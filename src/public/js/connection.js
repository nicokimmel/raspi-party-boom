
let socket = io();
let timeout = null; 

// Time it takes for the search to start after the last keyinput
let searchDelay = 500;

let textInputField = $( '#searchTextInput' ) 

socket.on('spotify-search', (songList) => {
    
    songList.forEach(song => {
        console.log(song);

    });
});

function spotifySearch(query) {
    socket.emit('spotify-search', query)
}
      

textInputField.on('input',function(e){
    clearTimeout(timeout)
    const textInput = textInputField.val()
    timeout == setTimeout(() => spotifySearch(textInput), searchDelay)
});

function addEntryToList(){

    

}



