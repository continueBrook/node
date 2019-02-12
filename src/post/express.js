const express = require('express');
const body = require('body-parser');

let server = express();
server.listen(3000);

server.use(body.urlencoded({extended:false}));
server.use(body.json());

server.use('/api',(req,res) => {
    res.setHeader('Access-Control-Allow-Origin','*');
    res.setHeader('Access-Control-Allow-Headers','X-Requested-With');
    console.log(req.method);
    if(req.method == 'POST'){
        console.log(req.body);
    }
    res.send('ok');
})
