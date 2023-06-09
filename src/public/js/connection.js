let socket = io();
socket.on('spotify-search', (songList) => {
    console.log(songList);
});

function spotifySearch(query) {
    socket.emit('spotify-search', query);
}
