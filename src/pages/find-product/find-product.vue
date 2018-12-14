<template>
  <div class="find-product">
    <navigation-bar :title="title"></navigation-bar>
    <div class="product-box">
      <order-item :isShowStatus="false"></order-item>
    </div>
    <div class="bulk-pickup">
      <p class="bulk-pickup-text">共3笔订单，3件商品</p>
      <p class="bulk-pickup-btn">批量提货</p>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import NavigationBar from '@components/navigation-bar/navigation-bar'
  import OrderItem from '@components/order-item/order-item'

  const PAGE_NAME = 'FIND_PRODUCT'

  export default {
    name: PAGE_NAME,
    data() {
      return {
        title: '客户名称'
      }
    },
    components: {
      NavigationBar,
      OrderItem
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"

  .find-product
    padding-bottom: 55px
    background: $color-background
    box-sizing: border-box
    min-height: 100vh

  .product-box
    box-sizing: border-box
    background: $color-background
    padding-top: 10px

  .bulk-pickup
    position: fixed
    bottom: 0
    left: 0
    width: 100vw
    display: flex
    align-items: center
    font-size: $font-size-14
    color: $color-text-main
    font-family: $font-family-regular
    box-shadow: 0 -5px 10px 0 rgba(0, 0, 0, 0.03)
    height: 55px
    justify-content: flex-end
    background: $color-white
    box-sizing: border-box
    padding: 0 12px
    .bulk-pickup-btn
      border-radius: 15px
      background: $color-main
      margin-left: 10px
      padding: 0 12px
      line-height: 30px
      color: $color-white
      height: 30px
      font-size: $font-size-14
      &:active
        color: #E1F2C9
        background: #9DD44C
</style>
