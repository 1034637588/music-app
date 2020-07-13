<template>
    <div class="progress-circle">
        <svg xmlns="http://www.w3.org/2000/svg" :width="radius" :height="radius" viewBox="0 0 100 100" version="1.1">
            <circle class="progress-background" cx="50" cy="50" r="50" fill="transparent"/>
            <circle class="progress-bar" cx="50" cy="50" r="50"
            fill="transparent" :stroke-dasharray="dasharray"  :stroke-dashoffset="dashoffset"/>
        </svg>
        <slot></slot>
    </div>
</template>
<script>
export default {
    props:{
        radius:{
            type:Number,
            default:50
        },
        percent:{
            type:Number,
            default:0
        }
    },
    data(){
        return{
            dasharray:Math.PI * 100
        }
    },
    computed:{
        dashoffset(){
            return (1-this.percent) * this.dasharray;
        }
    }
}
</script>
<style lang="less" scoped>
@import '../../assets/styles/css/varibal.less';
.progress-circle{
    position: relative;
    circle{
        stroke-width: 8px;
        transform-origin: center;
        &.progress-background{
            transform:scale(0.9);
            stroke:@color-theme-d;
        }
         &.progress-bar{
            transform:rotate(-90deg) scale(0.9);
            stroke: @color-theme;
        }
    }
}
</style>