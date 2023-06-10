
let socket = io()

function spotifyAddToQueue(song) {
    socket.emit('spotify-queue-add', song)
}

function spotifyNext() {
    socket.emit('spotify-next')
}

function spotifyPrevious() {
    socket.emit('spotify-previous')
}

function spotifyQueueRemove(index) {
    socket.emit('spotify-queue-remove', index)
}

function spotifyPause() {
    socket.emit('spotify-pause')
}

function spotifyResume() {
    socket.emit('spotify-resume')
}

function spotifySeek(value) {
    socket.emit('spotify-seek', value)
}

function searchSpotify(query) {
    socket.emit('spotify-search', query)
}

function queueMove(oldIndex, newIndex) {
    socket.emit('spotify-queue-move', oldIndex, newIndex)
}
