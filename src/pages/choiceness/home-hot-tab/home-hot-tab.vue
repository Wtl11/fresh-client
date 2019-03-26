<template>
  <scroll-view
    v-if="isShowTab"
    :style="{top: statusBarHeight + 44 + 'px'}"
    :scroll-left="scrollLeft"
    scroll-with-animation
    class="home-hot-tab"
    scroll-x
  >
    <div
      v-for="(child, idx) in hotTabList"
      :key="idx"
      class="item"
      @click="changeHandle(child, idx)"
    >{{child.name}}</div>
    <!--<div-->
      <!--v-for="(item, index) in tabList"-->
      <!--:class="tabIndex === index ? 'item-active'  : ''"-->
      <!--:key="index"-->
      <!--class="item"-->
      <!--:id="'item'+index"-->
      <!--@click="_changeTab(index, item.id, $event)"-->
    <!--&gt;-->
      <!--{{item.name}}{{index}}-->
      <!--<div class="item-under-line">-->
        <!--<div class="line" :class="'corp-' + corpName + '-bg'"></div>-->
      <!--</div>-->
    <!--</div>-->
  </scroll-view>
</template>

<script type="text/ecmascript-6">
  const COMPONENT_NAME = 'HOME_HOT_TAB'

  export default {
    name: COMPONENT_NAME,
    props: {
      isShowTab: {
        type: Boolean,
        default: false
      },
      systemInfo: {
        type: Object,
        default: () => {}
      },
      hotTabList: {
        type: Array,
        default: () => []
      }
    },
    data() {
      return {
        viewToItem: 'item0',
        statusBarHeight: 20,
        tabIndex: 0,
        scrollLeft: 0
      }
    },
    onLoad() {
      this.statusBarHeight = this.systemInfo.statusBarHeight || 20
    },
    methods: {
      changeHandle(child, idx) {
        console.log(child, idx)
        this.scrollLeft = child.left + 375 / 2
      },
      async _changeTab(index, id, e) {
        console.log(index, id, e)
        if (this.tabIndex * 1 === index * 1) return
        let number = index * 1 === 0 ? 1 : index
        if (this.tabIndex > index) {
          if (index <= 3) {
            number = 0
          } else {
            number = index
          }
        } else if (this.tabIndex < index) {
          if (index <= 3) {
            number = 0
          } else {
            number = index
          }
        }
        this.viewToItem = `item${number}`
        this.tabIndex = index
        this.move = e.target.offsetLeft
        // this.classifyId = id
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@designCommon"

  .home-hot-tab
    display: block
    position: fixed
    z-index: 100
    left: 0
    height: 40px
    background: $color-white
    box-shadow: 0 1px 8px 0 rgba(55, 75, 99, 0.04)
    white-space: nowrap
    box-sizing: border-box
    transform: translate3d(0,0,0)
    ::-webkit-scrollbar
      width: 0
      height: 0
      color: transparent
    .item
      height: 100%
      line-height: 40px
      white-space: nowrap
      padding: 0 12.5px
      font-family: $font-family-regular
      font-size: $font-size-14
      color: $color-text-main
      text-align: center
      display: inline-block
      position: relative
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
