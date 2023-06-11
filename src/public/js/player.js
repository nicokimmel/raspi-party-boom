// Song preview
const currentTitleTextLabel = $('#currentTitleTextLabel')
const currentArtistTextLabel = $('#currentArtistTextLabel')
const currentSongPlaytimeLabel = $('#currentSongPlaytimeLabel')
const currentSongLengthLabel = $('#currentSongLengthLabel')
const currentSongImage = $('#currentSongImage')
const currentSongImageBackground = $('#currentSongImageBackground')

// Player controlls
const skipBackwardButton = $('#skipBackwardButton')
const playButton = $('#playButton')
const loopButton = $('#loopButton')
const skipForwardButton = $('#skipForwardButton')
const progressBar = $('#progressBar')

// Default values
const defaultSongName = "No song playing"
const defaultSongArtist = "No artist involved"
let loop = false

// [Progressbar]

progressBar.on('mousedown', function () {
    seeking = true
})

progressBar.on('change', function () {
    seeking = false
    console.log('ASDF' + progressBar.val())
    spotifySeek(progressBar.val())
})

progressBar.on('input', function () {
    if (seeking)
        currentSongPlaytimeLabel.text(formatMilliseconds(parseInt(progressBar.val())))
})

function refreshProgressbar(song, time) {
    if (song != null) {
        if(!seeking)
            currentSongPlaytimeLabel.text(formatMilliseconds(time))

        currentSongLengthLabel.text(formatMilliseconds(song.duration))
        progressBar.attr("max", song.duration);
    } else {
        currentSongPlaytimeLabel.text('00:00')
        currentSongLengthLabel.text('00:00')
    }   

    if (!seeking) {
        progressBar.val((time))        
    }
}

// [Playercontrolls]

$('#playButton').on("click", function () {
    if (isPlaying)
        spotifyPause()
    else
        spotifyResume()
})

$('#skipForwardButton').on("click", function () {
    spotifyNext()
})

$('#skipBackwardButton').on("click", function () {
    spotifyPrevious()
});

function refreshPlayButton(isPlaying) {

    playButton.empty()

    if (isPlaying) {
        playButton.append(`<i class="bi bi-pause"></i>`)
        playButton.removeClass('btn-success')
        playButton.removeClass('bg-spotify')
        playButton.addClass('btn-secondary')
    } else {
        playButton.append(`<i class="bi bi-play"></i>`)
        playButton.addClass('btn-success')
        playButton.addClass('bg-spotify')
        playButton.removeClass('btn-secondary')
    }    
}

function refreshLoopbutton() {
    if (loop) {
        loopButton.addClass('text-success')
    } else { 
        loopButton.removeClass('text-success')
    }
}

function refreshCurrentTitle(song) {
    if (song != null) {
        currentTitleTextLabel.text(song.title)
        currentArtistTextLabel.text(song.artist)
        currentSongImage.attr('src', '' + song.image)
        currentSongImageBackground.attr('src', '' + song.image)
    } else {
        currentTitleTextLabel.text(defaultSongName)
        currentArtistTextLabel.text(defaultSongArtist)
        currentSongImage.attr('src', '../images/default.webp')
        currentSongImageBackground.attr('src', '../images/default.webp')
    }

}

loopButton.on('click', function () {
    loop = !loop
    spotifyLoop()
    refreshLoopbutton()
})