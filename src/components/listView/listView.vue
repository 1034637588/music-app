<template>
    <scorll class="scroll" 
            :listenScroll="true"
            ref = "listview"
            :probeType="3"
            @scroll="onscroll">
        <div>
        <ul class="list-group" v-for="group in data" :key="group.title" ref="listGroup">
            <h1 class="title">{{group.title}}</h1>
            <ul class="item-box">
                <li @click="cliceItem(item)" class="item" v-for="item in group.list" :key="item.id"> 
                    <div class="imgbox">
                        <img v-lazy="item.pic120"/>
                    </div>
                    <span>{{item.name}}</span>
                </li>
            </ul>
        </ul>
        </div>
        <div class="list-shortcut" @touchstart="onShortcutTouchStart" 
                @touchmove.stop.prevent="onShortcutTouchMove">
            <ul>
                <li ref="shortcut" 
                    v-for="(item,index) in shortcutList" 
                    :data-index="index" 
                    :key="index" 
                    class="shotitem"
                    :class="{current:currentIndex == index}"
                    >
                    {{item}}
                </li>
            </ul>
        </div>
        <div class="list-fixed" ref="fixed" v-show="fixedTitle"> 
            <div class="fixed-title">{{fixedTitle}} </div>
        </div>
    </scorll>
</template>
<script>
import Scorll from '../../components/scroll/ScrollView';
import utils from '../../assets/utils/dom';
import {playlistMixin} from '../../assets/utils/mixin';
export default {
    props: {
       data:Array
    },
    mixins:[
        playlistMixin
    ],
    data(){
        return{
            heightList:[],
            scrollY:0,//监听页面滚动 实现联动做准备
            currentIndex:0,//当前显示的小导航的索引
            shortcutList:['热',"A","B","C","D","E","F","G","H","J","K","L","M","N","O","P","Q","R","S","T","W","X","Y","Z"]
        }
    },
    components:{
        Scorll
    },
    computed:{
        fixedTitle(){
            if(this.scrollY > 0){
                return "";
            }
            return this.data[this.currentIndex] ? this.data[this.currentIndex].title : '';
        }
    },
    created(){
        this.touch = {};
    },
    mounted(){
        this.touch.shortCutHeight = this.$refs.shortcut[0].clientHeight;//得到每个小导航的高度
        this.calculateHeight();
    },
    watch:{
        data(){ //数据改变了重新计算高度
            setTimeout(() => {
                this.calculateHeight();
            }, 20);
        },
        scrollY(newY){
            const listHeight = this.heightList;
            // 当滚动到顶部，newY>0
            if (newY > 0) {
                this.currentIndex = 0;
                return;
            }
            // 在中间部分滚动
            for (let i = 0; i < listHeight.length - 1; i++) {
                let height1 = listHeight[i];
                let height2 = listHeight[i + 1];
                if (-newY >= height1 && -newY < height2) {
                    this.currentIndex = i;
                    return;
                }
            }
            // 当滚动到底部，且-newY大于最后一个元素的上限
            this.currentIndex = listHeight.length - 2;
        }
    },
    methods:{
        onShortcutTouchStart(e){
            this.touch.y1 = e.changedTouches[0].pageY;//记录滑动起始值
            let index = utils.getData(e.changedTouches[0].target,"index");
            index = Number(index);
            this.touch.index = index;//记录第一次点击时的位置
            this.$refs.listview.scroll.scrollToElement(this.$refs.listGroup[index],0);
            //点击滚动到相应的位置
        },
        onShortcutTouchMove(e){
            this.touch.y2 = e.changedTouches[0].pageY;
            let darta = (this.touch.y2 - this.touch.y1)/this.touch.shortCutHeight ; 
                darta = Math.floor(darta);//计算滑动的偏移 滑动了几个小导航
            let index2 = this.touch.index + darta;//就是要滑动到的位置
            if(index2<0){ //判断边界
                index2 = 0;
            }
            if(index2 > this.listHeight - 2 ){
                index2 = this.listHeight - 2;
            }
            this.$refs.listview.scroll.scrollToElement(this.$refs.listGroup[index2],0);
            //在小导航处滑动 后 滚动到的哪个位置
        },
        onscroll(pos){
            this.scrollY = pos.y;
        },
        calculateHeight(){ //计算出每个group高度对应的位置
            this.heightList = [];//记录个group的顶部高度 来判断在哪个区间 属于哪个索引 实现联动
            let list = this.$refs.listGroup;
            let height = 0;
            this.heightList.push(height);//第一个的高度是0开始的
            list.forEach(item => {
                height +=Number(item.clientHeight);
                this.heightList.push(height)
            });
        },
        cliceItem(item){ //触发点击事件
            this.$emit("clickItem",item);
        },
        handlePlaylist(playList){ //解决小播放器遮挡住列表的问题
            if(playList.length > 0){
                this.$refs.listview.$el.children[0].style.paddingBottom="10vh";
                this.$refs.listview.refresh();
            }else{
                this.$refs.listview.$el.children[0].style.paddingBottom="0";
                this.$refs.listview.refresh();
            }
         }
    }
}
</script>
<style lang="less" scoped>
@import '../../assets/styles/css/varibal.less';
    .scroll{
        // height: 9.8rem;
        height: 86.6vh;
        overflow: hidden;
        position: relative;
        .list-group{
            .title{
                height: .6rem;
                line-height: .6rem;;
                font-size: @font-size-small;
                color: @color-text-l;
                background: @color-highlight-background;
                padding-left: .3rem;
            }
            .item-box{
                .item{
                    height: 1.4rem;
                    display: flex;
                    flex-flow: row nowrap;
                    align-items: center;
                    padding: .11rem .4rem;
                    box-sizing: border-box;
                    .imgbox{
                         height: 1rem;
                        width: 1rem;
                        border-radius: 50%;
                        overflow: hidden;
                    }
                    img{
                        height: 1rem;
                        width: 1rem;
                    }
                    span{
                        margin-left: .4rem;
                        color: @color-text-l;
                        font-size: @font-size-medium;
                    }
                    &:first-child{
                        margin-top: .2rem;
                    }
                }
            }
        }
        .list-shortcut{
            position: absolute;
            z-index: 300;
            right: 0;
            top: 50%;
            transform: translateY(-50%);
            width: 20px;
            padding: 20px 0;
            border-radius: 10px;
            text-align: center;
            background: @color-background-d;
            font-family: Helvetica;
            .shotitem{
                padding: 3px;
                line-height: 1;
                color: @color-text-l;
                font-size: @font-size-small;
                &.current{
                color: @color-theme;
                }
            }
        }
        .list-fixed{
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            .fixed-title{
                height: .6rem;
                line-height: .6rem;;
                font-size: @font-size-small;
                color: @color-text-l;
                background: @color-highlight-background;
                padding-left: .3rem;
            }
       }
    }
</style>