// Import all required modules for use in the server
const http = require('http'); // Used by both Kaiser and Noah
const url = require('url'); // Used by both Kaiser and Noah
const fs = require('fs'); // Used by both Kaiser and Noah

// Define the port number where the server will listen for incoming requests.
// Uses the environment variable 'PORT' if defined, otherwise defaults to 3000.
const port = process.env.PORT || 3000;

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
