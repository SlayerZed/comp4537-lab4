// Import all required modules for use in the API
const http = await import('http');
const url = await import('url');
const fs = await import('fs');

const port = process.env.PORT || 3000; // Port provided by NodeChef, but 3000 for localhost testing and as backup

// This code is used to get the word parameter, and is from StackOverflow here:
// https://stackoverflow.com/questions/16903476/node-js-http-get-request-with-query-string-parameters
const params=function(req){
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
    const reqUrl = url.parse(req.url, true);
    if (!localStorage.request_num) localStorage.request_num = 1;

    let getData = (req2, res2) => {
        req2.params = params(req2);
        let response = ``;
        fs.readFile("./dictionary.json", (err, data) => {
            if (err) {
                // Respond with an error
                response =
                `{
                    "error_message": "An error has occurred, please try again."
                }`;
                res2.statusCode = 500; // Internal server error code
            } else {
                let dictionary = JSON.parse(data);
                if (dictionary[req2.params.word]) {
                    // return word + definition
                    response =
                    `{
                        "requestNumber": ${localStorage.request_num},
                        "word": "${req2.params.word}",
                        "definition": "${dictionary[req2.params.word]}"
                    }`;
                    res2.statusCode = 200; // Success code
                }
                localStorage.request_num += 1;
            }
            res2.setHeader('content-Type', 'Application/json');
            res2.end(response);
        });
    }

    let addData = (req2, res2) => {
        let body = ``;
        req.on('data', (chunk) => {
            body += chunk;
        });

        req.on('end', () => {
            let response = ``;
            if (JSON.parse(body)) {
                let postBody = JSON.parse(body);
                fs.readFile("./dictionary.json", (err, data) => {
                    if (err) {
                        // Respond with an error
                        response = `
                        {
                            "error_message": "An error occurred, please try again"
                        }`;
                        res2.statusCode = 500; // Internal server error code
                    } else {
                        // Successful file read
                        let dictionary = JSON.parse(data);
                        if (dictionary[postBody["word"]]) {
                            // Respond with an error
                            response = `
                            {
                                "error_message": "An error occurred, please try again"
                            }`;
                            res2.statusCode = 500; // Internal server error code
                        } else {
                            let new_word = `"${postBody["word"]}": "${postBody["definition"]}"`;
                            let existing_words = data.substring(1, data.length - 2);
                            fs.writeFile("./dictionary.json",
                                `{
                                ${existing_words},
                                    ${new_word}
                                }`);
                            response = `
                            {
                                "success": true
                            }`;
                            res2.statusCode = 201; // Successfully created code
                        }
                    }
                });
            } else {
                response = `
                {
                    "error_message": "An error occurred, please try again"
                }`;
                res2.statusCode = 500; // Internal server error code
            }
            res2.setHeader('content-Type', 'Application.json');
            res2.end(response);
        });
    }
    
    let invalidUrl = (req2, res2) => {
        let response =
        `{
            "message": "Oops! Unfortunately that is an invalid API endpoint! Please try either /api/definitions or /api/definitions?word="
        }`;
        res2.statusCode = 404;
        res2.setHeader('content-Type', 'Application/json');
        res2.end(response);
    }

    if (reqUrl.pathname.includes(`/api/definitions?word=`) && req.method === 'GET') {
        // Add a new word + definition
        addData(req, res);
    } else if (reqUrl.pathname.includes(`/api/definitions`) && req.method === 'POST')  {
        // Respond with the definition of the word provided
        getData(req, res);
    } else {
        // Respond with invalid url message
        invalidUrl(req, res);
    }
}).listen(port);