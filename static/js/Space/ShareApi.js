// All the content in a Folder
function viewContentFolder(){
  let data = {}
  fetch(ViewContentURL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json"
    },
    body: JSON.stringify(data),
    credentials: 'same-origin'
  })
  .then(response => response.json()) // Convert the response to JSON
  .then(data => {
    cleanGrid()
    for (let key in data) {
      let item = data[key];  // Process each item in the response
      if (item.type === "folder") {
        addFolderToGrid(FolderIcon, item.name, item.id);  // item[name] should be item.name
      }
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
  .catch(error => {
    ErrorBox(error);
    console.error('Error:', error);
  });
}

function infoFolderApi( folder_id ){
  const data = {
    folder_id: folder_id
  }

  return fetch(InfoFolderURL, {
    method : "POST",
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
      // Additional headers, if needed
    },
    body: JSON.stringify(data),
    credentials: 'same-origin' // This ensures cookies are included with the request
  })
  .then(response => {
    if (!response.ok) {
      ErrorBox('Network response was not ok')
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .catch(error => {
    ErrorBox(error);
    console.error('Error:', error);
  });

}

function infoFileApi( file_id ){
  const data = {
    file_id: file_id
  }

  return fetch(InfoFileURL, {
    method : "POST",
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
      // Additional headers, if needed
    },
    body: JSON.stringify(data),
    credentials: 'same-origin' // This ensures cookies are included with the request
  })
  .then(response => {
    if (!response.ok) {
      ErrorBox('Network response was not ok');
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .catch(error => {
    ErrorBox(error);
    console.error('Error:', error);
  });

}

function PdfInfoApi(id){
  data = {
    file_id: id,
  }
  return fetch(previewPdfInfoURL, {
    method: "POST",
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
      // Additional headers, if needed
    },
    body: JSON.stringify(data),
    credentials: 'same-origin' // This ensures cookies are included with the request
  })
  .then(response => {
    if (!response.ok) {
      ErrorBox('Network response was not ok');
      throw new Error('Network response was not ok');
    }
    return response.json()
  })
}

function SheetsInfoApi(id){
  data = {
    file_id: id,
  }
  return fetch(previewSheetsInfoURL, {
    method: "POST",
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
      // Additional headers, if needed
    },
    body: JSON.stringify(data),
    credentials: 'same-origin' // This ensures cookies are included with the request
  })
  .then(response => {
    if (!response.ok) {
      ErrorBox('Network response was not ok');
      throw new Error('Network response was not ok');
    }
    return response.json()
  })
}

function SlidesInfoApi(id){
  data = {
    file_id: id,
  }
  return fetch(previewSlidesInfoURL, {
    method: "POST",
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
      // Additional headers, if needed
    },
    body: JSON.stringify(data),
    credentials: 'same-origin' // This ensures cookies are included with the request
  })
  .then(response => {
    if (!response.ok) {
      ErrorBox('Network response was not ok');
      throw new Error('Network response was not ok');
    }
    return response.json()
  })
}

function searchApi(text){
  data = {
    text : text
  }
  
  return fetch(searchURL, {
    method: "POST",
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
      // Additional headers, if needed
    },
    body: JSON.stringify(data),
    credentials: 'same-origin' // This ensures cookies are included with the request
  })
  .then(response => {
    if (!response.ok) {
      ErrorBox('Network response was not ok');
      throw new Error('Network response was not ok');
    }
    return response.json()
  })
}