class Song {
    private id: string;
    private title: string;
    private artist: string;
    private duration: number;
    
    constructor(id: string, title: string, artist: string, duration: number) {
        this.id = id;
        this.title = title;
        this.artist = artist;
        this.duration = duration;
    }
    
    toString(): string {
        return `${this.title} by ${this.artist}`;
    }
    
    getID(): string {     
        return this.id;
    }
    
    getTitle(): string {     
        return this.title;
    }
    
    getArtist(): string {     
        return this.artist;
    }
    
    getDuration(): number {     
        return this.duration;
    }
}

class Queue {
    private queue: Song[];
    
    constructor() {
        this.queue = [];
    }
    
    toString(): string {
        return this.queue.map((s) => s.toString()).join(", ");
    }
    
    addSong(song: Song): void {
        this.queue.push(song);
    }
    
    removeSong(song: Song): void {
        this.queue = this.queue.filter((s) => s !== song);
    }
    
    nextSong(): Song | undefined {
        let song = this.queue.shift();
        return song;
    }
    
    getSong(index: number): Song | undefined {
        return this.queue[index];
    }
}