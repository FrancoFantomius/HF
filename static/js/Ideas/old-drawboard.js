/*
const App = () => {
    return React.createElement(
      React.Fragment,
      null,
      React.createElement(
        "div",
        {
          style: { height: "100vh" },
        },
        React.createElement(ExcalidrawLib.Excalidraw, {
          onChange: handleChange,
          excalidrawAPI: excalidrawAPI,
        }),
      ),
    );
};


// Function to handle when the user makes changes to the board
const handleChange = (elements, appState) => {
  const currentData = excalidrawAPI.getSceneElements();
  console.log(currentData); // Log "hi" every time a change occurs
};


const excalidrawWrapper = document.getElementById("app");
const root = ReactDOM.createRoot(excalidrawWrapper);
root.render(React.createElement(App));
*/

const App = () => {
    const [elements, setElements] = React.useState([]);
    const [docId, setDocId] = React.useState(null);
    const prevElements = React.useRef([]); // Reference to hold previous elements
  
    // Function to compare two arrays (new and old elements)
    const areElementsEqual = (oldElements, newElements) => {
        return JSON.stringify(oldElements) === JSON.stringify(newElements);
    };
  
    // Load the document when the component mounts
    React.useEffect(() => {
        const loadDocument = async () => {
            const urlParts = window.location.pathname.split('/');
            const documentId = urlParts[urlParts.length - 1];
            setDocId(documentId);
  
            try {
                const response = await axios.get(`/api/document/${documentId}`);
                setElements(response.data.elements); // Set elements from the response
                prevElements.current = response.data.elements; // Initialize previous elements with loaded data
            } catch (error) {
                console.error("Error loading document:", error);
            }
        };
  
        loadDocument();
    }, []);
  
    // Function to handle when the user makes changes to the board
    const handleChange = (newElements, appState) => {
        setElements(newElements); // Update local state with the current elements
    };
  
    // Auto-save the document every 30 seconds
    React.useEffect(() => {
        const saveDocument = async () => {
            // Check if the new elements are different from the old elements
            if (!areElementsEqual(prevElements.current, elements)) {
                try {
                    await axios.post('/api/save', { elements });
                    console.log("Document saved successfully");
                    prevElements.current = elements; // Update the previous elements to the current ones after successful save
                } catch (error) {
                    console.error("Error saving document:", error);
                }
            } else {
                console.log("No changes detected, skipping save.");
            }
        };
  
        const intervalId = setInterval(saveDocument, 30000); // Save every 30 seconds
  
        return () => clearInterval(intervalId); // Cleanup on unmount
    }, [elements, docId]);
  
    return React.createElement(
        React.Fragment,
        null,
        React.createElement(
            "div",
            {
                style: { height: "100vh" },
            },
            React.createElement(ExcalidrawLib.Excalidraw, {
                onChange: handleChange,
                initialData: { elements }, // Load initial data into Excalidraw
            }),
        ),
    );
  };
  
  const excalidrawWrapper = document.getElementById("app");
  const root = ReactDOM.createRoot(excalidrawWrapper);
  root.render(React.createElement(App));