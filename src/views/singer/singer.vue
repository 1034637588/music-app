<template>
<scorll-view ref="box" class="box">
    <ul>
      <li v-for="item in 60" :key="item">{{item}}</li>
    </ul>
</scorll-view>

</template>
<script>
import ScorllView from '../../components/scroll/ScrollView.vue';
import BScroll from 'better-scroll';
export default {
  components:{
    ScorllView
  },
  mounted(){
  }
}
</script>
<style lang="less" scoped>
  .box{
    height: 80vh;
    background: burlywood;
    overflow: hidden;
  }
</style>