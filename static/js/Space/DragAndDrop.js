// Function to initialize drag-and-drop for the grid-container
function initDragAndDrop() {
    const gridContainer = document.getElementById('grid-container');
    
    // When dragging over the container, add the 'dragging' class
    gridContainer.addEventListener('dragover', (event) => {
        event.preventDefault();
        gridContainer.classList.add('dragging');
    });
    
    // When drag leaves the container, remove the 'dragging' class
    gridContainer.addEventListener('dragleave', () => {
        gridContainer.classList.remove('dragging');
    });

    // When dropping files or folders
    gridContainer.addEventListener('drop', (event) => {
        event.preventDefault();
        gridContainer.classList.remove('dragging');

        const items = event.dataTransfer.items;
        const files = [];

        // Traverse through dropped items
        for (let i = 0; i < items.length; i++) {
            const item = items[i].webkitGetAsEntry();
            if (item) {
                if (item.isDirectory) {
                    // If the item is a folder, process it recursively
                    processDirectory(item, FolderId);
                } else {
                    files.push(items[i].getAsFile());
                }
            }
        }

        if (files.length > 0) {
            uploadFiles(files, FolderId); // Upload files if any
        }
    });
}

// Function to process a directory and log all files inside
function processDirectory(directoryEntry, parent_id) {
    let current_id;
    NewFolderApi(parent_id, directoryEntry.name).then((data) => {
        current_id = data['Id'];
        console.log(current_id);
        const reader = directoryEntry.createReader();
    
        reader.readEntries((entries) => {
            entries.forEach((entry) => {
                if (entry.isDirectory) {
                    processDirectory(entry, current_id); // Recursively process subfolders
                } else {
                    entry.file((file) => {
                        uploadFiles([file], current_id)
                    });
                }
            });
        });
        viewContentFolder()
    })
}

// Function to handle file uploads
function uploadFiles(files, folder_id) {
    const progressBarContainer = document.createElement('div');
    progressBarContainer.classList.add('progress-bar-container');
    document.body.appendChild(progressBarContainer); // Append the progress container to the body

    files.forEach((file, index) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('folderId', folder_id);

        // Create progress bar for each file
        const progressBar = document.createElement('div');
        progressBar.classList.add('progress-bar');
        progressBarContainer.appendChild(progressBar);

        // Create and configure XMLHttpRequest for upload
        const xhr = new XMLHttpRequest();
        xhr.open('POST', UploadURL, true);
        xhr.withCredentials = true; // Include session cookies

        // Track progress event
        xhr.upload.addEventListener('progress', (event) => {
            if (event.lengthComputable) {
                const percentComplete = (event.loaded / event.total) * 100;
                progressBar.style.width = `${percentComplete}%`;
                progressBar.textContent = `Uploading... ${Math.round(percentComplete)}%`;
            }
        });

        // Handle completion
        xhr.onload = function () {
            if (xhr.status === 200) {
                progressBar.style.width = '100%';
                progressBar.textContent = `File ${index + 1} of ${files.length} uploaded`;
                console.log('File uploaded successfully:', file.name);
                viewContentFolder()
            } else {
                console.error('Error uploading file:', file.name, xhr.statusText);
                progressBar.textContent = `Error uploading ${file.name}`;
            }
        };

        // Handle errors
        xhr.onerror = function () {
            console.error('Upload error:', file.name);
            progressBar.textContent = `Error uploading ${file.name}`;
        };

        // Send the form data
        xhr.send(formData);
    });
}

// Initialize drag-and-drop functionality
document.addEventListener('DOMContentLoaded', initDragAndDrop());