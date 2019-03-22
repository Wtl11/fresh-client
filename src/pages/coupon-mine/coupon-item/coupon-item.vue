<template>
  <div class="coupon-item">
    <div class="coupon-bg">
      <img class="img" mode="aspectFill" v-if="imageUrl" :src="imageUrl + '/yx-image/2.1/pic-couponbg@2x.png'">
    </div>
    <div class="coupon-container">
      <section class="left">
        <div class="l-top" :class="'corp-' + corpName + '-money'" :style="{color}">
          <p class="number">{{dataInfo.denomination}}</p>
          <p class="unit">{{unit}}</p>
        </div>
        <div v-if="dataInfo.condition > 0" class="l-bottom" :style="{color}">{{dataInfo.condition_str}}</div>
      </section>
      <section class="right">
        <div class="info-wrapper">
          <div class="title" :style="{color}">{{dataInfo.coupon_name}}</div>
          <div class="explain-wrapper">
            <p class="explain" :style="{color}">{{dataInfo.range_type_desc}}</p>
            <p class="date" :style="{color}">有效期至{{dataInfo.end_at}}</p>
          </div>
        </div>
        <div class="tool-wrapper">
          <div v-if="status === 1" class="button" :class="'corp-' + corpName + '-bg'" @click="useHandle">去使用</div>
          <img v-if="imageUrl && status === 2" class="icon-status" mode="aspectFill":src="imageUrl + '/yx-image/2.1/pic-coupon_ygq@2x.png'">
          <img v-if="imageUrl && status === 0" class="icon-status" mode="aspectFill":src="imageUrl + '/yx-image/2.1/pic-coupon_ysy@2x.png'">
        </div>
      </section>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import CouponNavigator from '@mixins/coupon-navigator'
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
    computed: {
      status() {
        return +this.dataInfo.status
      },
      color() {
        return Coupon.COLOR[this.status]
      },
      unit() {
        return Coupon.COUPON_UNIT[this.dataInfo.preferential_type] || ''
      }
    },
    methods: {
      useHandle() {
        this.navHandle(this.dataInfo.range_type, this.dataInfo.customer_coupon_id)
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
    padding-top :25.64102564102564%
    position :relative
    border-radius :6px
    .coupon-bg
      position: absolute
      left :-2.666666666666667vw
      right :@left
      top:@left
      bottom :@left
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
          .unit
            margin-left :1px
            position :relative
            top:2vw
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
          padding:4.533333333333333vw 0 4.8vw 3.4000000000000004vw
          layout(column,block,nowrap)
          justify-content :space-between
          color: $color-text-sub
          .title
            width :40vw
            font-family: $font-family-medium
            font-size: 3.733333333333334vw
            line-height: @font-size
            color: $color-text-main
            white-space: nowrap
          .explain-wrapper
            padding-top :2.666666666666667vw
            opacity: 0.8
            font-family: $font-family-regular
            font-size: 3.2vw
            line-height: @font-size
            .date
              width :60vw
              padding-top :1.866666666666667vw
              white-space: nowrap
</style>
