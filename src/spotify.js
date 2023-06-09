const { SpotifyApi } = require("@spotify/web-api-ts-sdk");

class SpotifyWrapper {

    constructor() {
        this.api = SpotifyApi.withClientCredentials(process.env.SPOTIFY_CLIENT_ID, process.env.SPOTIFY_CLIENT_SECRET);
    }
    
    search(query, callback) {
        this.api.search(query, ["track"])
        .then((items) => {
            //console.log(items.tracks.items[0].name + " - " + items.tracks.items[0].artists[0].name);
            
            const song = {
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

module.exports = { SpotifyWrapper };