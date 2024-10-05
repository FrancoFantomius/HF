// All the content in a Folder
function viewContentFolder(){
  const data = {
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
      addFileToGrid(item.name, item.id)
    }
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