<template>
  <div class="commodity-certificates">
    <navigation-bar title="兑换券"></navigation-bar>
    <coupon-tab :tabList="tabList" :tabIndex="tabIndex" @change="changeHandle"></coupon-tab>
    <article class="big-box">
      <div class="scroll-wrapper"
           :style="{'transform': ' translateX('+ -(tabIndex * 100) +'vw)', width:  (tabList.length * 100) +'vw'}"
      >
        <scroll-view
          scroll-y
          class="scroll-item-wrapper"
          :style="{height: height + 'px'}"
          @scrolltolower="bindScrollToLower"
          v-for="(item, index) in tabList" :key="index"
        >
          <div class="coupon">
            <div v-for="(child, childIdx) in item.dataArray" :key="childIdx" :class="{'coupon-disable': child.status !== 1 }" class="coupon-item" @click="selectCoupon(child)">
              <section class="top-wrapper">
                <img class="top-bg-img" v-if="imageUrl" :src="imageUrl + '/yx-image/invitation/pic-couponbg_myzk1.png'">
                <div class="top-container">
                  <artilce class="left">
                    <div class="goods-box">
                      <img v-if="imageUrl && child.other_info" :src="child.other_info.goods_cover_image" class="goods-img" mode="aspectFill">
                      <span class="goods-price">0元兑换</span>
                    </div>
                  </artilce>
                  <article class="right">
                    <div class="title">
                      <!--<p class="use-type" :style="{color, borderColor: color}">{{child.range_type_str}}</p>-->
                      <p class="txt goods-name">{{child.coupon_name}}</p>
                    </div>
                    <p class="condition">有效期至 {{child.end_at}}</p>
                    <img class="lab-img" v-if="imageUrl && child.status === 2" :src="imageUrl + '/yx-image/2.3/pic-coupon_ygq.png'">
                    <img class="lab-img" v-if="imageUrl && child.status === 0" :src="imageUrl + '/yx-image/2.3/pic-coupon_ysy.png'">
                  </article>
                </div>
              </section>
              <div class="select" v-if="child.status === 1">
                立即兑换
              </div>
              <section class="middle-wrapper">
                <img class="middle-bg-img" v-if="imageUrl" :src="imageUrl + '/yx-image/2.3/pic-couponbg_myzk2.png'">
                <div class="middle-container">
                  <div class="middle-box" @click.stop="handleShowTip(childIdx)">
                    <aritlce class="title">
                      <p>使用说明</p>
                      <img class="down-img" :class="{'rotate': child.showTip}" mode="widthFix" v-if="imageUrl" :src="imageUrl + '/yx-image/2.3/icon-pressed_down@2x.png'">
                    </aritlce>
                    <!--<div class="middle-detail">-->
                    <!--<span class="middle-detail-text">查看此商品</span>-->
                    <!--<img class="detail-img" mode="widthFix" v-if="imageUrl" :src="child.status === 1 ? imageUrl + '/yx-image/invitation/icon-coupon_down@2x.png' : imageUrl + '/yx-image/invitation/icon-coupon_downs@2x.png'">-->
                    <!--</div>-->
                  </div>
                  <p v-if="child.showTip" class="explain">{{child.description}}</p>
                </div>
              </section>
              <section class="bottom-wrapper">
                <img class="bottom-bg-img" v-if="imageUrl" :src="imageUrl + '/yx-image/2.3/pic-couponbg_myzk3.png'">
              </section>
            </div>
            <is-active-empty v-if="item.isShowEmpty"></is-active-empty>
          </div>
        </scroll-view>
      </div>
    </article>

  </div>
</template>

<script type="text/ecmascript-6">
  import NavigationBar from '@components/navigation-bar/navigation-bar'
  import isActiveEmpty from '@components/is-active-empty/is-active-empty'
  // import Coupon from './coupon'
  import { isEmptyObject } from '@utils/common'
  import { orderComputed, orderMethods } from '@state/helpers'
  import API from '@api'
  import CouponTab from './coupon-tab/coupon-tab'
  import TabItem from './tab-item'

  const PAGE_NAME = 'COMMODITY_CERTIFICATES'

  export default {
    name: PAGE_NAME,
    components: {
      NavigationBar,
      isActiveEmpty,
      CouponTab
    },
    data() {
      return {
        choose: false,
        couponList: [],
        select: true,
        page: 1,
        isShowEmpty: false,
        lastPage: 1,
        tabList: [
          new TabItem({ text: '可用', status: '1', numberKey: 'goods_can_used_count' }),
          new TabItem({ text: '不可用', status: '0', numberKey: 'goods_cannot_used_count' })
        ],
        tabIndex: 0,
        height: 300
      }
    },
    async onShow() {
      this.choose = !!this.$mp.query.choose || false
      await this._getListNumber(false)
      await this._getLIst(true)
      // this.setCommodityItem({ sd: 'sdfsd' })
    },
    async onReachBottom() {
    },
    onLoad() {
      let res = this.$wx.getSystemInfoSync()
      this.height = res.screenHeight - 40 - 44 - res.statusBarHeight
    },
    computed: {
      ...orderComputed
    },
    watch: {
      commodityItem(newValue) {
        this.select = isEmptyObject(newValue)
      }
    },
    methods: {
      ...orderMethods,
      async bindScrollToLower() {
        if (this.tabList[this.tabIndex].page >= this.tabList[this.tabIndex].lastPage) {
          return
        }
        this.tabList[this.tabIndex].page++
        await this._getLIst(false)
      },
      // 获取头部数量
      _getListNumber(index = 0) {
        API.Coupon.getClientListNumber().then(res => {
          this.tabList = this.tabList.map(item => {
            item.number = res.data[item.numberKey]
            return item
          })
        })
      },
      // 切换tab
      changeHandle(item, index) {
        if (this.tabIndex === index) return
        this.tabIndex = index
        !this.tabList[this.tabIndex].dataArray.length && this._getLIst()
      },
      async _getLIst(isFirstLoad = false) {
        let res = await API.Coupon.getClientList({ status: this.tabList[this.tabIndex].status, page: this.tabList[this.tabIndex].page, tag_type: 1 }, isFirstLoad)
        if (res.error !== this.$ERR_OK) {
          this.$wechat.showToast(res.message)
          return
        }
        this.tabList[this.tabIndex].lastPage = res.meta.last_page
        if (this.tabList[this.tabIndex].page === 1) {
          this.tabList[this.tabIndex].dataArray = res.data
          this.tabList[this.tabIndex].isShowEmpty = !res.meta.total
        } else {
          this.tabList[this.tabIndex].dataArray = this.tabList[this.tabIndex].dataArray.concat(res.data)
        }
      },
      goGoodsDetail(item) {
        // wx.navigateTo({ url: `${this.$routes.main.GOODS_DETAIL}?id=${item.other_info.goods_id}&activityId=0&activityType=DEFAULT` })
      },
      handleShowTip(index) {
        let arr = JSON.parse(JSON.stringify(this.tabList[this.tabIndex].dataArray))
        arr[index].showTip = !arr[index].showTip
        this.tabList[this.tabIndex].dataArray = JSON.parse(JSON.stringify(arr))
      },
      selectCoupon(item) {
        if (item.status !== 1) return
        // 商品不可用时的吐司提示
        if (item.other_info.is_enable === 0) {
          this.$wechat.showToast(item.other_info.unusable_str)
          return
        }
        // 设置商品信息
        let arr = [item.other_info.goods_skus[0]]
        arr[0].num = 1
        let orderInfo = {
          goodsList: arr,
          total: arr[0].trade_price,
          deliverAt: item.other_info.delivery_at
        }
        this.setOrderInfo(orderInfo)
        this.setCommodityItem(item)
        wx.navigateTo({ url: `${this.$routes.main.SUBMIT_ORDER}?isFree=1` })
      }
    }
  }
</script>


<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@designCommon"

  .coupon-disable
    .goods-price
      background: rgba(17, 17, 17, 0.2) !important
    .middle-box
      .title
        color: #B7B7B7 !important
    .goods-name, .middle-detail-text
      color: #B7B7B7 !important

  .select
    col-center()
    width: 17.333vw
    text-align: center
    height: 6.4vw
    line-height: 6.4vw
    position: absolute
    background: $color-main
    color: $color-white
    right: 5.8333vw
    border-radius: 12px
    font-size: 3.2vw
    z-index: 1

  .commodity-certificates
    min-height: 100vh
    background: #f7f7f7
    box-sizing: border-box
    overflow-y: auto

  .select-coupon
    display: flex
    justify-content: space-between
    padding: 0 12px
    height: 50px
    align-items: center
    box-sizing: border-box
    background: $color-white
    .select-title
      font-size: $font-size-14
      color: #000000
      font-family: $font-family-regular
    .select-icon-box
      width: 20px
      height: 100%
      position: relative
      padding: 0 8px
    .select-icon
      all-center()
      right: 0
      box-sizing: border-box
      border-radius: 50%
      width: 20px
      height: @width
      opacity: 0
      transition: all 0.2s
      &.active
        opacity: 1

  .coupon
    padding-top: 1.8vw
    box-sizing: border-box

  .bottom-wrapper
    width: 100%
    position: relative
    .bottom-bg-img
      position: absolute
      display: block
      width: 100%
      height: 6.133333333333333vw

  .middle-wrapper
    width: 100vw
    position: relative
    min-height: 4vw
    overflow: hidden
    margin-top: -2px
    .middle-bg-img
      position: absolute
      display: block
      width: 100vw
    .middle-container
      position: relative
      padding-left: 6.4vw
      padding-right: @padding-left
      font-family: $font-family-regular
      font-size: 3.4666666666666663vw
      color: #1D2023
      .middle-box
        display: flex
        justify-content: space-between
      .title
        display: flex
        align-items: center
        justify-content: space-between
        width: 70.5px
        .down-img
          width: 12.5px
          height: 7px
          display: block
          transition: transform 0.3s
          transform: rotate(0deg)
          margin-top: 1px
          &.rotate
            transform: rotate(180deg)
      .explain
        transition: all 0.2s
        padding-top: 2.4vw
        font-size: 3.2vw
        line-height: 1.42
      .middle-detail-text
        color: #73C200
      .detail-img
        margin-left: 6px
        height: 12.5px
        width: 7px

  .top-wrapper
    width: 100%
    height: 28.5vw
    position: relative
    .top-bg-img
      position: absolute
      display: block
      width: 100%
      height: 100%
    .top-container
      position: relative
      padding-top: 1.866666666666667vw
      padding-left: 3.2vw
      padding-right: @padding-left
      height: 83%
      layout(block, block, nowrap)
      .left
        display: flex
        align-items: center
        width: 18.4vw
        height: 100%
        margin: 0 3.46vw
        .goods-box
          position: relative
          width: 18.4vw
          height: 18.4vw
          border-radius: 2px
          overflow: hidden
          .goods-img
            width: 18.4vw
            height: 18.4vw
          .goods-price
            position: absolute
            bottom: 0
            left: 0
            height: 4.8vw
            color: $color-white
            font-size: $font-size-13
            text-align: center
            line-height: 4.8vw
            width: 100%
            background: rgba(17, 17, 17, 0.5)
      .right
        flex: 2.548582995951417
        position: relative
        layout(column, block, nowrap)
        box-sizing: border-box
        .lab-img
          position: absolute
          right: 0
          top: 0
          width: 16.666666666666664vw
          height: 18vw
          z-index: 50
        .button
          col-center()
          right: 4vw
          width: 17.333333333333336vw
          height: 6.4vw
          border-radius: @width
          font-family: $font-family-regular
          font-size: 3.2vw
          background: #73C200
          color: #FFFFFF;
          text-align: center;
          line-height: @height
        .title
          layout(row, block, nowrap)
          align-items: center
          color: #1D2023
          .use-type
            height: 12px
            border: 1px solid rgba(29, 32, 35, 0.8)
            border-radius: 2px
            color: #1d2023
            font-size: 11px
            line-height: 12.5px
            padding: 0 2px
          .txt
            font-family: $font-family-medium
            font-size: 4vw
            max-width: 51vw
            margin-top: 4.26667vw
            color: $color-text-main
            line-height: 5.0667vw
            height: 10.13333vw
        .condition
          font-family: $font-family-regular
          padding-top: 1.6vw
          opacity: 0.8
          color: $color-text-sub
          font-size: 3.46667vw
          line-height: 1

  .img
    position: absolute
    top: 0
    left: 0
    display: block
    width: 100%
    height: 100%
    font-size: 0
    line-height: 0

  .coupon-item
    width: 100vw
    position: relative
    margin-bottom: 5.2vw

  .big-box
    width: 100vw
    overflow: hidden
    display: flex
    transform: translateX(0)
    .scroll-wrapper
      width: 100vw
      transition: transform 0.3s
      layout(row, block, nowrap)
      .scroll-item-wrapper
        width: 100vw
        box-sizing: border-box
        .coupon-wrapper
          background: transparent
          position: relative
          min-height: (19.46667 * 3) vw
          .people-item
            display: flex
            padding: 4vw 0 4vw
            margin: 0 4vw
            box-sizing: border-box
            height: 19.46667vw
            border-bottom-1px(#D8D8D8)
            .people-img
              width: 10.6667vw
              border-radius: 50%
              height: @width
              min-height: @width
              min-width: @width
              background: $color-background
            .people-msg
              margin-left: 2.66667vw
              width: 56.266667vw
              .people-name
                font-size: $font-size-15
                font-family: $font-family-regular
                color: #1D2023
                line-height: 1.3
                margin-top: 0.7vw
                no-wrap()
              .people-time
                font-size: $font-size-13
                font-family: $font-family-regular
                color: #808080
                line-height: 1
                margin-top: 1.5vw

            .guid
              width: 20.5333333vw
              height: 8vw
              line-height: 8vw
              text-align: center
              border-radius: 15px
              background: $color-main
              font-size: $font-size-14
              font-family: $font-family-regular
              color: $color-white
              margin-top: 1.2vw
            .tip
              margin-top: 3.6vw
              color: #333333
              font-size: $font-size-13
              height: 13px
              line-height: 13px
              font-family: $font-family-regular

          .more-item
            display: flex
            align-items: center
            justify-content: center
            height: 38px
            border-top-1px(#D8D8D8)
            .more-text
              color: #868686
              font-family: $font-family-regular
              font-size: $font-size-14
              margin-right: 4.5px
            .way
              height: 12.5px
              width: 6.5px

</style>
