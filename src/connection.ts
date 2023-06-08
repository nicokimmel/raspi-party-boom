import arp from '@network-utils/arp-lookup'

export class Connection {
    
    private http: any;
    private io: any;
    private macs: Map<String, number>;
    
    constructor(app: any) {
        this.http = require("http").Server(app);
        this.io = require("socket.io")(this.http);
        this.macs = new Map<String, number>();
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
            
            socket.on("spotify-search", (title: string) => {
                const song: Song = {
                    id: "asdffdsa",
                    title: "Never Gonna Give You Up",
                    artist: "Rick Astley",
                    duration: 213000,
                    image: "https://upload.wikimedia.org/wikipedia/en/thumb/3/34/RickAstleyNeverGonnaGiveYouUp7InchSingleCover.jpg/220px-RickAstleyNeverGonnaGiveYouUp7InchSingleCover.jpg"
                };
                return song;
            });
        });
    }
    
}