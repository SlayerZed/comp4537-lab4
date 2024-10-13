document.getElementById('submitBtn').addEventListener('click', function() {
    const word = document.getElementById('word').value.trim();
    const definition = document.getElementById('definition').value.trim();
    const feedback = document.getElementById('feedback');

    if (!word || !definition) {
        feedback.textContent = "Please provide both a word and a definition.";
        return;
    }

    // Input validation to allow only letters for the word
    if (!/^[a-zA-Z]+$/.test(word)) {
        feedback.textContent = "Word can only contain letters.";
        return;
    }

    const requestData = { word: word, definition: definition };

    fetch('https://yourDomainName2.xyz/api/definitions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestData),
    })
    .then(response => response.json())
    .then(data => {
        feedback.textContent = `Request #${data.requestNumber}: ${data.message}`;
    })
    .catch(error => {
        feedback.textContent = "An error occurred. Please try again.";
    });
});
