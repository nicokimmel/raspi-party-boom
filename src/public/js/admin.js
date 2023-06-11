
const connectedList = $('#connectedList')
const blockedList = $('#blockedList')

function refreshConnectionLists(connectedClientList, blockedList) {
    
    emptyConnectionLists()
    let i = 0
    for (const [mac, hostname] of Object.entries(connectedClientList)) {
        addConnectionEntry(hostname, mac, i++)
    }
}

function emptyConnectionLists() {

    connectedList.empty()

}

function addConnectionEntry(hostname, mac, index) {

    console.log('Entry added connection')
    connectedList.append(`
    <li class="border rounded list-group-item m-0 mt-2 p-0">
        <div class="m-0">
            <div class="row g-0">                                      
                <div class="col-2">
                    <select class="text-center form-select m-auto h-100 w-100" aria-label="Default select example">
                       
  >    
                    <option value="1"><i class="bi bi-code-slash"></i></option>
                        <option value="2"><div><i class="bi bi-boombox"></i></div></option>                        
                        <option value="3"><i class="bi bi-headphones"></i></option>
                        <option value="4"><i class="bi bi-person"></i>.</option>
                    </select>
                </div>    
                <div class="col-8">
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
            </div class="row">
                <div class="btn-group w-100" role="group" aria-label="Basic radio toggle button group">
                    <input type="radio" class="btn-check" name="${hostname}" id="${hostname + 1}" autocomplete="off" checked>
                    <label class="btn btn-outline-success border-spotify" for="${hostname + 1}"><i class="bi bi-code-slash"></i></label>
                
                    <input type="radio" class="btn-check" name="${hostname}" id="${hostname + 2}" autocomplete="off">
                    <label class="btn btn-outline-success border-spotify" for="${hostname + 2}"><i class="bi bi-boombox"></i></label>
                
                    <input type="radio" class="btn-check" name="${hostname}" id="${hostname + 3}" autocomplete="off">
                    <label class="btn btn-outline-success border-spotify" for="${hostname + 3}"><i class="bi bi-person"></i></label>

                    <input type="radio" class="btn-check" name="${hostname}" id="${hostname + 4}" autocomplete="off">
                    <label class="btn btn-outline-success border-spotify" for="${hostname + 4}"><i class="bi bi-headphones"></i></label>
                <div>
            </div>
        </div>
    </li>      
`)
}
