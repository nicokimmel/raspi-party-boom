import { SpotifyApi } from "@spotify/web-api-ts-sdk";
import { Song } from "./queue";

export class SpotifyWrapper {
    
    private api: SpotifyApi;
    
    constructor() {
        this.api = SpotifyApi.withClientCredentials(process.env.SPOTIFY_CLIENT_ID!, process.env.SPOTIFY_CLIENT_SECRET!);
    }
    
    search(query: string, callback: (song: Song) => void) {
        this.api.search(query, ["track"])
        .then((items) => {
            //console.log(items.tracks.items[0].name + " - " + items.tracks.items[0].artists[0].name);
            
            const song: Song = {
                id: items.tracks.items[0].id,
                title: items.tracks.items[0].name,
                artist: items.tracks.items[0].artists[0].name,
                duration: items.tracks.items[0].duration_ms,
                image: "https://upload.wikimedia.org/wikipedia/en/thumb/3/34/RickAstleyNeverGonnaGiveYouUp7InchSingleCover.jpg/220px-RickAstleyNeverGonnaGiveYouUp7InchSingleCover.jpg"
            };
            
            callback(song);
        })
        .catch((error) => {
            console.log(error);
        });
    }
}