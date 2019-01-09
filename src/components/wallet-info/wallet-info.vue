<template>
  <div class="wallet-info">
    <div class="info-left">
      <img class="info-left-img" :src="wechatInfo.head_image_url" v-if="wechatInfo.customer_id * 1 !== 0">
      <img class="info-left-img" src="" v-if="wechatInfo.customer_id * 1 === 0">
    </div>
    <div class="info-right">
      <div class="info-text-box">
        <div class="info-text-title">{{wechatInfo.title}}</div>
        <div class="info-text-bottom">
          <div class="label-btn " :class="{'label-btn-active': wechatInfo.type === 30, 'label-btn-active': wechatInfo.type === 31}">{{wechatInfo.type_str}}</div>
          <div class="info-time">{{wechatInfo.created_at}}</div>
        </div>
      </div>
      <div class="info-money-box">
        <div class="money-number" :class="{'money-subtract': wechatInfo.type === 30, 'money-subtract': wechatInfo.type === 31}">{{wechatInfo.total}}</div>
        <div class="money-balance">余额 ￥{{wechatInfo.after_remaining}}</div>
        <div class="withdraw"></div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  const COMPONENT_NAME = 'WALLET_INFO'

  export default {
    name: COMPONENT_NAME,
    props: {
      wechatInfo: {
        type: Object,
        default: {}
      }
    },
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
        width: 170px
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
          line-height: 15px
          padding: 0 5px
          border-radius: 8.5px
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
        color: $color-text-main
        font-family: $font-family-medium
        margin-bottom: 8px
      .money-subtract
        color: $color-money
      .money-balance
        font-size: $font-size-11
        color: $color-text-assist
        font-family: $font-family-regular
</style>
