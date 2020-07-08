<template>
  <div id="app">
    <m-header/>
    <m-tab/>
    <router-view/>
  </div>
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
      height: 100%;
      width: 100%;
      p{
        color: @color-theme;
      }
    }
</style>
