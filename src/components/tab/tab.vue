<template>
  <div class="tab-box">
      <router-Link tag="div" to="/recommend" class="tab-item">
        <span class="tab-link">推荐</span>
      </router-Link>
      <router-Link tag="div" to="singer" class="tab-item">
        <span class="tab-link">歌手</span>
      </router-Link>
      <router-Link tag="div" to="rank" class="tab-item">
        <span class="tab-link">排行</span>
      </router-Link>
      <router-Link tag="div" to="search" class="tab-item">
        <span class="tab-link">搜索</span>
      </router-Link>
  </div>
</template>
<script>
export default {
  
}
</script>
<style lang="less" scoped>
@import '../../assets/styles/css/varibal.less';
  .tab-box{
    color: @color-text-l;
    font-size: @font-size-medium;
    height: .8rem;
    display: flex;
    justify-content: space-around;
    align-items: center;
    font-weight: 600;
    .tab-item{
      height: 100%;
      width: 100%;
      display: flex;
      .tab-link{
        margin: auto;
        display: inline-block;
        height: .4rem;
        line-height: .4rem;
        box-sizing: border-box;
      }
      &.router-link-active{
        .tab-link{
          color: @color-theme;
          border-bottom: 2px solid @color-theme;
        }
        }
    }
  }
</style>