<template>
    <scroll class="scroll" :data="list">
        <div class="suggest-box">
            <ul class="list">
                <li @click="selectItem(item)" class="suggest-item" v-for="(item,index) in list" :key="index">
                    <div class="icon">
                        <i class="iconfont icon-mobile"></i>
                    </div>
                    <div class="name">
                        <p class="text">{{item[0]}}</p>
                    </div>
                </li>
            </ul>
            <no-reslut :isShow="noSuggest"/>
        </div>
    </scroll>
</template>
<script>
import SearchApi from '../../api/searchApi';
import Scroll from '../../components/scroll/ScrollView';
import {throttle} from '../../assets/utils/utils';
import noReslut from '../../components/no-result/noReslut';
export default {
    components:{
        Scroll,
        noReslut
    },
    props:{
        keys:{
            type:String,
            default:""
        }
    },
    data(){
        return{
            list:[],
            noSuggest:false
        }
    },
    created(){
        SearchApi.getSearchList(this.keys).then((res)=>{
            this.list = res.data.data;
        });
        this.$watch("keys",throttle((newKey)=>{
            SearchApi.getSearchList(newKey).then((res)=>{
            this.list = res.data.data;
            console.log();
            let newList = this.list.map((item,index)=>{
                let arr = item.split("\n");
                let temp = arr[0].split("=");
                arr.splice(0,1,temp[1]);
                return arr;
            });
            this.list = newList;
            if(this.list.length==0){
                this.noSuggest = true;
            }else{
                this.noSuggest = false;
            }
        });
        },300))
    },
    methods:{
        selectItem(item){
            this.$emit("selectItem",item);
        }
    }
}
</script>
<style lang="less" scoped>
@import '../../assets/styles/css/varibal.less';
@import '../../assets/styles/css/mixin.less';
.scroll{
    height: 71.6vh;
    width: 100%;
    overflow: hidden;
}
.suggest-box{
    .list{
    width: 100%;
    .suggest-item{
        height: 7vh;
        display: flex;
        align-items: center;
        padding-left: .5rem;
        .icon{
            flex: 0 0 30px;
             width: 30px;
            font-size: 14px;
            color: @color-text-d;
        }
        .name{
            flex: 1;
            font-size: @font-size-medium;
            color: @color-text-d;
            overflow: hidden;
            .text{
                .no-wrap();
                }
        }
    }
  }

}

</style>