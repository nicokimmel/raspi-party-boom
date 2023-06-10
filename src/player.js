const TICK_RATE = 1000

class Player {
    constructor(spotify, queue) {
        this.spotify = spotify
        this.queue = queue
        this.currentSong = null
        this.playing = false
        this.time = 0
        this.loop = false
    }

    isPlaying() {
        return this.playing
    }
    
    getCurrentSong() {
        return this.currentSong
    }

    getCurrentTime() {
        return this.time
    }
    
    isLooping() {
        return this.loop
    }

    play(song) {
        this.playing = true
        this.currentSong = song
        this.spotify.play(song)
        console.log("[PLAYER] Playing song " + song.title)
    }

    pause() {
        this.playing = false
        this.spotify.pause()
        console.log("[PLAYER] Pausing song ")
    }

    resume() {
        this.playing = true
        this.spotify.resume()
        console.log("[PLAYER] Resuming song ")
    }

    seek(time) {
        console.log("[PLAYER] Seeking to " + time)
    }

    toggleLoop() {
        this.loop = !this.loop
        console.log("[PLAYER] Looping is now " + this.loop)
    }

    tick() {
        setInterval(() => {
            if (!this.currentSong || !this.playing) { return }

            this.time += 1000;
            console.log("[PLAYER] " + this.time + "/" + this.currentSong.duration)

            if (this.time > this.currentSong.duration + 1000) {
                this.time = 0
                let song = this.queue.nextSong()
                if (!song) {
                    this.playing = false
                    this.time = 0
                    return
                }
                this.play(song)
            }
        }, TICK_RATE)
    }
}

module.exports = { Player }