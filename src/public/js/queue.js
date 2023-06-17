// Textlabel and other ui components




const spotifyWarningSign = $('#spotifyWarning')
const searchButton = $('#Searchbutton')
//const adminBadge = $('adminBadge')


let isPlaying
let currentSong
let currentQueue
let seeking

// initial refresh
refreshProgressbar(null, 0)
refreshCurrentTitle(null)


function refreshDeviceStatus(spoitfyData) {
    if (spoitfyData.ready) {
        spotifyWarningSign.addClass('d-none')
        searchButton.removeClass('disabled')
        //adminBadge.removeClass('d-none')
        //skipBackwardButton.removeClass('disabled')
        //playButton.removeClass('disabled')
        //skipForwardButton.removeClass('disabled')
        //progressBar.removeClass('disabled')
    } else {
        spotifyWarningSign.removeClass('d-none')
        searchButton.addClass('disabled')
        //adminBadge.addClass('d-none')
        //skipBackwardButton.addClass('disabled')
        //playButton.addClass('disabled')
        //skipForwardButton.addClass('disabled')
        //progressBar.addClass('disabled')
    }
}

function refreshQueue(songList) {

    emptyQueueList()

    for (let i = 0; i < songList.length; i++) {
        console.log(songList[i].title)

        addEntryToQueue(songList[i], i)
    }

    $('#queueList').find('.removeFromQueueButton').on('click', function () {
        let index = parseInt($(this).siblings('.index').val())
        let selectedSong = currentQueue[index]
        console.log("Delete:" + (index + 1) + " / " + selectedSong.title)
        spotifyQueueRemove(index + 1)
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

function emptyQueueList() {

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

$('#Searchbutton').on('click', function (e) {
    console.log("Focus")
    setTimeout(function () {
        $('#searchTextInput').focus()
    }, 500)
})



