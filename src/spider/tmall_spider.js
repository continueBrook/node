const request = require('./libs/request');
const fs = require('fs');
const Mysql = require('mysql-pro');
const JSDOM = require('JSDOM').JSDOM;
const gbk = require('gbk');

let db = new Mysql({
    mysql: {
        host: 'localhost',
        port: 3306,
        user: 'root',
        password: '123456',
        database: 'spider'
    }
})

async function execute(sql) {
    await db.startTransaction();
    let data = await db.executeTransaction(sql);
    await db.stopTransaction();
    return data;
}

function html2$(html){
    let document= new JSDOM(html).window.document;
    return document.querySelectorAll.bind(document);
}

async function indexParser(buffer){
            let document= new JSDOM(buffer.toString()).window.document;
            let html = html2$(html2$(buffer.toString())('textarea.f1')[0].value);
            return Array.from(html('li')).map(li => {
                let oA = li.getElementsByClassName('mod-g-photo')[0];
                if(!li.getElementsByClassName('mod-g-nprice')[0]){
                    let document= new JSDOM(html).window.document;
                    let oSpan = document.createElement('span');
                    oSpan.className = "mod-g-nprice";
                    oSpan.innerHTML = '<i>&yen;</i>0';
                    let Info = li.getElementsByClassName('mod-g-info')[0];
                    Info.appendChild(oSpan);
                }
                return {
                   url: 'https:' + oA.href,
                   img_src: 'https:' + oA.children[0].getAttribute('data-lazyload-src'),
                   name: li.getElementsByClassName('mod-g-tit')[0].children[0].innerHTML,
                   description: li.getElementsByClassName('mod-g-desc')[0].innerHTML,
                   price: li.getElementsByClassName('mod-g-nprice')[0].innerHTML.match(/\d+(\.\d+)?/g)[0],
                   sale: li.getElementsByClassName('mod-g-sales')[0].innerHTML,
                };
            });

}

async function indexSpide(){
    try {
        let {body,headers} = await request('https://shouji.tmall.com/?spm=875.7931836/B.category2016015.1.70bd4265eF4HOS&acm=lb-zebra-148799-667863.1003.4.708026&scm=1003.4.lb-zebra-148799-667863.OTHER_14561662186585_708026'); //request 是async函数下面引用的时候也要加
        let datas2 = await indexParser(body);
        await indexProcessor(datas2);
    } catch (e) {
        console.log('index错误',e);
    }

}


async function indexProcessor(datas2) {
    //存到数据库
    console.log(datas2);
    for (let i = 0; i < datas2.length; i++) {
        let row = await execute(`SELECT * FROM item_table WHERE url = '${datas2[i].url}'`);
        if (row.length > 0) {
            await execute(`UPDATE item_table SET  img_src='${datas2[i].img_src}',name='${datas2[i].name}',description='${datas2[i].description}',price='${datas2[i].price}',sale='${datas2[i].sale}' WHERE url = '${datas2[i].url}'`);
        } else {            
            await execute(`INSERT INTO item_table (ID,url,img_src,name,description,price,sale) VALUES (0,'${datas2[i].url}','${datas2[i].img_src}','${datas2[i].name}','${datas2[i].description}','${datas2[i].price}','${datas2[i].sale}')`);
        }
    }

    //继续抓取
    for(let i=0;i<datas2.length;i++){
        await detailSpider(datas2[i].url);
    }

}


async function detailSpider(url){
    try{
      let {body, headers}=await request(url);
      let data=detailParser(body);
  
      detailProcessor(data);
    }catch(e){
      console.log('detail, 请求失败');
      console.log(e);
    }
  }

async function detailParser(body){
    let $=html2$(gbk.toString('utf-8', body));

    let attributes={};

    Array.from($('.attributes-list li')).forEach(li=>{
        let n=li.innerHTML.search(/：|:/);
        if(n==-1)return;
    
        let key=li.innerHTML.substring(0, n);
        let val=li.innerHTML.substring(n+1);
    
        attributes[key]=val;
      });
    
      console.log(attributes);
}

(async () => {
    indexSpide();
})();