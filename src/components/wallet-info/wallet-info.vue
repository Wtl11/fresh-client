<template>
  <div class="wallet-info">
    <div class="info-left">
      <img class="info-left-img">
    </div>
    <div class="info-right">
      <div class="info-text-box">
        <div class="info-text-title">张三丰购买了 40斤新鲜柠檬</div>
        <div class="info-text-bottom">
          <div class="label-btn label-btn-active">佣金返还</div>
          <div class="info-time">2018-06-05 10:22:50</div>
        </div>
      </div>
      <div class="info-money-box">
        <div class="money-number money-subtract">+5.00</div>
        <div class="money-balance">余额 ￥1000.00</div>
        <div class="withdraw"></div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  const COMPONENT_NAME = 'WALLET_INFO'

  export default {
    name: COMPONENT_NAME,
    data() {
      return {

      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"

  .wallet-info
    width: 100%
    layout(row)
    align-items: center
    .info-left
      width: 40px
      height: 40px
      margin-right: 10px
      .info-left-img
        width: 100%
        height: 100%
        display: block
        background: #73C200
        border-radius: 50%
    .info-right
      flex: 1
      padding: 17px 0 15px
      border-bottom-1px($color-line)
      layout(row)
      align-items: center
      justify-content: space-between
      padding-right: 15px
      box-sizing: border-box
      .info-text-title
        font-size: $font-size-14
        font-family: $font-family-regular
        color: $color-text-main
        width: 190px
        margin-bottom: 8px
        no-wrap()
      .info-text-bottom
        layout(row)
        align-items: center
        .label-btn
          font-size: $font-size-10
          color: #616161
          font-family: $font-family-regular
          height: 14px
          line-height: 14.5px
          padding: 0 5px
          border-1px(#616161, 8.5px)
          margin-right: 5px
        .label-btn-active
          color: $color-money
          background: rgba(255,131,0,0.16)
          border-1px($color-money, 8.5px)
        .info-time
          font-size: $font-size-11
          color: $color-text-assist
          font-family: $font-family-regular
      .info-money-box
        text-align: right
      .money-number
        font-size: $font-size-16
        color: $color-money
        font-family: $font-family-medium
        margin-bottom: 8px
      .money-subtract
        color: $color-text-main
      .money-balance
        font-size: $font-size-11
        color: $color-text-assist
        font-family: $font-family-regular
</style>
