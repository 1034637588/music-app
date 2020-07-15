import {shuffle} from '../assets/utils/random';
import {playMode} from '../assets/config/config';
import * as types from './mutationType';
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