// Import all required modules for use in the server
const http = require('http'); // Used by both Kaiser and Noah
const url = require('url'); // Used by both Kaiser and Noah
const fs = require('fs'); // Used by both Kaiser and Noah

// Define the port number where the server will listen for incoming requests.
// Uses the environment variable 'PORT' if defined, otherwise defaults to 3000.
const port = process.env.PORT || 3000; // Port provided by NodeChef/Azure, but 3000 for localhost testing and as backup

// Kaiser's server code:
// Create the HTTP server
http.createServer((req, res) => {
    // Declare variables to hold the content of files to be served (HTML, CSS, JS)
    let store, search, style, storejs, searchjs;

    // Parse the request URL to determine the path
    const reqUrl = url.parse(req.url, true);

    // Serve the 'store.html' file when the '/store' path is requested
    if (reqUrl.pathname === '/store') { // Used by Kaiser
        fs.readFile('./store.html', (err, data) => { 
            // If there's an error reading the file, return a 500 Internal Server Error
            if (err) {
                res.statusCode = 500;
                res.end('An error occurred');
            } else {
                // If successful, store the HTML data and serve it with a 200 OK response
                store = data;
                res.setHeader('Content-Type', 'text/html'); // Set the content type to HTML
                res.statusCode = 200;
                res.end(store); // Send the 'store.html' file as the response
            }
        });

    // Serve the 'search.html' file when the '/search' path is requested
    } else if (reqUrl.pathname === '/search') { // Used by Kaiser
        fs.readFile('./search.html', (err, data) => {
            // If there's an error reading the file, return a 500 Internal Server Error
            if (err) {
                res.statusCode = 500;
                res.end('An error occurred');
            } else {
                // If successful, store the HTML data and serve it with a 200 OK response
                search = data;
                res.setHeader('Content-Type', 'text/html'); // Set the content type to HTML
                res.statusCode = 200;
                res.end(search); // Send the 'search.html' file as the response
            }
        });

    // Serve the 'styles.css' file when the '/css/styles.css' path is requested (used for styling the HTML pages)
    } else if (reqUrl.pathname === '/css/styles.css') { // Used by Kaiser
        fs.readFile('./css/styles.css', (err, data) => {
            // If there's an error reading the file, return a 500 Internal Server Error
            if (err) {
                res.statusCode = 500;
                res.end('An error occurred');
            } else {
                // If successful, store the CSS data and serve it with a 200 OK response
                style = data;
                res.setHeader('Content-Type', 'text/css'); // Set the content type to CSS
                res.statusCode = 200;
                res.end(style); // Send the 'styles.css' file as the response
            }
        });

    // Serve the 'store.js' file when the '/js/store.js' path is requested (used for handling form submission in 'store.html')
    } else if (reqUrl.pathname === '/js/store.js') { // Used by Kaiser
        fs.readFile('./js/store.js', (err, data) => {
            // If there's an error reading the file, return a 500 Internal Server Error
            if (err) {
                res.statusCode = 500;
                res.end('An error occurred');
            } else {
                // If successful, store the JavaScript data and serve it with a 200 OK response
                storejs = data;
                res.setHeader('Content-Type', 'text/javascript'); // Set the content type to JavaScript
                res.statusCode = 200;
                res.end(storejs); // Send the 'store.js' file as the response
            }
        });

    // Serve the 'search.js' file when the '/js/search.js' path is requested (used for handling search functionality in 'search.html')
    } else if (reqUrl.pathname === '/js/search.js') { // Used by Kaiser
        fs.readFile('./js/search.js', (err, data) => {
            // If there's an error reading the file, return a 500 Internal Server Error
            if (err) {
                res.statusCode = 500;
                res.end('An error occurred');
            } else {
                // If successful, store the JavaScript data and serve it with a 200 OK response
                searchjs = data;
                res.setHeader('Content-Type', 'text/javascript'); // Set the content type to JavaScript
                res.statusCode = 200;
                res.end(searchjs); // Send the 'search.js' file as the response
            }
        });

    // If the requested path does not match any of the specified routes, return a 404 Not Found error
    } else { // Used by Kaiser
        res.statusCode = 404;
        res.end('Page not found'); // Send a 404 error message if the path doesn't exist
    }

// Make the server listen on the specified port
}).listen(port);



// Noah's server code:
// This code is used to get the word parameter, and is from StackOverflow here:
// https://stackoverflow.com/questions/16903476/node-js-http-get-request-with-query-string-parameters
const params=function(req){ // Used by Noah
    let q=req.url.split('?'),result={};
    if(q.length>=2){
        q[1].split('&').forEach((item)=>{
             try {
               result[item.split('=')[0]]=item.split('=')[1];
             } catch (e) {
               result[item.split('=')[0]]='';
             }
        });
    }
    return result;
}
// API endpoints programmed referencing https://morayodeji.medium.com/building-nodejs-api-without-expressjs-or-any-other-framework-977e8768abb1

http.createServer((req, res) => {
    const reqUrl = url.parse(req.url, true); // Used by both Kaiser and Noah
    let request_num = 1; // Track the request number, default to 1
    // Loads the current request number into the variable
    fs.readFile("./request_num_tracker.txt", (err, data) => { // Used by Noah
        if (err) {
            console.error(err);
            return
        } else {
            request_num = parseInt(data); // Update to correct request number
        }
    });

    let getData = (req2, res2) => { // Used by Noah
        req2.params = params(req2); // Used to get the ?word param from the URL
        let word = req2.params.word.replaceAll("%20", " "); // Replace %20 characters in the URL with spaces
        let response = ``;
        fs.readFile("./dictionary.json", (err, data) => { // Used by Noah
            if (err) {
                // Respond with an error
                response =
`
{
    "error_message": "An error has occurred, please try again."
}`;
                res2.statusCode = 500; // Internal server error code
            } else {
                let dictionary = JSON.parse(data);
                if (dictionary[word]) {
                    // Respond with the word + definition
                    response =
`
{
    "requestNumber": ${request_num},
    "word": "${word}",
    "definition": "${dictionary[word]}"
}`;
                    res2.statusCode = 200; // Success code
                }
                // Updates the value stored in the request number tracker
                fs.writeFile("./request_num_tracker.txt", (++request_num).toString(), err => { // Used by Noah
                    if (err) {
                        console.error(err);
                    } else {
                        console.log("File written successfully"); // Request number tracker update successful
                    }
                });
            }
            res2.setHeader('content-Type', 'Application/json');
            res2.setHeader('Access-Control-Allow-Origin', '*');
            res2.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
            res2.setHeader('Access-Control-Allow-Headers', 'Content-Type');
            res2.setHeader('Access-Control-Allow-Credentials', true);
            res2.end(response);
        });
    }

    let addData = (req2, res2) => {// Used by Noah
        let body = ``; // Stores the request body
        req.on('data', (chunk) => { // When data is recieved, update the body with the information
            body += chunk;
        });

        req.on('end', () => { // When the data is finished processing, return the response
            let response = ``;
            if (JSON.parse(body)) {
                let postBody = JSON.parse(body);
                fs.readFile("./dictionary.json", (err, data) => { // Used by Noah
                    if (err) {
                        // Respond with an error
                        response =
`
{
    "error_message": "An error occurred, please try again"
}`;
                        res2.statusCode = 500; // Internal server error code
                    } else {
                        // Successful file read
                        let dictionary = JSON.parse(data);
                        if (dictionary[postBody["word"]]) {
                            // Respond with an error
                            response =
`
{
    "error_message": "That word already exists in the dictionary!"
}`;
                            res2.statusCode = 400; // Bad request error code
                        } else {
                            // Word does not yet exist, add to the dictionary
                            let new_word = `"${postBody["word"]}": "${postBody["definition"]}"`; // Create a new word entry for the JSON
                            let dict_string = JSON.stringify(dictionary);
                            let existing_words = dict_string.substring(1, dict_string.length - 1);
                            existing_words = existing_words.replaceAll("\",", "\",\n");
                            // Updates the dictionary with the new word and proper formatting
                            fs.writeFile("./dictionary.json",
`{
${existing_words},
${new_word}
}`
                                , err => {
                                    if (err) {
                                        console.error(err);
                                    } else {
                                        console.log("file written successfully"); // Dictionary update successful
                                    }
                                });
                            response =
`
{
    "success": true
}`;
                            res2.statusCode = 201; // Successfully created code
                        }
                    }
                });
            } else {
                response =
`
{
    "error_message": "An error occurred, please try again"
}`;
                res2.statusCode = 500; // Internal server error code
            }
            res2.setHeader('content-Type', 'Application.json');
            res2.setHeader('Access-Control-Allow-Origin', '*');
            res2.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
            res2.setHeader('Access-Control-Allow-Headers', 'Content-Type');
            res2.setHeader('Access-Control-Allow-Credentials', true);
            res2.end(response);
        });
    }

    // If the user attempts an invalid url, then return a JSON with an error message
    let invalidUrl = (req2, res2) => { // Used by Noah
        let response =
`
{
    "message": "Oops! Unfortunately that is an invalid API endpoint! Please try either /api/definitions or /api/definitions?word="
}`;
        res2.statusCode = 404; // Not found error code
        res2.setHeader('content-Type', 'Application/json');
        res2.setHeader('Access-Control-Allow-Origin', '*');
        res2.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
        res2.setHeader('Access-Control-Allow-Headers', 'Content-Type');
        res2.setHeader('Access-Control-Allow-Credentials', true);
        res2.end(response);
    }

    if (req.url.includes(`/api/definitions?word=`)) {
        // Respond with the definition of the word provided
        getData(req, res);
    } else if (req.url.includes(`/api/definitions`))  {
        // Add a new word + definition
        addData(req, res);
    } else if (req.method === 'OPTIONS') {
        // Handle preflight request
        res.statusCode = 204;
        res.end();
        return;
    } else {
        // Respond with invalid url message
        invalidUrl(req, res);
        console.log(reqUrl.pathname);
    }
}).listen(port);
