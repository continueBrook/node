const http = require('http')
const https = require('https')
const urllib = require('url')
const fs = require('fs')
const path = require('path')

function requestUrl(url,headers){
    let urlObj = urllib.parse(url);
    let httpMode = null;
    if(urlObj.protocol=='http:'){
        httpMode=http;
    }else if(urlObj.protocol=='https:'){
        httpMode=https;
    }else{
        throw new Error(`协议无法识别 ${urlObj.protocol}`);
    }

    return new Promise((resolve,reject) => {
        let req = httpMode.request({
            host: urlObj.host,
            path: urlObj.path,
            headers
        }, (res) => {
            if (res.statusCode == 200 && res.statusCode < 300 || res.statusCode == 304) {
                let arr = []
                res.on('data', (data) => {
                    arr.push(data);
                });
                res.on('end', () => {
                    let buffer = Buffer.concat(arr);
                    resolve({
                        status: 200,
                        body: buffer,
                        headers: res.headers
                    })
                })
            } else if(res.statusCode==302 || res.statusCode==301){
                resolve({
                    status: 302,
                    body: null,
                    headers: res.headers
                })
            }else {
                reject({
                    status:res.statusCode,
                    body: null,
                    headers: res.headers
                })
            }
        })
        
        req.on('error', err => {
            console.log('错了' + err);
        })
        req.write(''); //发送post数据
        req.end(); //正式开始请求
    })
}


async function request(url){
    try{
        while(1){
            let {status,body,headers} = await requestUrl(url);
            console.log(status,url);
            if(status==200){
                return {body,headers};
            }else{
                url = headers.location;
            }
        }
    }catch(e){
        console.log(e);
    }
}

module.exports = request;