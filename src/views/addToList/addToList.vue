<template>
<transition name="fade">
  <div class="add-song" v-show="show" @click.stop>
    <div class="header">
      <h1 class="title">添加歌曲到播放列表</h1>
      <div class="close" @click.stop="close">
        <i class="iconfont icon-guanbicuowu"></i>
      </div>
    </div>
    <!-- <div class="search-box-wrapper">
        <search-box  @clear="clearVal" v-model="query" placeholder="搜索歌曲"></search-box>
    </div> -->
    <div class="shortcut" v-show="!query">
        <my-switch @switch="switchItem" :switches="switchsTitle" :currentIndex="currentIndex"></my-switch>
    </div>
    <scroll class="list-wrapper" v-if="currentIndex==0 && !query" :data="playHistory">
        <div class="list-inner">
            <song-list @select="seletSong" :songs="playHistory"></song-list>
        </div>
    </scroll>
    <scroll ref="scroll" class="list-wrapper" v-if="currentIndex==1 &&!query" :data="playHistory">
        <div class="list-inner hist">
            <history-list
                :searches="searchHistory"
                @select = "selectHistory"
                @delete = "deleteHistory" >
            </history-list>
            </div>
    </scroll>
    <!-- <div class="search-result" v-show="query">
        <suggest @selectItem="selectItem" :keys = "query"></suggest>
    </div> -->
    <top-tip ref="toptip">
        <div class="tip-title">
            <i class="iconfont"></i>
            <span class="text">一首歌曲已添加到播放列表</span>
        </div>
    </top-tip>
  </div>
</transition>
</template>
<script>
import searchBox from '../../components/search-box/searchBox';
import Suggest from '../../components/suggest/suggest';
import MySwitch from '../../components/switchs/switch';
import SongList from '../../components/songList/songList';
import {searchMixin} from '../../assets/utils/mixin';
import Scroll from '../../components/scroll/ScrollView';
import TopTip from '../../components/topTip/topTip';
import historyList from '../../components/history-list/historyList';
import {mapGetters, mapActions} from 'vuex';
export default {
    mixins:[
        searchMixin
    ],
    props:{
        show:{
            type:Boolean,
            default:false
        }
    },
    computed:{
        ...mapGetters([
            'playHistory'
        ])
    },
    components:{
        historyList,
        MySwitch,
        Scroll,
        SongList,
        TopTip
    },
    data(){
        return{
            query:"",
            currentIndex:0,
            switchsTitle:[{name:"最近播放"},{name:"搜索历史"}]
        }
    },
    created(){
    },
    methods:{
        ...mapActions([
            'insertSong'
        ]),
        close(){
            this.$emit("close");
            this.query = "";
        },
        switchItem(index){
            this.currentIndex = index;
        },
        seletSong(song,index){
            if(index!=0){
                this.insertSong(song);
                this.showTip();
            }
        },
        showTip(){
            this.$refs.toptip.show();
        }
    }
};
</script>
<style lang="less" scoped>
@import '../../assets/styles/css/varibal.less';
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
    .add-song{
        position: fixed;
        top: 0;
        bottom: 0;
        width: 100%;
        z-index: 3000;
        background: @color-background;
        display: flex;
        flex-flow: column nowrap;
        align-items: center;
        .header{
            position: relative;
            height: 6.7vh;
            text-align: center;
            width: 100%;
            .title{
                line-height: 6.7vh;
                font-size: @font-size-large;
                color: @color-text;
            }
            .close{
                position: absolute;
                top: 0;
                right: 8px;
                .icon-guanbicuowu{
                    display: block;
                    padding: 12px;
                    font-size: .35rem;
                    color: @color-theme;
                }
            }
        }
        .search-box-wrapper{
            width: 90%;
            margin-top: 2vh;
        }
        .shortcut{
            height: 10vh;
            width: 100%;
            display: flex;
            justify-items: center;
            align-items: center;
        }
        .search-result{
            width: 100%;
            margin-top: 5vh;
        }
        .list-wrapper{
            width: 100%;
            height: 83.3vh;
            overflow: hidden;
            .hist{
                padding: 0 8%;
            }
        }
        .tip-title{
            text-align: center;
            padding: 18px 0;
            font-size: 0;
            z-index: 4000;
            .icon-ok{
                font-size: @font-size-medium;
                color: @color-theme;
                margin-right: 4px;
            } 
            .text{
                font-size: @font-size-medium;
                color: @color-text;
            }
        }
        }
</style>