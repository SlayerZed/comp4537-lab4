// Add an event listener for the 'click' event on the submit button
// This listens for the user clicking the submit button and then triggers the function.
document.getElementById('submitBtn').addEventListener('click', async function() {
    
    // Get the values of the 'word' and 'definition' input fields, and remove any leading/trailing whitespace.
    const word = document.getElementById('word').value.trim();
    const definition = document.getElementById('definition').value.trim();
    
    // Get the element where the result will be displayed later.
    const result = document.getElementById('result');

    // Input validation: Check if either the 'word' or 'definition' fields are empty.
    // If either is empty, display an error message and return (stop execution).
    if (!word || !definition) {
        result.textContent = "Please provide both a word and a definition.";
        result.style.color = "red"; // Error message in red
        return;
    }

    // Validate the input for 'word' to ensure it only contains letters and spaces.
    // If the input is invalid, display an error message and stop execution.
    if (!/^[a-zA-Z\s]+$/.test(word)) {
        result.textContent = "Word can only contain letters and spaces.";
        result.style.color = "red"; // Error message in red
        return;
    }

    // Create an object containing the word and definition to be sent in the request body.
    const requestData = { word: word, definition: definition };

    // Log the request data to the console for debugging purposes.
    console.log("Sending Request Data:", requestData);

    try {
        // Send a POST request using fetch to store the word and definition.
        // The request includes the word and definition in the body, sent as JSON.
        const response = await fetch('https://cors-anywhere.herokuapp.com/https://noahbaldwincomp4537-lab4-26062.nodechef.com/api/definitions', {
            method: 'POST', // Use POST method to send data
            mode: 'cors', // Ensure CORS is used to handle cross-origin requests
            headers: {
                'Content-Type': 'application/json', // Specify that we are sending JSON data
                'Access-Control-Reqest-Method': 'POST', // Indicate allowed method for CORS
                'Access-Control-Request-Headers': 'Content-Type', // Indicate allowed headers
                'Accept': 'application/json', // Indicate that we expect JSON response
                'Connection': 'keep-alive' // Persistent connection for efficient data exchange
            },
            body: JSON.stringify(requestData) // Send the word and definition as a JSON object in the body
        });

        // Check if the request was successful (status code 200-299).
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Parse the JSON response from the server.
        const data = await response.json();

        // Check the response to see if the data was successfully stored.
        // If successful, display a success message.
        if (data.success) {
            result.textContent = "Word and definition stored successfully!";
            result.style.color = "green"; // Success message in green
        } else {
            // If something went wrong, display an error message.
            result.textContent = "An error occurred. Please try again.";
            result.style.color = "red"; // Error message in red
        }
    } catch (error) {
        // Catch any errors (e.g., network issues or server issues), log them, and show an error message to the user.
        console.error("Fetch Error:", error);
        result.textContent = `An error occurred. Please try again. Error: ${error.message}`;
        result.style.color = "red"; // Error message in red
    }

    // Log to confirm that the request was sent.
    console.log("Request sent.");
});
