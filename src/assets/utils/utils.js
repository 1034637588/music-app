export function throttle(func,wait){
    let timer = null;
    return function(...args){
        if(timer!=null){
            console.log("太着急")
            return;
        }else{
            timer = setTimeout(() => {
                timer = null;
                func.apply(this,args);
            }, wait);
        }
    }
}
