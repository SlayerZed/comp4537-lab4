document.getElementById('searchBtn').addEventListener('click', function() {
    const word = document.getElementById('word').value.trim();
    const result = document.getElementById('result');

    if (!word) {
        result.textContent = "Please enter a word to search for.";
        result.style.color = "red";
        return;
    }

    if (!/^[a-zA-Z]+$/.test(word)) {
        result.textContent = "Word can only contain letters.";
        result.style.color = "red";
        return;
    }

    fetch(`https://yourDomainName2.xyz/api/definitions?word=${word}`)
    .then(response => response.json())
    .then(data => {
        if (data.found) {
            result.textContent = `Request #${data.requestNumber}: ${data.word} - ${data.definition}`;
            result.style.color = "black";
        } else {
            result.textContent = `Request #${data.requestNumber}: Word '${word}' not found!`;
            result.style.color = "red";
        }
    })
    .catch(error => {
        result.textContent = "An error occurred. Please try again.";
        result.style.color = "red";
    });
});
