<template>
  <div class="search-list" v-show="searches.length">
    <transition-group name="list" tag="ul">
      <li :key="item" class="search-item" @click="selectItem(item)" v-for="item in searches">
        <span class="text">{{item}}</span>
        <span class="icon" @click.stop="deleteOne(item)">
          <i class="icon-delete iconfont icon-guanbicuowu"></i>
        </span>
      </li>
    </transition-group>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    props: {
      searches: {
        type: Array,
        default: []
      }
    },
    methods: {
      selectItem(item) {
        this.$emit('select', item)
      },
      deleteOne(item) {
        this.$emit('delete', item)
      }
    }
  }
</script>

<style lang="less" scoped>
@import '../../assets/styles/css/varibal.less';
  .search-list{
      .search-item{
        display: flex;
        align-items: center;
        height: 40px;
        overflow: hidden;
        &.list-enter-active, &.list-leave-active{
            transition: all 0.1s;
        }
        &.list-enter, &.list-leave-to{
            height: 0;
        }
        .text{
            flex: 1;
            font-size: @font-size-medium;
            color: @color-text-l;
        }
        .icon{
            .icon-delete{
            font-size: @font-size-small;
            color: @color-text-d;
            }
        }
    }
  }
</style>