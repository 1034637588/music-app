<template>
  <div class="searchBox">
    <i class="iconfont icon-sousuo icon-search"></i>
    <input ref="query" @input="changeinput" :value="value" :class="value ?'force' : ''" class="input" :placeholder="placeholder"/>
    <i v-show="value" @click="clear" class="iconfont icon-shanchu1 icon-dismiss"></i>
  </div>
</template>
<script>
export default {
    props:{
        placeholder: {
         type: String,
         default: '搜索歌曲、歌手'
      },
      value:{
          type:String,
          default:""
      }
    },
    data() {
      return {
      }
    },
    created(){
       
    },
    methods:{
        changeinput(e){
           this.$emit('input',e.target.value);
        },
        clear(){
            this.$emit('clear');
        }
    },
    watch:{
        value(newV){
            // console.log(newV)
        }
    }
}
</script>
<style lang="less" scoped>
@import '../../assets/styles/css/varibal.less';
@import '../../assets/styles/css/mixin.less';
.searchBox{
    display: flex;
    align-items: center;
    box-sizing: border-box;
    width: 100%;
    padding: 0 .1rem;
    height: 7vh;
    background: @color-highlight-background;
    border-radius: 6px;
    .icon-search{
      font-size: 24px;
      color: @color-background;
    }
    .input{
        flex: 1;
        margin: 0 .1rem;
        line-height: .4rem;
        background: @color-highlight-background;
        border: none;
        color: @color-text;
        font-size: @font-size-medium;
        outline: none;
        &::placeholder{
            color: @color-text-d;
        }
        &.force{
            &:focus{
                outline: @color-theme  2px solid;
                border-radius: 4px;
            }
        }
    }
    .icon-dismiss{
        font-size: 16px;
        color: @color-background;
        }
}
</style>