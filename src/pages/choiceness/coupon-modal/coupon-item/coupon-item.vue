<template>
  <div class="coupon-item">
    <div class="coupon-bg">
      <img class="img" mode="aspectFill" v-if="imageUrl" :src="imageUrl + '/yx-image/2.3/pic-coupon_lqtc.png'">
    </div>
    <div class="coupon-container" :class="'corp-' + corpName + '-money'">
      <section class="left">
        <div class="l-top">
<!--          <p v-if="dataInfo.coupon.preferential_type === 2" class="unit">¥</p>-->
          <p class="number">{{money.int}}</p>
          <p class="unit">{{money.dec}}{{dataInfo.coupon.preferential_type === 1?'折':'元'}}</p>
        </div>
      </section>
      <section class="right">
        <div class="info-wrapper">
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
  import {formatCouponMoney} from '@utils/common'

  import Coupon from './coupon'

  const COMPONENT_NAME = 'COUPON_ITEM'

  export default {
    name: COMPONENT_NAME,
    props: {
      dataInfo: {
        type: Object,
        default: () => new Coupon()
      }
    },
    computed: {
      money() {
        return formatCouponMoney(this.dataInfo.coupon.denomination)
      }
    }
    // data() {
    //   return {
    //     dataInfo: new Coupon()
    //   }
    // }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@designCommon"

  .img
    display :block
    width :100%
    height :100%
    font-size :0
    line-height :0

  .coupon-item
    width: 100%
    height :0
    padding-top :30.567685589519648%
    position :relative
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
          font-family: DINAlternate-Bold
          layout(row,block,nowrap)
          align-items :center
          .number
            font-size: 7.466666666666668vw
            line-height: 6.666666666666667vw
            margin :0 1px
          .unit
            font-family :$font-family-regular
            position :relative
            top:1.1vw
            font-size: 3.266666666666667vw
            line-height: 3.733333333333334vw
      .right
        flex: 1.7926829268292683
        overflow :hidden
        .info-wrapper
          height :100%
          layout(column,block,nowrap)
          opacity: 0.9;
          font-family: $font-family-regular
          font-size: 3.4666666666666663vw
          line-height :1
          color: #3F454B;
          .title
            padding-top :4.266666666666667vw
            layout(row,block,nowrap)
            align-items :center
            color: #1D2023;
            .use-type
              height :14px
              border :1px solid #1D2023
              border-radius :1px
              color:#1D2023
              font-size:10px
              line-height :14.5px
              padding :0 3px
            .txt
              padding-left :0.8vw
              font-family: $font-family-medium
              font-size :3.733333333333334vw
              line-height :1
              max-width :25vw
              no-wrap()
          .condition
            padding-top :2.933333333333333vw
            opacity :0.8
            font-size :3.2vw
            line-height :1
            no-wrap()
</style>
