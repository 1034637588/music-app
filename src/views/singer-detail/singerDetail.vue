<template>
    <div class="detalil-box">
        <music-list
        ref="musiclist"
        :bgImage="singer.pic300"
        :title="singer.name"
        :songs = "songList"
        :isLoad="load"
        @loaderMore="loaderMore"/>
        <div class="loadingbox" v-show="!songList.length">
         <loading/>
        </div>
    </div>
</template>
<script>
import songApi from '../../api/songsApi';
import searchApi from '../../api/searchApi'
import musicList from '../../components/musicList/musicList';
import Loading from '../../components/loading/loading.vue';
import {mapGetters} from 'vuex';
export default {
    components:{
        musicList,
        Loading
    },
    data(){
        return{
            songList:[],
            moreData:[],
            currentPage:1,
            load:false
        }
    },
    computed:{
        ...mapGetters([
            "singer"
        ])
    },
    created(){
        this.loadeData(this.currentPage,30);
    },
    methods:{
        loadeData(page,size){
            searchApi.SearchMusicBykeyWord(this.singer.name,page,size).then(res=>{
                this.songList = res.data.data.list;
            })
        },
        loaderMore(pos){ //监听了misiclist个滚动事件
        }
    }
}
</script>
<style lang="less" scoped>
@import '../../assets/styles/css/varibal.less';
.detalil-box{
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