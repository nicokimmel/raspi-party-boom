
const io = require('/socket.io/socket.io.js');

export type Song = {
    id: string;
    title: string;
    artist: string;
    duration: number;
    image: string;
}



function spotifySearch(input: string) {

    const socket = io.connect("localhost:3000");

    let song: Song = socket.emit('spotify-search', input);

}

let button = $("#test");

console.log("KECK");
