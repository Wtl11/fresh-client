<template>
  <div class="group-wallet">
    <navigation-bar title="团长钱包"></navigation-bar>
    <div class="wallet-top">
      <img class="bgimg-url" mode="aspectFill" v-if="imageUrl" :src="imageUrl + '/yx-image/wallet/icon-money_bg@2x.png'">
      <div class="wallet-box">
        <div class="wallet-box-left">
          <div class="wallet-box-left-name">钱包余额(元)</div>
          <div class="wallet-box-left-number">2859.00</div>
        </div>
        <div class="wallet-box-right">提现</div>
      </div>
      <div class="wallet-bottom">
        <div class="wallet-bottom-main">
          <div class="wallet-main-text">
            <div class="jump-text">收入:￥</div>
            <div class="jump-money">200.00</div>
            <img class="jump-arrows" mode="aspectFill" v-if="imageUrl" :src="imageUrl + '/yx-image/cart/icon-pressed@2x.png'">
          </div>
          <div class="wallet-main-text">
            <div class="jump-text">收入:￥</div>
            <div class="jump-money">200.00</div>
            <img class="jump-arrows" mode="aspectFill" v-if="imageUrl" :src="imageUrl + '/yx-image/cart/icon-pressed@2x.png'">
          </div>
          <div class="wallet-line"></div>
        </div>
      </div>
    </div>
    <div class="wallet-list">
      <wallet-info></wallet-info>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import NavigationBar from '@components/navigation-bar/navigation-bar'
  import WalletInfo from '@components/wallet-info/wallet-info'

  const PAGE_NAME = 'GROUP_WALLET'

  export default {
    name: PAGE_NAME,
    data() {
      return {

      }
    },
    components: {
      NavigationBar,
      WalletInfo
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"

  .group-wallet
    width: 100%
  .wallet-top
    height: 34vw
    width: 100%
    position: relative
    margin-bottom: 40px
    .bgimg-url
      width: 100%
      height: 100%
      display: block
      position: absolute
      z-index: 1
      left: 0
      top: 0
    .wallet-box
      padding: 6.8vw 20px 0 27px
      box-sizing: border-box
      position: relative
      z-index: 2
      layout(row)
      align-items: center
      justify-content: space-between
      .wallet-box-left-name
        font-size: $font-size-14
        color: $color-white
        font-family: $font-family-regular
        margin-bottom: 8px
      .wallet-box-left-number
        font-size: 30px
        color: $color-white
        font-family: $font-family-din-bold
      .wallet-box-right
        width: 70px
        text-align: center
        height: 24px
        line-height: 24px
        font-size: $font-size-14
        color: $color-text-sub
        font-family: $font-family-regular
        background: $color-white
        border-radius: 15px
    .wallet-bottom
      position: absolute
      bottom: -30px
      left: 0
      padding: 0 15px
      height: 60px
      box-sizing: border-box
      width: 100%
      z-index: 2
      .wallet-bottom-main
        position: relative
        width: 100%
        height: 60px
        border-radius: 4px
        box-shadow: 0 4px 8px 0 rgba(0,0,0,0.06)
        background: $color-white
        align-items: center
        layout(row)
        .wallet-main-text
          width: 50%
          height: 100%
          layout(row)
          align-items: center
          justify-content: center
          .jump-text
            font-size: $font-size-14
            font-family: $font-family-regular
            color: $color-text-assist
          .jump-money
            font-size: $font-size-16
            font-family: $font-family-regular
            color: $color-text-main
          .jump-arrows
            display: block
            width: 7.5px
            height: 12.5px
            margin-left: 4px
        .wallet-line
          position: absolute
          left: 50%
          top: -44.5px
          width: 1px
          height: 27px
          border-right-1px(#E6E6E6)
  .wallet-list
    padding-left: 15px
    box-sizing: border-box
</style>
