function ajax(setOptions){
    let method   = setOptions["method"];
    let data     = setOptions["data"];
    let url      = setOptions["url"];
    let dataType = setOptions["dataType"];
    let arr      = [];
    let str      = "";
    for(name in data){
        arr.push(`${name}=${data[name]}`);
        str = arr.join("&");
    }
    let xhr    = new XMLHttpRequest();
    if(method=="get"){
        xhr.open("get",url+"?"+str,true);
        xhr.send();
    }else{
        xhr.open("post",url,true);
        xhr.setRequestHeader('content-type','application/x-www-form-urlencoded');
        xhr.send(str);
    }
    xhr.onreadystatechange = function(){
        if(xhr.readyState==4){
            if(xhr.status>=200 && xhr.status<300 || xhr.status == 304){
                let resData = xhr.responseText;
                switch(dataType){
                    case "json":
                    if(Window.JSON&&JSON.parse){
                        resData=JSON.parse(resData);
                    }else{
                        resData=eval("("+resData+")");
                    }
                    break;
                }
                setOptions.sucess(resData);
            }else{
                setOptions.error("传输错误");
            }
        }
    }
}