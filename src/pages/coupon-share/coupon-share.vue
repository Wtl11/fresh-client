<template>
  <div class="coupon-share">
    <navigation-bar title="优惠券分享"></navigation-bar>
    <coupon-common-channel :pageConfig="pageConfig"></coupon-common-channel>
  </div>
</template>

<script type="text/ecmascript-6">
  import NavigationBar from '@components/navigation-bar/navigation-bar'
  import CouponCommonChannel from '@components/coupon-common-channel/coupon-common-channel'

  const PAGE_NAME = 'COUPON_SHARE'

  export default {
    name: PAGE_NAME,
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
        }
      }
    },
    onShareAppMessage() {
      return {
        title: '【赞播优鲜】送你一张优惠券，赶快来领取吧！',
        path: `/pages/coupon-take`,
        imageUrl: `${this.imageUrl}/yx-image/2.1/pic-getcoupon@2x.png`
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
