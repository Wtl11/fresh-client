<template>
  <div class="coupon-common">
    <div class="img-wrapper">
      <img class="img" mode="aspectFill" v-if="imageUrl" :src="imageUrl + '/yx-image/2.1/pic-lqcoupon@2x.png'">
    </div>
    <div class="content">
      <section class="coupon-info-wrapper">
        <div class="coupon-item-wrapper">
          <coupon-item></coupon-item>
        </div>
        <div class="line-wrapper">
          <img class="line" v-if="imageUrl" :src="imageUrl + '/yx-image/2.1/pic-wire@2x.png'">
        </div>
        <div class="button-wrapper" :style="pageConfig.btnStyle">
          <div class="button">{{pageConfig.btnText}}</div>
        </div>
        <p v-if="pageConfig.btnExplain" class="explain">{{pageConfig.btnExplain}}</p>
      </section>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import CouponItem from './coupon-item/coupon-item'
  const COMPONENT_NAME = 'COUPON_COMMON'

  export default {
    name: COMPONENT_NAME,
    components: {
      CouponItem
    },
    props: {
      pageConfig: {
        type: Object,
        default: () => {}
      }
    },
    data() {
      return {

      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@designCommon"

  .img
    width :100%
    height :100%
    line-height :0
    font-size :0

  .coupon-common
    .img-wrapper
      height :100vw
    .content
      padding :10.5px 15px
      .coupon-info-wrapper
        font-family: $font-family-regular
        padding :0 15px
        background: rgba(255,244,216,0.7)
        border-radius: 6px
        .coupon-item-wrapper
          padding-top :15px
        .line-wrapper
          padding:16.5px 0
          width :100%
          height :1px
          .line
            display :block
            width :100%
            height :1px
        .button-wrapper
          padding-bottom :0
          .button
            height :12vw
            background: #FF8506
            border-radius: 6px;
            font-size: 18px;
            color: #FFFFFF;
            text-align: center;
            line-height: @height
        .explain
          padding :7.5px 0 15px
          font-size: 11px;
          color: rgba(224,112,0,0.8)
          text-align: center
          line-height: 12px;
</style>
