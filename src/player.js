class Player {
    constructor() {
        this.currentSong = null

        this.currentSong = {
            id: '4cOdK2wGLETKBW3PvgPWqT',
            title: 'Never Gonna Give You Up',
            artist: 'Rick Astley',
            duration: 213573,
            image: 'https://i.scdn.co/image/ab67616d0000b273baf89eb11ec7c657805d2da0'
          }

        this.loop = false
    }

    getCurrentSong() {
        return this.currentSong
    }

    getCurrentTime() {
        return 420
    }

    play(song) {
        this.currentSong = song
        console.log("[PLAYER] Playing song " + song.title)
    }

    pause() {
        console.log("[PLAYER] Pausing song ")
    }

    resume() {
        console.log("[PLAYER] Resuming song ")
    }

    seek(time) {
        console.log("[PLAYER] Seeking to " + time)
    }

    toggleLoop() {
        this.loop = !this.loop
        console.log("[PLAYER] Looping is now " + this.loop)
    }
}

module.exports = { Player }