<template>
    <div class="detalil-box">
        <music-list 
        :bgImage="singer.pic300"
        :title="singer.name"
        :songs = "songList"/>
    </div>
</template>
<script>
import songApi from '../../api/songsApi';
import musicList from '../../components/musicList/musicList'
import {mapGetters} from 'vuex';
export default {
    components:{
        musicList
    },
    data(){
        return{
            songList:[]
        }
    },
    computed:{
        ...mapGetters([
            "singer"
        ])
    },
    created(){
        songApi.getSongsBySinger(this.singer.name,1,10).then((res)=>{
            let data = res.data;
            let index = data.indexOf('abslist');
            data ="{'" + data.slice(index);
            data = data.replace(/'/g,'"');
            data = JSON.parse(data);
            this.songList = data.abslist;
            console.log(this.songList)
       });
    }
}
</script>
<style lang="less" scoped>
@import '../../assets/styles/css/varibal.less';
.detalil-box{
    height: 100vh;
    width: 100%;
    z-index: 1000;
    position: absolute;
    background: @color-background;
    top: 0;
    left: 0;

}
</style>