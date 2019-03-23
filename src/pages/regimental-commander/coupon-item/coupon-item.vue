<template>
  <div class="coupon-item">
    <div class="coupon-bg">
      <img class="img" mode="aspectFit" v-if="imageUrl" :src="imageUrl + '/yx-image/2.1/pic-couponbg_tz@2x.png'">
    </div>
    <div class="coupon-container">
      <section class="left">
        <div class="l-top" :class="'corp-' + corpName + '-text'">
          <p class="number">{{dataInfo.coupon.denomination}}</p>
          <p class="unit">{{unit}}</p>
        </div>
        <div v-if="dataInfo.coupon.condition > 0" class="l-bottom">{{dataInfo.coupon.condition_str}}</div>
      </section>
      <section class="right">
        <div class="info-wrapper">
          <div class="title">{{dataInfo.coupon.coupon_name}}</div>
          <div class="explain-wrapper">
            <p class="explain">{{dataInfo.coupon.range_type_desc}}(剩{{dataInfo.usable_stock}}张)</p>
            <p class="date">有效期至{{dataInfo.coupon.end_at}}</p>
          </div>
        </div>
        <div class="tool-wrapper">
          <div class="button" :class="'corp-' + corpName + '-bg'" >发送</div>
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
    props: {
      dataInfo: {
        type: Object,
        default: () => new Coupon()
      }
    },
    computed: {
      unit() {
        return Coupon.COUPON_UNIT[this.dataInfo.coupon.preferential_type] || ''
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
    padding-top :27.19033232628399%
    position: relative
    .coupon-bg
      position :absolute
      top:1px
      bottom :@top
      left:2px
      right :@left
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
            white-space: nowrap
          .unit
            margin-left :1px
            position :relative
            top:1.65vw
            font-size: 4.010695187165775vw
            line-height: @font-size
            white-space: nowrap
        .l-bottom
          padding-top :1.4666666666666666vw
          font-family: $font-family-regular
          font-size: 3.2vw
          color: $color-text-sub
          text-align: center;
          line-height: @font-size
          white-space: nowrap
      .right
        flex: 2.3461538461538463
        layout(row,block,nowrap)
        position :relative
        .tool-wrapper
          right :2.666666666666667vw
          col-center()
          .button
            width:16vw
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
          padding:4.8vw 2.6133333333333333vw 4.533333333333333vw
          layout(column,block,nowrap)
          justify-content :space-between
          color: #999
          .title
            width :42vw
            font-family: $font-family-medium
            font-size: 3.733333333333334vw
            line-height: @font-size
            color: $color-text-main
            no-wrap()
          .explain-wrapper
            padding-top :2.666666666666667vw
            opacity: 0.8
            font-family: $font-family-regular
            font-size: 3.2vw
            line-height: @font-size
            .date
              width: 50vw
              padding-top :1.866666666666667vw
              no-wrap()
</style>
