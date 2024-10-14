// Add an event listener for the 'click' event on the submit button
document.getElementById('submitBtn').addEventListener('click', async function() {
    // Get the value of the 'word' input field and trim any extra spaces
    const word = document.getElementById('word').value.trim();
    // Get the value of the 'definition' input field and trim any extra spaces
    const definition = document.getElementById('definition').value.trim();
    // Get the element where the result will be displayed
    const result = document.getElementById('result');

    // Check if the 'word' or 'definition' input fields are empty
    if (!word || !definition) {
        // Display an error message if either field is empty
        result.textContent = "Please provide both a word and a definition.";
        result.style.color = "red"; // Error message will be red
        return; // Stop further execution
    }

    // Validate that the 'word' input contains only letters
    if (!/^[a-zA-Z\s]+$/.test(word)) {
        // Display an error message if validation fails
        result.textContent = "Word can only contain letters.";
        result.style.color = "red"; // Error message will be red
        return; // Stop further execution
    }

    // Create an object with the word and definition to send to the server
    const requestData = { word: word, definition: definition };

    // Send a POST request to the server to store the word and definition
    try {
        const response = await fetch('https://noahbaldwincomp4537-lab4-26062.nodechef.com/api/', {
            method: 'POST', // Specify the request method as POST
            headers: { 'Content-Type': 'application/json' }, // Set the content type to JSON
            body: JSON.stringify(requestData), // Convert the request data to a JSON string
        });
        
        const data = await response.json();
        if (data) {
            // Display a success message in green
            result.textContent = `Word and definition stored successfully!`;
            result.style.color = "green"; // Success message will be green
        } else {
            // Display an error message if something went wrong
            result.textContent = "An error occurred. Please try again.";
            result.style.color = "red"; // Error message will be red
        }
    } catch (error) {
        // Display an error message if the request fails (e.g., network error)
        result.textContent = `An error occurred. Please try again. Error: ${error}`;
        result.style.color = "red"; // Error message will be red
    }
});
