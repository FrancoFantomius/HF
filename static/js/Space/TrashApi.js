function restoreFolderApi ( folder_id ) {
    const data = {
      folder_id: folder_id
    }
  
    fetch(RestoreFolderURL, {
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
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      window.location.reload();
      })
    .catch(error => {
      console.error('Error:', error);
    });
}

function infoFolderApi( folder_id ) {
    const data = {
        folder_id: folder_id
      }
    
      fetch(InfoFolderURL, {
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
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        window.location.reload();
        })
      .catch(error => {
        console.error('Error:', error);
      });
}

function deleteFolderApi(folder_id ) {
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
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        window.location.reload();
        })
      .catch(error => {
        console.error('Error:', error);
      });
}

function restoreFileApi ( file_id ) {
    const data = {
      file_id: file_id
    }
  
    fetch(RestoreFileURL, {
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
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      window.location.reload();
      })
    .catch(error => {
      console.error('Error:', error);
    });
}

function infoFileApi( file_id ) {
    const data = {
        file_id: file_id
      }
    
      fetch(InfoFileURL, {
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
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        window.location.reload();
        })
      .catch(error => {
        console.error('Error:', error);
      });
}

function deleteFileApi( file_id ) {
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
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        window.location.reload();
        })
      .catch(error => {
        console.error('Error:', error);
      });
}

document.getElementById('empty-trash').onclick = event => {
  data = {}
  fetch(EmptyTrashURL, {
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
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .then(data => {
    window.location.reload();
    })
  .catch(error => {
    console.error('Error:', error);
  });
}
