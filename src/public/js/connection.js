let socket = io();
socket.on('spotify-search', (song) => {
    console.log(song);
});

function spotifySearch(query) {
    socket.emit('spotify-search', query);
}
