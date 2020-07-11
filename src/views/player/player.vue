<template>
<!-- 当有播放列表时显示 -->
    <div class="player-box" v-show="playList.length>0">  
        <div class="nomal-player" v-show="fullScreen">
            <div class="background">
                <img height="100%" width="100%" :src="currentSong.hts_MVPIC || singer.pic300 " alt="歌手照片">
            </div>
            <div class="top">
                <div @click="back" class="back">
                    <i class="iconfont icon-wei-"></i>
                </div>
                <h1 class="title" v-html="currentSong.NAME">枫</h1>
                <h2 class="subtitle" v-html="currentSong.ARTIST">周杰伦</h2>
            </div>
            <div class="middle">
                <div class="middle-l">
                    <div class="cd-wrapper">
                        <div class="cd">
                            <img :src="currentSong.hts_MVPIC || singer.pic300" alt="专辑照片" class="image">
                        </div>
                    </div>
                </div>
            </div>
            <div class="bottom">
                <div class="progress-wrapper"></div>
                <div class="operators">
                    <div class="icon i-left">
                        <i class="iconfont icon-yinleliebiao"></i>
                    </div>
                    <div class="icon i-left" >
                        <i class="iconfont icon-tubiaozhizuomoban1"></i>
                    </div>
                    <div class="icon i-center" >
                        <i class="iconfont icon-ziyuan"></i>
                    </div>
                    <div class="icon i-right" >
                        <i class="iconfont icon-tubiaozhizuomoban"></i>
                    </div>
                    <div class="icon i-right">
                        <i class="iconfont icon-xin1"></i>
                    </div>
                </div>
            </div>
        </div>
        <div class="mini-player" @click="open" v-show="!fullScreen">
            <div class="little-img">
                <img :src="currentSong.hts_MVPIC || singer.pic300">
            </div>
            <div class="text">
                <h2 class="name" v-html="currentSong.NAME"></h2>
                <p class="desc" v-html="currentSong.ARTIST"></p>
            </div>
            <div class="control">
                <i class="iconfont icon-ziyuan1"></i>
            </div>
            <div class="control" @click.stop="showPlaylist">
                <i class="iconfont icon-yinleliebiao"></i>
            </div>
        </div>
    </div>
</template>
<script>
import {mapGetters,mapMutations} from 'vuex';
export default {
    computed:{
        ...mapGetters([
            'fullScreen',
            'playList',
            'currentSong',
            'singer'
        ])
    },
    methods:{
        ...mapMutations({
            setFullScreen:"SET_FULL_SCREEN"
        }),
        back(){
            this.setFullScreen(false);
        },
        open(){
            this.setFullScreen(true);
        }
    }
}
</script>
<style lang="less" scoped>
@import '../../assets/styles/css/varibal.less';
@import '../../assets/styles/css/mixin.less';
.player-box{
    .nomal-player{
        height: 100%;
        width: 100%;
        background: @color-background;
        position: fixed;
        top: 0;
        left: 0;
        z-index: 500;
        .background{
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            z-index: -1;
            opacity: 0.6;
            filter: blur(20px);
        }
        .top{
            height: 8.7vh;
            .back{
                height: 5vh;
                width: 7vh;
                position: absolute;
                top: 0;
                left: .12rem;
                display: flex;
                align-items: center;
                justify-content: center;
                // z-index: 50
                .icon-wei-{
                    font-size: @font-size-large-x;
                    color: @color-theme;
                }
            }
            .title{
                width: 70%;
                margin: 0 auto;
                line-height: 5vh;
                text-align: center;
                font-size: @font-size-large;
                color: @color-text;
                white-space: nowrap;
                text-overflow: ellipsis;
                overflow: hidden;
            }
            .subtitle{
                line-height: 3.7vh;
                text-align: center;
                font-size: @font-size-medium;
                color: @color-text;
            }
        }
        .middle{
            width: 100%;
            height: 71.3vh;
            display: flex;
            margin-top: .2rem;
            justify-content: center;
            .cd{
                height: 75vw;
                width: 75vw;
                border-radius: 50%;
                overflow: hidden;
                border: rgba(255, 255, 255, 0.1) solid .15rem;
                .image{
                    width: 100%;
                    height: 100%;
                }
            }
        }
        .bottom{
             height: 20vh;
            width: 100%;
            position: fixed;
            bottom: 0;
            left: 0;
            .progress-wrapper{
                height: 30%;
                background: gainsboro;
            }
            .operators{
                height: 70%;
                display: flex;
                flex-flow:row nowrap;
                justify-content: space-around;
                align-items: flex-start;
                .icon{
                     color: @color-theme;
                     height: 60%;
                     width: 20%;
                     display: flex;
                     justify-content: center;
                     align-items: center;
                     text-align: center;
                     font-size: @font-size-large-x;
                     i{
                         font-size: .6rem;
                     }
                     .icon-tubiaozhizuomoban1,.icon-tubiaozhizuomoban{
                         font-weight: 600;
                     }
                     .icon-ziyuan{
                         font-size: .7rem;
                     }

                }
            }
        }
    }
    .mini-player{
        height: 10vh;
        width: 100%;
        background:@color-highlight-background;
        position: fixed;
        left: 0;
        bottom: 0;
        display: flex;
        z-index: 1000;
        flex-flow: row nowrap;
        justify-content: center;
        align-items: center;
        .little-img{
            height: 7vh;
            width: 7vh;
            position: absolute;
            left: 3vh;
            img{
                border-radius: 50%;
                height: 100%;
                width: 100%;
            }
        }
        .text{
                height: 100%;
                width: 12vh;
                display: flex;
                flex-flow: column nowrap;
                justify-content: center;
                align-items: flex-start;
                position: absolute;
                left: 11.5vh;
                .name{
                    margin-bottom: .04rem;
                    .no-wrap();
                    width: 100%;
                    font-size: @font-size-medium;
                    color: @color-text;
                }
                .desc{
                    .no-wrap();
                    width: 100%;
                    font-size: @font-size-small;
                    color: @color-text-d;
                }
            }
            .control{
                height: 15vw;
                width: 12vw;
                display: flex;
                justify-content: center;
                align-items: center;
                color: @color-theme-d;
            }
            .icon-ziyuan1{
                 font-size: .6rem;
                 position: absolute;
                 right: .8rem;
            }
            .icon-yinleliebiao{
                font-size: .6rem;
                 position: absolute;
                 right: 0.05rem;
            }
    }
}
</style>