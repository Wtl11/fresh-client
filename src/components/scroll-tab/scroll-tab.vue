<template>
  <div class="scroll-view2" v-if="tabList1.length" id="scrollView" :style="{'transform': 'translateX('+ -scrollMove + 'px)'}" @touchstart="_getNowLeft" @touchmove="_setMove">
    <div class="under-line" :style="{left: move + 'px', lineStyle}"></div>
    <div v-for="(item, index) in tabList1" :style="tabIndex === index ? (boxStyle + activeStyle)  : boxStyle" :key="index" class="item" :class="{'item-last': isMask && index + 1 === tabList1.length}" :id="'item'+index" @click="_changeTab(index, item.id, $event)">
      {{item.name}}
      <!--另一种下划线-->
      <!--<span v-if="showLine" :style="lineStyle" :class="{'active':tabIndex === index}" class="line"></span>-->
    </div>
    <!--<div class="liner" v-if="isMask" :style="{'top': pageHeadH + 'px'}"></div>-->
  </div>
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
        move: 12.75,
        scrollMove: 0,
        allWidth: 0,
        nowLeft: 0,
        paddingLeft: this.isMask ? PADDING_LEFT : 0
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
        // if (!this.arrWidth.length) {
        this.getWidth(index, id, e)
        // }
        // this.infoMove(index, id, e)
      },
      infoMove(index, id, e) {
        this.tabIndex = index
        let width = 0
        for (let i in this.arrWidth) {
          if (+i < index) {
            width += this.arrWidth[i]
          } else if (+i === index) {
            width += (this.arrWidth[i] - 30) / 2
            break
          }
        }
        this.move = width
        if (this.allWidth <= SCREEN_WIDTH) {
          this.$emit('changeTab', id)
          return
        }
        let target = e.target.offsetLeft - (SCREEN_WIDTH - this.arrWidth[index]) / 2
        this.scrollMove = target < 0 ? 0 : Math.abs(target) >= this.allWidth - SCREEN_WIDTH ? this.allWidth - SCREEN_WIDTH + this.paddingLeft : target
        this.$emit('changeTab', id)
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

  .scroll-view
    padding-top: 50px
    width: 100vw
    position: relative
    height: 44px
    display: flex
    flex-wrap: nowrap
    ::-webkit-scrollbar
      width: 0
      height: 0
      color: transparent
    .item
      white-space: nowrap
      width: 70px
      text-align: center
      display: inline-block
      position: relative
      transition: all 0.3s

  .scroll-view2
    padding-top: 0px
    height: 44px
    width: 100vw
    background: $color-white
    box-shadow: 0 1px 8px 0 rgba(55, 75, 99, 0.04)
    min-width: 100vw
    white-space: nowrap
    box-sizing: border-box
    transform: translateX(0)
    transition: all 0.3s
    ::-webkit-scrollbar
      width: 0
      height: 0
      color: transparent
    .item
      white-space: nowrap
      padding: 0 20px
      text-align: center
      display: inline-block
      position: relative
      transition: all 0.3s
      transform-origin: 50%

  .under-line
    position: absolute
    top: 0
    transform: translate3d(0, 42px, 0)
    left: 20px
    height: 20px
    width: 30px
    z-index: 11111
    background: $color-main
    transition: all 0.3s

  .liner
    width: 40px
    height: 44px
    background-image: linear-gradient(-90deg, #fff 37%, rgba(255, 255, 255, 0.00) 79%)
    position: fixed
    right: 0
    top: 0
</style>
