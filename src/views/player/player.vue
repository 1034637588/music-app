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
                    <img height="100%" width="100%" :src="currentSong.hts_MVPIC || songImg " alt="歌手照片">
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
                            <div :class="cdRotate" class="cd">
                                <img :src="currentSong.hts_MVPIC || songImg" alt="专辑照片" class="image">
                            </div>
                        </div>
                    </div>
                    <div class="middle-r">

                    </div>
                </div>
                <div class="bottom">
                    <div class="progress-wrapper">
                        <span class="time time-l">{{format(currentTime)}}</span>
                        <div class="progress-bar-wrapper">
                            <progress-bar @changePrecent="changePrecent" :percent="percent"></progress-bar>
                        </div>
                        <span class="time time-r">{{songTime}}</span>
                    </div>
                    <div class="operators">
                        <div class="icon i-left">
                            <i class="iconfont icon-yinleliebiao"></i>
                        </div>
                        <div @click.stop="pre" class="icon i-left" >
                            <i class="iconfont icon-tubiaozhizuomoban1"></i>
                        </div>
                        <div @click="togglePlaying" class="icon i-center" >
                            <i :class="playIcon" class="iconfont"></i>
                        </div>
                        <div @click.stop="next" class="icon i-right" >
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
            <div :class="cdRotate" class="little-img" ref="littleImg">
                <img :src="currentSong.hts_MVPIC || (songImg || '../../assets/image/default.png')">
            </div>
            <div class="text">
                <h2 class="name" v-html="currentSong.NAME"></h2>
                <p class="desc" v-html="currentSong.ARTIST"></p>
            </div>
            <div @click.stop="togglePlaying" class="control">
                <i :class="miniIcon" class="iconfont"></i>
            </div>
            <div class="control">
                <i class="iconfont icon-yinleliebiao"></i>
            </div>
        </div>
        </transition>
        <audio 
        ref="audio"
        @timeupdate="updataTime"
        @error="error" 
        @canplay="ready" 
        autoplay 
        preload:auto 
        :src="songUrl">
        </audio>
    </div>
</template>
<script>
import songApi from '../../api/songsApi';
import axios from 'axios';
import {mapGetters,mapMutations} from 'vuex';
import animations from 'create-keyframe-animation';
import progressBar from '../../components/progressBar/progressBar';
export default {
    components:{
        progressBar
    },
    data(){
        return{
            songUrl:"",
            lrclist:null,
            songReady:false,
            songTime:"",
            currentTime:"",
            songImg:""
        }
    },
    computed:{
        playIcon(){
            return this.playing ? "icon-ziyuan1" : "icon-ziyuan"
        },
        miniIcon(){
            return this.playing ? "icon-ziyuan1" : "icon-ziyuan"
        },
        cdRotate(){
                return this.playing ? "play" : "play pause"
        },
        percent(){ //歌曲播放的百分比
            let time = this.songTime.split(':');
            time = Number(time[0]) * 60 + Number(time[1]);
            // console.log(this.currentTime/time);
            return this.currentTime / time;
        },
        ...mapGetters([
            'fullScreen',
            'playList',
            'currentSong',
            'singer',
            'playing',
            'currentIndex'
        ])
    },
    watch:{ //当前歌曲改变 就重新请求歌曲地址 并且播放
        currentSong(newSong){
            let ID = newSong.MUSICRID.split('_')[1];
            this.getSongAndLrc(ID);
            console.log(this.songUrl);
        },
        playing(newPlaying){ //通过监听playing的状态 来控制播放和停止
            const audio = this.$refs.audio;
            this.$nextTick(()=>{
                newPlaying ? audio.play() : audio.pause();
            });
        }
    },
    created(){
    },
    mounted(){
        let id = this.currentSong.MUSICRID.split('_')[1];
        this.getSongAndLrc(id);
    },
    methods:{
        ...mapMutations({
            setFullScreen:"SET_FULL_SCREEN",
            setPlayingState:"SET_PLAYING_STATE",
            setCurrentIndex:"SET_CURRENT_INDEX"
        }),
        togglePlaying(){
            this.setPlayingState(!this.playing);//改变vuex中state的playing 控制暂停播放
        },
        //上一首
        pre(){
            if(!this.songReady) return;
            if(!this.playing){
                this.setPlayingState(true);
            }
            if(this.currentIndex == 0){
                let index = this.playList.length - 1;
                this.setCurrentIndex(index);
            }else{
                let index = this.currentIndex - 1;
                this.setCurrentIndex(index);
            }
            this.songReady = false;
        },
        //下一首
        next(){
            if(!this.songReady) return;
            if(!this.playing){
                this.setPlayingState(true);
            }
            if(this.currentIndex == this.playList.length - 1){
                this.setCurrentIndex(0);
            }else{
                let index = this.currentIndex + 1;
                this.setCurrentIndex(index);
            }
            this.songReady = false;
        },
        changePrecent(percent){ //拖动进度条
            let time = this.songTime.split(':');
            time = Number(time[0]) * 60 + Number(time[1]);
            let currentTime = time * percent;
            this.$refs.audio.currentTime = currentTime;
            if(!this.playing){
                this.setPlayingState(true);
            }
        },
        updataTime(e){ //播放当前时间
            this.currentTime = e.target.currentTime; //这是可读写的属性
        },
        ready(){ //当歌曲可以播放时
            this.songReady = true;
        },
        error(){ //当歌曲加载失败
            this.songReady = true;
        },
        back(){
            this.setFullScreen(false);
        },
        open(){
            this.setFullScreen(true);
        },
        //请求歌曲地址和歌词
        getSongAndLrc(id){
                axios.all([songApi.play(id),songApi.getLrclist(id)]).
                then(axios.spread((songUrl,lrclist)=>{
                    this.songUrl = songUrl.data.url;
                    this.lrclist = lrclist.data.data.lrclist;
                    this.songTime = lrclist.data.data.songinfo.songTimeMinutes;
                    this.songImg = lrclist.data.data.songinfo.pic;
                    console.log(this.songTime,this.lrclist);
                }))

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
            let Y2 = CdToBottom - this.$refs.wrapper.clientHeight / 2;//cd 中心到body底部的距离
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
                100: { transform: `translate3d(-${offsetX}px,${offsetY}px,0) scale(${scale})`}
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
        },
        format(time){
            Math.floor(time);
            let minute =Math.floor(time / 60);
            let second = Math.floor(time % 60);
            second.toFixed(2);
            if(minute < 10){
                minute = "0" + minute;
            }
            if(second < 10){
                second = "0" + second; 
            }
            return `${minute}:${second}`;
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
                &.play{
                   animation: rotate 20s linear infinite; 
                }
                &.pause{
                    animation-play-state: paused;
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
                display: flex;
                align-items: center;
                width: 80%;
                margin: 0px auto;
                padding: 10px 0;
                .time{
                    color: @color-text;
                    font-size: @font-size-small;
                    flex: 0 0 .6rem;
                    line-height: .6rem;
                    width: .6rem;
                    &.time-l{
                        text-align: left;
                    }
                    &.time-r{
                        text-align: right;
                    }
                }
                .progress-bar-wrapper{
                    padding: 0 .05rem;
                    box-sizing: border-box;
                    flex: 1
                }
                // background: gainsboro;
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
                     .icon-ziyuan,.icon-ziyuan1{
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
            &.play{
                   animation: rotate 20s linear infinite; 
                }
            &.pause{
                animation-play-state: paused;
            }
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
            .icon-ziyuan1,.icon-ziyuan{
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
    @keyframes rotate{
      0%{
      transform: rotate(0);
      }
     100%{
      transform: rotate(360deg);
     }
    }
}
</style>