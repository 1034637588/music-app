<template>
  <div class="music-list">
    <div class="head" 
        :style="{
            backgroundImage:bgStyle,
            height:headHeight,
            zIndex:headIndex,
            transform:scale}"
        ref="head">
        <div class="play" @click="random" v-show="palyIndex==20" :style="{zIndex:palyIndex}">
          <i class="iconfont icon-ziyuan"></i>
          <span class="text">随机播放全部</span>
        </div>
        <div class="filter"></div>
        <!-- 背景图片的蒙层 -->
    </div>
        <div class="back" :style="{background:backBg}" ref="back" @click="back">
        <i class="iconfont icon-fanhui"></i>
        <h1 class="title">{{title}}</h1>
        </div>
    <div class="bg-layer" ref="layer"></div>
    <scroll-view 
        :data="songs"
        class="scroll"
        :probeType=3
        :listenScroll=true
        @scroll="scroll"
        >
        <song-list @select="selectSong" :songs="songs"/>
        <div class="loadingbox" v-show="isLoad">
          <loading/>
        </div>
    </scroll-view>
  </div>
</template>
<script>
import {mapGetters,mapActions} from 'vuex';
import songList from '../songList/songList';
import scrollView from '../scroll/ScrollView';
import Loading from '../../components/loading/loading'
export default {
    components:{
        songList,
        scrollView,
        Loading
    },
    props:{
        bgImage: {
        type: String,
        default: ''
      },
      songs: {
        type: Array,
        default:[]
      },
      title: {
        type: String,
        default: ''
      },
      isLoad:{
        type: Boolean,
        default: false
      }
    },
    data(){
        return{
            scrollY:0,
            palyIndex:20,
            headHeight:"40vh",
            headIndex:0,
            scale:"",
            backBg:"",
            bgStyle:`url(${this.bgImage})`
        }
    },
    computed: {
      ...mapGetters([
            "singer"
        ])
    },
    watch:{
        scrollY(newY){ //监听滚动的距离
        // console.log(newY);
        this.$emit("loaderMore",newY); //触发滚动事件 留给详情页做上拉加载
        if(-newY > this.imgHeight - this.backHeight){ //当滑动到back的部分的时候 让head的高度变成back的高度 并且层级变高 这样歌词就不会超出了
            this.headHeight = "6.7vh";
            this.headIndex= 10;
            return;
        }else{
            this.headIndex = 0;
            this.headHeight = "40vh"; //在滚动小于head高度减去back的高度时 让蒙层向上跟随平移(蒙层的层级高于head的层级) 蒙层的背景和歌曲list的背景一致 这样就可以有 列表伴随滚动的效果 并且在back处停止
            this.$refs.layer.style.transform = `translate3d(0,${newY-5}px,0)`;
       }
        if(-newY > 20){ //控制paly区域层级的 在向上滑动时隐藏
            this.palyIndex = -1;
        }else{
            this.palyIndex = 20;
        }
        if(newY > 0){ //实现向下拉的时候 让背景跟随变大 并且高斯模糊
            let percent = Math.abs(newY / this.imgHeight); //计算处要放大的倍数
            let x = 1 + percent;
            this.scale = `scale(${x})`;
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
        ...mapActions([
            "selectPlay",
            "randomPlay"
        ]),
        back(){
            this.$router.go(-1);
        },
        scroll(pos){ //监听滚动事件 使得滚动时背景图片也网上走
            this.scrollY = pos.y;
        },
        selectSong(item,index){ //点击播放音乐 传入播放列表
            this.selectPlay({
               list:this.songs,
               index
            });
        },
        random(){
            this.randomPlay({
                list: this.songs
            });
        }
    }
}
</script>
<style lang="less" scoped>
@import '../../assets/styles/css/varibal.less';
@import '../../assets/styles/css/mixin.less';
.music-list{
    height: 100%;
    overflow: hidden;
    .head{
        height: 40vh;
        position: relative;
        background-repeat: no-repeat;
        background-position: top;
        background-size: cover;
        transform-origin: top;
        z-index: 10;
    }
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
        top: 40vh;
        left: 0;
        height: 60vh;
        width: 100%;
        // overflow: hidden;
    }
    .loadingbox{
        width: 100%;
        text-align: center;
    }
}
</style>