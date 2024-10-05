// Constants
const pageHeight = 1123; // Height of an A4 page in pixels
const editor = document.getElementById('editor');

// Load saved content
window.onload = function () {
    const savedContent = localStorage.getItem('document-content');
    if (savedContent) {
        editor.innerHTML = savedContent;
    }
    // Initial page handling
    handlePageBreaks();
    updatePageNavigation();
};

// Save document
function saveDocument() {
    const editorContent = editor.innerHTML;
    localStorage.setItem('document-content', editorContent);
    alert('Document saved!');
}

// Change font size
function changeFontSize() {
    const fontSize = document.getElementById('fontSize').value;
    editor.style.fontSize = fontSize;
    handlePageBreaks();
}

// Change font family
function changeFontFamily() {
    const fontFamily = document.getElementById('fontFamily').value;
    editor.style.fontFamily = fontFamily;
    handlePageBreaks();
}

// Print the document
function printDocument() {
    window.print();
}

// Handle dynamic page breaks
function handlePageBreaks() {
    // Save cursor position
    let range;
    try {
        const selection = window.getSelection();
        if (selection.rangeCount > 0) {
            range = selection.getRangeAt(0);
        }
    } catch (e) {
        console.error('Error retrieving the range:', e);
    }

    const pageContainer = document.getElementById('pageContainer');
    const pages = document.querySelectorAll('.page');

    // Reset all pages except the first one
    for (let i = 1; i < pages.length; i++) {
        pages[i].remove();
    }

    // Process the first page
    let currentPage = pages[0];
    let remainingContent = splitContent(currentPage);

    while (remainingContent) {
        const newPage = createNewPage();
        remainingContent = splitContent(newPage, remainingContent);
    }

    // Restore cursor position if available
    if (range) {
        const editorPage = pages[0];
        const newRange = document.createRange();
        newRange.setStart(editorPage, 0);
        newRange.collapse(true);
        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(newRange);
    }

    updatePageNavigation();
}

// Split content into pages
function splitContent(page, content = page.innerHTML) {
    page.innerHTML = content;
    let range = document.createRange();
    let pageHeightUsed = page.scrollHeight;

    if (pageHeightUsed <= pageHeight) return null;

    let endIndex = findSplitIndex(page);
    const remainingContent = content.substring(endIndex);
    page.innerHTML = content.substring(0, endIndex);

    return remainingContent;
}

// Find index to split content
function findSplitIndex(page) {
    let range = document.createRange();
    let nodes = Array.from(page.childNodes);
    let startIndex = 0;
    let endIndex = nodes.length;
    let middleIndex;

    while (startIndex < endIndex) {
        middleIndex = Math.floor((startIndex + endIndex) / 2);
        range.setStartBefore(nodes[0]);
        range.setEndAfter(nodes[middleIndex]);

        let pageHeightUsed = range.getBoundingClientRect().height;
        if (pageHeightUsed > pageHeight) {
            endIndex = middleIndex;
        } else {
            startIndex = middleIndex + 1;
        }
    }

    return range.endOffset;
}

// Create a new page
function createNewPage() {
    const newPage = document.createElement('div');
    newPage.className = 'page';
    newPage.setAttribute('contenteditable', 'true');
    document.getElementById('pageContainer').appendChild(newPage);

    return newPage;
}

// Update page navigation
function updatePageNavigation() {
    const pages = document.querySelectorAll('.page');
    const currentPageIndex = Array.from(pages).findIndex(p => p.style.display !== 'none');

    document.querySelectorAll('.page').forEach((page, index) => {
        page.style.display = (index === currentPageIndex) ? 'block' : 'none';
    });
}

// Navigate to the previous page
function previousPage() {
    const pages = document.querySelectorAll('.page');
    const currentPageIndex = Array.from(pages).findIndex(p => p.style.display !== 'none');

    if (currentPageIndex > 0) {
        updatePageDisplay(pages, currentPageIndex - 1);
    }
}

// Navigate to the next page
function nextPage() {
    const pages = document.querySelectorAll('.page');
    const currentPageIndex = Array.from(pages).findIndex(p => p.style.display !== 'none');

    if (currentPageIndex < pages.length - 1) {
        updatePageDisplay(pages, currentPageIndex + 1);
    }
}

// Update the display of pages based on the given index
function updatePageDisplay(pages, newIndex) {
    pages.forEach((page, index) => {
        page.style.display = (index === newIndex) ? 'block' : 'none';
    });
}

// Initial page navigation setup
updatePageNavigation();
