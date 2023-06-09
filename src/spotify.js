const SpotifyWebApi = require("spotify-web-api-node")

var SCOPES = ['user-read-private', 'user-read-email']
var REDIRECT_URI = 'http://localhost:3000'

class SpotifyWrapper {

    constructor() {

        this.api = new SpotifyWebApi({ redirectUri: REDIRECT_URI, clientId: process.env.SPOTIFY_CLIENT_ID })
        this.url = this.api.createAuthorizeURL(SCOPES)
    }

    search(query, callback) {
        /*
        this.api.search(query, ["track"])
            .then((items) => {
                let songList = []
                for (let i = 0; i < items.tracks.items.length; i++) {
                    const song = {
                        id: items.tracks.items[i].id,
                        title: items.tracks.items[i].name,
                        artist: items.tracks.items[i].artists[0].name,
                        duration: items.tracks.items[i].duration_ms,
                        image: items.tracks.items[i].album.images[0]?.url ?? ""
                    }
                    songList.push(song)
                }
                callback(songList)
            })
            .catch((error) => {
                console.log(error)
            })
        */
    }

    getLoginURL() {
        return this.url
    }

    setAccessToken(code) {
        spotifyApi.authorizationCodeGrant(code).then(
            function (data) {
                console.log('The token expires in ' + data.body['expires_in'])
                console.log('The access token is ' + data.body['access_token'])
                console.log('The refresh token is ' + data.body['refresh_token'])

                // Set the access token on the API object to use it in later calls
                spotifyApi.setAccessToken(data.body['access_token'])
                spotifyApi.setRefreshToken(data.body['refresh_token'])
            },
            function (err) {
                console.log('Something went wrong!', err)
            }
        )
    }
}

module.exports = { SpotifyWrapper }