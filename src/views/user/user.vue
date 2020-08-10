<template>
   <transition name="fade">
    <div class="box">
        <div class="top">
            <i @click="back" class="iconfont icon-fanhui"></i>
            <my-switch @switch="switchItem" :switches="switchsTitle" :currentIndex="currentIndex"></my-switch>
        </div>
        <div class="center">
           <div @click="random" class="play">
                <i class="iconfont icon-ziyuan"></i>
                <span class="text">随机播放全部</span>
           </div>
        </div>
        <div class="list">
            <scroll ref="scrolltow" class="scroll" :data="favoriteList" v-show="currentIndex===0">
                <div class="list-warpper">
                    <song-list :songs="favoriteList" @select="selectFav"></song-list>
                </div>
                <no-reslut :isShow="!favoriteList.length" title="还没有收藏歌曲"/>
            </scroll>
            <scroll ref="scroll" class="scroll" :data="playHistory" v-show="currentIndex===1">
                <div class="list-warpper">
                    <song-list :songs="playHistory" @select="selectHist"></song-list>
                </div>
                <no-reslut :isShow="!playHistory.length" title="还没有听歌"/>
            </scroll>
        </div>
    </div>
    </transition>
</template>
<script>
import MySwitch from '../../components/switchs/switch';
import Scroll from '../../components/scroll/ScrollView';
import SongList from '../../components/songList/songList';
import {mapGetters, mapActions} from 'vuex';
import {playlistMixin} from '../../assets/utils/mixin';
import noReslut from '../../components/no-result/noReslut';
export default {
  components:{
      MySwitch,
      Scroll,
      SongList,
      noReslut
  },
  mixins:[
      playlistMixin
  ],
  data(){
      return{
          currentIndex:0,
          switchsTitle:[{name:"我喜欢的"},{name:"最近听的"}]
      }
  },
  computed:{
     ...mapGetters([
          'playHistory',
          'favoriteList'
     ])
  },
  methods:{
      ...mapActions([
          'insertSong',
          'randomPlay'
      ]),
      back(){
          this.$router.go(-1);
      },
     switchItem(index){
            this.currentIndex = index;
     },
     selectFav(item){
         this.insertSong(item);
     },
     selectHist(item){
          this.insertSong(item);
     },
     random(){ //随机播放
        let songList = this.currentIndex === 0? this.favoriteList : this.playHistory;
        this.randomPlay({
            list: songList
        });
     },
     handlePlaylist(playList){
      if(playList.length > 0){
        this.$refs.scroll.$el.children[0].style.paddingBottom="10vh";
        this.$refs.scroll.refresh();
        
        this.$refs.scrolltow.$el.children[0].style.paddingBottom="10vh";
        this.$refs.scrolltow.refresh();
      }else{
        this.$refs.scroll.$el.children[0].style.paddingBottom="0";
        this.$refs.scroll.refresh();

        this.$refs.scrolltow.$el.children[0].style.paddingBottom="0";
        this.$refs.scrolltow.refresh();
      }
    }
  }
}
</script>
<style lang="less" scoped>
@import "../../assets/styles/css/varibal.less";
@import "../../assets/styles/css/mixin.less";
.fade-enter-active,.fade-leave-active{
      transition: all .5s 0s;
    }
    .fade-enter{
        transform:translate3d(100%,0,0) scale(.2); //进入之前的状态 然后进入后就是原样 在这个这个之间过度
        transform-origin: left buttom;
    }
    .fade-leave-to{
      transform:  translate3d(100%,0,0) scale(.2);
    }
.box{
    position: fixed;
    left: 0;
    right: 0;
    top:0;
    bottom: 0;
    background: @color-background;
    display: flex;
    flex-flow: column nowrap;
    align-items: center;
    .top{
        height: 6.7vh;
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        .icon-fanhui{
            color: @color-theme;
            font-weight: 600;
            font-size: @font-size-large;
            width: 6.7vh;
            height: 6.7vh;
            text-align: center;
            line-height: 6.7vh;
            position: absolute;
            left: 0;
        }
    }
    .center{
        width: 100%;
        height: 10vh;
        position: relative;
        .play{
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%,-50%);
        height: 4.7vh;
        width: 40%;
        line-height: 4.7vh;
        text-align: center;
        border: 1px solid @color-theme;
        color: @color-theme;
        border-radius: 100px;
        z-index: 20;
        .icon-ziyuan{
            display: inline-block;
            vertical-align: middle;
            margin-right: .12rem;
            font-size: @font-size-medium-x;
        }
        .text{
            display: inline-block;
            vertical-align: middle;
            font-size: @font-size-small;
            letter-spacing: 3px;
        }
    }
    }
    .list{
        height: 83.3vh;
        width: 100%;
        .scroll{
            height: 83.3vh;
            width: 100%;
            overflow: hidden;
            .list-warpper{
                width: 100%;
            }
        }
    }
}
</style>