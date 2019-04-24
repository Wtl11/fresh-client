<template>
  <div class="coupon-item">
    <div class="coupon-bg">
      <img class="img" mode="aspectFill" v-if="imageUrl" :src="imageUrl + '/yx-image/2.3/pic-coupon_lqtc.png'">
    </div>
    <div class="coupon-container" :class="'corp-' + corpName + '-money'">
      <section class="left">
        <div class="l-top">
<!--          <p v-if="dataInfo.coupon.preferential_type === 2" class="unit">¥</p>-->
          <p class="number">{{dataInfo.coupon.denomination}}</p>
          <p v-if="dataInfo.coupon.preferential_type === 1" class="unit">{{dataInfo.coupon.preferential_type === 1?'折': '元'}}</p>
        </div>
      </section>
      <section class="right">
        <div class="info-wrapper">
          <div class="title">
            <p class="use-type">通用</p>
            <p class="txt">满100元减5元</p>
          </div>
          <p class="condition">{{dataInfo.coupon.condition_str}}有效期至 2018.12.31</p>
        </div>
      </section>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import Coupon from './coupon'

  const COMPONENT_NAME = 'COUPON_ITEM'

  export default {
    name: COMPONENT_NAME,
    // props: {
    //   dataInfo: {
    //     type: Object,
    //     default: () => new Coupon()
    //   }
    // },
    data() {
      return {
        dataInfo: new Coupon()
      }
    }
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
            top:1.4vw
            font-size: 3.266666666666667vw
            line-height: 3.733333333333334vw
      .right
        flex: 2.0031847133757963
        overflow :hidden
        .info-wrapper
          height :100%
          layout(column,block,nowrap)
          justify-content :center
          opacity: 0.9;
          font-family: $font-family-medium
          font-size: 3.4666666666666663vw
          line-height :1
          color: #3F454B;
          .title
            layout(row,block,nowrap)
            align-items :center
            color: #1D2023;
            .use-type
              height :14px
              border-bottom :1px solid #1D2023
              border-radius :3.73px
              color:#1D2023

          .condition
            padding-top :11px
            opacity :0.8
            font-size :3.2vw
            no-wrap()
</style>
