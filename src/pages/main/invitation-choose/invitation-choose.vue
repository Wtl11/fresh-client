<template>
  <div class="choose-coupon">
    <navigation-bar title="选择兑换券"></navigation-bar>
    <div class="select-coupon" @click="notUse">
      <div class="select-title">不使用兑换券</div>
      <div class="select-icon-box">
        <img :class="{active: !select}" v-if="imageUrl" :src="imageUrl+'/yx-image/cart/icon-pick@2x.png'" class="select-icon"/>
        <img v-if="imageUrl" :class="{active: select}" :src="imageUrl + '/yx-image/invitation/icon-pick@2x.png'" class="select-icon">
      </div>
    </div>

    <dl v-if="useArray.length" class="panel">
      <dt class="not-title">可用兑换券</dt>
      <div class="coupon">
        <div v-for="(item, index) in useArray" :key="index" class="coupon-item" @click="selectCoupon(item, index)">
          <section class="top-wrapper">
            <img class="top-bg-img" v-if="imageUrl" :src="imageUrl + '/yx-image/invitation/pic-couponbg_myzk1.png'">
            <div class="top-container">
              <artilce class="left">
                <div class="goods-box">
                  <img v-if="imageUrl && item.other_info" :src="item.other_info.goods_cover_image" class="goods-img" mode="aspectFill">
                  <span class="goods-price">{{item.denomination ? item.denomination + '元' : ''}}</span>
                </div>
              </artilce>
              <article class="right">
                <div class="title">
                  <!--<p class="use-type" :style="{color, borderColor: color}">{{item.range_type_str}}</p>-->
                  <p class="txt" :style="{color}">{{item.coupon_name}}</p>
                </div>
                <p class="condition" :style="{color}">有效期至 {{item.end_at}}</p>
                <img class="lab-img" v-if="imageUrl && status === 2" :src="imageUrl + '/yx-image/2.3/pic-coupon_ygq.png'">
                <img class="lab-img" v-if="imageUrl && status === 0" :src="imageUrl + '/yx-image/2.3/pic-coupon_ysy.png'">
              </article>
            </div>
            <div class="select">
              <img :class="{active: useIndex !== index}" v-if="imageUrl" :src="imageUrl+'/yx-image/cart/icon-pick@2x.png'" class="select-icon"/>
              <img v-if="imageUrl" :class="{active: useIndex === index}" :src="imageUrl + '/yx-image/invitation/icon-pick@2x.png'" class="select-icon">
            </div>
          </section>
          <section class="middle-wrapper">
            <img class="middle-bg-img" v-if="imageUrl" :src="imageUrl + '/yx-image/2.3/pic-couponbg_myzk2.png'">
            <div class="middle-container">
              <div class="middle-box">
                <aritlce class="title" :style="{color}" @click.stop="handleShowTip(index, 'use')">
                  <p>使用说明</p>
                  <img class="down-img" :class="{'rotate': item.showTip}" mode="widthFix" v-if="imageUrl" :src="imageUrl + '/yx-image/2.3/icon-pressed_down@2x.png'">
                </aritlce>
                <div class="middle-detail" @click.stop="goGoodsDetail(item)">
                  <span class="middle-detail-text">查看此商品</span>
                  <img class="detail-img" mode="widthFix" v-if="imageUrl" :src="imageUrl + '/yx-image/invitation/icon-coupon_down@2x.png'">
                </div>
              </div>
              <p v-if="item.showTip" class="explain">{{item.description}}</p>
            </div>
          </section>
          <section class="bottom-wrapper">
            <img class="bottom-bg-img" v-if="imageUrl" :src="imageUrl + '/yx-image/2.3/pic-couponbg_myzk3.png'">
          </section>
        </div>
      </div>
    </dl>
    <dl v-if="disableArray.length" class="panel">
      <dt class="not-title">不可用兑换券</dt>
      <div class="coupon coupon-disable">
        <div v-for="(item, index) in disableArray" :key="index" class="coupon-item">
          <div class="shade"></div>
          <section class="top-wrapper">
            <img class="top-bg-img" v-if="imageUrl" :src="imageUrl + '/yx-image/invitation/pic-couponbg_myzk1.png'">
            <div class="top-container">
              <artilce class="left">
                <div class="goods-box">
                  <img v-if="imageUrl && item.other_info" :src="item.other_info.goods_cover_image" class="goods-img" mode="aspectFill">
                  <span class="goods-price">{{item.denomination ? item.denomination + '元' : ''}}</span>
                </div>
              </artilce>
              <article class="right">
                <div class="title">
                  <!--<p class="use-type" :style="{color, borderColor: color}">{{item.range_type_str}}</p>-->
                  <p class="txt goods-name" :style="{color}">{{item.coupon_name}}</p>
                </div>
                <p class="condition" :style="{color}">有效期至 {{item.end_at}}</p>
                <img class="lab-img" v-if="imageUrl && status === 2" :src="imageUrl + '/yx-image/2.3/pic-coupon_ygq.png'">
                <img class="lab-img" v-if="imageUrl && status === 0" :src="imageUrl + '/yx-image/2.3/pic-coupon_ysy.png'">
              </article>
            </div>
          </section>
          <section class="middle-wrapper">
            <img class="middle-bg-img" v-if="imageUrl" :src="imageUrl + '/yx-image/2.3/pic-couponbg_myzk2.png'">
            <div class="middle-container">
              <div class="middle-box">
                <aritlce class="title" :style="{color}" @click.stop="handleShowTip(index, 'no')">
                  <p>使用说明</p>
                  <img class="down-img" :class="{'rotate': item.showTip}" mode="widthFix" v-if="imageUrl" :src="imageUrl + '/yx-image/invitation/icon-coupon_down2@2x.png'">
                </aritlce>
                <div class="middle-detail" @click.stop="goGoodsDetail(item)">
                  <span class="middle-detail-text">查看此商品</span>
                  <img class="detail-img" mode="widthFix" v-if="imageUrl" :src="imageUrl + '/yx-image/invitation/icon-coupon_downs@2x.png'">
                </div>
              </div>
              <p v-if="item.showTip" class="explain">{{item.description}}</p>
            </div>
          </section>
          <section class="bottom-wrapper">
            <img class="bottom-bg-img" v-if="imageUrl" :src="imageUrl + '/yx-image/2.3/pic-couponbg_myzk3.png'">
          </section>
        </div>
      </div>
    </dl>
    <div v-if="isShowEmpty > 1" class="empty-wrapper">
      <img class="img" mode="aspectFill" v-if="imageUrl" :src="imageUrl + '/yx-image/2.1/pic-kong@2x.png'">
      <p class="text">空空如也</p>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import NavigationBar from '@components/navigation-bar/navigation-bar'
  import { orderComputed, orderMethods } from '@state/helpers'
  import API from '@api'
  import { isEmptyObject } from '@utils/common'

  const PAGE_NAME = 'CHOOSE_COUPON'

  export default {
    name: PAGE_NAME,
    components: {
      NavigationBar
    },
    data() {
      return {
        useArray: [],
        disableArray: [],
        useIndex: -1,
        isShowEmpty: 0,
        select: false,
        customerCoupons: []
      }
    },
    computed: {
      ...orderComputed
    },
    watch: {
      commodityItem(newValue) {
        this.select = isEmptyObject(newValue) || newValue.notUse
      }
    },
    onLoad() {
      if (!isEmptyObject(this.commodityItem)) {
        this.useIndex = this.useArray.findIndex((item) => item.coupon_id === this.commodityItem.coupon_id)
      } else {
        this.useIndex = -1
      }
      this.select = isEmptyObject(this.commodityItem) || this.commodityItem.notUse
      this._getCouponInfo()
    },
    methods: {
      ...orderMethods,
      selectCoupon(item, index) {
        this.useIndex = index
        this.setCommodityItem(item)
        wx.navigateBack()
      },
      notUse() {
        this.select = true
        this.useIndex = -1
        this.setCommodityItem({})
        wx.navigateBack()
      },
      goGoodsDetail(item) {
        wx.navigateTo({ url: `${this.$routes.main.GOODS_DETAIL}?id=${item.other_info.goods_id}&activityId=0&activityType=DEFAULT` })
      },
      handleShowTip(index, type) {
        let arr = type === 'no' ? JSON.parse(JSON.stringify(this.disableArray)) : JSON.parse(JSON.stringify(this.useArray))
        arr[index].showTip = !arr[index].showTip
        if (type === 'no') {
          this.disableArray = JSON.parse(JSON.stringify(arr))
          return
        }
        this.useArray = JSON.parse(JSON.stringify(arr))
      },
      _getCouponInfo() {
        API.Coupon.getChooseList({ goods: this.goodsList, is_usable: 1, tag_type: 1 }, true).then((res) => {
          this.useArray = res.data
          this.useIndex = res.data.findIndex(val => val.coupon_id === this.couponInfo.coupon_id)
          this.useIndex = res.data.length && !isEmptyObject(this.commodityItem) && !this.commodityItem.notUse ? 0 : -1
          if (!res.data.length) {
            this.isShowEmpty++
          }
        })
        API.Coupon.getChooseList({ goods: this.goodsList, is_usable: 0, tag_type: 1 }, false).then((res) => {
          this.disableArray = res.data
          if (!res.data.length) {
            this.isShowEmpty++
          }
        })
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@designCommon"
  .select
    col-center()
    width: 50px
    height: 50px
    position: absolute
    right: 5.8333vw
    z-index: 1
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

  .empty-wrapper
    padding-top: 106px
    .img
      display: block
      margin: 0 auto
      width: 116px
      height: 110px
    .text
      padding-top: 15px
      font-family: $font-family-regular
      font-size: 14px
      color: $color-text-sub
      text-align: center

  .not-title
    font-family: $font-family-regular
    font-size: 14px
    color: #1F1F1F
    line-height: @font-size
    margin-top: 20px
    text-indent: 14px

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

  .choose-coupon
    background: $color-background
    min-height: 100vh
    padding-bottom: 20px
    box-sizing: border-box
    .panel
      .title
        padding-bottom: 10px
        font-family: $font-family-regular
        font-size: 14px
        color: $color-text-main
        line-height: @font-size
      .coupon-item
        &:last-child
          padding-bottom: 0

  .coupon-item
    width: 100vw
    position: relative
    margin-bottom: 5.2vw

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
          padding-bottom: 0
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
        height: 14px
      .title
        display: flex
        align-items: center
        justify-content: space-between
        width: 75px
        white-space: nowrap
        padding-bottom: 0
        .down-img
          width: 12.5px
          height: 7px
          display: block
          transition: transform 0.3s
          transform: rotate(0deg)
          margin-top: 1px
          position: relative
          z-index: 10
          margin-left: 6px
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

  .coupon
    margin-top: 1.8vw
    position: relative
    .shade
      top: 1.866666666666667vw
      left: 3.2vw
      right: 3.2vw
      bottom: 0
      z-index: 1
      position: absolute
      background: rgba(210, 210, 210, 0.05)

  .coupon-disable
    .goods-price
      background: rgba(17, 17, 17, 0.2) !important
    .middle-box
      .title
        color: #B7B7B7 !important
    .goods-name, .middle-detail-text
      color: #B7B7B7 !important

  .bottom-wrapper
    width: 100%
    position: relative
    .bottom-bg-img
      position: absolute
      display: block
      width: 100%
      height: 6.133333333333333vw

</style>
