<template>
 <div class="discbox">
    <transition name="slide">
        <music-list :title="title" :bgImage="bgImage" :songs="songList"></music-list>
    </transition>
    <div class="loadingbox" v-show="!songList.length">
      <loading/>
    </div>
  </div>
</template>

<script>
import ReApi from '../../api/recommendApi';
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
            'disc'
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
        this.bgImage = this.disc.img;
        this.title = this.disc.name;
        ReApi.getRecommendPlayList(this.disc.id,1,15).then((res)=>{
                this.songList = res.data.data.musicList;
                console.log(this.songList)
        });
    }

}
</script>
<style lang="less" scoped>
@import '../../assets/styles/css/varibal.less';
.discbox{
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