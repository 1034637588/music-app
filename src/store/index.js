import Vue from 'vue';
import Vuex from 'vuex';
import * as actions from './actions';
import * as getters from './getters';
import state from './state';
import mutations from './mutations';
import createLogger from 'vuex/dist/logger';//这样每次通过mutations修改state就会打印出来
Vue.use(Vuex)

const debug = process.env.NODE_ENV == 'development'; //开发模式下启用严格模式
export default new Vuex.Store({
  state,
  mutations,
  getters,
  actions,
  strict: debug //这样如果不是通过mutation改变状态 就会报错
  // plugins:debug ? [createLogger()] : []
})
