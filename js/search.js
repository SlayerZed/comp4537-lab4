// Add an event listener for the 'click' event on the search button
// This listens for the user clicking the search button and then triggers the function.
document.getElementById('searchBtn').addEventListener('click', async function() {
    
    // Get the value of the 'word' input field and remove any leading/trailing whitespace.
    const word = document.getElementById('word').value.trim();
    
    // Get the element where the result will be displayed later.
    const result = document.getElementById('result');

    // Check if the input field is empty.
    // If so, display an error message and return (stop execution).
    if (!word) {
        result.textContent = "Please enter a word to search for.";
        result.style.color = "red"; // Error message in red color
        return;
    }

    // Validate the input to ensure it only contains letters and spaces.
    // If it doesn't match this pattern, show an error message and stop execution.
    if (!/^[a-zA-Z\s]+$/.test(word)) {
        result.textContent = "Word can only contain letters and spaces.";
        result.style.color = "red"; // Error message in red color
        return;
    }

    try {
        // Send a GET request to the server using fetch, appending the word as a query parameter.
        const response = await fetch(`https://noahbaldwincomp4537-lab4-26062.nodechef.com/api/definitions?word=${word}`);

        // Check if the response status is OK (200-299). If not, throw an error.
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        // Read the response as plain text. If the response is empty, throw an error.
        const text = await response.text();
        if (!text) {
            throw new Error("Empty response from the server");
        }

        // Try to parse the response text as JSON.
        const data = JSON.parse(text);

        // Check if the word was found and display it along with its definition.
        if (data && data.requestNumber) {
            result.textContent = `Request #${data.requestNumber}: ${data.word} - ${data.definition}`;
            result.style.color = "black"; // Success message in black
        } else {
            // If the word wasn't found, display an appropriate message.
            result.textContent = `Word '${word}' not found!`;
            result.style.color = "red"; // Error message in red
        }
    } catch (error) {
        // Catch any errors (e.g., network issues or parsing errors), log them, and show the user an error message.
        console.error("Error:", error);
        result.textContent = `An error occurred. Please try again. Error: ${error.message}`;
        result.style.color = "red"; // Error message in red
    }
});
