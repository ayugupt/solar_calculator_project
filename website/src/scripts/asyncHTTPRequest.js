function asyncHTTPRequest(method, url, data, headers){
    return new Promise((resolve, reject)=>{
        let req = new XMLHttpRequest();
        req.open(method, url);
        if(headers){
            for(let header of headers){
                req.setRequestHeader(header.name, header.value);
            }
        }
        req.send(data);

        req.addEventListener("load", function(){
            resolve(JSON.parse(this.responseText));
        })

        req.addEventListener('error', function(){
            reject(this.response)
        })
    })
}

export default asyncHTTPRequest;