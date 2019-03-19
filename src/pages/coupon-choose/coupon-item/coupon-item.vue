<template>
  <div class="coupon-item" :style="{paddingTop: USE_TYPE[useType].paddingTop}">
    <div class="coupon-bg">
      <img class="img" mode="aspectFill" v-if="imageUrl" :src="imageUrl + USE_TYPE[useType].bgImg">
    </div>
    <div v-if="useType==='able'" class="coupon-container">
      <section class="left">
        <div class="l-top" :class="'corp-' + corpName + '-money'">
          <p class="number">20</p>
          <p class="unit">元</p>
        </div>
        <div class="l-bottom">满100元可用</div>
      </section>
      <section class="right">
        <div class="info-wrapper">
          <div class="title">赞播优鲜新人专享券赞播优鲜新人专享券赞播优鲜新人专享券</div>
          <div class="explain-wrapper">
            <p class="explain">指定商品可用</p>
            <p class="date">有效期至 2018.12.31 23:59:50</p>
          </div>
        </div>
        <div class="tool-wrapper">
          <img class="sel-box"
               :class="{active: !isChecked}"
               v-if="imageUrl"
               :src="imageUrl+'/yx-image/cart/icon-pick@2x.png'" alt=""/>
          <img class="sel-box"
               :class="{active: isChecked}"
               v-if="imageUrl && corpName === 'platform'"
               :src="imageUrl+'/yx-image/cart/icon-pick1@2x.png'" alt=""/>
          <img class="sel-box"
               :class="{active: isChecked}"
               v-if="imageUrl && corpName === 'retuan'"
               :src="imageUrl+'/yx-image/retuan/icon-pick_gwc@2x.png'" alt=""/>
        </div>
      </section>
    </div>
    <article v-if="useType==='disable'" class="coupon-container disable">
      <div class="top">
        <section class="left">
          <div class="l-top color-b7b7b7">
            <p class="number">20</p>
            <p class="unit">元</p>
          </div>
          <div class="l-bottom color-b7b7b7">满100元可用</div>
        </section>
        <section class="right">
          <div class="info-wrapper">
            <div class="title color-b7b7b7">赞播优鲜新人专享券赞播优鲜新人专享券赞播优鲜新人专享券</div>
            <div class="explain-wrapper color-b7b7b7">
              <p class="explain">指定商品可用</p>
              <p class="date">有效期至 2018.12.31 23:59:50</p>
            </div>
          </div>
          <div class="tool-wrapper">
          </div>
        </section>
      </div>
     <div class="bottom">
        <p class="explain">不可用原因: 指定商品可用</p>
     </div>
    </article>
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
      },
      isChecked: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        USE_TYPE: {
          able: {
            bgImg: '/yx-image/2.1/pic-couponbg@2x.png'
          },
          disable: {
            paddingTop: '34.18803418803419%',
            bgImg: '/yx-image/2.1/pic-couponbg_bky@2x.png'
          }
        }
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@designCommon"

  .color-b7b7b7
    color:$color-text-assist !important

  .img
    width :100%
    height :100%
    font-size :0
    line-height :0

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
      .sel-box
        all-center()
        display: block
        width: 20px
        height: 20px
        padding: 12px
        background: $color-white
        opacity : 0
        transition :opacity 0.3s
        &.active
          opacity : 1

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
      &.disable
        layout(column,block,nowrap)
      .bottom
        flex: 1
        opacity: 0.8
        font-family: $font-family-regular
        font-size: 3.2vw
        line-height: @font-size
        color :$color-text-assist
        display :flex
        align-items :center
        .explain
          padding-left: 3.4666666666666663vw
      .top
        flex: 3
        layout(row,block,nowrap)
</style>
