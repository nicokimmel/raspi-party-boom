// Textlabel and other ui components
const currentTitleTextLabel = $('#currentTitleTextLabel')
const currentArtistTextLabel = $('#currentArtistTextLabel')
const currentSongPlaytimeLabel = $('currentSongPlaytimeLabel')

$('#currentTitleTextLabel').text("Never Gonna Give you up")
$('#currentArtistTextLabel').text("FrigginM")

socket.on('tick', (song, time, queue) => {
    
});
