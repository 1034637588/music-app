<template>
  <div class="search-box">
    <scroll ref="scroll" class="scroll" :data="searchHistory">
      <div class="scrollcontent">
        <div class="top">
          <search-box  @clear="clearVal" v-model="query"/>
        </div>
        <div class="center">
          <div class="hot-search" v-show="!query">
              <h1 class="title">热门搜索</h1>
                <ul @click="clickItem">
                  <li class="item" v-for="(item,index) in searchKey" :key="index">
                    <span>{{item}}</span>
                  </li>
                </ul>
          </div>
          <div class="search-history" v-show="!query">
                <h1 class="title">
                  <span class="text">搜索历史</span>
                  <span @click.stop="clear" class="clear">
                    <i class="iconfont icon-shanchu"></i>
                  </span>
                </h1>
                <history-list 
                :searches="searchHistory"
                @select = "selectHistory"
                @delete = "deleteHistory"
                ></history-list>
          </div>
          <div class="suggest" v-show="query">
            <suggest @selectItem="selectItem" :keys="query"/>
          </div>
        </div>
      </div>
    </scroll>
    <confirm ref="confirm" @confirm="confirm" text="是否要清除所有历史记录"/>
    <transition name="fade">
        <router-view></router-view>
    </transition>
  </div>
</template>
<script>
import SearchBox from '../../components/search-box/searchBox';
import SearchApi from '../../api/searchApi';
import suggest from '../../components/suggest/suggest';
import historyList from '../../components/history-list/historyList';
import Confirm from '../../components/comfirm/confirm';
import Scroll from '../../components/scroll/ScrollView';
import {playlistMixin} from '../../assets/utils/mixin';
import {mapMutations,mapActions,mapGetters} from 'vuex';
export default {
  components:{
    SearchBox,
    suggest,
    historyList,
    Confirm,
    Scroll
  },
  mixins:[
    playlistMixin
  ],
  data(){
    return{
      searchKey:[],
      query:"",
      scrollData:[]
    }
  },
  computed:{
    ...mapGetters([
        "searchHistory"
    ])
  },
  created(){
    SearchApi.getSearchKey().then(res=>{
      this.searchKey = res.data.data;
    });
  },
  methods:{
    ...mapActions([
      'saveSearchHistory',
      'deleteHistory',
      "clearHistory"
    ]),
     ...mapMutations({
            "setSuggest":'SET_SUGGEST'
        }),
    clickItem(e){
      if(e.target.nodeName == "SPAN"){
        this.query = e.target.innerHTML;
        this.$refs.scroll.scrollTo(0,0);
      }
    },
    clearVal(){
      this.query = "";
    },
    selectItem(item){ //点击一个搜索的结果
      this.setSuggest(item[0]);
      this.saveSearchHistory(item[0]);
      this.query = "";
      this.$router.push({path:`/search/${item[0]}`});
    },
    selectHistory(item){ //点击历史item
        this.query = item;
        this.$refs.scroll.scrollTo(0,0);
    },
    deleteHisItem(item){
      this.deleteHistory(item);
    },
    clear(){
      this.$refs.confirm.show();
    },
    confirm(){ //如果确认 就清除
      this.clearHistory();
    },
    handlePlaylist(playList){ //处理遮挡问题
      if(playList.length > 0){
        this.$refs.scroll.$el.children[0].style.paddingBottom="10vh";
        this.$refs.scroll.refresh();
      }else{
        this.$refs.scroll.$el.children[0].style.paddingBottom="0";
        this.$refs.scroll.refresh();
      }
    }
  }
}
</script>
<style lang="less" scoped>
@import '../../assets/styles/css/varibal.less';
  .search-box{
    height: 86.6vh;
    width: 100%;
    display: flex;
    flex-flow: column nowrap;
    align-items: center;
    .scroll{
      height: 86.6vh;
      width: 100%;
      overflow: hidden;
    }
    .scrollcontent{
      width: 100%;
      overflow: hidden;
      display: flex;
      flex-flow: column nowrap;
      align-items: center;
    }
    .top{
      width: 90%;
      margin-top: 2vh;
    }
    .center{
      width: 100%;
      // margin: .5rem .2rem;
      margin-top: 5vh;
      .hot-search{
         margin: 0 20px 20px 20px;
          .title{
            margin-bottom: 20px;
            font-size: @font-size-medium;
            color: @color-text-l;
          }
          .item{
            display: inline-block;
            padding: 5px 10px;
            margin: 0 20px 10px 0;
            border-radius: 6px;
            background: @color-highlight-background;
            font-size: @font-size-medium;
            color: @color-text-d;
          }
      }
      .search-history{
          position: relative;
          margin: 0 20px;
          .title{
            display: flex;
            align-items: center;
            height: 40px;
            font-size: @font-size-medium;
            color: @color-text-l;
            .text{
              flex: 1
            } 
            .clear{
              // extend-click()
              .icon-clear{
                font-size: @font-size-medium;
                color: @color-text-d;
              }
            }
          }
      }
      .suggest{
        flex:1;
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