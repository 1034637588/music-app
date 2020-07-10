<template>
  <div class="singerbox">
      <list-view @clickItem="clickItem" :data="singerData"/>
      <transition name="fade">
        <router-view></router-view>
      </transition>
  </div>
</template>
<script>
import ListView from '../../components/listView/listView';
import SingerApi from '../../api/singerApi.js';
import {SET_SINGER} from '../../store/mutationType';
import {mapMutations} from 'vuex';
export default {
  components:{
    ListView
  },
  data(){
    return{
      singerData:[]
    }
  },
  mounted(){
    SingerApi.getSingers().then((res)=>{
      this.singerData=res.data.artistList;
    })
  },
  methods:{
    clickItem(item){
      this.setSinger(item);
      this.$router.push({
        path:`/singer/${item.id}`
      });
    },
    ...mapMutations({
        setSinger:SET_SINGER
    })
  }
}
</script>
<style lang="less" scoped>
  .singerbox{
        height: 86.6vh;
  }
  .fade-enter-active,.fade-leave-active{
    transition: all .5s 0s;
  }
  .fade-enter{
      transform:translate3d(100%,0,0) scale(.2); //进入之前的状态 然后进入后就是远洋 在这个这个之间过度
      transform-origin: left buttom;
 }
  .fate-leave-to{
      transform: translate3d(100%,0,0) scale(.1);
  }
</style>