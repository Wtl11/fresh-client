<template>
  <!--<scroll-view class="scroll-view2" v-if="tabList1.length" id="scrollView" :scroll-into-view="" :style="{'transform': 'translateX('+ -scrollMove + 'px)'}" @touchstart="_getNowLeft" @touchmove="_setMove">-->
  <scroll-view class="scroll-view2" v-if="tabList1.length" id="scrollView" :scroll-into-view="viewToItem" scroll-x scroll-with-animation>
    <div class="under-line" :style="{left: move + 'px', width: arrWidth[tabIndex] + 'px' }"></div>
    <div v-for="(item, index) in tabList1" :class="tabIndex === index ? 'item-active'  : ''" :key="index" class="item" :id="'item'+index" @click="_changeTab(index, item.id, $event)">
      {{item.name}}
    </div>
  </scroll-view>
  <!--
  **用法**
  <scroll-tab
    @changeTab="changeTab"
    :tabList="tabList"
    :showLine="true"
    :autoWidth="true"
    activeStyle="color:#f94c5f;"
    lineStyle="border-bottom-color: #f94c5f;"
    :boxStyle='color: #666; height: 40px; line-height: 40px;'
  ></scroll-tab>
  -->
</template>

<script>
  const SCREEN_WIDTH = wx.getSystemInfoSync().screenWidth
  const PADDING_LEFT = 20
  export default {
    name: 'scrollTab',
    props: {
      tabList: { // tab数组
        type: Array,
        default: {
          rate: new Array(5)
        }
      },
      boxStyle: {
        type: String,
        default: {
          rate: 'color: #1f1f1f; height: 40px; line-height: 40px;'
        }
      },
      showLine: {
        type: Boolean,
        default: {
          rate: true
        }
      },
      lineStyle: {
        type: String,
        default: {
          rate: 'background: #f94c5f'
        }
      },
      autoWidth: {
        type: Boolean,
        default: {
          rate: false
        }
      },
      activeStyle: {
        type: String,
        default: {
          rate: 'color:#f94c5f;'
        }
      },
      infoBorderWidth: { // 初始化边框宽度
        type: Number,
        default: 0
      },
      isMask: {
        type: Boolean, // 是否展示最右端遮罩
        default: true
      },
      infoTabIndex: {
        type: Number,
        default: 0
      }
    },
    watch: {
      tabList(news) {
        this.tabList1 = news
        setTimeout(() => {
          this.getWidth('', '', '', false)
        }, 100)
      },
      infoTabIndex(newVal) {
        this.tabIndex = newVal
      }
    },
    data() {
      return {
        // tabList: ['菜单1', '菜单2', '菜单3', '菜单4', '菜单5', '菜单6', '菜单7', '菜单8', '菜单9', '菜单10', '菜单11'],
        tabList1: [],
        scrollLeft: 0,
        screenWidth: 0,
        tabIndex: this.infoTabIndex,
        lastItemRight: 0,
        scrollLeftTemp: 0,
        selfScroll: false,
        botLineWidth: this.infoBorderWidth,
        lineLeft: 0,
        arrWidth: [],
        width: 0,
        move: 0,
        scrollMove: 0,
        allWidth: 0,
        nowLeft: 0,
        paddingLeft: this.isMask ? PADDING_LEFT : 0,
        viewToItem: 'item0'
      }
    },
    onLoad() {
    },
    methods: {
      infoTab() {
        this.tabIndex = 0
        this.move = 12.75
        this.scrollMove = 0
      },
      _getLeft(e) {
        // console.log(e.target)
      },
      getWidth(index, id, e, run = true) {
        this.allWidth = 0
        let query = wx.createSelectorQuery()
        query.selectAll('.item').boundingClientRect()
        query.exec((res) => {
          this.arrWidth = res[0].map((item, index) => {
            this.allWidth += item.width
            return item.width
          })
          if (run) {
            this.infoMove(index, id, e)
          }
        })
      },
      async _changeTab(index, id, e) {
        let number = index * 1 === 0 ? 1 : index
        if (this.tabIndex > index) {
          number--
        } else if (this.tabIndex < index) {
          number++
        }
        console.log(this.tabIndex, index)
        this.viewToItem = `item${number}`
        console.log(e.target.offsetLeft)
        this.tabIndex = index
        this.move = e.target.offsetLeft
        this.$emit('changeTab', id)
      },
      infoMove(index, id, e) {
      },
      _getNowLeft(e) {
        this.nowLeft = e.target.offsetLeft
      },
      _setMove(e) {
        let target = e.clientX - this.nowLeft
        let w = this.scrollMove - target
        if (w < 0) {
          this.scrollMove = 0
          return
        }
        if (Math.abs(w) > this.allWidth - SCREEN_WIDTH) {
          this.scrollMove = this.allWidth - SCREEN_WIDTH + this.paddingLeft
          return
        }
        this.scrollMove = w
        // console.log(this.scrollMove)
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"


  .scroll-view2
    display: block
    margin: 23px auto 10px
    height: 33px
    width: 93.6vw
    background: $color-white
    box-shadow: 0 1px 8px 0 rgba(55, 75, 99, 0.04)
    white-space: nowrap
    box-sizing: border-box
    transform: translateX(0)
    position: relative
    transition: all 0.3s
    border-bottom: 2px solid $color-main
    ::-webkit-scrollbar
      width: 0
      height: 0
      color: transparent
    .item
      height: 100%
      line-height: 33px
      white-space: nowrap
      padding: 0 7px
      font-family: $font-family-medium
      font-size: $font-size-14
      color: $color-text-main
      text-align: center
      display: inline-block
      position: relative
      transition: all 0.3s
      min-width: 70px
      box-sizing: border-box
      transform-origin: 50%
    .item-active
      color: $color-white

  .under-line
    position: absolute
    bootom: 0
    left: 0
    width: 30px
    background: $color-main
    transition: all 0.3s
    height: 33px
    border-radius: 8px 8px 0px 0px

  .liner
    width: 40px
    height: 44px
    background-image: linear-gradient(-90deg, #fff 37%, rgba(255, 255, 255, 0.00) 79%)
    position: fixed
    right: 0
    top: 0
</style>
