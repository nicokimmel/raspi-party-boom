let socket = io()

let songBuffer

socket.on('spotify-search', (songList) => {
    songBuffer = songList
    deleteCurrentEntries()
    console.log("Emptied list")

    for (let i = 0; i < songList.length; i++) {
        addEntryToList(songList[i], i)
    }

    // Add logic to newly created queue buttons
    $('#searchResultList').find('.addToQueueButton').on("click", function () {
        let index = parseInt($(this).siblings('.index').val())
        let selectedSong = songBuffer[index]
        spotifyAddToQueue(selectedSong)
    })
})

$('#Searchbutton').on('click', function (e) {
    console.log("Focus")
    setTimeout(function () {
        $('#searchTextInput').focus()
    }, 500)
})

function spotifyAddToQueue(song) {
    socket.emit('spotify-queue-add', song)
}

function spotifySearch(query) {
    if (query == "") {
        deleteCurrentEntries()
        return
    }
    socket.emit('spotify-search', query)
}

function queueMove(oldIndex, newIndex) {
    socket.emit('spotify-queue-move', oldIndex, newIndex)
}

let inputTimeout = null
$('#searchTextInput').on('keyup', function (e) {
    clearTimeout(inputTimeout)
    inputTimeout = setTimeout(function () {
        spotifySearch($('#searchTextInput').val())
    }, 500)
})

function addEntryToList(song, index) {

    $("ul#searchResultList").append(`<li class="border rounded list-group-item m-0 mt-2 p-0">
        <div class="m-0">
            <div class="row g-0">
                <div class="col-3">
                <img src="` + song.image + `" style="width: 100%; height: 100%" class="rounded-start" onerror='this.src="img/default.jpg"'>
                </div>
                <div class="col-7">
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
                <button type="button" class="btn addToQueueButton" data-bs-dismiss="offcanvas" style="width: 100%; height: 100%"><i class="bi bi-arrow-right"></i></button>
                <input type="hidden" value="${index}" class="index"></input>
                </div>
            </div>
        </div>
    </li>`)

}


function deleteCurrentEntries() {

    $("ul#searchResultList").empty()

}


