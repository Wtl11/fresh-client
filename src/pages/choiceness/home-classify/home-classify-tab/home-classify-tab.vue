<template>
  <scroll-view
    class="home-classify-tab"
    :style="styles"
    :class="{active: !isShow}"
    v-if="tabList.length"
    :id="id"
    :scroll-into-view="viewToItem" scroll-x
  >
    <div
      v-for="(item, index) in tabList"
      :class="tabIndex === index ? 'item-active'  : ''"
      :key="index"
      class="item"
      :id="'item'+index"
      @click="changeTabHandle(index, item.id, $event)"
    >
      {{item.name}}
      <div class="item-under-line">
        <div class="line" :class="'corp-' + corpName + '-bg'"></div>
      </div>
    </div>
  </scroll-view>
</template>

<script type="text/ecmascript-6">
  const COMPONENT_NAME = 'HOME_CLASSIFY_TAB'

  export default {
    name: COMPONENT_NAME,
    props: {
      id: {
        type: String,
        default: ''
      },
      isShow: {
        type: Boolean,
        default: true
      },
      tabList: {
        type: Array,
        default: () => []
      },
      viewToItem: {
        type: String,
        default: 'item0'
      },
      styles: {
        type: String,
        default: ''
      },
      tabIndex: {
        type: Number,
        default: 0
      }
    },
    methods: {
      changeTabHandle(index, id, e) {
        this.$emit('changeTab', index, id, e)
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  $tab-height=45px
  @import "~@designCommon"

  .home-classify-tab
    display: block
    height: $tab-height
    width: 100vw
    background: $color-white
    box-shadow: 0 1px 8px 0 rgba(55, 75, 99, 0.04)
    white-space: nowrap
    box-sizing: border-box
    transform: translateX(0)
    transition: all 0
    &.active
      display :none
    ::-webkit-scrollbar
      width: 0
      height: 0
      color: transparent
    .item
      height: $tab-height
      line-height: @height
      white-space: nowrap
      padding: 0 12.5px
      font-family: $font-family-regular
      font-size: $font-size-14
      color: $color-text-main
      text-align: center
      display: inline-block
      position: relative
      /*transition: all 0.3s*/
      min-width: 66px
      box-sizing: border-box
      transform-origin: 50%
    .item-active
      font-family: $font-family-medium
      font-size: $font-size-16
      .item-under-line
        position: absolute
        width: 100%
        height: 3px
        left: 0
        bottom: 0
        .line
          width: 30px
          height: 3px
          margin: 0 auto
          border-radius: 3px
</style>
