// Add an event listener for the 'click' event on the search button
document.getElementById('searchBtn').addEventListener('click', function() {
    // Get the value of the 'word' input field and trim any extra spaces
    const word = document.getElementById('word').value.trim();
    // Get the element where the result will be displayed
    const result = document.getElementById('result');

    // Check if the 'word' input field is empty
    if (!word) {
        // Display an error message if the field is empty
        result.textContent = "Please enter a word to search for.";
        result.style.color = "red"; // Error message will be red
        return; // Stop further execution
    }

    // Validate that the 'word' input contains only letters
    if (!/^[a-zA-Z]+$/.test(word)) {
        // Display an error message if validation fails
        result.textContent = "Word can only contain letters.";
        result.style.color = "red"; // Error message will be red
        return; // Stop further execution
    }

    // Send a GET request to the server to search for the word's definition
    fetch(`https://noahbaldwincomp4537-lab4-26062.nodechef.com/api/definitions?word=${word}`)
    .then(response => response.json()) // Convert the response to JSON
    .then(data => {
        // Check if the word was found in the dictionary
        if (data.found) {
            // Display the word and its definition in black
            result.textContent = `Request #${data.requestNumber}: ${data.word} - ${data.definition}`;
            result.style.color = "black"; // Normal result will be black
        } else {
            // Display a "word not found" message if the word wasn't found
            result.textContent = `Request #${data.requestNumber}: Word '${word}' not found!`;
            result.style.color = "red"; // Error message will be red
        }
    })
    .catch(error => {
        // Display an error message if the request fails (e.g., network error)
        result.textContent = "An error occurred. Please try again.";
        result.style.color = "red"; // Error message will be red
    });
});
