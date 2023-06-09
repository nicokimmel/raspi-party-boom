const { SpotifyApi } = require("@spotify/web-api-ts-sdk");

class SpotifyWrapper {

    constructor() {
        this.api = SpotifyApi.withClientCredentials(process.env.SPOTIFY_CLIENT_ID, process.env.SPOTIFY_CLIENT_SECRET);
    }

    search(query, callback) {
        this.api.search(query, ["track"])
            .then((items) => {
                let songList = [];
                for (let i = 0; i < items.tracks.items.length; i++) {
                    const song = {
                        id: items.tracks.items[i].id,
                        title: items.tracks.items[i].name,
                        artist: items.tracks.items[i].artists[0].name,
                        duration: items.tracks.items[i].duration_ms,
                        image: items.tracks.items[i].album.images[i]?.url ?? ""
                    };
                    songList.push(song);
                }
                callback(songList);
            })
            .catch((error) => {
                console.log(error);
            });
    }
}

module.exports = { SpotifyWrapper };