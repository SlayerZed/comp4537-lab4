const port = process.env.PORT || 3000;
const http = await import(http);

// This code is from StackOverflow here:
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

http.createServer((req, res) => {
    res.writeHead(200, {"Content-Type": "text/html"});
    let url = req.url;
    if (url.includes("/api/definitions")) {
        // api post method
    }
    if (url.includes("/api/definitions?word=")) {
        req.params = params(req);
        let word = req.params.word;
        res.write(`<h3>${word}</h3>`);
    }
}).listen(port);