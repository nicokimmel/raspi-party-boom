const arp = require('@network-utils/arp-lookup')
const fs = require("fs")

const { ShellWrapper } = require("./shell.js")
const { Group } = require("./permissions.js")

const TICK_RATE = 500
const MAC_PATTERN = /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})|([0-9a-fA-F]{4}\.[0-9a-fA-F]{4}\.[0-9a-fA-F]{4})$/

class Connection {

    constructor(app, player, spotify, queue, permissions) {
        this.https = require("https").createServer(
            {
                key: fs.readFileSync("ssl/key.pem"),
                cert: fs.readFileSync("ssl/cert.pem"),
            },
            app
        )
        this.io = require("socket.io")(this.https)
        this.player = player
        this.spotify = spotify
        this.queue = queue
        this.permissions = permissions
        this.shell = new ShellWrapper()
        this.lookupTable = {}
    }

    get() {
        return this.https
    }

    open() {
        this.io.on("connection", (socket) => {

            let address = socket.handshake.address
            let hostname = socket.handshake.headers["user-agent"]
            console.log("[CONNECTION] " + address + " connected as " + this.lookupTable[address])

            socket.getMac = () => {
                return this.lookupTable[address]
            }

            socket.emit("handshake", this.getTag(socket.getMac()))

            socket.on("disconnect", () => {
                console.log("[CONNECTION] User disconnected")
            })

            socket.on("spotify-search", (query) => {
                if (this.permissions.getGroup(socket.getMac()) > Group.USER) { return }
                if (!this.spotify.isReady()) { return }
                if (typeof query !== "string") { return }
                if (query.length < 3) { return }

                this.spotify.search(query, (songList) => {
                    socket.emit("spotify-search", songList)
                })
            })

            socket.on("spotify-queue-move", (from, to) => {
                if (this.permissions.getGroup(socket.getMac()) > Group.DJ) { return }
                if (typeof from !== "number" || typeof to !== "number") { return }
                if (from < 0 || from >= this.queue.getSize()) { return }
                if (to < 0 || to >= this.queue.getSize()) { return }
                if (!this.queue.getSong(from) || !this.queue.getSong(to)) { return }

                this.queue.moveSong(from, to)
            })

            socket.on("spotify-queue-add", (song) => {
                if (this.permissions.getGroup(socket.getMac()) > Group.USER) { return }
                //check if song is valid
                if (!song) { return }

                this.queue.addSong(song)
                if (!this.player.getCurrentSong()) {
                    this.queue.nextSong()
                    this.player.play(song)
                }
            })

            socket.on("spotify-queue-remove", (index) => {
                if (this.permissions.getGroup(socket.getMac()) > Group.DJ) { return }
                if (typeof index !== "number") { return }
                if (index < 0 || index >= this.queue.getSize()) { return }
                if (!this.queue.getSong(index)) { return }

                this.queue.removeSongByIndex(index)
            })

            socket.on("spotify-shuffle", () => {
                if (this.permissions.getGroup(socket.getMac()) > Group.DJ) { return }

                this.queue.shuffle()
            })

            socket.on("spotify-next", () => {
                if (this.permissions.getGroup(socket.getMac()) > Group.DJ) { return }
                if (!this.spotify.isReady()) { return }

                const song = this.queue.nextSong()
                if (!song) {
                    this.player.stop()
                    return
                }
                this.player.play(song)
            })

            socket.on("spotify-previous", () => {
                if (this.permissions.getGroup(socket.getMac()) > Group.DJ) { return }
                if (!this.spotify.isReady()) { return }

                const song = this.queue.previousSong()
                this.player.play(song)
            })

            socket.on("spotify-play", (index) => {
                if (this.permissions.getGroup(socket.getMac()) > Group.DJ) { return }
                if (!this.spotify.isReady()) { return }
                if (typeof index !== "number") { return }
                if (index < 0 || index >= this.queue.getSize()) { return }

                let song = this.queue.getSong(index)
                this.player.play(song)
            })

            socket.on("spotify-pause", () => {
                if (this.permissions.getGroup(socket.getMac()) > Group.DJ) { return }
                if (!this.spotify.isReady()) { return }

                this.player.pause()
            })

            socket.on("spotify-resume", () => {
                if (this.permissions.getGroup(socket.getMac()) > Group.DJ) { return }
                if (!this.spotify.isReady()) { return }

                this.player.resume()
            })

            socket.on("spotify-seek", (time) => {
                if (this.permissions.getGroup(socket.getMac()) > Group.DJ) { return }
                if (!this.spotify.isReady()) { return }
                if (typeof time !== "number") { return }
                if (time < 0 || time > this.player.getCurrentSong().duration) { return }

                this.player.seek(parseInt(time))
            })

            socket.on("spotify-loop", () => {
                if (this.permissions.getGroup(socket.getMac()) > Group.DJ) { return }

                this.player.toggleLoop()
            })

            socket.on("permissions-change", (mac, group) => {
                if (this.permissions.getGroup(socket.getMac()) > Group.ADMIN) { return }
                if (!this.isMac(mac)) { return }
                if (typeof group !== "number") { return }
                if (group < Group.ADMIN || group > Group.BLOCKED) { return }

                this.permissions.setGroup(mac, group)
            })

            socket.on("wifi-change-home", (ssid, password) => {
                if (this.permissions.getGroup(socket.getMac()) > Group.ADMIN) { return }
                if (typeof ssid !== "string" || typeof password !== "string") { return }
                if (ssid.length < 2 || ssid.length > 32) { return }
                if (password.length < 8 || password.length > 60) { return }

                this.shell.setHomeWifi(ssid, password)
            })

            socket.on("wifi-change-guest", (ssid, password) => {
                if (this.permissions.getGroup(socket.getMac()) > Group.ADMIN) { return }
                if (typeof ssid !== "string" || typeof password !== "string") { return }
                if (ssid.length < 2 || ssid.length > 32) { return }
                if (password.length < 8 || password.length > 60) { return }

                this.shell.setGuestWifi(ssid, password)
            })
        })
    }

    tick() {
        setInterval(() => {
            const playerData = {
                playing: this.player.isPlaying(),
                song: this.player.getCurrentSong(),
                time: this.player.getCurrentTime(),
                loop: this.player.isLooping()
            }
            const queueData = {
                upcoming: this.queue.getUpcomingList(),
                previous: this.queue.getPreviousList(),
            }
            const spotifyData = {
                ready: this.spotify.isReady()
            }
            const networkData = {
                connected: [
                    ["00:1A:8C:12:5F:AB", "#5FAB", 3],
                    ["98:D3:45:EF:2B:76", "#2B76", 1],
                    ["AA:BE:27:8F:6D:34", "#6D34", 2],
                    ["12:34:56:78:90:AB", "#90AB", 2],
                    ["CD:EF:12:34:56:78", "#5678", 3]
                ], //this.shell.getConnectedClients(),
                blocked: [
                    ["11:22:33:44:55:AA", "#55AA", 4],
                    ["66:77:88:99:00:BB", "#00BB", 4],
                    ["CC:DD:EE:FF:11:22", "11:22", 4]
                ]//this.shell.getBlockedClients()
            }
            this.io.emit("tick", playerData, queueData, spotifyData, networkData)
        }, TICK_RATE)
    }

    lookupMac(address, callback) {
        let ip = address
        if (address.startsWith('::ffff:')) {
            ip = address.substring(7)
        }
        arp.toMAC(ip)
            .then((mac) => {
                if (mac === null) { mac = "00:00:00:00:00:00" }
                this.lookupTable[address] = mac
                callback(mac, address, ip)
            })
    }

    getMac(address) {
        return this.lookupTable[address]
    }

    isMac(mac) {
        return MAC_PATTERN.test(mac)
    }

    getTag(mac) {
        if (!mac) { return "????" }
        let cleanedMAC = mac.replace(/:/g, '')
        let lastFourDigits = cleanedMAC.substr(cleanedMAC.length - 4)
        let tag = lastFourDigits.toUpperCase()
        return tag;
    }
}

module.exports = { Connection }