// Add an event listener for the 'click' event on the search button
document.getElementById('searchBtn').addEventListener('click', async function() {
    const word = document.getElementById('word').value.trim();
    const result = document.getElementById('result');

    if (!word) {
        result.textContent = "Please enter a word to search for.";
        result.style.color = "red";
        return;
    }

    // Validate that the 'word' input contains only letters and spaces
    if (!/^[a-zA-Z\s]+$/.test(word)) {
        result.textContent = "Word can only contain letters and spaces.";
        result.style.color = "red";
        return;
    }

    try {
        // Send a GET request to the server
        const response = await fetch(`https://noahbaldwincomp4537-lab4-26062.nodechef.com/api/definitions?word=${word}`);

        // Check if the response is not empty and has a valid status
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        // Check if the response body is empty before trying to parse
        const text = await response.text();
        if (!text) {
            throw new Error("Empty response from the server");
        }

        // Try to parse the response text as JSON
        const data = JSON.parse(text);

        // Check if the word was found in the dictionary
        if (data && data.requestNumber) {
            result.textContent = `Request #${data.requestNumber}: ${data.word} - ${data.definition}`;
            result.style.color = "black";
        } else {
            result.textContent = `Word '${word}' not found!`;
            result.style.color = "red";
        }
    } catch (error) {
        // Log the error for debugging
        console.error("Error:", error);

        // Display the error message to the user
        result.textContent = `An error occurred. Please try again. Error: ${error.message}`;
        result.style.color = "red";
    }
});
