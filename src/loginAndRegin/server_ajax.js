const http = require("http");
const url = require("url");   //get方法获得数据
const fs = require("fs");  
const zlib = require("zlib");   //压缩用
const querystring = require("querystring");  //post方法获得数据
const mysql = require("mysql");
const crypto = require("crypto");  //对于加密(md5)
const key = "zheshiyiduanmeiyourenzhidaodekey";  

let db = mysql.createPool({
    host: "localhost",
    port: "3306",
    user: "root",
    password: "123456",
    database: "2018"
})

function md5(str) {
    let obj = crypto.createHash("md5");
    obj.update(str);
    return obj.digest("hex");
}

function md5_2(str) {
    return md5(md5(str) + key);
}

let server = http.createServer((req, res) => {
    if(req.headers['origin']  == null){   //对于是否跨域的一种判断;
        res.setHeader('Access-Control-Allow-Origin','*');  //全部放开 允许访问;
    }
    let {pathname,query} = url.parse(req.url, true);
    let {user,pass} = query;
    function checkQuery() {
        for (i in query) {
            return true;
        }
        return false;
    }
    switch (pathname) {
        case '/reg':
            if (checkQuery()) {  //get方法
                if (!user) {
                    res.write('{"error":1,"msg":"user is null"}');
                    res.end();
                } else if (!pass) {
                    res.write('{"error":1,"msg":"pass is null"}');
                    res.end();
                } else if (!/^[A-Za-z0-9]{4,16}$/.test(user)) {
                    res.write('{"error":1,"msg":"user is not valied"}');
                    res.end();
                } else if (/['|"]/.test(pass)) {
                    res.write('{"error":1,"msg":"pass is not valied"}');
                    res.end();
                } else {
                    db.query(`SELECT * FROM user_table where username = '${user}'`, (err, data) => {
                        if (err) {
                            res.write('{"error":1,"msg":"database is worry about select"}');
                            res.end();
                        } else if (data.length > 0) {
                            res.write('{"error":1,"msg":"this user is existed"}');
                            res.end();
                        } else {
                            db.query(`INSERT INTO user_table (ID,username,password) VALUES (0,'${user}','${md5_2(pass)}')`, (err, data) => {
                                if (err) {
                                    res.write('{"error":1,"msg":"database is worry about insert"}');
                                    res.end();
                                } else {
                                    res.write('{"error":0,"msg":"sucess"}');
                                    res.end();
                                }
                            })
                        }
                    })
                }
            } else { //post方法
                let arr = [];
                req.on("data", data => {
                    arr.push(data);
                });
                req.on("end", () => {
                    let postData = Buffer.concat(arr).toString();
                    postData = querystring.parse(postData);
                    let user = postData["user"];
                    let pass = postData["pass"];
                    if (!user) {
                        res.write('{"error":1,"msg":"user is null"}');
                        res.end();
                    } else if (!pass) {
                        res.write('{"error":1,"msg":"pass is null"}');
                        res.end();
                    } else if (!/^[A-Za-z0-9]{4,16}$/.test(user)) {
                        res.write('{"error":1,"msg":"user is not valied"}');
                        res.end();
                    } else if (/['|"]/.test(pass)) {
                        res.write('{"error":1,"msg":"pass is not valied"}');
                        res.end();
                    } else {
                        db.query(`SELECT * FROM user_table where username = '${user}'`, (err, data) => {
                            if (err) {
                                res.write('{"error":1,"msg":"database is worry about select"}');
                                res.end();
                            } else if (data.length > 0) {
                                res.write('{"error":1,"msg":"this user is existed"}');
                                res.end();
                            } else {
                                db.query(`INSERT INTO user_table (ID,username,password) VALUES (0,'${user}','${md5_2(pass)}')`, (err, data) => {
                                    if (err) {
                                        res.write('{"error":1,"msg":"database is worry about insert"}');
                                        res.end();
                                    } else {
                                        res.write('{"error":0,"msg":"sucess"}');
                                        res.end();
                                    }
                                })
                            }
                        })
                    }
                })
            }
            break;
        case '/login':
            if (checkQuery()) {  //get方法
                if (!user) {
                    res.write('{"error":1,"msg":"user is null"}');
                    res.end();
                } else if (!pass) {
                    res.write('{"error":1,"msg":"pass is null"}');
                    res.end();
                } else if (!/^[A-Za-z0-9]{4,16}$/.test(user)) {
                    res.write('{"error":1,"msg":"user is not valied"}');
                    res.end();
                } else if (/['|"]/.test(pass)) {
                    res.write('{"error":1,"msg":"pass is not valied"}');
                    res.end();
                } else {
                    db.query(`SELECT * FROM user_table where username = '${user}'`, (err, data) => {
                        if (err) {
                            res.write('{"error":1,"msg":"database is worry about select"}');
                            res.end();
                        } else if (data.length == 0) {
                            res.write('{"error":1,"msg":"this user is not existed please regin"}');
                            res.end();
                        } else if (data[0].password != md5_2(pass)) {
                            res.write('{"error":1,"msg":"your username or your password is wrong"}');
                            res.end();
                        } else {
                            res.write('{"error":0,"msg":"login sucess"}');
                            res.end();
                        }
                    })
                }
            } else {  //post方法
                let arr = [];
                req.on("data", data => {
                    arr.push(data);
                });
                req.on("end", () => {
                    let postData = Buffer.concat(arr).toString();
                    postData = querystring.parse(postData);
                    let user = postData["user"];
                    let pass = postData["pass"];
                    if (!user) {
                        res.write('{"error":1,"msg":"user is null"}');
                        res.end();
                    } else if (!pass) {
                        res.write('{"error":1,"msg":"pass is null"}');
                        res.end();
                    } else if (!/^[A-Za-z0-9]{4,16}$/.test(user)) {
                        res.write('{"error":1,"msg":"user is not valied"}');
                        res.end();
                    } else if (/['|"]/.test(pass)) {
                        res.write('{"error":1,"msg":"pass is not valied"}');
                        res.end();
                    } else {
                        db.query(`SELECT * FROM user_table where username = '${user}'`, (err, data) => {
                            if (err) {
                                res.write('{"error":1,"msg":"database is worry about select"}');
                                res.end();
                            } else if (data.length == 0) {
                                res.write('{"error":1,"msg":"this user is not existed please regin"}');
                                res.end();
                            } else if (data[0].password != md5_2(pass)) {
                                res.write('{"error":1,"msg":"your username or your password is wrong"}');
                                res.end();
                            } else {
                                res.write('{"error":0,"msg":"login sucess"}');
                                res.end();
                            }
                        })
                    }
                })
            }
            break;
        default:
            fs.stat(`.${req.url}`, (err, data) => { //data获得server端改变的时间
                function sendToClient() {
                    let rs = fs.createReadStream(`.${req.url}`);
                    console.log(`.${req.url}`);
                    let gz = zlib.createGzip(`.${req.url}`);
                    res.setHeader("Content-Encoding", "gzip");
                    res.setHeader("last-modified", data.mtime.toGMTString()); //缓存
                    rs.pipe(gz).pipe(res);
                    rs.on("error", err => {
                        res.writeHeader(404);
                        res.write("not found");
                        res.end();
                    })
                }
                if (err) {
                    res.writeHeader(404);
                    res.write("404");
                    res.end();
                } else {
                    if (req.headers['if-modified-since']) {
                        let oDate = new Date(req.headers['if-modified-since']);
                        let client_time = Math.floor(oDate.getTime() / 1000);
                        let server_time = Math.floor(data.mtime.getTime() / 1000);
                        if (server_time > client_time) {
                            sendToClient();
                        } else {
                            res.writeHeader(304);
                            res.write("not modified");
                            res.end();
                        }
                    } else {
                        console.log("a");
                        sendToClient();
                    }
                }
            })
    }
})
server.listen(3000);