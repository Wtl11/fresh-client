<template>
  <div class="coupon-share">
    <navigation-bar title="优惠券分享"></navigation-bar>
    <coupon-common-channel :pageConfig="pageConfig" :couponInfo="couponInfo"></coupon-common-channel>
  </div>
</template>

<script type="text/ecmascript-6">
  import NavigationBar from '@components/navigation-bar/navigation-bar'
  import CouponCommonChannel from '@components/coupon-common-channel/coupon-common-channel'
  import ShareTrick from '@mixins/share-trick'
  import API from '@api'

  const PAGE_NAME = 'COUPON_SHARE'

  export default {
    name: PAGE_NAME,
    mixins: [ShareTrick],
    components: {
      NavigationBar,
      CouponCommonChannel
    },
    data() {
      return {
        pageConfig: {
          btnText: '分享',
          btnExplain: '优惠券24小时后未领取完的，剩余数量全部返还到团长账户中',
          openType: 'share'
        },
        couponInfo: {coupon: {}}
      }
    },
    onShow() {
      this._getCouponInfo()
    },
    onShareAppMessage() {
      let shopId = wx.getStorageSync('leaderId')
      let packetId = this.$mp.query.packetId
      let couponName = this.couponInfo.coupon.coupon_name || ''
      const flag = Date.now()
      console.warn(shopId, packetId, '=======团长分享')
      return {
        title: `【赞播优鲜】送你一张${couponName}优惠券，赶快来领取吧！`,
        path: `/pages/coupon-take?shopId=${shopId}&packetId=${packetId}&flag=${flag}`,
        imageUrl: `${this.imageUrl}/yx-image/2.1/pic-getcoupon@2x.png`
      }
    },
    methods: {
      // 获取优惠券信息
      _getCouponInfo() {
        API.Coupon.getDetailPacket(this.$mp.query.packetId).then((res) => {
          this.couponInfo = res.data
        }).catch(e => {
          console.error(e)
        })
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"

  .coupon-share
    min-height :100vh
    background: linear-gradient(180deg,#FFFFFF 0, #FFFFFF 100vw, #FCC446 100vw, #FFA83F 100%)
</style>
