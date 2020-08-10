const SEARCH_KRY = "SEARCH_KRY";
const PLAY_KRY = "PLAY_KRY"
const FAV_KEY = "FAV_KEY";
function insertArray(arr,val,compare,maxLen){
    const index = arr.findIndex(compare);
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
//++++++++++++++++++++++++++++++++++
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
export function saveSearch(val){ //存储搜索历史
    let searchs = getItem(SEARCH_KRY);
    insertArray(searchs,val,
        (item)=>{
            return item === val;
        },15);
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
//+++++++++++++++++++++++++++++
export function savePlay(song){
    let songs =JSON.parse(localStorage.getItem(PLAY_KRY)) || [];
    insertArray(songs,song,(item)=>{
        return song.musicrid == item.musicrid;
    },100);
    localStorage.setItem(PLAY_KRY,JSON.stringify(songs));
    return songs;
}

export function loadPlay(){
    const plays = localStorage.getItem(PLAY_KRY);
    return JSON.parse(plays);
}

//++++++++++++++++搜藏歌曲
export function saveFavorite(song){

    let songs =JSON.parse(localStorage.getItem(FAV_KEY)) || [];
    insertArray(songs,song,(item)=>{
        return song.musicrid == item.musicrid;
    },100);
    localStorage.setItem(FAV_KEY,JSON.stringify(songs));
    return songs;
}
export function deleteFavorite(song){
    let songs =JSON.parse(localStorage.getItem(FAV_KEY)) || [];
    songs = songs.filter((item)=>{
       return item.musicrid != song.musicrid;
    });
    localStorage.setItem(FAV_KEY,JSON.stringify(songs));
    return songs;

}
export function loadFavorite(song){
    let favSongs = localStorage.getItem(FAV_KEY);
    favSongs = JSON.parse(favSongs) || []
    return favSongs;
}