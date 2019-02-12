const http = require('http');
const querystring = require('querystring');

let server = http.createServer((req,res) => {
    res.setHeader('Access-Control-Allow-Origin','*');
    res.setHeader('Access-Control-Allow-Headers','X-Requested-With');
    if(req.method == 'POST'){
        let arr = [];
        req.on('data',data => {
            arr.push(data);
        });
        req.on('end',() => {
            let postData = Buffer.concat(arr).toString();
            postData = querystring.parse(postData);
            console.log(postData);
        })
    }
    res.write('ok');
    res.end();
});
server.listen(3000);