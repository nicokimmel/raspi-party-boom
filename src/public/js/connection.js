
let socket = io()
let timeout = null

// Time it takes for the search to start after the last keyinput
let searchDelay = 500

let textInputField = $('#searchTextInput')

socket.on('spotify-search', (songList) => {

    deleteCurrentEntries()
    console.log("Emptied list")

    songList.forEach(song => {

        addEntryToList(song)        

    })
})

function spotifySearch(query) {
    socket.emit('spotify-search', query)
}


textInputField.on('input', function (e) {
    clearTimeout(timeout)
    const textInput = textInputField.val()
    timeout == setTimeout(() => spotifySearch(textInput), searchDelay)
})

function addEntryToList(song) {

    $("ul#searchResultList").append(` <li class="border rounded list-group-item m-1 p-0">
        <div class="m-0">
        <div class="row g-0">
            <div class="col-3">
            <img src="` + song.image + `" style="width: 100% height: 100%" class="rounded-start" onerror='this.src="img/default.jpg"'>
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
            <button type="button" class="btn" style="width: 100% height: 100%"><i class="bi bi-arrow-right"></i></button>
            </div>
        </div>
        
        </div>
        </li> `)

}

function deleteCurrentEntries() {

    $("ul#searchResultList").empty()

}


