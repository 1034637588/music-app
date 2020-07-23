const SEARCH_KRY = "SEARCH_KRY";
function insertArray(arr,val,maxLen){
    const index = arr.findIndex((item)=>{
        return item === val;
    });
    if(index == 0){
        return;
    }
    if(index > 0){
        arr.splice(index,1);
    }
    arr.unshift(val);
    if(arr.length > maxLen){
       arr.pop(); 
    }
}

export function getItem(keys){
    let searchs = localStorage.getItem(SEARCH_KRY) || [];
    if(typeof searchs == 'string'){
       if(searchs.indexOf(',') > 0){
        searchs = searchs.split(',');
       }else{
           searchs = [searchs];
           }
    }
    return searchs;
}
export function saveSearch(val){
    let searchs = getItem(SEARCH_KRY);
    insertArray(searchs,val,15);
    localStorage.setItem(SEARCH_KRY,searchs);
    return searchs;
}

export function delectSearch(val){
    let searchs = getItem(SEARCH_KRY);
    searchs = searchs.filter((item,index)=>{
        return item != val;
    });
    localStorage.setItem(SEARCH_KRY,searchs);
    return searchs;
}

export function clear() {
    localStorage.clear(SEARCH_KRY);
}