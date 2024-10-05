// For the Hamburger Menu
document.getElementById('hamburger-menu').addEventListener('click', function() {
  const sideMenu = document.getElementById('side-menu');
  sideMenu.classList.toggle('active');
});

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

// Add a folder to file view
function addFolderToGrid(Icon, Name, Id){
  main = document.getElementById("file-view");
  let element = document.createElement('div')
            element.className = "grid-item"
            element.innerHTML = `
                <img src="${Icon}" alt="" onclick="window.location ='${ViewFolderURL +'/'+ Id}'">
                <div class="text">${ Name }</div>
                <div class="menu-container">
                    <button class="dots-menu-btn" onclick = "ContextMenu('${Id + "-folder-context-menu"}')">⋮</button>
                    <div id = "${Id + "-folder-context-menu"}" class="menu">
                        <ul>
                            <li onclick="window.open('${ViewFolderURL +'/'+ Id}', '_blank')">
                                <img src="${MenuIconOpen}">
                                Open
                            </li>
                            <li onclick = "renameFolder('${Id}', '${Name}')">
                                <img src="${MenuIconEdit}">
                                Rename
                            </li>
                            <li onclick = "moveGridElement('${Id}', '${FolderId}', true)">
                                <img src="${MenuIconMove}">
                                Move
                            </li>
                            <li onclick="shareFolder('${Id}', '${Name}')">
                                <img src="${MenuIconShare}">
                                Share
                            </li>
                            <li onclick="infoFolder( '${Id}' )"">
                                <img src="${MenuIconInfo}">
                                Details
                            </li>
                            <li onclick="deleteFolderApi( '${Id}' )">
                                <img src="${MenuIconDelete}">
                                Delete
                            </li>
                        </ul>
                    </div>
                </div>
            `;
            main.appendChild(element);
}

// Add a file to file view
function addFileToGrid(Icon, Name, Id){
  main = document.getElementById("file-view");
  let element = document.createElement('div')
            element.className = "grid-item"
            element.innerHTML = `
                <img src="${Icon}" alt="" onclick="window.location ='${ViewFileURL +'/'+ Id}'">
                <div class="text">${ Name }</div>
                <div class="menu-container">
                    <button class="dots-menu-btn" onclick = "ContextMenu('${Id + "-file-context-menu"}')">⋮</button>
                    <div id = "${Id + "-file-context-menu"}" class="menu">
                        <ul>
                            <li onclick = "previewFile('${Id}')">
                                <img src="${MenuIconView}">
                                Preview
                            </li>
                            <li onclick = "renameFile('${Id}', '${Name}')">
                                <img src="${MenuIconEdit}">
                                Rename
                            </li>
                            <li onclick = "moveGridElement('${Id}', '${FolderId}', false)">
                                <img src="${MenuIconMove}">
                                Move
                            </li>
                            <li onclick="window.open('${ViewFileURL +'/'+ Id}', '_blank')">
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

// Creates a new folder from the side menu
function NewFolder(){
    // Add the HTML Overlay content
    insertHTML(`
        <h2>New Folder</h2>
        <input type="text" id="NewFolderName" placeholder="Folder Name">
        <button class="close-button" onclick = 'showOverlay(false)'>
            <img src="${CloseButtonIcon}" alt="X">
        </button>
        <br>
        <button id="createNewFolder" class = "ok-button">Create</button>
        <button class = "cancel-button" onclick = 'showOverlay(false)'>Cancel</button>
      `);

    // Display the Overlay
    showOverlay(true);

    // function to call the API when pressed the button
    document.getElementById("createNewFolder").addEventListener("click", () => {
        new_folder_name = document.getElementById("NewFolderName").value;
        res = NewFolderApi(FolderId, new_folder_name);
        document.getElementById('overlay').style.display = 'none'; // Hide overlay
        document.getElementById('NewFolderName').value = ""; // Clears the NewFolderName
        removeHTML()
        viewContentFolder();
    });
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

// Share a file
function shareFolder(folder_id, folder_name){
    // Add the HTML Overlay content
    insertHTML(`
        <h2>Share</h2>
        <button class="close-button" onclick = 'showOverlay(false)'>
            <img src="${CloseButtonIcon}" alt="X">
        </button>
        <p> Share ${folder_name} by email or with a link </p>
        <input type="email" id="ShareByEmailInput" placeholder="Share with email">
        <br>
        <button id="shareFolder" class = "ok-button">Share</button>
        <button id="shareFolderLink" class = "middle-button">Share Link</button>
        <button class = "cancel-button" onclick = 'showOverlay(false)'>Cancel</button>
    `);
    
    // Display the Overlay
    showOverlay(true);

    document.getElementById('shareFolder').addEventListener("click", () => {
        email = document.getElementById("ShareByEmailInput").value;
        showOverlay(false);
        shareEmailApi(folder_id, email, true);
        AllertBox("Folder shared")
    })

    document.getElementById("shareFolderLink").addEventListener("click", () => {
        shareLinkApi(folder_id, true).then((data) => {
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

function renameFolder(id, folder_name){
    // Add the HTML Overlay content
    insertHTML(`
        <h2>Rename</h2>
        <button class="close-button" onclick = 'showOverlay(false)'>
            <img src="${CloseButtonIcon}" alt="X">
        </button>
        <p> Rename ${folder_name}:</p>
        <input type="text" id="RenamedFolder" placeholder="New folder name">
        <br>
        <button id="renameFolderButton" class = "ok-button">Rename</button>
        <button class = "cancel-button" onclick = 'showOverlay(false)'>Cancel</button>
    `);
    
    // Display the Overlay
    showOverlay(true);

    document.getElementById('renameFolderButton').addEventListener("click", () => {
        newName = document.getElementById("RenamedFolder").value;
        showOverlay(false)
        RenameApi(id, newName, true);
        viewContentFolder();
    })
}

function moveGridElement(id, current_folder, is_folder){
    viewSubfolderApi(current_folder).then(subfolders => {
        if (is_folder === true) {
            delete subfolders[id];
        }
        console.log(subfolders);

        // Add the HTML Overlay content
        insertHTML(`
            <h2>Rename</h2>
            <button class="close-button" onclick = 'showOverlay(false)'>
                <img src="${CloseButtonIcon}" alt="X">
            </button>
            <p> Move to:</p>
            <ul id="SubfolderList">
            </ul>
            <br>
            <button id="MoveButton" class = "ok-button">Move</button>
            <button class = "cancel-button" onclick = 'showOverlay(false)'>Cancel</button>
        `);
        
        // Add the possible subfolders in the list
        function populateList(jsonData) {
            const ul = document.getElementById('SubfolderList');
            ul.innerHTML = ''; // Clear previous list items

            // Iterate through JSON object keys and values
            for (let key in jsonData) {
                if (jsonData.hasOwnProperty(key)) {
                    const li = document.createElement('li');
                    li.innerHTML = `
                        <img src="${FolderIcon}" alt = "">
                        ${jsonData[key]}
                    `; // Add key-value pair as text
                    li.onclick = () => moveGridElement(id, key, is_folder);
                    ul.appendChild(li); // Append each LI to the UL
                }
            }
        }
        
        populateList(subfolders);
        
        document.getElementById("MoveButton").addEventListener("click", () => {
            showOverlay(false);
            MoveApi(id, current_folder, is_folder);
            viewContentFolder();
        });

        // Shows the Overlay
        showOverlay(true);
    });
}

function infoFolder( folder_id ) {
    infoFolderApi(folder_id).then((data) => {
        insertHTML(`
            <h2>Informations</h2>
            <button class="close-button" onclick = 'showOverlay(false)'>
                  <img src="${CloseButtonIcon}" alt="X">
            </button>
            <br>      
            <p id='FolderName' > </p><br>
            <p id='FolderProprietary' > </p><br>
            <br>
            <button class = "ok-button" onclick = 'modifyFolderShare("${folder_id}")'>Edit sharing permissions</button>
            <button class = "cancel-button" onclick = 'showOverlay(false)'>Close</button>
        `); // Add the HTML Overlay content
        document.getElementById("FolderName").innerText = 'Name: ' + data.name;
        document.getElementById("FolderProprietary").innerText = 'Proprietary: ' + data.proprietary;
        showOverlay(true); // Show overlay
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

function showPreview(bool) {
    if (bool === true) {
        document.getElementById("preview").style.display="flex";
    }
    else {
        document.getElementById("preview").style.display="none";
        document.getElementById("preview").innerHTML = `
        <header id="preview-title" onclick = "showPreview(false)">
        </header>
        <button id="preview-download">
            <img src="${MenuIconDownload}" alt="download">
        </button>
        <button id="close-preview" onclick = "showPreview(false)">
            <img src="${MenuIconClose}" alt="X">
        </button>
        <div class="preview-content" id="preview-content">
            
        </div>
        `;
    }
}

function previewFile(id){
    infoFileApi(id).then((data) => {
        let type = data.type;
        let name = data.name;

        if (type === "image") {
            document.getElementById("preview-download").onclick = () => {
                window.open(ViewFileURL + id, '_blank')
            }
            document.getElementById("preview-title").innerHTML=`
            <img src="${FileIconImage}" alt="">
            ${name}
            `;

            var img = document.createElement('img');
            img.src = previewImgURL + id;
            document.getElementById("preview-content").appendChild(img);
            showPreview(true);
        }
        if (type === "pdf") {
            document.getElementById("preview-download").onclick = () => {
                window.open(ViewFileURL + id, '_blank')
            }
            document.getElementById("preview-title").innerHTML=`
            <img src="${FileIconPdf}" alt="">
            ${name}
            `;
            PdfInfoApi(id).then((data) => {
                const pages = data.pages;
                for (let i = 0; i < pages; i++) {
                    const placeholder = document.createElement('div');
                    placeholder.className = 'placeholder';
                    placeholder.id = `preview-placeholder-${i}`;
                    placeholder.textContent = `Page ${i}`;
                    document.getElementById('preview-content').appendChild(placeholder);
                    const observer = new IntersectionObserver((entries) => {
                        entries.forEach(entry => {
                            if (entry.isIntersecting) {
                                const img = document.createElement('img');
                                img.src = previewPdfURL + `/${id}/${i}`; // Adjust the path according to your images
                                img.alt = `Page ${i}`;
                                
                                // Clear placeholder and append image
                                placeholder.innerHTML = ''; // Clear existing content
                                placeholder.appendChild(img); // Add the image

                                // Unobserve the placeholder after loading
                                observer.unobserve(entry.target);
                            }
                        });
                    });
                    observer.observe(placeholder);
                }
            })

            // Shows the preview
            showPreview(true);
        }
        if (type === "document") {
            document.getElementById("preview-download").onclick = () => {
                window.open(ViewFileURL + id, '_blank')
            }
            document.getElementById("preview-title").innerHTML=`
            <img src="${FileIconDoc}" alt="">
            ${name}
            `;

            var img = document.createElement('img');
            img.src = previewDocURL + id;
            document.getElementById("preview-content").appendChild(img);
            showPreview(true);
        }
        if (type === "sheet") {
            document.getElementById("preview-download").onclick = () => {
                window.open(ViewFileURL + id, '_blank')
            }
            document.getElementById("preview-title").innerHTML=`
            <img src="${FileIconSheet}" alt="">
            ${name}
            `;
            SheetsInfoApi(id).then((data) => {
                const pages = data.pages;
                for (let i = 0; i < pages; i++) {
                    const placeholder = document.createElement('div');
                    placeholder.className = 'placeholder';
                    placeholder.id = `preview-placeholder-${i}`;
                    placeholder.textContent = `Page ${i}`;
                    document.getElementById('preview-content').appendChild(placeholder);
                    const observer = new IntersectionObserver((entries) => {
                        entries.forEach(entry => {
                            if (entry.isIntersecting) {
                                const img = document.createElement('img');
                                img.src = previewSheetsURL + `/${id}/${i}`; // Adjust the path according to your images
                                img.alt = `Page ${i}`;
                                
                                // Clear placeholder and append image
                                placeholder.innerHTML = ''; // Clear existing content
                                placeholder.appendChild(img); // Add the image

                                // Unobserve the placeholder after loading
                                observer.unobserve(entry.target);
                            }
                        });
                    });
                    observer.observe(placeholder);
                }
            })

            // Shows the preview
            showPreview(true);
        }
        if (type === "slide") {
            document.getElementById("preview-download").onclick = () => {
                window.open(ViewFileURL + id, '_blank')
            }
            document.getElementById("preview-title").innerHTML=`
            <img src="${FileIconSlide}" alt="">
            ${name}
            `;
            SlidesInfoApi(id).then((data) => {
                const pages = data.pages;
                for (let i = 0; i < pages; i++) {
                    const placeholder = document.createElement('div');
                    placeholder.className = 'placeholder';
                    placeholder.id = `preview-placeholder-${i}`;
                    placeholder.textContent = `Page ${i}`;
                    document.getElementById('preview-content').appendChild(placeholder);
                    const observer = new IntersectionObserver((entries) => {
                        entries.forEach(entry => {
                            if (entry.isIntersecting) {
                                const img = document.createElement('img');
                                img.src = previewSlidesURL + `/${id}/${i}`; // Adjust the path according to your images
                                img.alt = `Page ${i}`;
                                
                                // Clear placeholder and append image
                                placeholder.innerHTML = ''; // Clear existing content
                                placeholder.appendChild(img); // Add the image
    
                                // Unobserve the placeholder after loading
                                observer.unobserve(entry.target);
                            }
                        });
                    });
                    observer.observe(placeholder);
                }
            })
    
            // Shows the preview
            showPreview(true);
        }
    });
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

function modifyFolderShare(id){
    infoShare(id, true).then((permissions) => {
        // Add the HTML Overlay content
        insertHTML(`
            <h2>Share</h2>
            <button class="close-button" onclick = 'showOverlay(false)'>
                <img src="${CloseButtonIcon}" alt="X">
            </button>
            <p> Move to:</p>
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
                            deleteShareEmail(id, jsonData[key].email, true);
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
                            deleteShareLink(id, jsonData[key].id, true);
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
            if (item.type === "file/document") {
                addFileToGrid(FileIconDoc, item.name, item.id);
              }
              if (item.type === "file/sheet") {
                addFileToGrid(FileIconSheet, item.name, item.id);
              }
              if (item.type === "file/slide") {
                addFileToGrid(FileIconSlide, item.name, item.id);
              }
              if (item.type === "file/image") {
                addFileToGrid(FileIconImage, item.name, item.id);
              }
              if (item.type === "file/video") {
                addFileToGrid(FileIconVideo, item.name, item.id);
              }
              if (item.type === "file/pdf") {
                addFileToGrid(FileIconPdf, item.name, item.id);
              }
              if (item.type === "file/other") {
                addFileToGrid(FileIconGen, item.name, item.id);
              }
        }
    })
}

// Loads the item in the folder when the rest is loaded
window.onload = function() {
  viewContentFolder();
};