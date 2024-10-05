// Creates a new subfolder in a specific folder
function NewFolderApi(folder_id, new_folder_name){
    const data = {
      folder_id: folder_id,
      name : new_folder_name
    }
    return fetch(NewFolderURL, {
      method: 'POST',
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
      return response.json().then((data) => {
        console.log('Success:', data);
        return data;
      });
    })
    .catch(error => {
      ErrorBox(error);
      console.error('Error:', error);
    });
}

// All the content in a Folder
function viewContentFolder(){
  const data = {
    folder_id: FolderId
  }

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
      else {
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



function deleteFolderApi ( folder_id ) {
  const data = {
    folder_id: folder_id
  }

  fetch(DeleteFolderURL, {
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
  .then(data => {
    viewContentFolder();
    })
  .catch(error => {
    ErrorBox(error);
    console.error('Error:', error);
  });
}

function deleteFileApi ( file_id ) {
  const data = {
    file_id: file_id
  }

  fetch(DeleteFileURL, {
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
  .then(data => {
    viewContentFolder();
    })
  .catch(error => {
    ErrorBox(error);
    console.error('Error:', error);
  });
}


// Share file or folder by email
function shareEmailApi ( id, email, is_folder ) {
  let data = {};
  if (is_folder === false){
    data = {
      file_id : id,
      email: email
    }
  }
  else {
    data = {
      folder_id: id,
      email : email
    }
  }
  fetch(ShareEmailURL, {
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
  .then(data => {
    console.log("Success: ", data);
    })
  .catch(error => {
    ErrorBox(error);
    console.error('Error:', error);
  });

}

// Share file or folder by link
function shareLinkApi ( id, is_folder ) {
  let data = {};
  
  if (is_folder === false) {
    data = { file_id: id };
  } else {
    data = { folder_id: id };
  }
  return fetch(ShareLinkURL, {
    method: 'POST',
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
    return response.json().then((data) => {
      console.log('Success:', data);
      return data;
    });
  })
  .catch(error => {
    ErrorBox(error);
    console.error('Error:', error);
  });

}

// Rename a file or a folder
function RenameApi(id, new_name, is_folder){
  let data = {};
  if (is_folder === false) {
    data = {
      file_id: id,
      name: new_name,
    };
  } else {
    data = {
      folder_id: id,
      name: new_name
    };
  }
  fetch(RenameURL, {
    method: 'POST',
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
    return response.json().then((data) => {
      console.log('Success:', data);
      AllertBox(data['message'])
      return data;
    });
  })
  .catch(error => {
    ErrorBox(error);
    console.error('Error:', error);
  });
}

// Move a file or a folder
function MoveApi(id, new_position, is_folder){
  let data = {};
  if (is_folder === false) {
    data = {
      file_id: id,
      new_position: new_position
    };
  } else {
    data = {
      folder_id: id,
      new_position: new_position
    };
  }
  fetch(MoveURL, {
    method: 'POST',
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
    return response.json().then((data) => {
      console.log('Success:', data);
      AllertBox(data['message'])
      return data;
    });
  })
  .catch(error => {
    ErrorBox(error);
    console.error('Error:', error);
  });  
}

// All the subfolders in a folder
async function viewSubfolderApi(folder_id){
  const data = {
    folder_id: folder_id
  }
  
  const response1 = await fetch(ViewContentURL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json"
    },
    body: JSON.stringify(data),
    credentials: 'same-origin'
  })
  if (!response1.ok){
    ErrorBox(response1.statusText)
  }
  const json1 = await response1.json();

  const response2 = await fetch(InfoFolderURL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json"
    },
    body: JSON.stringify(data),
    credentials: 'same-origin'
  })
  if (!response2.ok){
    ErrorBox(response1.statusText)
  }
  const json2 = await response2.json();
  
  subfolders = {}

  if (json2.parent_folder) {
    subfolders[json2.parent_folder] = "⬆️";
  }

  for (let key in json1) {
    let item = json1[key];  // Process each item in the response
    if (item.type === "folder") {
      subfolders[item.id] = item.name;  // item[name] should be item.name
    }
  }
  return subfolders;
  
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

function infoShare(id, is_folder){
  let data = {};
  if (is_folder === true) {
    data = {
      folder_id : id
    }
  }
  else {
    data = {
      file_id : id
    }
  }

  return fetch(ShareInfoURL, {
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
      console.log(response)
      throw new Error('Network response was not ok');
    }
    return response.json()
  })
}

function deleteShareEmail(id, email, is_folder){
  let data = {}
  if (is_folder === true) {
    data = {
      folder_id : id,
      email : email
    }
  }
  else{
    data = {
      file_id: id,
      email : email
    }
  }
  fetch(ShareDeleteURL, {
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

function deleteShareLink(id, link, is_folder){
  let data = {}
  if (is_folder === true) {
    data = {
      folder_id : id,
      link: link
    }
  }
  else{
    data = {
      file_id: id,
      link: link
    }
  }
  fetch(ShareDeleteURL, {
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