function asyncGetCurrentPosition(options){
    return new Promise((resolve, reject)=>{
        navigator.geolocation.getCurrentPosition((position)=>{
            resolve(position);
        }, (error)=>{
            reject(error);
        }, options)
    })
}

export default asyncGetCurrentPosition;