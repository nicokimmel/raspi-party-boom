
export type Song = {
    id: string;
    title: string;
    artist: string;
    duration: number;
    image: string;
}

import * as io from 'socket.io-client';

const socket = io.connect("localhost:3000");



function spotifySearch(input: string) {

    socket.emit('spotify-search', input);

}
