<template>
  <div class="singerbox">
    <list-view :data="singerData"/>
  </div>
</template>
<script>
import ListView from '../../components/listView/listView';
import SingerApi from '../../api/singerApi.js';
export default {
  components:{
    ListView
  },
  data(){
    return{
      singerData:[]
    }
  },
  mounted(){
    SingerApi.getSingers().then((res)=>{
      this.singerData=res.data.artistList;
      console.log(this.singerData)
    })
  }
}
</script>
<style lang="less" scoped>
  .singerbox{
    height: 9.8rem;
  }
</style>