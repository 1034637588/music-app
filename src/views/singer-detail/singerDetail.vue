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
        this.loadeData(this.currentPage,100);
    },
    methods:{
        loadeData(page,size){
            // this.load = true;
            songApi.getSongsBySinger(this.singer.name,page,size).then((res)=>{
                let data = res.data;
                let index = data.indexOf('abslist');
                data ="{'" + data.slice(index);
                data = data.replace(/'/g,'"');
                data = JSON.parse(data);
                this.moreData = data.abslist;
                this.songList = this.songList.concat(this.moreData);
                // this.load = false;
             });
        },
        loaderMore(pos){ //监听了misiclist个滚动事件
        //     let listHeight = this.$refs.musiclist.$children[0].$children[0].$refs.songul.clientHeight;
        //     let Height = document.documentElement.clientHeight;//屏幕高度
        //     let imgHeight = this.$refs.musiclist.imgHeight;
        //     let scorllHeight = Height - imgHeight;
        //     if(scorllHeight - pos > listHeight + 100){
        //         // console.log("加载数据")
        //         this.currentPage += 1; 
        //         this.loadeData(this.currentPage,2);
        //     }
        //     console.log(listHeight)
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