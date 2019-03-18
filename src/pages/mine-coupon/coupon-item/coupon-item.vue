<template>
  <div class="coupon-item">
    <div class="coupon-bg">
      <img class="img" mode="aspectFill" v-if="imageUrl" :src="imageUrl + '/yx-image/2.1/pic-couponbg@2x.png'">
    </div>
    <div class="coupon-container">
      <section class="left">
        <div class="l-top" :class="'corp-' + corpName + '-money'" :style="{color: USE_TYPE[useType].color}">
          <p class="number">20</p>
          <p class="unit">元</p>
        </div>
        <div class="l-bottom" :style="{color: USE_TYPE[useType].color}">满100元可用</div>
      </section>
      <section class="right">
        <div class="info-wrapper">
          <div class="title" :style="{color: USE_TYPE[useType].color}">赞播优鲜新人专享券赞播优鲜新人专享券赞播优鲜新人专享券</div>
          <div class="explain-wrapper">
            <p class="explain" :style="{color: USE_TYPE[useType].color}">指定商品可用</p>
            <p class="date" :style="{color: USE_TYPE[useType].color}">有效期至 2018.12.31 23:59:50</p>
          </div>
        </div>
        <div class="tool-wrapper">
          <div v-if="USE_TYPE[useType].status === 'default'" class="button" :class="'corp-' + corpName + '-bg'" >去使用</div>
          <img v-if="imageUrl && USE_TYPE[useType].status === 'timeout'" class="icon-status" mode="aspectFill":src="imageUrl + '/yx-image/2.1/pic-coupon_ygq@2x.png'">
          <img v-if="imageUrl && USE_TYPE[useType].status === 'used'" class="icon-status" mode="aspectFill":src="imageUrl + '/yx-image/2.1/pic-coupon_ysy@2x.png'">
        </div>
      </section>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  const COMPONENT_NAME = 'COUPON_ITEM'

  export default {
    name: COMPONENT_NAME,
    props: {
      useType: {
        type: String,
        default: 'able'
      }
    },
    data() {
      return {
        USE_TYPE: {
          able: {color: '', status: 'default'},
          disable: {color: '#B7B7B7', status: 'used'}
        }
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"


  .img
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
    overflow :hidden
    box-shadow: 0 3px 10px 0 rgba(17,17,17,0.06);
    background: transparent
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
          font-family: PingFang-SC-Bold
          layout(row,block,nowrap)
          align-items :center
          .number
            font-size: 9.066666666666666vw
            line-height: 7.733333333333333vw
          .unit
            margin-left :1px
            position :relative
            top:1.3333333333333335vw
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
            no-wrap()
          .explain-wrapper
            padding-top :2.666666666666667vw
            opacity: 0.8
            font-family: $font-family-regular
            font-size: 3.2vw
            line-height: @font-size
            .date
              padding-top :1.866666666666667vw
              no-wrap()
</style>
