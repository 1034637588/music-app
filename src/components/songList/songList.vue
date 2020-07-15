<template>
  <div class="song-list">
    <ul ref="songul">
      <li @click="selectItem(item,index)" class="item" v-for="(item,index) in songs" :key="item.MUSICRID">
        <div class="rank" v-show="rank">
          <span></span>
        </div>
        <div class="content">
          <h2 class="name" v-html="item.SONGNAME || item.name"></h2>
          <p class="desc" v-html="getDesc(item)"></p>
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
    computed(){
    },
    methods: {
      selectItem(item,index){ //派发点击事件
        this.$emit("select",item,index);
      },
       getDesc(song){
         if((song.ALBUM || song.album)!=''){
          return `${song.ARTIST || song.artist}·${song.ALBUM || song.album}`;
         }else{
           return `${song.ARTIST || song.album}`
         }
      }
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
          width: 100%;
          color: @color-text;
          margin-bottom: .1rem;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .desc{
          width: 100%;
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