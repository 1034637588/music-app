<template>
 <transition name="list-fade">
    <div class="playlist" @click="close" v-show="showFlag">
        <div class="list-wrapper" @click.stop>
            <div class="list-header">
                <i @click.stop="changeMode" :class="modeIcon" class="iconfont" ></i>
                <span class="text">循环播放</span>
                <span @click.stop="clear" class="clear"><i  class="iconfont icon-shanchu"></i></span>
            </div>
            <scroll ref="scroll" :data = "sequenceList" class="listContent">
                <ul class="list" ref="list">
                    <li @click="selectItem(item,index)" class="item" v-for="(item,index) in sequenceList" :key="item.musicrid">
                        <i :class="getCurrent(item) ? 'icon-bofang' : ''" class="current iconfont"></i>
                        <span class="text">{{item.name}}</span>
                        <span class="like" @click.stop="toggleFavorite(item)">
                            <i class="iconfont" :class="isLike(item) ? 'icon-xin' : ' icon-xin1'"></i>
                        </span>
                        <span @click.stop="delItem(item,index)" class="delete">
                            <i class="iconfont icon-shanchu1"></i>
                        </span>
                    </li>
                </ul>
            </scroll>
            <div class="list-operate">
                <div @click.stop="add2List" class="add">
                    <i class="iconfont icon-icon-test"></i>
                    <span class="text">添加歌曲到队列</span>
                </div>
            </div>
            <div @click.stop="close" class="list-close">
                <span>关闭</span>
            </div>
        </div>
    <confirm ref="confirm" @confirm="confirm" text="是否要清除所有历史记录"/>
    <add-to-list :show="isshow" @close="isshow = false"></add-to-list>
    </div>
</transition>
</template>
<script>
import Confirm from '../../components/comfirm/confirm';
import {mapGetters,mapMutations,mapActions} from 'vuex';
import Scroll from '../../components/scroll/ScrollView';
import {playerMixin} from '../../assets/utils/mixin';
import addToList from '../../views/addToList/addToList';
export default {
    components:{
        Scroll,
        Confirm,
        addToList
    },
    mixins:[
        playerMixin
    ],
    data(){
        return{
            showFlag:false,
            isshow:false
        }
    },
    computed:{
        ...mapGetters([
            'sequenceList',
            'currentSong',
            'playList',
            'mode'
        ])
    },
    created(){

    },
    methods:{
        ...mapMutations({
            setCurrentIndex:"SET_CURRENT_INDEX",
            setPlayState:'SET_PLAYING_STATE'
        }),
        ...mapActions([
            'deleteSong',
            'clearPlayList'
        ]),
        show(){
            this.showFlag = true;
            setTimeout(() => {
                this.$refs.scroll.refresh();
                let index = this.sequenceList.findIndex((item)=>{
                return this.currentSong.musicrid == item.musicrid;
            });
            this.scrollToEle(index);
            }, 20);
        },
        hidden(){
            this.showFlag = false;
        },
        close(){
            this.$emit('close');
        },
        getCurrent(item){
            if(item.musicrid){
                return item.musicrid == this.currentSong.musicrid;
            }else{
                return item.MUSICRID == this.currentSong.MUSICRID
            }
        },
        selectItem(item,index){
            if(this.mode == 'random'){
               let idx = this.playList.arr.findIndex((items)=>{
                    return item.musicrid == items.musicrid;
                });
               this.setCurrentIndex(idx);
               this.scrollToEle(idx);
               this.setPlayState(true);
            }else{
                this.setCurrentIndex(index);
                this.scrollToEle(index);
                this.setPlayState(true);
            }
        },
        delItem(item,index){
            this.deleteSong(item);
            // this.scrollToEle(index);
            if(!this.sequenceList.length){
                this.hidden();
            }
        },
        clear(){
            this.$refs.confirm.show();
        },
        confirm(){
            this.clearPlayList();
        },
        scrollToEle(index){
            let list = this.$refs.list.children;
            this.$refs.scroll.scrollToElement(list[index]);
        },
        add2List(){ //进入添加到列表页面
            this.isshow = true;
        }
    }
}
</script>
<style lang="less" scoped>
@import '../../assets/styles/css/varibal.less';
    .list-fade-enter-active,.list-fade-leave-active{
        transition: all .5s;
    }
    .list-fade-enter, .list-fade-leave-to{
         opacity: 0;
        .list-wrapper{
            transform: translate3d(0, 100%, 0);
        }
    }
    .playlist{
        position: fixed;
        right: 0;
        top: 0;
        bottom: 0;
        left: 0;
        z-index: 2000;
        background-color: @color-background-d;
        .list-wrapper{
            transition: all .5s;
            position: absolute;
            height: 65vh;
            left: 0;
            bottom: 0;
            width: 100%;
            background-color: @color-highlight-background;
            display: flex;
            flex-flow: column nowrap;
            justify-content: center;
            align-items: center;
            .list-header{
                height: 10vh;
                width: 100%;
                display: flex;
                align-items: center;
                .icon-xunhuanbofang,.icon-yinleliebiao,.icon-suijibofang{
                    margin-left: 20px;
                    margin-right: 10px;
                    font-size: 30px;
                    color: @color-theme-d;
                }
                .text{
                    flex: 1;
                    font-size: @font-size-medium;
                    color: @color-text-l;
                }
                .clear{
                    margin-right: 20px;
                    .icon-shanchu{
                        font-size: @font-size-medium-x;
                        color: @color-text-d;
                    }
                }
            }
            .listContent{
                min-height: 20vh;
                width: 100%;
                flex: 1;
                overflow: hidden;
                // .list-enter-active, .list-leave-active{
                //     transition: all 0.1s
                // }
                // .list-enter, .list-leave-to{
                //      height: 0
                // }
                .list{
                    display: flex;
                    width: 100%;
                    flex-flow: column nowrap;
                    justify-content: flex-start;
                    align-items: center;
                    .item{
                        height: 10vh;
                        width: 100%;
                        display: flex;
                        align-items: center;
                        position: relative;
                        .iconfont{
                            font-size: @font-size-medium-x;
                            color: @color-theme-d;
                        }
                        .icon-bofang{
                            position: absolute;
                            left:20px;
                        }
                        .text{
                            flex: 1;
                            font-size: @font-size-medium;
                            color: @color-text-d;
                            margin-left: .8rem;
                        }
                        .like{
                            margin:0 10px;
                            .icon-xin{
                                color: red;
                            }
                        }
                        .delete{
                            margin-right: 20px;
                        }

                    }
                }
            }
            .list-operate{
                height: 10vh;
                width: 100%;
                display: flex;
                .add{
                    margin: auto;
                    display: flex;
                    align-items: center;
                    padding: 8px 16px;
                    border: 1px solid @color-text-l;
                    border-radius: 100px;
                    color: @color-text-l;
                    .icon-add{
                        margin-right: 10px;
                        font-size: @font-size-small-s;
                    }
                    .text{
                        margin-left: 10px;
                        font-size: @font-size-small;
                    }
                }

            }
            .list-close{
                height: 7vh;
                width: 100%;
                text-align: center;
                line-height: 7vh;
                background: @color-background;
                font-size: @font-size-medium-x;
                color: @color-text-l;
            }
        }
    }
</style>