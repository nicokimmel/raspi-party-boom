// Textlabel and other ui components
const currentTitleTextLabel = $('#currentTitleTextLabel')
const currentArtistTextLabel = $('#currentArtistTextLabel')
const currentSongPlaytimeLabel = $('#currentSongPlaytimeLabel')
const currentSongLengthLabel = $('#currentSongLengthLabel')
const currentSongImage = $('#currentSongImage')

const defaultSongName = "No song playing"
const defaultSongArtist = "No artist involved"


let currentSong
let currentQueue

socket.on('tick', (song, time, queue) => {

    refreshProgressbar(song, time)

    // Refresh Song only on Change
    if (currentSong != song) {
        refreshCurrentTitle(song)
        currentSong = song
    }

    // Refresh Queue only on change
    if (!songArraysEqual(currentQueue, queue)) {
        refreshQueue(queue)
        currentQueue = queue
    }

});

$('#playButton').on("click", function () {
    socket.emit('spotify-resume')    
});

$('#skipForwardButton').on("click", function () {
    socket.emit('spotify-next')    
});

$('#skipBackwardButton').on("click", function () {
    socket.emit('spotify-previous')    
});

function removeSongFromQueue(index) {
    socket.emit('spotify-queue-remove', index)    
}

function refreshProgressbar(song, time) {
    if (song != null) {
        currentSongPlaytimeLabel.text(formatMilliseconds(time))
        currentSongLengthLabel.text(formatMilliseconds(song.duration))
    } else {
        currentSongPlaytimeLabel.text('00:00')
        currentSongLengthLabel.text('00:00')
    }
}

function refreshCurrentTitle(song) {
    if(song != null) {
        currentTitleTextLabel.text(song.title)
        currentArtistTextLabel.text(song.artist)
        currentSongImage.attr('src', '' + song.image)
    } else {
        currentTitleTextLabel.text(defaultSongName)
        currentArtistTextLabel.text(defaultSongArtist)
    }

}

function refreshQueue(songList) {

    deleteCurrentQueueEntries()

    for (let i = 0; i < songList.length; i++) {

        addEntryToQueue(songList[i], i)

    };

    $('#queueList').find('.removeFromQueueButton').on('click', function () {
        console.log("htdzt")
        let index = parseInt($(this).siblings('.index').val())
            let selectedSong = currentQueue[index]
            removeSongFromQueue(index)
    });
}

function formatMilliseconds(milliseconds) {
    let timestamp = moment.utc(milliseconds).format('mm:ss');
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

    if (a === b) return true;
    if (a == null || b == null) return false;
    if (a.length !== b.length) return false;

    for (var i = 0; i < a.length; ++i) {
        if (a[i].id !== b[i].id) return false;
    }
    return true;
}