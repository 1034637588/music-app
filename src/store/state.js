import {playMode} from '../assets/config/config';
import {getItem,loadPlay,loadFavorite} from '../assets/utils/cache';
const {sequence,loop,random} = playMode;
const arr = getItem("SEARCH_KRY");
const plays = loadPlay("PLAY_KRY");
const fav = loadFavorite("FAV_KEY");
const state = {
    singer:{},
    playing:false,
    fullScreen:false, //是否全屏
    playList:[], //播放列表
    sequenceList:[],
    mode: sequence,
    currentIndex : -1, //当前播放的歌曲
    disc:{}, //推荐歌单
    bang:{},
    suggest:"", //点击搜索的关键词
    searchHistory:arr,
    playHistory:plays,
    favoriteList:fav
}
export default state;