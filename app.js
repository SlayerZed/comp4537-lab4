const port = process.env.PORT || 3000;
const http = await import('http');
const url = await import('url');
const fs = await import('fs');

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
        fs.readFile("./dictionary.json", (err, data) => {
            if (err) {
                // return error
                let response =
                `{
                    "error_message": "An error has occurred, please try again."
                }`;
                res2.statusCode = 500; // Internal server error code
                res2.setHeader('content-Type', 'Application/json');
                res2.end(JSON.stringify(response));
            } else {
                let dictionary = JSON.parse(data);
                if (dictionary[req2.params.word]) {
                    // return word + definition
                    let response =
                    `{
                        "requestNumber": ${localStorage.request_num},
                        "word": "${req2.params.word}",
                        "definition": "${dictionary[req2.params.word]}"
                    }`;
                    res2.statusCode = 200; // Success code
                    res2.setHeader('content-Type', 'Application/json');
                    res2.end(JSON.stringify(response));
                }
                localStorage.request_num += 1;
            }
        });
    }
    let addData = (req2, res2) => {
        let body = '';
        req.on('data', (chunk) => {
            body += chunk;
        });

        req.on('end', () => {
            let postBody = JSON.parse(body);
            let response;
            
            res2.statusCode = 201; // Successfully created code
            res2.setHeader('content-Type', 'Application.json');
            res2.end(JSON.stringify(response));
        });
    }
    if (reqUrl.pathname.includes(`/api/definitions`) && req.method === 'POST') {
        addData(req, res);
    } else if (reqUrl.pathname.includes(`/api/definitions?word=`) && req.method === 'GET') {
        getData(req, res);
    } else {
        // return invalid url
    }
}).listen(port);