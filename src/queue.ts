type Song = {
    id: string;
    title: string;
    artist: string;
    duration: number;
    image: string;
}

class Queue {
    private queue: Song[];
    private index: number;
    
    constructor() {
        this.queue = [];
    }
    
    toString(): string {
        return this.queue.map((s) => s.toString()).join(", ");
    }
    
    addSong(song: Song): void {
        this.queue.push(song);
    }
    
    removeSongByObject(song: Song): void {
        this.queue = this.queue.filter((s) => s !== song);
    }
    
    removeSongByIndex(index: number): void {
        this.queue.splice(index, 1);
    }
    
    nextSong(): Song | undefined {
        this.index++;
        return this.queue[this.index];
    }
    
    getSong(index: number): Song | undefined {
        return this.queue[index];
    }
}