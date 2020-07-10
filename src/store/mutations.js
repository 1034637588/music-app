import * as types from './mutationType';
const {SET_SINGER} = types;
const mutations = {
    [SET_SINGER](state,singer){
        state.singer = singer;
    }
}
export default mutations;