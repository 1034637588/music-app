import {playMode} from '../assets/config/config';
const {sequence,loop,random} = playMode;
const state = {
    singer:{},
    playing:false,
    fullScreen:false, //是否全屏
    playList:[], //播放列表
    sequenceList:[],
    mode: sequence,
    currentIndex : -1, //当前播放的歌曲
    disc:{}, //推荐歌单
    bang:{}
}
export default state;