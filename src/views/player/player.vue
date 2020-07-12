<template>
<!-- 当有播放列表时显示 -->
    <div class="player-box" v-show="playList.length>0">
        <transition 
                name="normal" 
                @enter="enter"
                @after-enter="afterEnter"
                @leave="leave"
                @after-leave="afterLeave">
            <div class="nomal-player" v-show="fullScreen">
                <div class="background">
                    <img height="100%" width="100%" :src="currentSong.hts_MVPIC || singer.pic300 " alt="歌手照片">
                </div>
                <div class="top" ref="top">
                    <div @click="back" class="back">
                        <i class="iconfont icon-wei-"></i>
                    </div>
                    <h1 class="title" v-html="currentSong.NAME">枫</h1>
                    <h2 class="subtitle" v-html="currentSong.ARTIST">周杰伦</h2>
                </div>
                <div class="middle" ref="middle">
                    <div class="middle-l">
                        <div class="cd-wrapper" ref = "wrapper">
                            <div class="cd">
                                <img :src="currentSong.hts_MVPIC || singer.pic300" alt="专辑照片" class="image">
                            </div>
                        </div>
                    </div>
                    <div class="middle-r">

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
        </transition>  
        <transition name="mini">
        <div class="mini-player" @click="open" v-show="!fullScreen">
            <div class="little-img" ref="littleImg">
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
        </transition>
    </div>
</template>
<script>
import {mapGetters,mapMutations} from 'vuex';
import animations from 'create-keyframe-animation';
export default {
    computed:{
        ...mapGetters([
            'fullScreen',
            'playList',
            'currentSong',
            'singer'
        ])
    },
    mounted(){
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
        },
        _getPosAndScale(){
            let littleImgX = this.$refs.littleImg.clientWidth;
            let littleImgOffsetLeft = this.$refs.littleImg.offsetLeft;
            let littleImgOffsetTop = this.$refs.littleImg.offsetTop;
            let X1 =littleImgOffsetLeft + littleImgX/2; //小图片中心到left的距离
            let X2 = document.documentElement.clientWidth / 2;
            let offsetX = X2-X1; //cd 的X位置的偏移
            let Y1 = littleImgOffsetTop + littleImgX/2;//小图片中心到bottom的距离
            let CdToBottom = document.documentElement.clientHeight - this.$refs.top.clientHeight;//cd顶部到body底部的距离
            let Y2 =  CdToBottom - this.$refs.wrapper.clientHeight / 2;//cd 中心到body底部的距离
            let offsetY = Y2-Y1; //y轴 的偏移
            let scale = littleImgX / this.$refs.wrapper.clientHeight; //缩小倍数
            return{
                offsetX,
                offsetY,
                scale
            }
        },
        enter(el, done){ //过度动画化钩子
            let {offsetX,offsetY,scale} = this._getPosAndScale();
            let animation = {
                0: {
                    transform: `translate3d(-${offsetX}px,${offsetY}px,0) scale(${scale})`
                },
                60: {
                    transform: `translate3d(0,0,0) scale(1.1)`
                },
                100: {
                    transform: `translate3d(0,0,0) scale(1)`
                }
                }
            animations.registerAnimation({
                name: 'move',
                animation,
                presets: {
                    duration: 400,
                    easing: 'linear'
                }
            });
            animations.runAnimation(this.$refs.wrapper, 'move', done);
        }, //控制进入nomal播放器时的动画
        afterEnter(){ //进入以后 移除动画
            animations.unregisterAnimation('move');
            this.$refs.wrapper.style.animation = '';
        },
        leave(el,done){
            let {offsetX,offsetY,scale} = this._getPosAndScale();
            let animation = {
                0: { transform: `translate3d(0,0,0) scale(1)` },
                100: {  transform: `translate3d(-${offsetX}px,${offsetY}px,0) scale(${scale})`}
                }
            animations.registerAnimation({
                name: 'leave',
                animation,
                presets: {
                    duration: 400,
                    easing: 'linear'
                }
            });
            animations.runAnimation(this.$refs.wrapper, 'leave', done);
        },
        afterLeave(){
            animations.unregisterAnimation('leave');
            this.$refs.wrapper.style.animation = '';
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
            overflow: hidden;
            .middle-l{
                height: 100%;
                width: 100%;
            }
            .cd{
                margin: 0 auto;
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
    .normal-enter-active, .normal-leave-active{
        transition: all 0.4s;
        .top, .bottom{
          transition: all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32)
        }
    }
    .normal-enter, .normal-leave-to{
        opacity: 0;
        .top{
          transform: translate3d(0, -100px, 0)
        }
        .bottom{
          transform: translate3d(0, 100px, 0)
        }
    }
    .mini-enter-active, .mini-leave-active{
        transition: all 0.4s
    }
    .mini-enter, .mini-leave-to{
        opacity: 0
    }
}
</style>