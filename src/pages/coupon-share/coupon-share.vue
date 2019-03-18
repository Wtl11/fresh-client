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
          btnExplain: '优惠券24小时后未领取完的，剩余数量全部返还到团长账户中'
        }
      }
    },
    onShareAppMessage() {
      return {}
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"

  .coupon-share
    min-height :100vh
    background: linear-gradient(180deg, #FCC446 100vw, #FFA83F 100%)
</style>
