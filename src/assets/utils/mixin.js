import {mapGetters, mapMutations, mapActions} from 'vuex';
import {shuffle} from './random';

export const playlistMixin = {
  computed: {
    ...mapGetters([
      'playList'
    ])
  },
  mounted() {
    this.handlePlaylist(this.playList)
  },
  activated() {
    this.handlePlaylist(this.playList)
  },
  watch: {
    playList(newVal) {
      this.handlePlaylist(newVal)
    }
  },
  methods: {
    handlePlaylist() {
      throw new Error('component must implement handlePlaylist method')
    }
  }
}

export const playerMixin = {

  computed:{
    modeIcon(){
        return this.mode == 0 ? 'icon-yinleliebiao' : this.mode == 1 ? 'icon-xunhuanbofang' : 'icon-suijibofang'
    },
    ...mapGetters([
      'playList',
      'currentSong',
      'mode',
      'sequenceList',
      'favoriteList'
  ])
  },
    methods:{
      ...mapMutations({
        setFullScreen:"SET_FULL_SCREEN",
        setPlayingState:"SET_PLAYING_STATE",
        setCurrentIndex:"SET_CURRENT_INDEX",
        setMode:"SET_PLAY_MODE",
        setPlayList:"SET_PLAYLIST"
       }),
       ...mapActions([
        "saveFavoriteList",
        "deleteFavoriteList"
       ]),
      changeMode(){ //改变播放模式
        let mode = (this.mode + 1) % 3;
        this.setMode(mode);
        let list = null;
        if(mode==2){ //if是随机播放
          list = shuffle(this.sequenceList);
        }else{
          list = this.sequenceList;
        }
        this.resetCurrentIndex(list);
        this.setPlayList(list);
    },
    resetCurrentIndex(list){ //由于打乱顺序 当前歌曲是根据当前的列表索引定的 那么当前歌曲会改变
      let index = list.findIndex((item)=>{
          if(!item.musicrid){
              return item.MUSICRID == this.currentSong.MUSICRID;
          }else{
              return item.musicrid == this.currentSong.musicrid;
          }
      });
      this.setCurrentIndex(index);
    },
    toggleFavorite(item){
      if(this.isLike(item)){
        this.deleteFavoriteList(item);
      }else{
        this.saveFavoriteList(item);
      }
    },
    isLike(item){
      let index = this.favoriteList.findIndex((itm)=>{
        return item.musicrid == itm.musicrid;
      })
      return index > -1;
    }
    }
}

export const searchMixin = {
  computed:{
    ...mapGetters([
      "searchHistory"
  ])
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
    clearVal(){
      this.query = "";
    },
    selectHistory(item){ //点击历史item
      this.query = item;
      this.$refs.scroll.scrollTo(0,0);
    },
    deleteHisItem(item){
      this.deleteHistory(item);
    }
  }
}