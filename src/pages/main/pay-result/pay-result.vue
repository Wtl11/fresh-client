<template>
  <div class="pay-result">
    <navigation-bar title="支付成功"></navigation-bar>
    <div class="result-top">
      <div class="result-img-box" :class="allReady ? 'show' : ''">
        <img v-if="imageUrl && allReady" :src="imageUrl + '/yx-image/choiceness/icon-pay_success@2x.png'" class="success-icon back">
        <img v-if="imageUrl && !allReady && corpName === 'platform'" :src="imageUrl + '/yx-image/choiceness/icon-in_payment@2x.png'" class="success-icon front">
        <img v-if="imageUrl && !allReady && corpName === 'retuan'" :src="imageUrl + '/yx-image/retuan/icon-in_payment@2x.png'" class="success-icon front">
      </div>
      <div class="result-text-box">{{allReady ? '订单支付成功' : '支付中···'}}</div>
    </div>
    <div class="jump-btn-box lost">
      <button v-if="payType !== 'offline'" class="jump-goods" :class="[allReady ? '' : 'jump-goods-show', 'corp-' + corpName + '-bg']" open-type="share" formType="submit">提醒团长接单</button>
      <form action="" report-submit @submit="$getFormId">
        <button class="jump-goods jump-order" formType="submit" @click="jumpGoods">继续购物</button>
      </form>
    </div>
    <!--兑换券弹窗-->
    <coupon-modal ref="invModal"></coupon-modal>
  </div>
</template>

<script type="text/ecmascript-6">
  import NavigationBar from '@components/navigation-bar/navigation-bar'
  import ShareTrick from '@mixins/share-trick'
  import Ald from '@utils/ald'
  import API from '@api'
  import CouponModal from './coupon-modal/coupon-modal'

  // const ald = getApp()
  const PAGE_NAME = 'PAY_RESULT'

  export default {
    name: PAGE_NAME,
    mixins: [ShareTrick],
    data() {
      return {
        allReady: false,
        orderId: '',
        payType: ''
      }
    },
    components: {
      NavigationBar,
      CouponModal
    },
    onLoad(e) {
      // ald && ald.aldstat.sendEvent('支付成功页')
      Ald.sendEvent('支付成功页')
      this.orderId = e.orderId
      this.payType = e.payType
      this.$sendMsg({
        event_no: 1006,
        total: e.total
      })
      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        this.allReady = true
        this.getReceiveInviteCoupon()
      }, 1700)
    },
    onShareAppMessage() {
      let shopId = wx.getStorageSync('shopId')
      let userInfo = wx.getStorageSync('userInfo').nickname
      const flag = Date.now()
      return {
        title: `团长，我是“${userInfo}”，刚在店里买了商品↓，请接单！`,
        path: `${this.$routes.main.SHARE_ORDER}?id=${this.orderId}&shopId=${shopId}&flag=${flag}`,
        imageUrl: `${this.imageUrl}/yx-image/order/pic-share_order@2x.png`,
        success: (res) => {
          // 转发成功
        },
        fail: (res) => {
          // 转发失败
        }
      }
    },
    onUnload() {
      this.allReady = false
    },
    methods: {
      jumpGoods() {
        if (!this.allReady) return
        wx.switchTab({ url: `${this.$routes.main.CHOICENESS}` })
      },
      getReceiveInviteCoupon() {
        API.Coupon.receiveInviteCoupon({ cond_type: 6 }, false, false)
          .then((res) => {
            if (res.error !== this.$ERR_OK) return
            this.couponItem = res.data
            this.couponItem.length && this.$refs.invModal.show(this.couponItem)
          })
      }
      // jumpDetail() {
      //   if (!this.allReady) return
      //   wx.navigateTo({
      //     url: `/pages/share-detail?id=${this.orderId}&&type=0&&shareType=1`
      //   })
      // }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@designCommon"

  .pay-result
    background: $color-white
    height: 100vh
    width: 100%

  .result-top
    padding-top: 75px
    transform-style: preserve-3d
    .result-img-box
      width: 82px
      height: 82px
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
        display: block
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
    font-family: $font-family-regular
    color: $color-white
    width: 271px
    margin: 0 auto 20px
    font-size: $font-size-16
    &:after
      border: none

  .jump-order
    background: $color-white
    font-family: $font-family-regular
    color: $color-text-sub
    border-1px(#b7b7b7, 25px)

  .z
    width: 100%
</style>
