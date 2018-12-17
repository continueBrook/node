const express = require("express");
const body    = require('body-parser');  //对于普通数据
const multer  = require("multer");   //对于文件数据
const mysql   = require("mysql");

let db = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "123456",
    port: 3306,
    database: '2018'
})

let server = express();
server.listen(3000);

server.use(body.urlencoded({extended:false}));
let multerObj = multer({dest:'./upload'})
server.use(multerObj.any());

server.use('/api',(req,res) => {
    console.log(req.method);

    if(req.headers['origin'] == 'null' || req.headers['origin'].startsWith('http://www.baidu.com')){
        res.setHeader('Access-Control-Allow-Origin','*');
    }
    console.log(req);
    let arr = [];
    req.files.forEach((value,key)=> {
        console.log(key);
        console.log(value);
        let originalname = req.files[key]["originalname"];
        let filename     = req.files[key]["filename"];
        let destination  = req.files[key]["destination"];
        arr.push(`('${originalname}','${filename}','${destination}')`);
        console.log(arr.join(','));
    })
    db.query(`INSERT INTO user_picture (originalname,filename,path) VALUES ${arr.join(',')}`,(error,data) => {
        if(error){
            res.send("not ok");
        }else{
            res.send("ok");
        }
    })
})