<template>
    <div class="h-box">
        <div class="img"></div>
        <h3>Chicken Music</h3>
        <i class="iconfont icon-yonghu"></i>
    </div>
</template>
<script>
export default {
}
</script>
<style lang="less" scoped>
@import '../../assets/styles/css/mixin.less';
@import '../../assets/styles/css/varibal.less';
    .h-box{
        // height: .80rem;
        height: 6.7vh;
        display: flex;
        align-items: center;
        position: relative;
    }
    .img{
        height: .60rem;
        width:.60rem;
        background-image: url('../../assets/image/logo@2x.png');
        background-size: contain;
        background-origin: convert;
        background-repeat: no-repeat;
        position: absolute;
        left: 1.9rem;
    }
    h3{
        font-size: @font-size-large;
        color: @color-theme;
        position: absolute;
        left: 2.6rem;
    }
    .icon-yonghu{
        font-size: @font-size-large;
        color: @color-theme;
        position: absolute;
        right: 5px;
    }
</style>