<template>
  <div class="coupon-item">
<!--    <div class="coupon-bg">-->
<!--      <img class="img" mode="aspectFill" v-if="imageUrl" :src="imageUrl + '/yx-image/2.3/pic-couponbg_my@1x.png'">-->
<!--    </div>-->
<!--    <div class="coupon-container">-->
<!--      <section class="left">-->
<!--        <div class="l-top" :class="'corp-' + corpName + '-money'" :style="{color}">-->
<!--          <p class="number">{{dataInfo.denomination}}</p>-->
<!--          <p class="unit">{{unit}}</p>-->
<!--        </div>-->
<!--        <div v-if="dataInfo.condition > 0" class="l-bottom" :style="{color}">{{dataInfo.condition_str}}</div>-->
<!--      </section>-->
<!--      <section class="right">-->
<!--        <div class="info-wrapper">-->
<!--          <div class="title" :style="{color}">{{dataInfo.coupon_name}}</div>-->
<!--          <div class="explain-wrapper">-->
<!--            <p class="explain" :style="{color}">{{dataInfo.range_type_desc}}</p>-->
<!--            <p class="date" :style="{color}">有效期至{{dataInfo.end_at}}</p>-->
<!--          </div>-->
<!--        </div>-->
<!--        <div class="tool-wrapper">-->
<!--          <div v-if="status === 1" class="button" :class="'corp-' + corpName + '-bg'" @click="useHandle">去使用</div>-->
<!--          <img v-if="imageUrl && status === 2" class="icon-status" mode="aspectFill":src="imageUrl + '/yx-image/2.1/pic-coupon_ygq@2x.png'">-->
<!--          <img v-if="imageUrl && status === 0" class="icon-status" mode="aspectFill":src="imageUrl + '/yx-image/2.1/pic-coupon_ysy@2x.png'">-->
<!--        </div>-->
<!--      </section>-->
<!--    </div>-->
    <section class="top-wrapper">
      <img class="top-bg-img" v-if="imageUrl" :src="imageUrl + '/yx-image/2.3/pic-couponbg_myzk1.png'">
      <div class="top-container">
        <artilce class="left">
          <p class="number">{{money.int}}</p>
          <p class="unit">{{money.dec}}{{unit}}</p>
        </artilce>
        <article class="right">
          <div class="title">
            <p class="use-type">{{dataInfo.range_type_str}}</p>
            <p class="txt">{{dataInfo.condition_str}}</p>
          </div>
          <p class="condition">有效期至 {{dataInfo.end_at}}</p>
          <div v-if="status === 1" class="button" @click="useHandle">去使用</div>
        </article>
      </div>
    </section>
    <section class="middle-wrapper">
      <img class="middle-bg-img" v-if="imageUrl" :src="imageUrl + '/yx-image/2.3/pic-couponbg_myzk2.png'">
      <div class="middle-container">
        <aritlce class="title" @click="handleShowTip">
          <p>使用说明</p>
          <img class="down-img" :class="{'rotate': showTip}" mode="widthFix" v-if="imageUrl" :src="imageUrl + '/yx-image/2.3/icon-pressed_down@2x.png'">
        </aritlce>
        <p v-if="showTip" class="explain">{{dataInfo.description}}</p>
      </div>
    </section>
    <section class="bottom-wrapper">
      <img class="bottom-bg-img" v-if="imageUrl" :src="imageUrl + '/yx-image/2.3/pic-couponbg_myzk3.png'">
    </section>
  </div>
</template>

<script type="text/ecmascript-6">
  import CouponNavigator from '@mixins/coupon-navigator'
  import {formatCouponMoney} from '@utils/common'

  import Coupon from './coupon'

  const COMPONENT_NAME = 'COUPON_ITEM'

  export default {
    name: COMPONENT_NAME,
    mixins: [CouponNavigator],
    props: {
      dataInfo: {
        type: Object,
        default: () => new Coupon()
      }
    },
    data() {
      return {
        // dataInfo: new Coupon()
        showTip: false
      }
    },
    computed: {
      status() {
        return +this.dataInfo.status
      },
      color() {
        return Coupon.COLOR[this.status]
      },
      unit() {
        return Coupon.COUPON_UNIT[this.dataInfo.preferential_type] || ''
      },
      money() {
        return formatCouponMoney(this.dataInfo.denomination)
      }
    },
    methods: {
      useHandle() {
        this.navHandle(this.dataInfo.range_type, this.dataInfo.customer_coupon_id)
      },
      handleShowTip() {
        this.showTip = !this.showTip
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@designCommon"


  .bottom-wrapper
    width :100%
    position :relative
    .bottom-bg-img
      position :absolute
      display :block
      width :100%
      height :6.133333333333333vw

  .middle-wrapper
    width :100vw
    position :relative
    min-height :15px
    .middle-bg-img
      position :absolute
      display :block
      width :100vw
    .middle-container
      position :relative
      padding-left :24px
      padding-right :@padding-left
      font-family: $font-family-regular
      font-size: 13px;
      color: #1D2023;
      line-height :1
      .title
        display :flex
        align-items :center
        justify-content :space-between
        .down-img
          width:12.5px
          height :7.5px
          display :block
          transition :transform 0.3s
          transform :rotate(0deg)
          &.rotate
            transform :rotate(180deg)
      .explain
        padding-top :9px
        font-size :12px
        line-height :1.42

  .top-wrapper
    width: 100%
    height :26.68463611859838vw
    position :relative
    .top-bg-img
      position :absolute
      display :block
      width :100%
      height :100%
    .top-container
      position :relative
      padding-top :1.866666666666667vw
      padding-left :2.4vw
      padding-right :2.4vw
      height :83%
      layout(block,block,nowrap)
      .left
        flex: 1
        display :flex
        font-family: $font-family-medium
        layout(row,block,nowrap)
        align-items :center
        justify-content :center
        color: #FF8506
        .number
          font-size: 9.066666666666666vw
          line-height: 7.733333333333333vw
        .unit
          position :relative
          top:1.65vw
          font-size: 4.010695187165775vw
          line-height: @font-size
      .right
        flex: 2.548582995951417
        position :relative
        layout(column,block,nowrap)
        justify-content :center
        box-sizing :border-box
        padding-left :3.4133333333333336vw
        .button
          col-center()
          right :4vw
          width:17.333333333333336vw
          height :6.4vw
          border-radius: @width
          font-family: $font-family-regular
          font-size: 3.2vw
          background: #73C200
          color: #FFFFFF;
          text-align: center;
          line-height: @height
        .title
          layout(row,block,nowrap)
          align-items :center
          color: #1D2023;
          .use-type
            height :14px
            border :0.5px solid #1D2023
            border-radius :1px
            color:#1D2023
            font-size:10px
            line-height :15px
            padding :0 3px
          .txt
            padding-left :0.8vw
            font-family: $font-family-medium
            font-size :3.733333333333334vw
            max-width :28vw
            no-wrap()
            line-height :1.2
        .condition
          font-family: $font-family-regular
          padding-top :2.933333333333333vw
          opacity :0.8
          color:$color-text-sub
          font-size :3.2vw
          line-height :1
          no-wrap()

  .img
    position :absolute
    top:0
    left :0
    display :block
    width :100%
    height :100%
    font-size :0
    line-height :0

  .coupon-item
    width :100vw
    position :relative
    margin :0 auto
</style>
