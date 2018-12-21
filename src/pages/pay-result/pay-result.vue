<template>
  <div class="pay-result">
    <navigation-bar title="支付成功"></navigation-bar>
    <div class="result-top">
      <div class="result-img-box" :class="allReady ? 'show' : ''">
        <img v-if="imageUrl && allReady" :src="imageUrl + '/yx-image/choiceness/icon-pay_success@2x.png'" class="success-icon back">
        <img v-if="imageUrl && !allReady" :src="imageUrl + '/yx-image/choiceness/icon-in_payment@2x.png'" class="success-icon front">
      </div>
      <div class="result-text-box">{{allReady ? '支付成功' : '支付中···'}}</div>
    </div>
    <div class="jump-btn-box">
      <form action="" report-submit @submit="$getFormId">
        <button class="jump-goods"  open-type="getUserInfo"  formType="submit"  @click="jumpGoods">继续购物</button>
      </form>
      <form action="" report-submit @submit="$getFormId">
        <button class="jump-goods jump-order"  open-type="getUserInfo"  formType="submit"  @click="jumpDetail">查看订单</button>
      </form>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import NavigationBar from '@components/navigation-bar/navigation-bar'

  const PAGE_NAME = 'PAY_RESULT'

  export default {
    name: PAGE_NAME,
    data() {
      return {
        allReady: false,
        orderId: ''
      }
    },
    components: {
      NavigationBar
    },
    onLoad(e) {
      this.orderId = e.orderId
      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        this.allReady = true
      }, 1700)
    },
    onUnload() {
      this.allReady = false
    },
    methods: {
      jumpGoods() {
        if (!this.allReady) return
        wx.switchTab({ url: '/pages/choiceness' })
      },
      jumpDetail() {
        if (!this.allReady) return
        wx.navigateTo({
          url: `/pages/order-detail?id=${this.orderId}&&type=0`
        })
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"

  .pay-result
    background: $color-white
    height: 100vh
    width: 100%
  .result-top
    padding-top: 75px
    transform-style: preserve-3d
    .result-img-box
      width: 79px
      height: 79px
      margin: 0 auto
      position: relative
      transform-style: preserve-3d
      transition: all .3s
      .success-icon
        width: 82px
        height: 82px
        position: absolute
        left: 0
        top: 0
        background: $color-white
      .front
        transform: rotateY(0deg)
      .back
        transform: rotateY(-180deg)
    .result-img-box.show
      transform: rotateY(180deg)
    .result-text-box
      font-family: $font-family-regular
      color: $color-text-main
      font-size: $font-size-16
      text-align: center
      margin-top: 15px
  .jump-btn-box
    margin-top: 94px
  .jump-goods
    height: 45px
    line-height: 45px
    border-radius: 25px
    background: $color-main
    font-family: $font-family-medium
    color: $color-white
    width: 271px
    margin: 0 auto 20px
    font-size: $font-size-16
    &:after
      border: none
  .jump-order
    background: $color-white
    font-family: $font-family-medium
    color: #000
    border-1px(#b7b7b7, 25px)
  .z
    width: 100%
</style>
