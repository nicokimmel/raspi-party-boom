const arp = require('@network-utils/arp-lookup');
const { SpotifyWrapper } = require("./spotify.js");

var TICK_RATE = 500;

class Connection {

    constructor(app, player, queue) {
        this.http = require("http").Server(app);
        this.io = require("socket.io")(this.http);
        this.player = player;
        this.queue = queue;
        this.spotify = new SpotifyWrapper();
    }

    get() {
        return this.http;
    }

    open() {
        this.io.on("connection", (socket) => {

            let address = socket.handshake.address;
            this.lookupMac(address, (mac, ip) => {
                console.log("[CONNECTION] " + ip + " connected as " + mac);
            });

            socket.on("disconnect", () => {
                console.log("[CONNECTION] User disconnected");
            });

            socket.on("spotify-search", (query) => {
                this.spotify.search(query, (song) => {
                    socket.emit("spotify-search", song);
                });
            });

            socket.on("spotify-queue", () => {
                socket.emit("spotify-queue", this.queue.getList());
            });

            socket.on("spotify-queue-move", (from, to) => {
                this.queue.moveSong(from, to);
            });

            socket.on("spotify-queue-add", (song) => {
                this.queue.addSong(song);
            });

            socket.on("spotify-queue-remove", (index) => {
                this.queue.removeSongByIndex(index);
            });

            socket.on("spotify-next", () => {
                const song = this.queue.nextSong();
                socket.emit("spotify-next", song);
                this.player.play(song);
            });

            socket.on("spotify-previous", () => {
                const song = this.queue.previousSong();
                socket.emit("spotify-next", song);
                this.player.play(song);
            });

            socket.on("spotify-play", (index) => {
                let song = this.queue.getSongByIndex(index);
                this.player.play(song);
            });

            socket.on("spotify-pause", () => {
                this.player.pause();
            });

            socket.on("spotify-resume", () => {
                this.player.resume();
            });

            socket.on("spotify-seek", (time) => {
                this.player.seek(time);
            });

            socket.on("spotify-loop", () => {
                this.player.toggleLoop();
            });
        });
    }

    tick() {
        setInterval(() => {
            this.io.emit("tick", this.player.getCurrentSong(), this.player.getCurrentTime(), this.queue.getList());
        }, TICK_RATE);
    }

    lookupMac(address, callback) {
        if (address.startsWith('::ffff:')) {
            address = address.substring(7)
        }
        arp.toMAC(address)
            .then((mac) => {
                callback(mac, address);
            });
    }
}

module.exports = { Connection };