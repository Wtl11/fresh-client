<template>
  <div class="delivery-order">
    <navigation-bar title="配送订单"></navigation-bar>
    <div class="scroll-view2" v-if="tabList.length" id="scrollView">
      <div class="under-line" :style="{left: move + 'px'}"></div>
      <div v-for="(item, index) in tabList" :class="tabIndex === index ? 'item-active' : ''" :key="index" class="item" @click="_setTab(index, item,$event)">
        {{item.name}}
      </div>
    </div>
    <scroll-view class="big-box">
      <div class="order-big-box" :style="{'transform': ' translateX('+ -(tabIndex * width) +'px)'}">
        <!--售后申请-->
        <div class="order-box" v-for="(item, index) in orderList" :key="index">
          <div class="order-status">
            <p class="order-text">配送单号：PS5554225530001254</p>
            <p class="order-status-str">待收货</p>
          </div>
          <div class="goods-header">
            <p class="goods-text">商品信息</p>
            <p class="goods-num">商品数量</p>
          </div>
          <div class="goods-list">
            <div class="goods-item">
              <div class="goods-detail">
                <img src="" class="goods-img" mode="aspectFill">
                <div class="goods-content">
                  <div class="goods-title">超值特惠 智利J级车厘子250g超值特惠 智利J级车厘子250g</div>
                  <div class="goods-money">3.8</div>
                </div>
                <div class="goods-num-box">x<span class="goods-num">1</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </scroll-view>
    <div class="bulk-pickup">
      <p class="bulk-pickup-text">商品共计:</p>
      <p class="bulk-pickup-num">20件</p>
      <p class="bulk-pickup-btn">批量提货</p>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import NavigationBar from '@components/navigation-bar/navigation-bar'

  const PAGE_NAME = 'DELIVERY_ORDER'

  export default {
    name: PAGE_NAME,
    data() {
      return {
        tabIndex: 0,
        tabList: [{name: '12月10日'}, {name: '9日'}, {name: '8日'}, {name: '7日'}, {name: '6日'}, {name: '5日'}],
        move: 39.7,
        scrollMove: 0,
        width: 0,
        orderList: [[], [], [], [], [], []]
      }
    },
    onLoad() {
      this.$wx.getSystemInfo({
        success: (res) => {
          this.width = res.screenWidth
        }
      })
    },
    methods: {
      _setTab(index, item, e) {
        let query = wx.createSelectorQuery()
        query.selectAll('.item').boundingClientRect()
        query.exec((res) => {
          this.move = e.target.offsetLeft + (res[0][index].width - 30) / 2
        })
        this.tabIndex = index
      }
    },
    components: {
      NavigationBar
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"

  .delivery-order
    background: $color-background
    min-height: 100vh

  .scroll-view2
    padding: 0 6px
    background: $color-white
    padding-top: 0px
    height: 40px
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
      color: $color-text-sub
      height: 100%
      line-height: 40px
      font-size: 15px
      white-space: nowrap
      padding: 0 14px
      text-align: center
      display: inline-block
      position: relative
      transform-origin: 50%
      font-family: $font-family-regular
      transition: all 0.3s
    .item-active
      font-size: $font-size-16
      font-family: $font-family-medium
      color: $color-text-main

  .under-line
    position: absolute
    bottom: 0
    left: 20px
    height: 3px
    width: 30px
    background: $color-main
    transition: all 0.3s

  .big-box
    margin-top: 12px
    height: 82vh
    width: 100vw
    overflow: hidden
    .order-big-box
      width: 600vw
      display: flex
      transform: translateX(0)
      transition: all 0.3s
    .order-box
      width: 100vw

  .order-status
    background: #FAFAFA
    font-size: $font-size-14
    font-family: $font-family-regular
    display: flex
    align-items: center
    justify-content: space-between
    padding: 0 12px
    box-sizing: border-box
    height: 45px
    .order-text
      color: $color-text-main
    .order-status-str
      color: $color-money

  .goods-header
    background: $color-white
    font-size: $font-size-14
    font-family: $font-family-regular
    color: $color-text-sub
    display: flex
    align-items: center
    justify-content: space-between
    padding: 0 12px
    box-sizing: border-box
    height: 45px
    border-bottom-1px($color-line)

  .goods-list
    background: $color-white
    padding: 0 12px
    box-sizing: border-box
    .goods-item
      padding: 15.5px 0
      box-sizing: border-box
      border-bottom-1px($color-line)
      &:last-child
        border-none()
      .goods-detail
        display: flex
        width: 100%
        box-sizing: border-box
        position: relative
        .goods-img
          background: $color-background
          min-width: 60px
          min-height: 60px
          height: 60px
          width: 60px
        .goods-content
          margin-left: 10px
          width: 66%
          display: flex
          flex-direction: column
          height: 60px
          font-family: $font-family-regular
          justify-content: space-between
          .goods-title
            min-height: 15px
            font-size: $font-size-14
            color: $color-text-main
            no-wrap()
          .goods-money
            height: 14px
            font-size: $font-size-14
            color: $color-text-main
        .goods-num-box
          font-family: $font-family-medium
          font-size: $font-size-14
          col-center()
          right: 10px
          .goods-num
            margin-left: 1.5px
            font-size: $font-size-16

  .bulk-pickup
    position: fixed
    bottom: 0
    left: 0
    width: 100vw
    display: flex
    align-items: center
    font-size: $font-size-16
    color: $color-text-main
    font-family: $font-family-regular
    box-shadow: 0 -5px 10px 0 rgba(0, 0, 0, 0.03)
    height: 55px
    justify-content: flex-end
    background: $color-white
    box-sizing: border-box
    padding: 0 12px
    .bulk-pickup-num
      font-family: $font-family-medium
      color: $color-money
      margin-left: 5px
    .bulk-pickup-btn
      border-radius: 15px
      background: $color-main
      margin-left: 15px
      padding: 0 12px
      line-height: 30px
      color: $color-white
      height: 30px
      font-size: $font-size-14
      &:active
        color: #E1F2C9
        background: #9DD44C
</style>
