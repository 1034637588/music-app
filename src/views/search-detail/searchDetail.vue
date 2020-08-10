<template>
    <div class="detalil-box">
        <div class="back" ref="back" @click="back">
            <i class="iconfont icon-fanhui"></i>
            <h1 class="title">{{title}}</h1>
        </div>
        <scroll-view
        :data="songs"
        class="scroll"
        :probeType=3
        :listenScroll=true
        ref = 'scroll'
        @scrollToEnd="scrollToEnd"
        >
            <song-list @select="selectSong" :search=true ref="list" :songs="songs"/>
            <div class="loadingbox" v-show="isLoad">
            <loading/>
            </div>
        </scroll-view>
    </div>
</template>
<script>

import Loading from '../../components/loading/loading.vue';
import {mapGetters,mapMutations,mapActions} from 'vuex';
import songList from '../../components/songList/songList';
import scrollView from '../../components/scroll/ScrollView';
import searchApi from '../../api/searchApi';
import musicListVue from '../../components/musicList/musicList.vue';
import {playlistMixin} from '../../assets/utils/mixin';
export default {
    mixins:[
        playlistMixin
    ],
    components:{
        songList,
        scrollView,
        Loading
    },
    computed:{
        ...mapGetters([
            'suggest'
        ]
        )
    },
    data(){
        return{
            songs:[],
            isLoad:false,
            title:"搜索详情",
            page:1,
            size:15
        }
    },
    created(){
        searchApi.SearchMusicBykeyWord(this.suggest,this.page,this.size).then(res=>{
            if(res.data.code == 200){
                this.songs = res.data.data.list;
                this.page++;
            }
        })
    },
    methods: {
         ...mapActions([
            "selectPlay",
            "randomPlay",
            "insertSong"
        ]),
        back(){
            this.$router.go(-1);
        },
         selectSong(item,index){ //点击播放音乐 传入播放列表
            // this.selectPlay({
            //    list:this.songs,
            //    index
            // });
            this.insertSong(item);
        },
        handlePlaylist(playList){
            if(playList.length > 0){
                this.$refs.list.$el.children[0].style.paddingBottom="10vh";
                this.$refs.scroll.refresh();
            }else{
                this.$refs.list.$el.children[0].style.paddingBottom="0";
                this.$refs.scroll.refresh();
            }
    },
    scrollToEnd(){
        this.isLoad = true;
        searchApi.SearchMusicBykeyWord(this.suggest,this.page,this.size).then(res=>{
            if(res.data.code == 200){
                this.songs = this.songs.concat(res.data.data.list);
                this.isLoad = false;
                this.page++;
            }
        });
    }
    }
}
</script>
<style lang="less" scoped>
@import '../../assets/styles/css/varibal.less';
@import '../../assets/styles/css/mixin.less';
.detalil-box{
    height: 100vh;
    width: 100%;
    z-index: 400;
    position: absolute;
    background: @color-background;
    top: 0;
    left: 0;
      .back{
        height: 6.7vh;
        width: 100%;
        line-height: 6.7vh;
        position: absolute;
        z-index: 200;
        top: 0;
        .icon-fanhui{
        position: absolute;
        top:0;
        left: 0;
        display:inline-block;
        font-size: @font-size-large-x;
        color: @color-theme;
        width: .6rem;
        padding-left: .2rem;
        z-index: 20;
        }
        .title{
            .no-wrap();
            position: absolute;
            top:0;
            left: 50%;
            height: 100%;
            width: 70%;
            transform: translate(-50%);
            font-size: @font-size-large;
            color: @color-text;
            z-index: 20;
            text-align: center;
        }
    }
    .scroll{
        height: 93.3vh;
        width: 100%;
        overflow: hidden;
        position: absolute;
        top: 6.7vh;
    }
}
</style>