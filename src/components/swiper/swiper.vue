<template>
  <div class="swiper-box" ref="swiper">
    <div class="scroll-box" :style="{width:width}"  ref="scroll">
      <div class="item" v-for="(item,index) in data" :key="index">
        <a class="img-box"><img :src="item.img"/></a>
      </div>
    </div>
    <div class="dots">
      <span class="dot" :class="{active:currentIndex == index}" v-for="(item,index) in dots" :key="item"></span>
    </div>
  </div>
</template>
<script>
import BScroll from 'better-scroll';
import domUtils from '../../assets/utils/dom.js';
export default {
  props: {
      loop: {
        type: Boolean,
        default: true
      },
      autoPlay: {
        type: Boolean,
        default: true
      },
      interval: {
        type: Number,
        default: 3000
      },
      data:{
        type: Array
      }
  },
  data(){
    return {
      width:'100%',
      dots:[],
      currentIndex:0
    }
  },
  components:{
  },
  methods:{
    _setSwiperWidth(){ //根据图片的个数来设置宽度
      let swiper = this.$refs.scroll;
      let width = document.documentElement.clientWidth;
      let num = swiper.children.length;
      this.dots = new Array(num);
      if (this.loop) {
        num += 2;
      }
      this.width = width*num + 'px';
      console.log(this.width);
    },
    _initSwiper(){
      this.swiper = new BScroll(this.$refs.swiper,{
        scrollX: true,
        scrollY: false,
        momentum: false,
        // snap: true,
        snapLoop: this.loop,
        snapThreshold: 0.3,
        snapSpeed: 400,
        snap: {
          loop: true
          }
      });
      if(this.autoPlay){
        this._play(400);
      }
      this.swiper.on('scrollEnd',(obj)=>{
        this.currentIndex = this.swiper.getCurrentPage().pageX;
      })
    },
    _play(time){ //自动轮播
      this.time = setInterval(() => {
        this.swiper.next(time);
      }, this.interval);
    }

  },
  mounted(){
    setTimeout(() => {
      this._setSwiperWidth();
      this._initSwiper();
      this.swiper.next(400);
    }, 20);
    window.addEventListener('resize',()=>{ //窗口改变重新计算
      if(!this.swiper){
        return;
      }
      this._setSwiperWidth();
      this.swiper.refresh();
    })
  },
  destroyed(){
    clearInterval(this.timer);
  }
}
</script>
<style lang="less" scoped>
@import '../../assets/styles/css/varibal.less';
  .swiper-box{
    height: 2.5rem;
    width: 100vw;
    position: relative;
    .scroll-box{
      width: 100%;
      height: 100%;
      display: flex;
      overflow: hidden;
      flex-flow: row nowrap;
    }
    .item{
      width: 100vw;
      text-align: center;
        .img-box{
          display: inline-block;
          height: 100%;
          width: 100%;
          overflow: hidden;
          img{
          height: 100%;
          width: auto;
          margin: 0 -100%;//让图片居中
        }
      }
    }
    .dots{
      position:absolute;
      left: 50%;
      bottom: 10px;
      transform: translate(-50%);
      span{
        width: 8px;
        height: 8px;
        margin: 0 5px;
        display: inline-block;
        border-radius: 50%;
        background:@color-text-l;
        &.active{
          width: 20px;
          border-radius: 5px;
          background: @color-text-ll
        }
      }

    }
  }
</style>