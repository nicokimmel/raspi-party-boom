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

    console.debug("REFRESH")
    deleteCurrentQueueEntries()

    for (let i = 0; i < songList.length; i++) {

        addEntryToQueue(songList[i], i)

    };
}

function formatMilliseconds(mill) {

    let min = Math.floor(mill / 1000 / 60);
    let seconds = Math.floor(mill / 1000 - min * 60);
    return min + ':' + seconds
}

function addEntryToQueue(song) {

    console.log("Add Song")
    $("#queueList").append(`<li class="border rounded list-group-item m-1 p-0">
        <div class="m-0">
            <div class="row g-0">
                <div class="col-2">
                <img src="` + song.image + `" style="width: 100%; height: 100%" class="rounded-start" onerror='this.src="img/default.jpg"'>
                </div>
                <div class="col-10">
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