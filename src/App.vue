<template>
  <div id="app">
    <m-header/>
    <m-tab/>
    <keep-alive>
      <router-view/>
    </keep-alive>
    <player/>
  </div>
</template>
<script>
import mHeader from './components/m-header/mHeader.vue';
import mTab from './components/tab/tab.vue';
import Player from './views/player/player'
export default {
  components: {
    mHeader,
    mTab,
    Player
  },
 methods:{
 }
}
</script>
<style lang="less" scoped>
@import './assets/styles/css/varibal.less';
    #app{
      height: 100vh;
      width: 100%;
      // display: flex;
      // flex-flow: column nowrap;
      p{
        color: @color-theme;
      }
    }
</style>
