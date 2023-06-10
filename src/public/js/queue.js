// Textlabel and other ui components
const currentTitleTextLabel = $('#currentTitleTextLabel')
const currentArtistTextLabel = $('#currentArtistTextLabel')
const currentSongPlaytimeLabel = $('#currentSongPlaytimeLabel')
const currentSongLengthLabel = $('#currentSongLengthLabel')
const currentSongImage = $('#currentSongImage')

const defaultSongName = "No song playing"
const defaultSongArtist = "No artist involved"

const spotifyWarningSign = $('#spotifyWarning')
const searchButton = $('#Searchbutton')
const skipBackwardButton = $('#skipBackwardButton')
const playButton = $('#playButton')
const skipForwardButton = $('#skipForwardButton')
const progressBar = $('#progressBar')

let isPlaying
let currentSong
let currentQueue

socket.on('tick', (playerData, queueData, spotifyData) => {

    refreshDeviceStatus(spotifyData)
    refreshPlayButton(playerData.playing)

    let song = playerData.song
    let queue = queueData.list
    let time = playerData.time
    isPlaying = playerData.playing

    if (!song) { return }

    refreshProgressbar(song, time)

    // Refresh Song only on Change
    if (currentSong !== song) {
        refreshCurrentTitle(song)
        currentSong = song
    }

    // Refresh Queue only on change
    if (!songArraysEqual(currentQueue, queue)) {
        refreshQueue(queue, )
        currentQueue = queue
    }

})

$('#playButton').on("click", function () {
    if (isPlaying)
        socket.emit('spotify-pause')
    else
        socket.emit('spotify-resume')
})

$('#skipForwardButton').on("click", function () {
    socket.emit('spotify-next')
})

$('#skipBackwardButton').on("click", function () {
    socket.emit('spotify-previous')
});

function removeSongFromQueue(index) {
    socket.emit('spotify-queue-remove', index)
}

function refreshDeviceStatus(spoitfyData) {
    if (spoitfyData.ready) {
        spotifyWarningSign.addClass('d-none')
        searchButton.removeClass('disabled')
        skipBackwardButton.removeClass('disabled')
        playButton.removeClass('disabled')
        skipForwardButton.removeClass('disabled')
        progressBar.removeClass('disabled')
    } else {
        spotifyWarningSign.removeClass('d-none')
        searchButton.addClass('disabled')
        skipBackwardButton.addClass('disabled')
        playButton.addClass('disabled')
        skipForwardButton.addClass('disabled')
        progressBar.addClass('disabled')
    }
}

function refreshProgressbar(song, time) {
    if (song != null) {
        currentSongPlaytimeLabel.text(formatMilliseconds(time))
        currentSongLengthLabel.text(formatMilliseconds(song.duration))
    } else {
        currentSongPlaytimeLabel.text('00:00')
        currentSongLengthLabel.text('00:00')
    }   
    console.log((time / song.duration * 1000))
    progressBar.val((time / song.duration * 1000))
}

function refreshCurrentTitle(song) {
    if (song != null) {
        currentTitleTextLabel.text(song.title)
        currentArtistTextLabel.text(song.artist)
        currentSongImage.attr('src', '' + song.image)
    } else {
        currentTitleTextLabel.text(defaultSongName)
        currentArtistTextLabel.text(defaultSongArtist)
    }

}

function refreshQueue(songList, index) {

    deleteCurrentQueueEntries()

    for (let i = 0; i < songList.length; i++) {
        console.log(songList[i].title)
        
        addEntryToQueue(songList[i], i)
    }

    $('#queueList').find('.removeFromQueueButton').on('click', function () {
        let index = parseInt($(this).siblings('.index').val())
        let selectedSong = currentQueue[index]
        console.log("Delete:" + index + " / " + selectedSong.title)
        removeSongFromQueue(index)
    })
}

function formatMilliseconds(milliseconds) {
    let timestamp = moment.utc(milliseconds).format('mm:ss')
    return timestamp
}

function addEntryToQueue(song, index) {

    $("#queueList").append(`<li class="border rounded list-group-item m-0 mt-2 p-0">
        <div class="m-0">
            <div class="row g-0">
                <div class="col-2">
                <img src="` + song.image + `" style="width: 100%; height: 100%" class="rounded-start" onerror='this.src="img/default.jpg"'>
                </div>
                <div class="col-8">
                    <div class="m-2">
                        <div class="card-text">
                            <div class="text-truncate">
                            ` + song.title + ` 
                                <br>
                                <small class="text-body-secondary">` + song.artist + `</small>
                            </div>
                        </div>
                    </div>
                </div>    
                <div class="col-2">
                    <button type="button" class="btn removeFromQueueButton" style="width: 100%; height: 100%">
                        <i class="bi bi-trash"></i>
                    </button>
                    <input type="hidden" value="${index}" class="index"></input>
                </div>            
            </div>
        </div>
    </li>`)

}

function deleteCurrentQueueEntries() {

    $('#queueList').empty()

}

function songArraysEqual(a, b) {
    if (a === b) return true
    if (a == null || b == null) return false
    if (a.length !== b.length) return false
    for (var i = 0; i < a.length; ++i) {
        if (a[i].id !== b[i].id) return false
    }
    return true
}

function refreshPlayButton(isPlaying) {

    playButton.empty()

    if (isPlaying) {
        playButton.append(`<i class="bi bi-pause"></i>`)
        playButton.removeClass('btn-success')
        playButton.removeClass('spotify-color')
        playButton.addClass('btn-secondary')
    } else {
        playButton.append(`<i class="bi bi-play"></i>`)
        playButton.addClass('btn-success')
        playButton.addClass('spotify-color')
        playButton.removeClass('btn-secondary')
    }
}