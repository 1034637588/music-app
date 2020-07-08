<template>
  <div class="recommend">
      <swiper :data="data"/>
      <h1 class="title">热门歌单推荐</h1>
  </div>
</template>
<script>
import Swiper from '../swiper/swiper.vue';
export default {
  components:{
    Swiper
  },
  data(){
    return {
      data:[
        {id:"1",img:"https://kwimg4.kuwo.cn/star/upload/43/83/1593867014431_.jpg"},
        {id:"2",img:"https://kwimg4.kuwo.cn/star/upload/43/83/1593867014431_.jpg"},
        {id:"3",img:"https://kwimg4.kuwo.cn/star/upload/43/83/1593867014431_.jpg"}
      ]
    }
  }
}
</script>
<style lang="less" scoped>
@import '../../assets/styles/css/varibal.less';
  .recommend{
    .title{
      height: .6rem;
      line-height: .6rem;
      text-align: center;
      font-size: @font-size-medium-x;
      color: @color-theme;
      letter-spacing: 4px;
    }
  }
</style>