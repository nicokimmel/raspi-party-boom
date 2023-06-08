import arp from '@network-utils/arp-lookup';
import { Song, Queue } from "./queue";

export class Connection {
    
    private http: any;
    private io: any;
    private macs: Map<String, number>;
    private queue: Queue;
    
    constructor(app: any, queue: Queue) {
        this.http = require("http").Server(app);
        this.io = require("socket.io")(this.http);
        this.macs = new Map<String, number>();
        this.queue = queue;
    }
    
    get(): any {
        return this.http;
    }
    
    open(): void {
        this.io.on("connection", (socket: any) => {
            console.log("a user connected");
            
            arp.toMAC(socket.handshake.address)
            .then((mac) => {
                console.log(mac);
            });
            
            socket.on("disconnect", () => {
                console.log("user disconnected");
            });
            
            socket.on("spotify-search", (query: string) => {
                const song: Song = {
                    id: "asdffdsa",
                    title: "Never Gonna Give You Up",
                    artist: "Rick Astley",
                    duration: 213000,
                    image: "https://upload.wikimedia.org/wikipedia/en/thumb/3/34/RickAstleyNeverGonnaGiveYouUp7InchSingleCover.jpg/220px-RickAstleyNeverGonnaGiveYouUp7InchSingleCover.jpg"
                };
                return song;
            });
            
            socket.on("spotify-add", (song: Song) => {
                this.queue.addSong(song);
                console.log("Added song " + song.title + " to queue");
            });
        });
    }
    
}