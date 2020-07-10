<template>
  <div class="song-list">
    <ul>
      <li class="item" v-for="item in songs" :key="item.MUSICRID">
        <div class="rank" v-show="rank">
          <span></span>
        </div>
        <div class="content">
          <h2 class="name" v-html="item.ARTIST"></h2>
          <p class="desc" v-html="item.SONGNAME"></p>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
  export default {
    props: {
      songs: {
        type: Array,
        default: []
      },
      rank: {
        type: Boolean,
        default: false
      }
    },
    methods: {
    }
  }
</script>

<style lang="less" scoped>
  @import '../../assets/styles/css/varibal.less';
  .song-list{
      z-index: 200;
      .item{
      display: flex;
      align-items: center;
      box-sizing: border-box;
      height: 10vh;
      font-size: @font-size-medium;
      .rank{
          width: 8%;
          height: 100%;
          background: chartreuse;
      }
      .content{
        flex: 1;
        height: 100%;
        display: flex;
        flex-flow: column nowrap;
        justify-content: center;
        align-items: flex-start;
        overflow: hidden;
        padding:0 8%;
        .name{
          color: @color-text;
          margin-bottom: .1rem;
        }
        .desc{
          margin-top: 4px;
          color: @color-text-d;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }
      }
  }
</style>