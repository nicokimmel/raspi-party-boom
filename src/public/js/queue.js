// Textlabel and other ui components
const currentTitleTextLabel = $('#currentTitleTextLabel')
const currentArtistTextLabel = $('#currentArtistTextLabel')
const currentSongPlaytimeLabel = $('#currentSongPlaytimeLabel')
const currentSongLengthLabel = $('#currentSongLengthLabel')
const currentSongImage = $('#currentSongImage')

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
    if (!arraysEqual(currentQueue, queue)) {
        refreshQueue(queue)
        currentQueue = queue
    }

});


$('#playButton').on("click", function () {
    socket.emit('spotify-play')    
});

$('#skipForwardButton').on("click", function () {
    socket.emit('spotify-resume')    
});

$('#skipBackwardButton').on("click", function () {
    socket.emit('spotify-previous')    
});


function refreshProgressbar(song, time) {

    currentSongPlaytimeLabel.text(formatMilliseconds(time))
    currentSongLengthLabel.text(formatMilliseconds(song.duration))
}

function refreshCurrentTitle(song) {

    currentTitleTextLabel.text(song.title)
    currentArtistTextLabel.text(song.artist)
    currentSongImage.attr('src', '' + song.image)

}

function refreshQueue(songList) {

    deleteCurrentQueueEntries()

    for (let i = 0; i < songList.length; i++) {

        addEntryToQueue(songList[i], i)

    };
}

function formatMilliseconds(milliseconds) {
    
    /*moment.duration.fn.format = function () {
        const minutes = Math.floor(this.asMinutes()).toString().padStart(2, '0');
        const seconds = Math.floor(this.seconds()).toString().padStart(2, '0');
        return `${minutes}:${seconds}`;
    };

    const duration = moment.duration(milliseconds);

    const formattedTime = duration.format();*/

    return milliseconds;
}

function addEntryToQueue(song) {

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
                    <button type="button" class="btn addToQueueButton" data-bs-dismiss="offcanvas" style="width: 100%; height: 100%">
                        <i class="bi bi-trash"></i>
                    </button>
                </div>            
            </div>
        </div>
    </li>`)

}

function deleteCurrentQueueEntries() {

    $('#queueList').empty()

}

function arraysEqual(a, b) {

    if (a === b) return true;
    if (a == null || b == null) return false;
    if (a.length !== b.length) return false;

    for (var i = 0; i < a.length; ++i) {
        if (a[i].id !== b[i].id) return false;
    }
    return true;
}