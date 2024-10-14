// Import all required modules for use in the server
const http = require('http'); // Used by both Kaiser and Noah
const url = require('url'); // Used by both Kaiser and Noah
const fs = require('fs'); // Used by both Kaiser and Noah

const port = process.env.PORT || 3000; // Port provided by NodeChef, but 3000 for localhost testing and as backup

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
            res2.setHeader('content-Type', 'application/json');
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
            res2.setHeader('content-Type', 'application/json');
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
        res2.setHeader('content-Type', 'application/json');
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