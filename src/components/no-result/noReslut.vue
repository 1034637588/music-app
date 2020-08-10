<template>
    <div class="noSuggest" v-show="isShow">
        <img src="./no-result@3x.png"/>
        <h1>{{title}}</h1>
    </div>
</template>
<script>
export default {
    props:{
        isShow:{
            type:Boolean,
            default:false
        },
        title:{
            type:String,
            default:"抱歉,暂无搜索到结果"
        }
    }
}
</script>
<style lang="less" scoped>
@import '../../assets/styles/css/varibal.less';
@import '../../assets/styles/css/mixin.less';
  .noSuggest{
      width: 100%;
      height: 40vh;
      text-align: center;
      margin-top: 100px;
      img{
          width: auto;
          height: 50%;
      }
      h1{
           margin-top: 30px;
            font-size: @font-size-medium;
            color: @color-text-d;
            letter-spacing: 3px;
      }
  }
</style>