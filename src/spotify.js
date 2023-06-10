const SpotifyWebApi = require("spotify-web-api-node")
const { ShellWrapper } = require("./shell.js")

const SCOPES = ['user-modify-playback-state', 'user-read-playback-state', 'user-read-currently-playing', "playlist-modify-public", "playlist-modify-private"]
const REDIRECT_URI = 'http://localhost:3000'
const SCAN_INTERVAL = 1000

class SpotifyWrapper {

    constructor() {
        this.api = new SpotifyWebApi({ clientId: process.env.SPOTIFY_CLIENT_ID, clientSecret: process.env.SPOTIFY_CLIENT_SECRET, redirectUri: REDIRECT_URI })
        this.url = this.api.createAuthorizeURL(SCOPES)
        this.shell = new ShellWrapper()
        this.deviceId = null
        this.deviceAttempts = 0
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
                console.error(err)
            })
    }

    getLoginURL() {
        return this.url
    }

    getDeviceId() {
        return this.deviceId
    }

    isReady() {
        return this.deviceId !== null
    }

    requestAccessToken(code, callback) {
        let self = this
        this.api.authorizationCodeGrant(code).then(
            function (data) {
                this.accessToken = data.body['access_token']
                self.api.setAccessToken(data.body['access_token'])

                this.refreshToken = data.body['refresh_token']
                self.api.setRefreshToken(data.body['refresh_token'])

                console.log("[SPOTIFY] Access token set. Token will expire in " + data.body['expires_in'] + " seconds.")

                setTimeout(() => {
                    self.refreshAccessToken()
                }, data.body['expires_in'])

                callback()
            },
            function (err) {
                console.log('Something went wrong!', err)
            }
        )
    }

    refreshAccessToken() {
        let self = this
        this.api.refreshAccessToken().then(
            function (data) {
                self.api.setAccessToken(data.body['access_token'])
                console.log('[SPOTIFY] The access token has been refreshed!')
            },
            function (err) {
                console.log('Could not refresh access token', err)
            }
        )
    }

    searchPlaybackDevice() {
        let self = this
        this.api.getMyDevices()
            .then(function (data) {
                let availableDevices = data.body.devices
                if (availableDevices.length > 0) {
                    for (let i = 0; i < availableDevices.length; i++) {
                        if (availableDevices[i].name === "raspi_party_boom") {
                            self.deviceId = availableDevices[i].id
                            console.log("[SPOTIFY] Device ID is " + self.deviceId)
                            self.deviceAttempts = 0
                            return
                        }
                    }
                }

                console.log('[SPOTIFY] No devices found. Checking again in 1 second.')
                setTimeout(() => {
                    self.deviceAttempts++
                    if (self.deviceAttempts >= 5) {
                        self.deviceAttempts = 0
                        self.shell.restartSpotifyd()
                    }
                    self.searchPlaybackDevice()
                }, SCAN_INTERVAL)
            }, function (err) {
                console.log('Something went wrong!', err)
            })
    }

    play(song) {
        if (!this.deviceId) {
            this.searchPlaybackDevice()
            return
        }
        this.api.play({ uris: [`spotify:track:${song.id}`], device_id: this.deviceId })
        console.log("[SPOTIFY] Playing track " + song.title + " on device " + this.deviceId)

    }

    pause() {
        if (!this.deviceId) {
            this.searchPlaybackDevice()
            return
        }
        this.api.pause()
            .then(function () {
                console.log('[SPOTIFY] Playback paused')
            }, function (err) {
                console.log('Something went wrong!', err)
            })
    }

    resume() {
        if (!this.deviceId) {
            this.searchPlaybackDevice()
            return
        }
        this.api.play()
            .then(function () {
                console.log('[SPOTIFY] Playback resumed')
            }, function (err) {
                console.log('Something went wrong!', err)
            })
    }
}

module.exports = { SpotifyWrapper }