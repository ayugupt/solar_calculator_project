function asyncTimer(timeout){
    return new Promise((resolve, reject)=>{
        window.setTimeout(()=>{
            try{
                resolve();
            }catch(e){
                reject(e);
            }
        }, timeout)
    })    
}

export default asyncTimer;