class Player {
    constructor() {
        this.currentSong = null;
        this.loop = false;
    }

    getCurrentSong() {
        return this.currentSong;
    }

    getCurrentTime() {
        return 420;
    }

    play(song) {
        this.currentSong = song;
        console.log("[PLAYER] Playing song " + song.title);
    }

    pause() {
        console.log("[PLAYER] Pausing song ")
    }

    resume() {
        console.log("[PLAYER] Resuming song ")
    }
    
    seek(time) {
        console.log("[PLAYER] Seeking to " + time);
    }
    
    toggleLoop() {
        this.loop = !this.loop;
        console.log("[PLAYER] Looping is now " + this.loop);
    }
}

module.exports = { Player };