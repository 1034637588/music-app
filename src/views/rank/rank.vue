<template>
  <div class="rank">
    <scroll :data="bangList"  class="toplist" ref="toplist">
      <ul>
        <li @click="selectItem(item)" class="bangitem" v-for="item in bangList" :key="item.id">
          <div class="icon">
            <img width="100%" height="100%" v-lazy="item.pic"/>
          </div>
          <ul class="songlist">
            <li v-for="(msic,index) in item.musiclist" :key="msic.musicrid" class="song">
              <span>{{index+1}}</span>
              <span>{{msic.name}}--{{msic.artist}}</span>
            </li>
          </ul>
        </li>
      </ul>
      <div class="loading-container" v-show="!bangList.length">
        <loading></loading>
      </div>
    </scroll>
     <transition name="fade">
        <router-view></router-view>
    </transition>
  </div>
</template>
<script>
  import bangApi from '../../api/bangApi';
  import scroll from '../../components/scroll/ScrollView';
  import loading from '../../components/loading/loading';
  import {playlistMixin} from '../../assets/utils/mixin';
  import {mapMutations} from 'vuex';
export default {
  components:{
    scroll,
    loading
  },
  mixins:[
    playlistMixin
  ],
  data(){
    return{
      bangList:[]
    }
  },
  created(){
    bangApi.getBangMenu().then((res)=>{
      if(res.data.code == 200){
        this.bangList = res.data.data[1].list;
        this.bangList.forEach(item => {
          const id = item.sourceid;
          bangApi.getBangMusicList(id,1,3).then((res)=>{
            if(res.data.code == 200){
                item.musiclist = res.data.data.musicList;
                this.$forceUpdate();
            }
          })
      });
      }
    });
  },
  mounted(){
    this.$refs.toplist.refresh();
  },
  methods:{
    ...mapMutations({
       setBang:"SET_BANG"
    }),
    selectItem(item){
      this.setBang(item);
      this.$router.push({path:`/rank/${item.sourceid}`});
    },
    handlePlaylist(playList){ //解决小播放器遮挡住列表的问题
            if(playList.length > 0){
                this.$refs.toplist.$el.children[0].style.paddingBottom="10vh";
                this.$refs.toplist.refresh();
            }else{
                this.$refs.toplist.$el.children[0].style.paddingBottom="0";
                this.$refs.toplist.refresh();
            }
    }
  }
}
</script>
<style lang="less" scoped>
@import '../../assets/styles/css/mixin.less';
@import '../../assets/styles/css/varibal.less';
.rank{
    display: flex;
    flex-flow: column nowrap;
    height: 86.6vh;
    overflow: hidden;
    .toplist{
      height: 86.6vh;
      width: 100%;
      overflow: hidden;
      .bangitem{
        height: 16vh;
        display: flex;
        justify-content: center;
        align-items: center;
        margin: 10px 0;
        .icon{
          width: 16vh;
          height: 16vh;
        }
        .songlist{
          flex: 1;
          display: flex;
          height: 100%;
          flex-flow: column nowrap;
          justify-content: center;
          padding: 0 20px;
          background: @color-highlight-background;
          color: @color-text-d;
          font-size: @font-size-small;
          overflow: hidden;
          .song{
            height: 4vh;
            width: 100%;
            line-height: 4vh;
            .no-wrap();

            span{
              &:first-child{
                margin-right: 10px;
              }
            }
          }
        }
      }
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