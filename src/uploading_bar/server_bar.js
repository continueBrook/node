const express = require('express');
const multer  = require('multer');

let server = express();
server.listen(3000);

let multerObj = multer({dest:'./upload'});
server.use(multerObj.any());

server.use('/api',(req,res) => {
    res.setHeader('Access-Control-Allow-Origin','*');
    if(req.method != 'OPTIONS'){
        req.files.forEach((value,key) => {
            console.log(value);
            console.log(key);
        })
    };
    res.send('ok');
})