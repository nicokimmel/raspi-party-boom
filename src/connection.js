const arp = require('@network-utils/arp-lookup')

const { ShellWrapper } = require("./shell.js")

const TICK_RATE = 500

class Connection {

    constructor(app, player, spotify, queue) {
        this.http = require("http").Server(app)
        this.io = require("socket.io")(this.http)
        this.player = player
        this.spotify = spotify
        this.queue = queue
        this.shell = new ShellWrapper()
    }

    get() {
        return this.http
    }

    open() {
        this.io.on("connection", (socket) => {

            let address = socket.handshake.address
            this.lookupMac(address, (mac, ip) => {
                console.log("[CONNECTION] " + ip + " connected as " + mac)
            })

            socket.on("disconnect", () => {
                console.log("[CONNECTION] User disconnected")
            })

            socket.on("spotify-search", (query) => {
                if (!this.spotify.isReady()) { return }
                this.spotify.search(query, (songList) => {
                    socket.emit("spotify-search", songList)
                })
            })

            socket.on("spotify-queue", () => {
                socket.emit("spotify-queue", this.queue.getList())
            })

            socket.on("spotify-queue-move", (from, to) => {
                this.queue.moveSong(from, to)
            })

            socket.on("spotify-queue-add", (song) => {
                this.queue.addSong(song)
                if (!this.player.getCurrentSong()) {
                    this.queue.nextSong()
                    this.player.play(song)
                }
            })

            socket.on("spotify-queue-remove", (index) => {
                if (!this.queue.getSong(index)) { return }
                this.queue.removeSongByIndex(index)
            })

            socket.on("spotify-shuffle", () => {
                this.queue.shuffle()
            })

            socket.on("spotify-next", () => {
                if (!this.spotify.isReady()) { return }
                const song = this.queue.nextSong()
                if (song != null) {
                    socket.emit("spotify-next", song)
                    this.player.play(song)
                } else {
                    this.player.stop()
                }
            })

            socket.on("spotify-previous", () => {
                if (!this.spotify.isReady()) { return }
                const song = this.queue.previousSong()
                socket.emit("spotify-next", song)
                this.player.play(song)
            })

            socket.on("spotify-play", (index) => {
                if (!this.spotify.isReady()) { return }
                let song = this.queue.getSongByIndex(index)
                this.player.play(song)
            })

            socket.on("spotify-pause", () => {
                if (!this.spotify.isReady()) { return }
                this.player.pause()
            })

            socket.on("spotify-resume", () => {
                if (!this.spotify.isReady()) { return }
                this.player.resume()
            })

            socket.on("spotify-seek", (time) => {
                if (!this.spotify.isReady()) { return }
                this.player.seek(parseInt(time))
            })

            socket.on("spotify-loop", () => {
                this.player.toggleLoop()
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
                clients: this.shell.getClientList()
            }
            this.io.emit("tick", playerData, queueData, spotifyData, networkData)
        }, TICK_RATE)
    }

    lookupMac(address, callback) {
        if (address.startsWith('::ffff:')) {
            address = address.substring(7)
        }
        arp.toMAC(address)
            .then((mac) => {
                callback(mac, address)
            })
    }
}

module.exports = { Connection }