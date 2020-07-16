<template>
 <div class="rdbox">
    <transition name="slide">
        <music-list :rank=true :title="title" :bgImage="bgImage" :songs="songList"></music-list>
    </transition>
    <div class="loadingbox" v-show="!songList.length">
      <loading/>
    </div>
  </div>
</template>
<script>
import bangApi from '../../api/bangApi';
import musicList from '../../components/musicList/musicList';
import Loading from '../../components/loading/loading.vue';
import {mapGetters} from 'vuex';
export default {
      components:{
         musicList,
         Loading
    },
    computed:{
        ...mapGetters([
            'bang'
        ])
    },
     data(){
        return{
            songList:[],
            bgImage:"",
            title:""
        }
    },
    created(){
        this.bgImage = this.bang.pic;
        this.title = this.bang.name;
        bangApi.getBangMusicList(this.bang.sourceid,1,15).then((res)=>{
                this.songList = res.data.data.musicList;
        });
    }
}
</script>
<style lang="less" scoped>
@import '../../assets/styles/css/varibal.less';
.rdbox{
    height: 100vh;
    width: 100%;
    z-index: 400;
    position: absolute;
    background: @color-background;
    top: 0;
    left: 0;
    .loadingbox{
      width: 100%;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%);
    }
}
</style>
