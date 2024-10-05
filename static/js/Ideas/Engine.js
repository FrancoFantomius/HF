// Interactive user details
document.getElementById('user-logo').addEventListener('click', function() {
    const userMenu = document.getElementById('user-menu');
    if (userMenu.style.display === 'none' || userMenu.style.display === '') {
        userMenu.style.display = 'block';
    } else {
        userMenu.style.display = 'none';
    }
});

// Menu for every file/folder
function ContextMenu(Id) {
    const menu = document.getElementById(Id);

    // Toggle the menu visibility first
    const isMenuVisible = menu.style.display === 'block';
    menu.style.display = isMenuVisible ? 'none' : 'block';

    // Only proceed with positioning if the menu was just made visible
    if (!isMenuVisible) {

        // Gets current dimensions
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        // Reset any previous position classes
        menu.classList.remove('left', 'top');

        const menuRect = menu.getBoundingClientRect();

        // Check if there's enough space to the right
        if (menuRect.left + menuRect.width > viewportWidth) {
            // Not enough space to the right, move to the left
            menu.classList.add('left');
        }

        // Check if there's enough space below
        if (menuRect.bottom + menuRect.height + 90 > viewportHeight) {
            // Not enough space below, move the menu to the top
            menu.classList.add('top');
        }
    }
};

// Add a file to file view
function addFileToGrid(Name, Id){
    main = document.getElementById("file-view");
    let element = document.createElement('div')
    element.className = "grid-item"
    element.innerHTML = `
        <img src="${FileIconNote}" alt="" onclick="window.location ='${ViewFileURL +'/'+ Id}'">
        <div class="text">${ Name }</div>
        <div class="menu-container">
            <button class="dots-menu-btn" onclick = "ContextMenu('${Id + "-file-context-menu"}')">⋮</button>
            <div id = "${Id + "-file-context-menu"}" class="menu">
                <ul>
                    <li onclick = "renameFile('${Id}', '${Name}')">
                        <img src="${MenuIconEdit}">
                        Rename
                    </li>
                    <li onclick="window.open('${DownloadFileURL +'/'+ Id}', '_blank')">
                        <img src="${MenuIconDownload}">
                        Download
                    </li>
                    <li onclick="shareFile('${Id}', '${Name}')">
                        <img src="${MenuIconShare}">
                        Share
                    </li>
                    <li onclick="infoFile( '${Id}' )"">
                        <img src="${MenuIconInfo}">
                        Details
                    </li>
                    <li onclick="deleteFileApi( '${Id}' )"">
                        <img src="${MenuIconDelete}">
                        Delete
                    </li>
                </ul>
            </div>
        </div>
    `;
    main.appendChild(element);
}

// Shows the errors
function ErrorBox(Error){
    const errorbox = document.getElementById("error-box");

    errorbox.innerText = Error;
    
    errorbox.style.display = "block";

    errorbox.style.left = '255px';

    setTimeout(() => {
        errorbox.style.left = "0px";
        errorbox.innerText = "";
    }, 20000);

    setTimeout(() => {
        errorbox.style.display="none";
    }, 22000)

}
  
// Shows the allerts
function AllertBox(Allert){
    const allertbox = document.getElementById("allert-box");
    allertbox.innerText = Allert;

    allertbox.style.display="block";

    allertbox.style.left = "255px";

    setTimeout(() => {
        allertbox.style.left = "0px";
        allertbox.innerText = "";
    }, 20000);

    setTimeout(() => {
        allertbox.style.display = "none";
    }, 22000);
}

// Show/Hide the Overlay
function showOverlay(bool){
    if (bool === true) {
        document.getElementById('overlay').style.display = 'flex'; // Show overlay
    }
    else {
        document.getElementById('overlay').style.display = 'none'; // Show overlay
        const overlayContent = document.querySelector(".overlay-content");
        overlayContent.innerHTML = "";
    }
}

// Insert code in the Overlay
function insertHTML(HTML) {
  const overlayContent = document.querySelector('.overlay-content');
  overlayContent.innerHTML = HTML;
}

// Clean the file view

function cleanGrid(){
  main = document.getElementById('file-view');
  main.innerHTML = `
          <div class="drop-message">
              <img src="${UploadIcon}" alt="">
              Drag and drop files or folders here
          </div>
  `;
}

// Share a file
function shareFile(file_id, file_name){
    // Add the HTML Overlay content
    insertHTML(`
        <h2>Share</h2>
        <button class="close-button" onclick = 'showOverlay(false)'>
            <img src="${CloseButtonIcon}" alt="X">
        </button>
        <p> Share ${file_name} by email or with a link </p>
        <input type="email" id="ShareByEmailInput" placeholder="Share with email">
        <br>
        <button id="shareFile" class = "ok-button">Share</button>
        <button id="shareFileLink" class = "middle-button">Share Link</button>
        <button class = "cancel-button" onclick = 'showOverlay(false)'>Cancel</button>
    `);
    
    // Display the Overlay
    showOverlay(true);

    document.getElementById('shareFile').addEventListener("click", () => {
        email = document.getElementById("ShareByEmailInput").value;
        showOverlay(false);
        shareEmailApi(file_id, email, false);
        AllertBox("File shared")
    })

    document.getElementById("shareFileLink").addEventListener("click", () => {
        shareLinkApi(file_id, false).then((data) => {
            showOverlay(false);
            link = window.location.protocol + '//' + window.location.host + BaseSharingLinkURL + data['link'];
            navigator.clipboard.writeText(link);
            AllertBox("Link copied to clipboard")
        });
    })
    
}

function renameFile(id, file_name){
    // Add the HTML Overlay content
    insertHTML(`
        <h2>Rename</h2>
        <button class="close-button" onclick = 'showOverlay(false)'>
            <img src="${CloseButtonIcon}" alt="X">
        </button>
        <p> Rename ${file_name}:</p>
        <input type="text" id="RenamedFile" placeholder="New file name">
        <br>
        <button id="renameFileButton" class = "ok-button">Rename</button>
        <button class = "cancel-button" onclick = 'showOverlay(false)'>Cancel</button>
    `);
    
    // Display the Overlay
    showOverlay(true);

    document.getElementById('renameFileButton').addEventListener("click", () => {
        newName = document.getElementById("RenamedFile").value;
        showOverlay(false);
        RenameApi(id, newName, false);
        viewContentFolder();
    })
}

function infoFile( file_id ) {
    infoFileApi(file_id).then((data) => {
        insertHTML(`
            <h2>Informations</h2>
            <button class="close-button" onclick = 'showOverlay(false)'>
                  <img src="${CloseButtonIcon}" alt="X">
            </button>
            <br>
            <p id='FileName' > </p><br>
            <p id='FileSize' > </p><br>
            <p id='FileType' > </p><br>
            <p id='FileProprietary' > </p><br>
            <br>      
            <br>
            <button class = "ok-button" onclick = 'modifyFileShare("${file_id}")'>Edit sharing permissions</button>
            <button id="cancelFileInfo" onclick = 'showOverlay(false)'>Close</button>
            `); // Add the HTML Overlay content
        document.getElementById("FileName").innerText = 'Name: ' + data.name;
        document.getElementById("FileSize").innerText = 'Size: ' + data.size;
        document.getElementById("FileType").innerText = 'File type: ' + data.type;
        document.getElementById("FileProprietary").innerText = 'Proprietary: ' + data.proprietary;
        showOverlay(true)
    })
}

function modifyFileShare(id){
    showOverlay(false);
    infoShare(id, false).then((permissions) => {
        // Add the HTML Overlay content
        insertHTML(`
            <h2>Share</h2>
            <button class="close-button" onclick = 'showOverlay(false)'>
                <img src="${CloseButtonIcon}" alt="X">
            </button>
            <ul id="ShareList">
            </ul>
            <br>
            <button class = "cancel-button" onclick = 'showOverlay(false)'>Cancel</button>
            `);
        
        // Add the possible subfolders in the list
        function populateList(jsonData) {
            const ul = document.getElementById('ShareList');

            // Iterate through JSON object keys and values
            for (let key in jsonData) {
                if (jsonData.hasOwnProperty(key)) {
                    const li = document.createElement('li');
                    if (jsonData[key].type === "email"){
                        
                        li.innerHTML = `
                            <img src="${MenuIconEmail}" alt = "">
                            ${jsonData[key].email}
                        `; // Add key-value pair as text
                        li.onclick = () => {
                            deleteShareEmail(id, jsonData[key].email, false);
                            showOverlay(false);
                        };
                        ul.appendChild(li); // Append each LI to the UL
                    }
                    else {
                        li.innerHTML = `
                            <img src="${MenuIconLink}" alt = "">
                            ${jsonData[key].id}
                        `; // Add key-value pair as text
                        li.onclick = () => {
                            deleteShareLink(id, jsonData[key].id, false);
                            showOverlay(false);
                        };
                        ul.appendChild(li); // Append each LI to the UL
                    }
                }
            }
        }
        
        populateList(permissions);

        // Shows the Overlay
        showOverlay(true);
    })
}

function Search(){
    const Searchbox = document.getElementById("SearchBox");
    text = Searchbox.value;

    searchApi(text).then((data) => {
        cleanGrid();
        for (let key in data){
            let item = data[key];
            addFileToGrid(item.name, item.id);
        }
    })
}

// Loads the item in the folder when the rest is loaded
window.onload = function() {
  viewContentFolder();
};