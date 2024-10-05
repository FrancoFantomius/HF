document.getElementById('hamburger-menu').addEventListener('click', function() {
    const sideMenu = document.getElementById('side-menu');
    sideMenu.classList.toggle('active');
});

document.getElementById('user-logo').addEventListener('click', function() {
    const userMenu = document.getElementById('user-menu');
    if (userMenu.style.display === 'none' || userMenu.style.display === '') {
        userMenu.style.display = 'block';
    } else {
        userMenu.style.display = 'none';
    }
});

document.querySelectorAll('.dots-menu-btn').forEach(button => {
    button.addEventListener('click', function() {
        const menu = this.nextElementSibling;
        const buttonRect = this.getBoundingClientRect();
        const menuRect = menu.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        // Reset any previous position classes
        menu.classList.remove('left', 'top');

        // Check if there's enough space to the right
        if (buttonRect.right + menuRect.width > viewportWidth) {
            // Not enough space to the right, move to the left
            menu.classList.add('left');
        }

        // Check if there's enough space below
        if (buttonRect.bottom + menuRect.height > viewportHeight) {
            // Not enough space below, move the menu to the top
            menu.classList.add('top');
        }

        // Toggle the menu visibility
        menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
    });
});

document.addEventListener('click', function(event) {
    // Close menus when clicking outside of them
    if (!event.target.matches('.dots-menu-btn')) {
        document.querySelectorAll('.menu').forEach(menu => {
            menu.style.display = 'none';
        });
    }
});


document.addEventListener('DOMContentLoaded', function () {
    const gridContainer = document.getElementById('grid-container');

    gridContainer.addEventListener('dragover', function (event) {
        event.preventDefault(); // Prevent default behavior to allow dropping
        gridContainer.classList.add('dragging');
    });

    gridContainer.addEventListener('dragleave', function () {
        gridContainer.classList.remove('dragging');
    });

    gridContainer.addEventListener('drop', function (event) {
        event.preventDefault(); // Prevent default behavior
        gridContainer.classList.remove('dragging');

        // Handle dropped files here
        const files = event.dataTransfer.files;

        // Upload each file
        for (let file of files) {
            uploadFile(file);
        }
    });

    function uploadFile(file) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('folderId', FolderId);

        fetch(UploadURL, {
            method: 'POST',
            body: formData,
            credentials: 'same-origin' // This ensures cookies are included with the request
        })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }
});

