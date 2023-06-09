const arp = require('@network-utils/arp-lookup');
const { SpotifyWrapper } = require("./spotify.js");

class Connection {
    
    constructor(app, queue) {
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
            
            arp.toMAC(socket.handshake.address)
            .then((mac) => {
                console.log(mac);
            });
            
            socket.on("disconnect", () => {
                console.log("user disconnected");
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
        });
    }
}

module.exports = { Connection };