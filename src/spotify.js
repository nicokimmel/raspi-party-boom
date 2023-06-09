const SpotifyWebApi = require("spotify-web-api-node")

var SCOPES = ['user-modify-playback-state', 'user-read-playback-state', 'user-read-currently-playing', "playlist-modify-public", "playlist-modify-private"]
var REDIRECT_URI = 'http://localhost:3000'

class SpotifyWrapper {

    constructor() {

        this.api = new SpotifyWebApi({ clientId: process.env.SPOTIFY_CLIENT_ID, clientSecret: process.env.SPOTIFY_CLIENT_SECRET, redirectUri: REDIRECT_URI })
        this.url = this.api.createAuthorizeURL(SCOPES)



    }

    search(query, callback) {
        this.api.searchTracks(query)
            .then(function (data) {
                let songList = []
                for (let i = 0; i < data.body.tracks.items.length; i++) {
                    const song = {
                        id: data.body.tracks.items[i].id,
                        title: data.body.tracks.items[i].name,
                        artist: data.body.tracks.items[i].artists[0].name,
                        duration: data.body.tracks.items[i].duration_ms,
                        image: data.body.tracks.items[i].album.images[0]?.url ?? ""
                    }
                    songList.push(song)
                }
                callback(songList)
            }, function (err) {
                console.error(err);
            });
    }

    getLoginURL() {
        return this.url
    }

    setAccessToken(code) {
        let self = this
        this.api.authorizationCodeGrant(code).then(
            function (data) {
                self.api.setAccessToken(data.body['access_token'])
                self.api.setRefreshToken(data.body['refresh_token'])
                console.log("[SPOTIFY] Access token set. Token will expire in " + data.body['expires_in'] + " seconds.")
            },
            function (err) {
                console.log('Something went wrong!', err)
            }
        )
    }

    getPlaybackDevice(callback) {
        this.api.getMyDevices()
            .then(function (data) {
                let availableDevices = data.body.devices;
                console.log(availableDevices);
                callback(availableDevices[0].id)
            }, function (err) {
                console.log('Something went wrong!', err);
            });
    }

    play(song) {
        this.getPlaybackDevice((deviceId) => {
            if (deviceId) {
                this.api.play({ uris: [`spotify:track:${song.id}`], device_id: deviceId });
            }
        })
    }
}

module.exports = { SpotifyWrapper }