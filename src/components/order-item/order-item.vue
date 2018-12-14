<template>
  <div class="order-item">
    <div class="order-header">
      <div class="order-num">20</div>
      <div class="name">刘娇娇</div>
      <div class="phone">13512345678</div>
      <div class="order-status" v-if="isShowStatus">待提货</div>
    </div>
    <!--商品信息-->
    <div class="goods-detail">
      <img src="" class="goods-img" mode="aspectFill">
      <div class="goods-content">
        <div class="goods-title">超值特惠 智利J级车厘子250g超值特惠 智利J级车厘子250g</div>
        <div class="goods-money">3.8</div>
      </div>
      <div class="goods-num-box">x<span class="goods-num">1</span></div>
    </div>
    <!--审核-->
    <div class="examine" v-if="isShowExamine">
      <p class="examine-text">审核中</p>
      <p class="liner"></p>
      <p class="examine-content">您的售后单已申请成功，等待审核中 </p>
    </div>
    <div class="order-footer">
      <div class="time">下单时间：2018-06-05 17:23</div>
      <div class="footer-btn">确认提货</div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  const COMPONENT_NAME = 'ORDER_ITEM'

  export default {
    name: COMPONENT_NAME,
    props: {
      orderList: { // 订单数组
        type: Array,
        default: []
      },
      isShowStatus: { // 是否展示订单状态
        type: Boolean,
        default: true
      },
      isShowExamine: { // 是否展示审核内容
        type: Boolean,
        default: true
      }
    },
    data() {
      return {}
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"

  .order-item
    margin-bottom: 12px
    background: $color-white
    width: 100%

  .order-header
    box-sizing: border-box
    padding: 0 12px
    display: flex
    align-items: center
    height: 45px
    border-bottom-1px($color-line)
    .order-num
      background: #9F9F9F
      font-size: $font-size-14
      color: $color-white
      font-family: $font-family-medium
      text-align: center
      line-height: 22px
      border-radius: 50%
      width: 22px
      height: 22px
    .name
      no-wrap()
      margin-left: 7px
      font-size: $font-size-14
      color: $color-text-main
      font-family: $font-family-medium
      max-width: 70px
    .phone
      margin-left: 6px
      font-size: $font-size-14
      color: $color-text-main
      font-family: $font-family-medium
    .order-status
      col-center()
      right: 12px
      font-size: $font-size-14
      color: $color-money
      font-family: $font-family-medium

  .goods-detail
    display: flex
    width: 93.6%
    background: #FAFAFA
    margin: 12px auto
    padding: 10px
    box-sizing: border-box
    position: relative
    .goods-img
      background: $color-white
      min-width: 60px
      min-height: 60px
      height: 60px
      width: 60px
    .goods-content
      margin-left: 10px
      width: 79%
      display: flex
      flex-direction: column
      justify-content: space-between
      height: 60px
      font-family: $font-family-regular
      .goods-title
        min-height: 15px
        font-size: $font-size-14
        color: $color-text-main
        no-wrap()
      .goods-money
        height: 14px
        margin-top: 13px
        font-size: $font-size-14
        color: $color-text-main
    .goods-num-box
      font-size: $font-size-12
      position: absolute
      bottom: 8px
      right: 10px
      .goods-num
        margin-left: 1.5px
        font-size: $font-size-16

  .examine
    padding: 0 12px
    box-sizing: border-box
    display: flex
    align-items: center
    font-size: $font-size-14
    font-family: $font-family-regular
    background: #FAFAFA
    height: 32px
    .examine-text
      color: $color-money
    .liner
      width: 1px
      height: 13px
      background: $color-text-sub
      transform: scaleX(0.5)
      margin: 0 6px

  .order-footer
    border-top-1px($color-line)
    margin-top: 12px
    display: flex
    box-sizing: border-box
    padding: 0 12px
    font-size: $font-size-14
    font-family: $font-family-regular
    height: 55px
    align-items: center
    justify-content: space-between
    .time
      color: $color-text-sub
    .footer-btn
      font-size: $font-size-12
      color: $color-main
      padding: 0 11px
      box-sizing: border-box
      height: 25px
      line-height: 25px
      border-1px($color-main, 15px)
</style>
