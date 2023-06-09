const arp = require('@network-utils/arp-lookup');
const { SpotifyWrapper } = require("./spotify.js");

class Connection {

    constructor(app, player, queue) {
        this.http = require("http").Server(app);
        this.io = require("socket.io")(this.http);
        this.queue = queue;
        this.spotify = new SpotifyWrapper();
    }

    get() {
        return this.http;
    }

    open() {
        this.io.on("connection", (socket) => {
            console.log("a user connected");

            let address = socket.handshake.address;
            this.lookupMac(address, (mac, ip) => {
                console.log(ip + " connected as " + mac);
            });

            socket.on("disconnect", () => {
                console.log("user disconnected");
            });

            socket.on("tick", () => {
                socket.emit("tick", this.player.getCurrentSong(), this.player.getCurrentTime(), this.queue.getList());
            });

            socket.on("spotify-search", (query) => {
                this.spotify.search(query, (song) => {
                    socket.emit("spotify-search", song);
                });
            });

            socket.on("spotify-add", (song) => {
                this.queue.addSong(song);
                console.log("Added song " + song.title + " to queue");
            });

            socket.on("spotify-remove", (index) => {
                this.queue.removeSongByIndex(index);
                console.log("Removed song " + song.title + " from queue");
            });

            socket.on("spotify-next", () => {
                const song = this.queue.nextSong();
                console.log("Next song is " + song.title);
                socket.emit("spotify-next", song);
            });

            socket.on("spotify-previous", () => {
                const song = this.queue.previousSong();
                console.log("Previous song is " + song.title);
                socket.emit("spotify-next", song);
            });
        });
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