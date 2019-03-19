<template>
  <div class="coupon-item">
    <div class="coupon-bg">
      <img class="img" mode="aspectFill" v-if="imageUrl" :src="imageUrl + '/yx-image/2.1/pic-coupon_lqtc@2x.png'">
    </div>
    <div class="coupon-container" :class="'corp-' + corpName + '-money'">
      <section class="left">
        <div class="l-top">
          <p v-if="false" class="unit">¥</p>
          <p class="number">9.9</p>
          <p class="unit">折</p>
        </div>
      </section>
      <section class="right">
        <div class="info-wrapper">
          <div class="title">赞播优鲜新人专享券赞播优鲜新人专享券赞播优鲜新人专享券</div>
          <p class="condition">满100元可用</p>
        </div>
      </section>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  const COMPONENT_NAME = 'COUPON_ITEM'

  export default {
    name: COMPONENT_NAME,
    data() {
      return {

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
    padding-top :29.100529100529098%
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
          box-sizing :border-box
          padding:3.0666666666666664vw 1.813333333333333vw 2.8000000000000003vw
          layout(column,block,nowrap)
          justify-content :space-between
          opacity: 0.9;
          font-family: $font-family-medium
          font-size: 3.4666666666666663vw
          line-height :1
          .title
            no-wrap()
          .condition
            opacity :0.8
            font-size :3.2vw
            no-wrap()
</style>
