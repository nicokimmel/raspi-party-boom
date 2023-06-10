class Queue {

    constructor() {
        this.queue = []
        this.index = -1
    }

    toString() {
        return this.queue.map((s) => s.toString()).join(", ")
    }

    getList() {
        return this.queue
    }

    moveSong(from, to) {
        var temp = this.queue[from]
        this.queue.splice(from, 1)
        if (to < 0) {
            this.queue.unshift(temp)
        } else {
            this.queue.splice(to, 0, temp)
        }
        console.log("[QUEUE] Moved song " + temp.title + " from " + from + " to " + to)
    }

    addSong(song) {
        this.queue.push(song)
        console.log("[QUEUE] Added song " + song.title)
    }

    removeSongByObject(song) {
        this.queue = this.queue.filter((s) => s !== song)
        console.log("[QUEUE] Removed (byObject) song " + song.title)
    }

    removeSongByIndex(index) {
        this.queue.splice(index, 1)
        console.log("[QUEUE] Removed (byIndex) song " + index)
    }

    shuffle() {
        if (index >= this.queue.length) {
            return
        }

        for (let i = index; i < this.queue.length; i++) {
            const randomIndex = Math.floor(Math.random() * (this.queue.length - index) + index)
            [this.queue[i], this.queue[randomIndex]] = [this.queue[randomIndex], this.queue[i]]
        }

        console.log("[QUEUE] Shuffled queue at index " + index + " and above")
    }

    nextSong() {
        console.log("[QUEUE] Next song")
        if (!this.queue[this.index + 1]) {
            return this.queue[this.index]
        }
        this.index++
        return this.queue[this.index]
    }

    previousSong() {
        console.log("[QUEUE] Previous song")
        if (!this.queue[this.index - 1]) {
            return this.queue[this.index]
        }
        this.index--
        return this.queue[this.index]
    }

    getSong(index) {
        console.log("[QUEUE] Get song at index " + index)
        return this.queue[index]
    }
}

module.exports = { Queue }