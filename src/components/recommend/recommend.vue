<template>
 <scroll-view  class="recommend" :data="reList" ref="scroll">
  <div>
      <swiper :data="data"/>
      <h1 class="title">热门歌单推荐</h1>
      <div class="recommendList">
        <div class="recommendItem" v-for="item in reList" :key="item.id">
            <div class="left">
              <img @load.once="onloadImg" :src="item.img"/>
            </div>
            <div class="right">
              <h1 class="r-title">{{item.uname}}</h1>
              <h1 class="content">{{item.name}}</h1>
            </div>
        </div>
      </div>
  </div>
</scroll-view>
</template>
<script>
import Swiper from '../swiper/swiper.vue';
import RecommentApi from '../../api/recommendApi.js';
import ScrollView from '../scroll/ScrollView.vue';
export default {
  components:{
    Swiper,
    ScrollView
  },
  data(){
    return {
      data:[
        {id:"1",img:"https://kwimg4.kuwo.cn/star/upload/43/83/1593867014431_.jpg"},
        {id:"2",img:"https://kwimg1.kuwo.cn/star/upload/31/68/1593879296854_.jpg"},
        {id:"3",img:"https://kwimg3.kuwo.cn/star/upload/69/35/1593507499521_.jpg"}
      ],
      reList:[]
    }
  },
  methods:{
    onloadImg(){
      this.$refs.scroll.refresh();
    }
  },
  created(){
    RecommentApi.TopRecommend().then((res)=>{
      this.reList = res.data.data;
    })
  },
  mounted(){
    setTimeout(() => {
        this.$refs.scroll.refresh();
    }, 20);
  }
}
</script>
<style lang="less" scoped>
@import '../../assets/styles/css/varibal.less';
  .recommend{
    display: flex;
    flex-flow: column nowrap;
    height: 9.7rem;
    overflow: hidden;
    .title{
      height: .6rem;
      line-height: .6rem;
      text-align: center;
      font-size: @font-size-medium-x;
      color: @color-theme;
      letter-spacing: 4px;
    }
    .recommendList{
      justify-content: center;
      flex: 1;
      .recommendItem{
        height: 1.7rem;
         display: flex;
         flex-flow: row nowrap;
        box-sizing: border-box;
        padding: .2rem;
      }
      .left{
        width: 1.3rem;
        height: 1.3rem;
        img{
          height: 1.3rem;
          width: 1.3rem;
        }
      }
      .right{
        flex: 1;
        padding: 0 .3rem;
        display: flex;
        flex-flow: column nowrap;
        justify-content: center;
        .r-title{
         font-size: @font-size-medium;
         color: @color-text;
         margin-bottom: .2rem;
        }
        .content{
          font-size: @font-size-medium;
          color: @color-text-d;
        }

      }
    }
  }
</style>