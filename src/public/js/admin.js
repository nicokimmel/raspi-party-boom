
const connectedList = $('#connectedList')
const blockedList = $('#blockedList')

function refreshConnectionLists(networkData) {
    
    let connected = networkData.connected
    emptyConnectionLists()
    
    for (let i = 0; i < connected.length; i++) {
        addConnectionEntry(connected[i][1], connected[i][0], i, connected[i][2])
    }

    $('.permissionButton').on('click', function () {
        console.log("Click")
        let index = parseInt($(this).siblings('.index').val())
        let permission = parseInt($(this).attr('permission'))

        console.log("Change Permissin of entry " + (index)+ " / with " + permission)
        // spotifyQueueRemove(index + 1)
    })
}

function emptyConnectionLists() {

    connectedList.empty()

}

function addConnectionEntry(hostname, mac, index, permission) {

    console.log('Entry added connection')
    connectedList.append(`
    <li class="border rounded list-group-item m-0 mt-2 p-0">
        <div class="m-0">
            <div class="row g-0">   
                <div class="col-10">
                    <div class="m-2">
                        <div class="card-text">
                            <div class="text-truncate">
                            ${hostname}
                                <br>
                                <small class="text-body-secondary">${mac}</small>
                            </div>
                        </div>
                    </div>
                </div>       
                <div class="col-2">                              
                    <button type="button" class="btn removeFromQueueButton" style="width: 100%; height: 100%">
                        <i class="bi bi-hammer"></i>
                    </button>
                    <input type="hidden" value="${index}" class="index"></input>
                </div>            
            </div class="row" id="permissionList">
                <div class="btn-group w-100" role="group" aria-label="Basic radio toggle button group">
                    <input type="radio" class="btn-check" name="${hostname}" id="${hostname + 1}" autocomplete="off" ${permission == 0 ? 'checked' : ''}>
                    <label class="btn btn-outline-success border-spotify permissionButton" for="${hostname + 1}" permission="0">
                        <i class="bi bi-code-slash"></i>                        
                    </label>
                
                    <input type="radio" class="btn-check" name="${hostname}" id="${hostname + 2}" autocomplete="off" ${permission == 1 ? 'checked' : ''}>
                    <label class="btn btn-outline-success border-spotify permissionButton" for="${hostname + 2}" permission="1">
                        <i class="bi bi-boombox"></i>
                    </label>
                
                    <input type="radio" class="btn-check" name="${hostname}" id="${hostname + 3}" autocomplete="off" ${permission == 2 ? 'checked' : ''}>
                    <label class="btn btn-outline-success border-spotify permissionButton" for="${hostname + 3}" permission="2">
                        <i class="bi bi-person"></i>
                    </label>

                    <input type="radio" class="btn-check" name="${hostname}" id="${hostname + 4}" autocomplete="off" ${permission == 3 ? 'checked' : ''}>
                    <label class="btn btn-outline-success border-spotify permissionButton" for="${hostname + 4}" permission="3">
                        <i class="bi bi-headphones"></i>
                    </label>
                    <input type="hidden" value="${index}" class="index"></input>
                <div>
            </div>
        </div>
    </li>      
`)
}

function checkPermission() {

}
