<template>
  <div class="delivery-order">
    <navigation-bar title="配送订单"></navigation-bar>
    <div class="noting" v-if="showMore">
      <div class="noting-img"><img class="img" :src="imageUrl + '/yx-image/group/pic-kong@2x.png'"></div>
      <div class="txt">空空如也</div>
    </div>
    <div class="scroll-view2" id="scrollView" v-if="!showMore">
      <div class="under-line" :style="{left: move + 'px'}"></div>
      <div v-for="(item, index) in orderList" :class="tabIndex === index ? 'item-active' : ''" :key="index" class="item" @click="_setTab(index, item,$event)">
        {{tabIndex === index ? item.month_day : item.day}}
      </div>
    </div>
    <div class="big-box">
      <div class="order-big-box" :style="{'transform': ' translateX('+ -(tabIndex * width) +'px)'}">
        <!--售后申请-->
        <div class="order-box" v-for="(item, index) in orderList" :key="index">
          <div class="order-status">
            <p class="order-text">配送单号：{{item.order_sn}}</p>
            <p class="order-status-str">{{item.status_str}}</p>
          </div>
          <div class="goods-header">
            <p class="goods-text">商品信息</p>
            <p class="goods-num">商品数量</p>
          </div>
          <scroll-view class="goods-list" :style="{'height': scrollHeight + 'px'}" scroll-y>
            <div class="goods-item" v-for="(good, idx) in item.detail_list" :key="idx">
              <div class="goods-detail">
                <img :src="good.goods_cover_image" class="goods-img" mode="aspectFill">
                <div class="goods-content">
                  <div class="goods-title">{{good.goods_name}}</div>
                  <div class="goods-money">{{good.price}}<span class="small">元</span></div>
                </div>
                <div class="goods-num-box">x<span class="goods-num">{{good.num}}</span></div>
              </div>
            </div>
            <div class="noting" v-if="item.detail_list && !item.detail_list.length">
              <div class="noting-img"><img class="img" :src="imageUrl + '/yx-image/group/pic-kong@2x.png'"></div>
              <div class="txt">空空如也</div>
            </div>
          </scroll-view>
        </div>
      </div>
    </div>
    <div class="bulk-pickup" v-if="!showMore">
      <p class="bulk-pickup-text">商品共计:</p>
      <p class="bulk-pickup-num">{{orderList[tabIndex].num}}件</p>
      <p class="bulk-pickup-btn" v-if="orderList[tabIndex].status === 2" @click="_openDialog">确认提货</p>
    </div>
    <dialog-model ref="dialog" @confirm="_confirm"></dialog-model>
  </div>
</template>

<script type="text/ecmascript-6">
  import NavigationBar from '@components/navigation-bar/navigation-bar'
  import DialogModel from '@components/dialog-model/dialog-model'
  import API from '@api'

  const PAGE_NAME = 'DELIVERY_ORDER'

  export default {
    name: PAGE_NAME,
    data() {
      return {
        tabIndex: 0,
        move: 39.7,
        scrollMove: 0,
        width: 0,
        orderList: [[], [], [], [], [], []],
        scrollHeight: 0,
        showMore: false
      }
    },
    async onLoad() {
      let data = this.$wx.getSystemInfoSync()
      this.$wx.getSystemInfo({
        success: (res) => {
          this.width = res.screenWidth
          this.scrollHeight = res.screenHeight - 241 - data.statusBarHeight
        }
      })
      await this._getDelivery()
    },
    methods: {
      _setTab(index, item, e) {
        if (this.tabIndex === index) {
          return
        }
        this.tabIndex = index
        let query = wx.createSelectorQuery()
        query.selectAll('.item').boundingClientRect()
        query.selectAll('.item-active').boundingClientRect()
        query.exec((res) => {
          this.move = index === 0 ? e.target.offsetLeft + (res[1][0].width - 30) / 2 : e.target.offsetLeft - res[0][index].width / 2 + (res[1][0].width - 30) / 2 - 6
        })
      },
      async _getDelivery() {
        let res = await API.Leader.deliveryList(false)
        if (res.error !== this.$ERR_OK) {
          this.showMore = true
          return
        }
        this.orderList = res.data
        this.showMore = !this.orderList.length
      },
      _openDialog() {
        this.$refs.dialog.show({msg: '确定已清点所有商品？'})
      },
      // 确认提货
      async _confirm() {
        let res = await API.Leader.deliveryConfirm(this.orderList[this.tabIndex].id)
        this.$wechat.showToast(res.message)
        if (res.error !== this.$ERR_OK) {
          return
        }
        await this._getDelivery()
      }
    },
    components: {
      NavigationBar,
      DialogModel
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"

  .delivery-order
    background: $color-background
    min-height: 100vh
    box-sizing: border-box

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
      width: 16vw
      box-sizing border-box
      text-align: center
      display: inline-block
      position: relative
      font-family: $font-family-regular
      transition: all 0.3s
      transform-origin: center, center
    .item-active
      width: 25.8vw
      box-sizing: border-box
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
    background: $color-background
    box-sizing: border-box
    .goods-item
      background: $color-white
      padding: 15.5px 12px
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
            .small
              font-size: $font-size-11
              margin-left: 1.5px
        .goods-num-box
          font-family: $font-family-medium
          font-size: $font-size-14
          col-center()
          right: 10px
          .goods-num
            margin-left: 1.5px
            font-size: $font-size-16

  .bulk-pickup
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

  .noting
    text-align: center
    padding-top: 106px
    .noting-img
      width: 116px
      height: 110px
      margin: 0 auto 15px
      .img
        display: block
        width: 100%
        height: 100%
    .txt
      font-family: $font-family-regular
      font-size: $font-size-14
      color: $color-text-sub
</style>
