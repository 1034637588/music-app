import {shuffle} from '../assets/utils/random';
import {playMode} from '../assets/config/config';
import * as types from './mutationType';
import {saveSearch,delectSearch,clear} from '../assets/utils/cache';
function findIndex(list, song) {
    return list.findIndex((item) => {
      if(!item.musicrid){
        return item.MUSICRID === song.MUSICRID ;
      }else{
        return item.musicrid === song.musicrid ;
      }
    })
  }
export const selectPlay = function({commit,state},{list,index}){
    commit(types.SET_SEQUENCE_LIST,list);
    if (state.mode === playMode.random) {
        let randomList = shuffle(list);
        commit(types.SET_PLAYLIST, randomList);
        index = findIndex(randomList, list[index]);
      } else {
        commit(types.SET_PLAYLIST, list);
    }
    commit(types.SET_CURRENT_INDEX,index);
    commit(types.SET_FULL_SCREEN,true);
    commit(types.SET_PLAYING_STATE,true);
}

export const randomPlay = function ({commit}, {list}) {
    commit(types.SET_PLAY_MODE, playMode.random)
    commit(types.SET_SEQUENCE_LIST, list)
    let randomList = shuffle(list)
    commit(types.SET_PLAYLIST, randomList)
    commit(types.SET_CURRENT_INDEX, 0)
    commit(types.SET_FULL_SCREEN, true)
    commit(types.SET_PLAYING_STATE, true)
  }

  //向播放列表中添加歌曲
export const insertSong = function ({commit,state},song){
  let playlist = state.playlist.slice(); //[A,B,C,D]
  let sequenceList = state.sequenceList.slice(); // [A,B,C,D]
  let currentIndex = state.currentIndex; //1=>B
  // 记录当前歌曲
  let currentSong = playlist[currentIndex]; //B
  // 查找当前列表中是否有待插入的歌曲并返回其索引
  let fpIndex = findIndex(playlist, song); //song =>C 2
   // 因为是插入歌曲，所以索引+1
   currentIndex++;
   // 插入这首歌到当前索引位置
  playlist.splice(currentIndex, 0, song); //[A,B,(C),C,D]
  // 如果已经包含了这首歌
  if (fpIndex > -1) {
    // 如果当前插入的序号大于列表中的序号
    if (currentIndex > fpIndex) {
      playlist.splice(fpIndex, 1);
      currentIndex--;
    } else {
      playlist.splice(fpIndex + 1, 1);
    }
  }
  let currentSIndex = findIndex(sequenceList, currentSong) + 1

  let fsIndex = findIndex(sequenceList, song);

  sequenceList.splice(currentSIndex, 0, song);

  if (fsIndex > -1) {
    if (currentSIndex > fsIndex) {
      sequenceList.splice(fsIndex, 1);
    } else {
      sequenceList.splice(fsIndex + 1, 1);
    }
  }
  commit(types.SET_PLAYLIST, playlist);
  commit(types.SET_SEQUENCE_LIST, sequenceList);
  commit(types.SET_CURRENT_INDEX, currentIndex);
  commit(types.SET_FULL_SCREEN, true);
  commit(types.SET_PLAYING_STATE, true);
}

export const saveSearchHistory = function({commit,state},query){
  commit(types.SET_SEARCH_HISTORY,saveSearch(query));
}

export const deleteHistory = function({commit,state},item){
    console.log(item);
   commit(types.SET_SEARCH_HISTORY,delectSearch(item));
}

export const clearHistory = function({commit,state},item){
    clear();
    commit(types.SET_SEARCH_HISTORY,[]);
}