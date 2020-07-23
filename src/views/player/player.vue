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
                    <img height="100%" width="100%" :src="currentSong.hts_MVPIC || currentSong.albumpic  || songImg " alt="歌手照片">
                </div>
                <div class="top" ref="top">
                    <div @click="back" class="back">
                        <i class="iconfont icon-wei-"></i>
                    </div>
                    <h1 class="title" v-html="currentSong.NAME || currentSong.name"></h1>
                    <h2 class="subtitle" v-html="currentSong.ARTIST || currentSong.artist"></h2>
                </div>
                <div class="middle"
                    ref="middle"
                    :style="{transform:middleTranslate,transition:transition}"
                    @touchstart="mtouchStart"
                    @touchend="mtouchEnd"
                    @touchmove="mtouchMove">
                    <div class="middle-l">
                        <div class="cd-wrapper" ref = "wrapper">
                            <div :class="cdRotate" class="cd">
                                <img :src="currentSong.hts_MVPIC|| currentSong.albumpic || songImg" alt="专辑照片" class="image">
                            </div>
                        </div>
                        <div class="playing-lyric-wrapper">
                            <div class="playing-lyric">{{currentLrc}}</div>
                        </div>
                    </div>
                    <div class="middle-r">
                        <scroll class="scroll" ref="lyricList" :data = "lrclist">
                            <div class="lyric-wrapper">
                                 <!-- @touchstart.stop.prevent="touchStart" @touchend.stop.prevent="touchEnd" -->
                                <div v-if="lrclist">
                                    <p  ref="lyricLine" v-for="(lyr,index) in lrclist" :key="index" :class="{ current: currentLrcIndex == index}" class="text">{{lyr.lineLyric}}</p>
                                </div>
                                <div v-else>
                                    <p  ref="lyricLine" class="text">"暂无歌词"</p>
                                </div>
                            </div>
                        </scroll>
                    </div>
                </div>
                <div class="bottom">
                     <div class="dot-wrapper">
                        <span class="dot" :class="{'active':currentShow==='cd'}"></span>
                        <span class="dot" :class="{'active':currentShow==='lyric'}"></span>
                    </div>
                    <div class="progress-wrapper">
                        <span class="time time-l">{{format(currentTime)}}</span>
                        <div class="progress-bar-wrapper">
                            <progress-bar @changePrecent="changePrecent" :percent="percent"></progress-bar>
                        </div>
                        <span class="time time-r">{{songTime}}</span>
                    </div>
                    <div class="operators">
                        <!-- 播放模式 -->
                        <div class="icon i-left" @click.stop="changeMode">  
                            <i class="iconfont" :class="modeIcon"></i>
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
                <img :src="currentSong.hts_MVPIC || currentSong.albumpic|| (songImg || '../../assets/image/default.png')">
            </div>
            <div class="text">
                <h2 class="name" v-html="currentSong.NAME || currentSong.name"></h2>
                <p class="desc" v-html="currentSong.ARTIST || currentSong.artist"></p>
            </div>
            <div @click.stop="togglePlaying" class="control one">
                <progress-cir :radius="radius" :percent="percent">
                     <i :class="miniIcon" ref = "icon" class="progress-cir-icon iconfont"></i>
                </progress-cir>
            </div>
            <div class="control two">
                <i class="iconfont icon-yinleliebiao"></i>
            </div>
        </div>
        </transition>
        <audio 
        ref="audio"
        @timeupdate="updataTime"
        @error="error" 
        @canplay="ready" 
        @ended="ended"
        autoplay 
        preload:auto 
        :src="songUrl">
        </audio>
    </div>
</template>
<script>
import Scroll from '../../components/scroll/ScrollView'
import songApi from '../../api/songsApi';
import axios from 'axios';
import {mapGetters,mapMutations} from 'vuex';
import animations from 'create-keyframe-animation';
import progressBar from '../../components/progressBar/progressBar';
import progressCir from '../../components/progress-circle/progressCircle';
import {shuffle} from '../../assets/utils/random';
export default {
    components:{
        progressBar,
        progressCir,
        Scroll
    },
    data(){
        return{
            songUrl:"",
            lrclist:[{lineLyric:"正在加载...",time:0}],
            songReady:false,
            songTime:"00:00",
            currentTime:"",
            songImg:"",
            radius:35,
            currentLrcIndex:0,
            isScroll:true,
            middleTranslate:"translate3d(0px, 0px, 0px)",
            transition:"",
            currentShow:"cd"
        }
    },
    computed:{
        modeIcon(){
            return this.mode == 0 ? 'icon-yinleliebiao' : this.mode == 1 ? 'icon-xunhuanbofang' : 'icon-suijibofang'
        },
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
            return this.currentTime / time;
        },
        currentLrc(){
            return this.lrclist[this.currentLrcIndex].lineLyric || "暂无歌词";
        },
        ...mapGetters([
            'fullScreen',
            'playList',
            'currentSong',
            'singer',
            'playing',
            'currentIndex',
            'mode',
            'sequenceList'
        ])
    },
    watch:{ //当前歌曲改变 就重新请求歌曲地址 并且播放
        currentSong(newSong,oldSong){
            this.currentTime = 0;
            this.$forceUpdate();
            console.log(newSong.musicrid);
            if(!newSong.MUSICRID){ //两种接口 返回的数据不一样
                if(newSong.musicrid == oldSong.musicrid){
                    return;
                }
                let ID = newSong.musicrid.split('_')[1];
                this.getSongAndLrc(ID);
            }else{
                if(newSong.MUSICRID == oldSong.MUSICRID){ return; }
                let ID = newSong.MUSICRID.split('_')[1];
                this.getSongAndLrc(ID);
            }
        },
        playing(newPlaying){ //通过监听playing的状态 来控制播放和停止
            const audio = this.$refs.audio;
            this.$nextTick(()=>{
                newPlaying ? audio.play() : audio.pause();
            });
        },
        currentTime(newTime,oldTime){ //监听当前播放时间的变化 改变歌词滚动
            // this.$forceUpdate();
            if(this.lrclist.length < 2){
                return;
            }
            for (let index = 0; index < this.lrclist.length; index++) {
                const time = this.lrclist[index].time;
                if(time > newTime){
                    if(index > 0){
                        this.currentLrcIndex = index - 1;
                         break;
                    }
                }
            }
            if(this.currentLrcIndex > 5){
                if(!this.isScroll) return;
                let ele = this.$refs.lyricLine[this.currentLrcIndex - 5];//控制滚动
                this.$refs.lyricList.scrollToElement(ele,1000);
            }else{
                if(!this.isScroll) return;
                this.$refs.lyricList.scrollTo(0,0,1000);
            }
        }
    },
    created(){
        this.touch = {};
        let id = this.currentSong.MUSICRID.split('_')[1] || this.currentSong.musicrid.split('_')[1] ;
        this.getSongAndLrc(id);
    },
    mounted(){
        // this.radius = this.$refs.icon.clientWidth;
    },
    methods:{
        ...mapMutations({
            setFullScreen:"SET_FULL_SCREEN",
            setPlayingState:"SET_PLAYING_STATE",
            setCurrentIndex:"SET_CURRENT_INDEX",
            setMode:"SET_PLAY_MODE",
            setPlayList:"SET_PLAYLIST"
        }),
        togglePlaying(){
            this.setPlayingState(!this.playing);//改变vuex中state的playing 控制暂停播放
        },
        changeMode(){ //改变播放模式
            let mode = (this.mode + 1) % 3;
            this.setMode(mode);
            let list = null;
            if(mode==2){ //if是随机播放
               list = shuffle(this.sequenceList);
            }else{
               list = this.sequenceList;
            }
            this.resetCurrentIndex(list);
            this.setPlayList(list);
        },
        resetCurrentIndex(list){ //由于打乱顺序 当前歌曲是根据当前的列表索引定的 那么当前歌曲会改变
            let index = list.findIndex((item)=>{
                if(!item.musicrid){
                    return item.MUSICRID == this.currentSong.MUSICRID;
                }else{
                    return item.musicrid == this.currentSong.musicrid;
                }
            });
            this.setCurrentIndex(index);
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
            // this.currentTime = 0;
        },
        ended(){ //歌曲播放结束
            if(this.mode == 1){ //循环播放的话
                this.$refs.audio.currentTime = 0; //从头播放
                this.$refs.audio.play();
                this.setPlayingState(true);
            }else{
                if (!this.songReady) { //歌曲不能播放的话 就不动
                    return;
                }
                if (this.playList.length === 1) { //如果列表只有一首歌
                    this.$refs.audio.currentTime = 0; //从头播放
                    this.$refs.audio.play();
                    this.setPlayingState(true);
                    return;
                } else { 
                    let index = this.currentIndex + 1; //如果到了最后一首+1 到第一首
                    if (index === this.playList.length) {
                        index = 0;
                    }
                    this.setCurrentIndex(index);
                    if (!this.playing) {
                        this.togglePlaying();
                    }
                    }
                this.songReady = false;
            }
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
        //左右切换歌词和cd
        mtouchStart(e){
            this.isScroll = false; //当点击时先不跟着当前的播放时间滑动歌词
            this.transition = "";
            if(this.timeOut!=null){
                clearTimeout(this.timeOut); //第二次点击就可以持续滑动
            }
            this.touch.startX = e.changedTouches[0].clientX;
            this.touch.startY = e.changedTouches[0].clientY;
            this.touch.Dwidth = window.innerWidth;
        },
        mtouchMove(e){
            let dartaX = e.changedTouches[0].clientX - this.touch.startX;
            this.touch.dartaX = dartaX;
            let dartaY = e.changedTouches[0].clientY - this.touch.startY;
            this.touch.dartaY = dartaY;

            if(Math.abs(dartaY) > Math.abs(dartaX)){
                return;
            }
            if(this.currentShow == "cd"){
                if(dartaX < 0){
                this.middleTranslate = `translate3d(${dartaX}px, 0px, 0px)`;
                }
            }
            if(this.currentShow == "lyric"){
                if(dartaX > 0){
                let x = this.touch.Dwidth-dartaX;
                this.middleTranslate = `translate3d(-${x}px, 0px, 0px)`;
                }
            }
        },
        mtouchEnd(e){
            this.timeOut = setTimeout(() => { //通过设置这个标志位 来确定能不能自动上滚歌词
                this.isScroll = true;
            }, 1000);
           let darta = this.touch.dartaX;
           if(this.currentShow == "cd"){
                if(darta < 0){
                    if( - darta > this.touch.Dwidth * 0.3){
                        this.transition = "all .5s";
                        this.middleTranslate = `translate3d(-${this.touch.Dwidth}px, 0px, 0px)`;
                        this.currentShow = "lyric";
                        return;
                    }else{
                        this.middleTranslate = `translate3d(-${0}px, 0px, 0px)`;
                        return;
                    }
                }
            }
            if(this.currentShow == "lyric"){
                if(darta > 0){
                    if( darta > this.touch.Dwidth * 0.3){
                        this.transition = "all .5s";
                        this.middleTranslate = `translate3d(${0}px, 0px, 0px)`;
                        this.currentShow = "cd";
                        return;
                    }else{
                        this.middleTranslate = `translate3d(-${this.touch.Dwidth}px, 0px, 0px)`;
                        return;
                    }
                }
            }
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
            width: 200%;
            height: 71.3vh;
            margin-top: .2rem;
            overflow: hidden;
            display: flex;
            .middle-l{
                height: 100%;
                width: 100vw;
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
            .playing-lyric-wrapper{
                width: 80%;
                margin: 30px auto 0 auto;
                overflow: hidden;
                text-align: center;
                .playing-lyric{
                    height: 20px;
                    line-height: 20px;
                    font-size: @font-size-medium;
                    color: @color-text-l;
                }
            }
            .middle-r{
                height: 71.3vh;
                width: 100vw;
                .scroll{
                height: 68.3vh;
                width: 100vw;
                overflow: hidden;
                }
                .lyric-wrapper{
                    width: 80%;
                    margin: 0 auto;
                    overflow: hidden;
                    text-align: center;
                    .text{
                        line-height: 32px;
                        color: @color-text-l;
                        font-size: @font-size-medium;
                        &.current{
                            color: @color-text;
                        }
                    }
                }
            }
        }
        .bottom{
            height: 20vh;
            width: 100%;
            position: fixed;
            bottom: 0;
            left: 0;
            .dot-wrapper{
                text-align: center;
                font-size: 0;
                .dot{
                    display: inline-block;
                    vertical-align: middle;
                    margin: 0 4px;
                    width: 8px;
                    height: 8px;
                    border-radius: 50%;
                    background: @color-text-l;
                    &.active{
                        width: 20px;
                        border-radius: 5px;
                        background: @color-text-ll;
                    }
                }
            }
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
                    //  .icon-yinleliebiao
                     .icon-xunhuanbofang,.icon-suijibofang {
                         font-size: .53rem;
                     }
                     .icon-tubiaozhizuomoban1,.icon-tubiaozhizuomoban{
                         font-weight: 600;
                     }
                     .icon-ziyuan,.icon-ziyuan1{
                         font-size: .7rem;
                         position: absolute;
                        //  left: 0;
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
                &.one{
                 position: absolute;
                 right: .8rem;
                }
                &.two{
                 position: absolute;
                 right: 0.05rem;
                }
            }
            .icon-ziyuan1,.icon-ziyuan{
                 font-size: 35px;
            }
            .progress-cir-icon{
                position: absolute;
                left: 0;
                top: 0;
            }
            .icon-yinleliebiao{
                font-size: 35px;
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