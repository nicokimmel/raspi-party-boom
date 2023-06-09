class Queue {
    
    constructor() {
        this.queue = [];
        this.index = 0;
    }
    
    toString() {
        return this.queue.map((s) => s.toString()).join(", ");
    }
    
    addSong(song) {
        this.queue.push(song);
    }
    
    removeSongByObject(song) {
        this.queue = this.queue.filter((s) => s !== song);
    }
    
    removeSongByIndex(index) {
        this.queue.splice(index, 1);
    }
    
    nextSong() {
        this.index++;
        return this.queue[this.index];
    }
    
    getSong(index) {
        return this.queue[index];
    }
}

module.exports = { Queue };