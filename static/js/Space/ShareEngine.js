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
                            <li onclick="infoFolder( '${Id}' )"">
                                <img src="${MenuIconInfo}">
                                Details
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
                            <li onclick="window.open('${ViewFileURL +'/'+ Id}', '_blank')">
                                <img src="${MenuIconDownload}">
                                Download
                            </li>
                            <li onclick="infoFile( '${Id}' )"">
                                <img src="${MenuIconInfo}">
                                Details
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




// Loads the item in the folder when the rest is loaded
window.onload = function() {
    viewContentFolder();
};