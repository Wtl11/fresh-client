<template>
  <div class="coupon-item">
    <div class="coupon-bg">
      <img class="img" mode="aspectFill" v-if="imageUrl" :src="imageUrl + '/yx-image/2.1/pic-couponlq@2x.png'">
    </div>
    <div class="coupon-container">
      <section class="left">
        <div class="l-top" :class="'corp-' + corpName + '-money'">
          <p class="number">{{money.int}}</p>
          <p class="dec">{{money.dec}}</p>
          <p class="unit">{{unit}}</p>
        </div>
        <div v-if="dataInfo.coupon.condition >= 0" class="l-bottom">{{dataInfo.coupon.condition_str}}</div>
      </section>
      <section class="right">
        <div class="info-wrapper">
<!--          <div class="title">{{dataInfo.coupon.coupon_name}}</div>-->
<!--          <p class="explain">{{dataInfo.coupon.condition_str}}</p>-->
          <!--<div class="explain-wrapper">-->
            <!--<p class="explain">指定商品可用</p>-->
            <!--<p class="date">有效期至 2018.12.31 23:59:50</p>-->
          <!--</div>-->
          <div class="title">
            <p class="use-type">{{dataInfo.coupon.range_type_str}}</p>
            <p class="txt">{{dataInfo.coupon.coupon_name}}</p>
          </div>
          <p class="condition">有效期至 {{dataInfo.coupon.end_at}}</p>
        </div>
      </section>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import Coupon from './coupon'
  import {formatCouponMoney} from '@utils/common'

  const COMPONENT_NAME = 'COUPON_ITEM'

  export default {
    name: COMPONENT_NAME,
    inject: ['couponInfo', 'COUPON_UNIT'],
    props: {
      dataInfo: {
        type: Object,
        default: () => new Coupon()
      }
    },
    computed: {
      unit() {
        return Coupon.COUPON_UNIT[this.dataInfo.coupon.preferential_type] || ''
      },
      money() {
        return formatCouponMoney(this.dataInfo.coupon.denomination)
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@designCommon"

  .img
    width :100%
    height :100%
    font-size :0
    line-height :0

  .coupon-item
    width: 100%
    height :0
    padding-top :26.984126984126984%
    position :relative
    border-radius :6px
    .coupon-bg
      fill-box(absolute)
    .coupon-container
      fill-box(absolute)
      layout(row,block,nowrap)
      .left
        flex: 1
        display :flex
        flex-direction :column
        justify-content :center
        align-items :center
        overflow :hidden
        .l-top
          font-family: $font-family-medium
          layout(row,block,nowrap)
          align-items :center
          .number
            font-size: 9.066666666666666vw
            line-height: 7.733333333333333vw
          .dec
            position :relative
            top:1.0666666666666667vw
            font-size: 5.6vw
            line-height: @font-size
          .unit
            margin-left :1px
            position :relative
            top:1.65vw
            font-size: 4.010695187165775vw
            line-height: @font-size
        .l-bottom
          padding-top :1.4666666666666666vw
          font-family: $font-family-regular
          font-size: 3.2vw
          color: $color-text-sub
          text-align: center;
          line-height: @font-size
      .right
        flex: 2.5493670886075948
        layout(row,block,nowrap)
        .tool-wrapper
          flex: 1
          position :relative
          .icon-status
            col-center()
            left: -0.8vw
            width :18.8vw
            height :17.50344827586207vw
          .button
            col-center()
            left :-1.0666666666666667vw
            width:17.333333333333336vw
            height :6.4vw
            border-radius: @width
            font-family: $font-family-regular
            font-size: 3.2vw
            color: #FFFFFF;
            text-align: center;
            line-height: @height
        .info-wrapper
          flex: 2.2908496732026142
          overflow :hidden
          height :100%
          box-sizing :border-box
          padding : 5.733333333333333vw 3.5vw 0
          layout(column,block,nowrap)
          color: $color-text-sub
          .title
            layout(row,block,nowrap)
            align-items :center
            color: #1D2023;
            .use-type
              height:12px;
              border:1px solid rgba(29,32,35,0.8);
              border-radius:2px;
              color:#1d2023;
              font-size:11px;
              line-height:12.5px;
              padding:0 2px;
            .txt
              padding-left :0.8vw
              font-family: $font-family-medium
              font-size :4vw
              max-width :28vw
              no-wrap()
              line-height :1.2
          .condition
            font-family: $font-family-regular
            padding-top : 3.666666666666667vw
            opacity :0.8
            color:$color-text-sub
            font-size: 3.4666666666666663vw
            line-height :1
            no-wrap()
</style>
