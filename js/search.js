document.getElementById('searchBtn').addEventListener('click', function() {
    const word = document.getElementById('word').value.trim();
    const result = document.getElementById('result');

    if (!word) {
        result.textContent = "Please enter a word to search for.";
        return;
    }

    // Input validation to allow only letters for the word
    if (!/^[a-zA-Z]+$/.test(word)) {
        result.textContent = "Word can only contain letters.";
        return;
    }

    // Send a GET request to fetch the word's definition
    fetch(`https://yourDomainName2.xyz/api/definitions?word=${word}`)
    .then(response => response.json())
    .then(data => {
        if (data.found) {
            result.textContent = `Request #${data.requestNumber}: ${data.word} - ${data.definition}`;
        } else {
            result.textContent = `Request #${data.requestNumber}: Word '${word}' not found!`;
        }
    })
    .catch(error => {
        result.textContent = "An error occurred. Please try again.";
    });
});
