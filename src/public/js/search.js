let inputTimeout = null

$('#searchTextInput').on('keyup', function (e) {
    clearTimeout(inputTimeout)
    inputTimeout = setTimeout(function () {
        if ($('#searchTextInput').val() == "") {
            deleteCurrentEntries()
            return
        }
        spotifySearch($('#searchTextInput').val())
    }, 500)
})

let songBuffer

socket.on('spotify-search', (songList) => {
    
    songBuffer = songList
    deleteCurrentEntries()

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