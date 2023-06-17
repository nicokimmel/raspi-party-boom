
let socket = io()

socket.on("handshake", (tag) => {
    $("#tagBadge").text(tag)
    socket.emit("wifi-get") //ADMIN ONLY?
})

socket.on("wifi-get", (homeSsid, guestSsid) => {
    refreshSSIDs(homeSsid, guestSsid)
})

socket.on('tick', (playerData, queueData, spotifyData, networkData) => {

    refreshDeviceStatus(spotifyData)
    refreshPlayButton(playerData.playing)
    refreshLoopbutton()
    refreshConnectionLists(networkData)

    let song = playerData.song
    let queue = queueData.upcoming
    let history = queueData.previous
    let time = playerData.time
    isPlaying = playerData.playing
    loop = playerData.loop
    refreshProgressbar(song, time)

    if (!song) { return }

    // Refresh Song only on Change
    if (currentSong !== song) {
        refreshCurrentTitle(song)
        currentSong = song
    }

    // Refresh Queue only on change
    if (!songArraysEqual(currentQueue, queue)) {
        refreshQueue(queue)
        refreshHistory(history)
        currentQueue = queue
    }
})

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
    socket.emit('spotify-seek', parseInt(value))
}

function spotifySearch(query) {
    socket.emit('spotify-search', query)
}

function queueMove(oldIndex, newIndex) {
    socket.emit('spotify-queue-move', oldIndex, newIndex)
}

function spotifyLoop() {
    socket.emit('spotify-loop')
}

function permissionsChange(mac, group) {
    socket.emit('permissions-change', mac, group)
}