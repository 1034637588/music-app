<template>
    <div ref="wrapper">
        <slot></slot>
    </div>
</template>
<script>
import BScroll from 'better-scroll';
export default {
    props:{
        probeType:{
            type: Number,
            default:1 //当 probeType 为 1 的时候，会非实时（屏幕滑动超过一定时间后）派发scroll 事件；当 probeType 为 2 的时候，会在屏幕滑动的过程中实时的派发 scroll 事件；当 probeType 为 3 的时候，不仅在屏幕滑动的过程中，而且在 momentum 滚动动画运行过程中实时派发 scroll 事件。如果没有设置该值，其默认值为 0，即不派发 scroll 事件。
        },
        click:{
            type:Boolean,
            default:true
        },
        data:{
            type:Array,
            default:null
        },
        listenScroll:{
            type:Boolean,
            default:false
        }

    },
    mounted(){
        setTimeout(() => {
        this._initScroll();
        }, 20);
    },
    methods:{
        _initScroll(){
            if(!this.$refs.wrapper){
                return;
            }
            this.scroll = new BScroll(this.$refs.wrapper,{
                scrollX: false,
                scrollY: true,
                probeType:this.probeType,
                click:this.click
            });
            if(this.listenScroll){
                let _this = this; //因为这个on默认会把this改成scroll本身
                this.scroll.on('scroll',(pos)=>{
                    _this.$emit("scroll",pos);
                })
            }
            if(this.listenScroll){
                let _this = this; //因为这个on默认会把this改成scroll本身
                this.scroll.on('scrollEnd',(pos)=>{
                    if (this.scroll.y <= (this.scroll.maxScrollY + 50)) {
                        this.$emit('scrollToEnd')
                    }
                })
            }
        },
        enable(){
            this.scroll && this.scroll.enable();
        },
        disable(){
            this.scroll && this.scroll.disable();
        },
        refresh(){
            this.scroll && this.scroll.refresh();
            console.log("重新加载scroll")
        },
        scrollTo(){
            this.scroll && this.scroll.scrollTo.apply(this.scroll,arguments);
        },
        scrollToElement(){
            this.scroll && this.scroll.scrollToElement.apply(this.scroll,arguments);
        }
    },
    watch:{
        data(){
            setTimeout(() => {
                this.refresh()
            }, 20);
        }
    }
}
</script>