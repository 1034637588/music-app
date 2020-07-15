<template>
  <div class="singerbox">
      <list-view ref="list" @clickItem="clickItem" :data="singerData"/>
      <transition name="fade">
        <router-view></router-view>
      </transition>
      <div class="loadingbox" v-show="!singerData">
        <loading/>
      </div>
  </div>
</template>
<script>
import ListView from '../../components/listView/listView';
import Loading from '../../components/loading/loading.vue';
import SingerApi from '../../api/singerApi.js';
import {SET_SINGER} from '../../store/mutationType';
import {mapMutations} from 'vuex';
import {playlistMixin} from '../../assets/utils/mixin';
// import axios from 'axios';
export default {
  mixins: [playlistMixin],
  components:{
    ListView,
    Loading
  },
  data(){
    return{
      singerData:[]
    }
  },
  mounted(){
    SingerApi.getSingers().then((res)=>{
      this.singerData=res.data.artistList;
    });
  },
  methods:{
    handlePlaylist(playlist) { //实现mixin要实现的方法
        // const bottom = playlist.length > 0 ? '10vh' : '';
        // this.$refs.list.$el.style.paddingBottom = bottom;
        // console.log(this.$refs.list.$el);
        // this.$refs.list.refresh()
        // console.log(playlist)
    },
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
  .fade-leave-to{
    transform:  translate3d(100%,0,0) scale(.2);
  }
  .loadingbox{
      width: 100%;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%);
    }
</style>