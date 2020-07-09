<template>
  <div id="app">
    <m-header/>
    <m-tab/>
    <!-- <div class="routerview"> -->
    <keep-alive>
    <router-view/>
    </keep-alive>
  </div>
  <!-- </div> -->
</template>
<script>
import mHeader from './components/m-header/mHeader.vue';
import mTab from './components/tab/tab.vue';
export default {
  components: {
    mHeader,
    mTab
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
