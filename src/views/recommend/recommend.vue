<template>
 <scroll-view  class="recommend" :data="reList" ref="scroll">
  <div>
      <swiper :data="data"/>
      <h1 class="title">热门歌单推荐</h1>
      <div class="recommendList">
        <div @click="selectitem(item)" class="recommendItem" v-for="item in reList" :key="item.id">
            <div class="left">
              <img @load.once="onloadImg" v-lazy="item.img"/>
            </div>
            <div class="right">
              <h1 class="r-title">{{item.uname}}</h1>
              <h1 class="content">{{item.name}}</h1>
            </div>
        </div>
      </div>
  </div>
  <div class="loadingbox" v-show="!reList.length">
    <loading/>
  </div>
  <transition name="fade">
        <router-view></router-view>
  </transition>
</scroll-view>
</template>
<script>
import Swiper from '../../components/swiper/swiper.vue';
import ScrollView from '../../components/scroll/ScrollView.vue';
import Loading from '../../components/loading/loading.vue';
import RecommentApi from '../../api/recommendApi.js';
import Api from '../../api/singerApi.js';
import {mapMutations} from 'vuex';
export default {
  components:{
    Swiper,
    ScrollView,
    Loading
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
    ...mapMutations({
        setDisc :'SET_DISC'
    }),
    onloadImg(){
      this.$refs.scroll.refresh();
    },
    selectitem(item){
      this.setDisc(item);
      this.$router.push({
        path:`/recommend/${item.id}`
      })
    }
  },
  created(){
    RecommentApi.TopRecommend(1,20).then((res)=>{
      this.reList = res.data.data.data;
      console.log(res.data);
    });
  },
  mounted(){
    this.$nextTick(()=>{
        this.$refs.scroll.refresh();
    })
  }
}
</script>
<style lang="less" scoped>
@import '../../assets/styles/css/varibal.less';
  .recommend{
    display: flex;
    flex-flow: column nowrap;
    height: 86.6vh;
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
    .loadingbox{
      width: 100%;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%);
    }
    .fade-enter-active,.fade-leave-active{
    transition: all .5s 0s;
    }
    .fade-enter{
        transform:translate3d(100%,0,0) scale(.2); //进入之前的状态 然后进入后就是远洋 在这个这个之间过度
        transform-origin: left buttom;
   }
    .fade-leave-to{
      transform:  translate3d(100%,0,0) scale(.2);
    }
  }
</style>