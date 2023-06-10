
function refreshHistory(songList) {

    emptyHistoryList()

    for (let i = 0; i < songList.length; i++) {
        console.log(songList[i].title)
        
        addEntryToHistoryList(songList[i], i)
    }

    $('#historyList').find('.removeFromHistoryButton').on('click', function () {
        let index = parseInt($(this).siblings('.index').val())
        let selectedSong = songList[index]
        console.log("Added again:" + selectedSong.title + "   " + index)
        
        spotifyAddToQueue(selectedSong)
    })
}

function emptyHistoryList() {
    $("#historyList").empty()
}

function addEntryToHistoryList(song, index) {
    $("#historyList").append(`<li class="border rounded list-group-item m-0 mt-2 p-0">
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
                    <button type="button" class="btn removeFromHistoryButton" style="width: 100%; height: 100%">
                        <i class="bi bi-plus-square"></i>
                    </button>
                    <input type="hidden" value="${index}" class="index"></input>
                </div>            
            </div>
        </div>
    </li>`)
}