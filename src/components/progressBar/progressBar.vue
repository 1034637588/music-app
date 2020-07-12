<template>
  <div class="progress-bar" ref="progressBar">
    <div class="bar-inner">
      <div class="progress" :style="{width:offsetWidth}" ref="progress"></div>
      <div class="progress-btn-wrapper" :style="{left:left}"  ref="progressBtn">
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
            offsetWidth:"0",
            left:"-8px"
        }
    },
    watch:{
        percent(newPercent){
            this.offsetWidth = (this.$refs.progressBar.clientWidth - 16) * newPercent + "px";
            this.left = ( this.$refs.progressBar.clientWidth -16) * newPercent - 8 + "px"
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