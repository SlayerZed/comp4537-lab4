document.getElementById('submitBtn').addEventListener('click', function() {
    const word = document.getElementById('word').value.trim();
    const definition = document.getElementById('definition').value.trim();
    const result = document.getElementById('result');

    if (!word || !definition) {
        result.textContent = "Please provide both a word and a definition.";
        result.style.color = "red"; 
        return;
    }

    if (!/^[a-zA-Z]+$/.test(word)) {
        result.textContent = "Word can only contain letters.";
        result.style.color = "red"; 
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
        if (data.success) {
            result.textContent = `Word and definition stored successfully!`;
            result.style.color = "green";
        } else {
            result.textContent = "An error occurred. Please try again.";
            result.style.color = "red"; 
        }
    })
    .catch(error => {
        result.textContent = "An error occurred. Please try again.";
        result.style.color = "red"; 
    });
});
