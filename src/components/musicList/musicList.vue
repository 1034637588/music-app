<template>
  <div class="music-list">
    <div class="head" :style="{backgroundImage:bgStyle,height:headHeight,zIndex:headIndex}" ref="head">
        <div class="back" ref="back" @click="back">
            <i class="iconfont icon-fanhui"></i>
            <h1 class="title">{{title}}</h1>
        </div>
        <div class="play" :style="{zIndex:palyIndex}">
          <i class="iconfont icon-ziyuan"></i>
          <span class="text">随机播放全部</span>
        </div>
        <div class="filter"></div>
        <!-- 背景图片的蒙层 -->
    </div>
    <div class="bg-layer" ref="layer"></div>
    <scroll-view 
        :data="songs" 
        class="scroll"
        :probeType=3
        :listenScroll=true
        @scroll="scroll"
        >
        <song-list :songs="songs"/>
    </scroll-view>
  </div>
</template>
<script>
import {mapGetters} from 'vuex';
import songList from '../songList/songList';
import scrollView from '../scroll/ScrollView';
export default {
    components:{
        songList,
        scrollView
    },
    props:{
        bgImage: {
        type: String,
        default: ''
      },
      songs: {
        type: Array,
        default:[1]
      },
      title: {
        type: String,
        default: ''
      }
    },
    data(){
        return{
            scrollY:0,
            palyIndex:20,
            headHeight:"40vh",
            headIndex:-1
        }
    },
    computed: {
      bgStyle() {
        return `url(${this.bgImage})`
      },
      ...mapGetters([
            "singer"
        ])
    },
    watch:{
        scrollY(newY){ //监听滚动的距离
        console.log(newY)
        if(-newY > this.imgHeight - this.backHeight){
            // this.headIndex = 10;
            return;
        }else{
            // this.headIndex = -1;
            this.$refs.layer.style.transform = `translate3d(0,${newY}px,0)`;
        }
        if(-newY > 20){
            this.palyIndex = -1;
        }else{
            this.palyIndex = 20;
        }
        }
    },
    mounted(){
        setTimeout(() => {
            this.imgHeight = this.$refs.head.clientHeight;
            this.backHeight = this.$refs.back.clientHeight;
        }, 20);
    },
    methods:{
        back(){
            this.$router.go(-1);
        },
        scroll(pos){ //监听滚动事件 使得滚动时背景图片也网上走
            this.scrollY = pos.y;
        }
    }
}
</script>
<style lang="less" scoped>
@import '../../assets/styles/css/varibal.less';
.music-list{
    height: 100%;
    .head{
        height: 40vh;
        position: relative;
        background-repeat: no-repeat;
        background-position: center;
        background-size: cover;
    }
    .back{
        height: 6.7vh;
        line-height: 6.7vh;
        position: relative;
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
            position: absolute;
            top:0;
            left: 50%;
            height: 100%;
            transform: translate(-50%);
            font-size: @font-size-large;
            color: @color-text;
            z-index: 20;
        }
    }
    .play{
        height: 4.7vh;
        width: 40%;
        position: absolute;
        line-height: 4.7vh;
        bottom: 20px;
        left: 50%;
        transform: translate(-50%);
        text-align: center;
        border: 1px solid @color-theme;
        color: @color-theme;
        border-radius: 100px;
        z-index: 20;
        .icon-ziyuan{
            display: inline-block;
            vertical-align: middle;
            margin-right: .12rem;
            font-size: @font-size-medium-x;
        }
        .text{
            display: inline-block;
            vertical-align: middle;
            font-size: @font-size-small;
            letter-spacing: 3px;
        }
            
    }
    .filter{
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(7, 17, 27, 0.4);
    }
    .bg-layer{
        position: absolute;;
        width: 100%;
        height: 100%;
        background: @color-background;
        z-index: 0; 
    }
    .scroll{
        position: absolute;
        height: 60vh;
        width: 100%;
        // overflow: hidden;
    }
}
</style>