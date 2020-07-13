<template>
  <div class="progress-bar" @click="pclick" ref="progressBar">
    <div class="bar-inner">
      <div class="progress" :style="{width:`${offsetWidth}px`}" ref="progress"></div>
      <div class="progress-btn-wrapper" 
          :style="{left:left>-8 ? `${left}px` : '-8px'}"
          ref="progressBtn"
          @touchstart.prevent="touchStart"
          @touchmove.prevent="touchMove"
          @touchend="touchEnd"
          >
        <div class="progress-btn"></div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
    props:{
        percent:{
            type:Number,
            default:0
        }
    },
    data(){
        return{
            offsetWidth:0,
            left:"-8"
        }
    },
    watch:{
        percent(newPercent){
            if(this.touch.initiaed) return; //当拖动进度条时停止进度改变
            this.offsetWidth = (this.$refs.progressBar.clientWidth - 16) * newPercent;
            this.left = ( this.$refs.progressBar.clientWidth -16) * newPercent - 8;
        }
    },
    created(){
        this.touch = {};
    },
    methods:{
        touchStart(e){
            this.touch.initiaed = true;
            this.touch.touchX = e.changedTouches[0].pageX;
            this.touch.offsetWidth = this.offsetWidth;
        },
        touchMove(e){
            if(!this.touch.initiaed){
                return;
            }
            let dartaX = e.changedTouches[0].pageX - this.touch.touchX;
            if(this.touch.offsetWidth + dartaX > this.$refs.progressBar.clientWidth){
                return;
            } //边界条件
            this.left = Math.max(0,Math.min(this.touch.offsetWidth + dartaX -8,this.$refs.progressBar.clientWidth));
            this.offsetWidth =Math.max(0,Math.min(this.touch.offsetWidth + dartaX,this.$refs.progressBar.clientWidth));
            this.$emit("changePrecent",this.offsetWidth / this.$refs.progressBar.clientWidth);
        },
        touchEnd(e){
            this.touch.initiaed = false;
        },
        pclick(e){
            this.left = e.pageX - this.$refs.progressBar.offsetLeft -8;
            this.offsetWidth = e.pageX - this.$refs.progressBar.offsetLeft;
            this.$emit("changePrecent",this.offsetWidth / this.$refs.progressBar.clientWidth);
        }
    }
}
</script>
<style lang="less" scoped>
@import '../../assets/styles/css/varibal.less';
.progress-bar{
    height: .6rem;
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    .bar-inner{
      position: relative;
      height: .06rem;
      width: 100%;
      background: rgba(0, 0, 0, 0.3);
      .progress{
        position: absolute;
        height: 100%;
        background: @color-theme;
      }
      .progress-btn-wrapper{
        position: absolute;
        left: -8px;
        top: -13px;
        width: 30px;
        height: 30px;
      }
        .progress-btn{
          position: relative;
          top: 7px;
          left: 7px;
          box-sizing: border-box;
          width: 16px;
          height: 16px;
          border: 3px solid @color-text;
          border-radius: 50%;
          background: @color-theme;
        }
    }
      
}
</style>