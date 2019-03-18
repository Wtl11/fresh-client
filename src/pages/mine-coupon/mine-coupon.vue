<template>
  <div class="mine-coupon">
    <navigation-bar title="我的优惠券"></navigation-bar>
    <coupon-tab :tabList="tabList"></coupon-tab>
  </div>
</template>

<script type="text/ecmascript-6">
  import NavigationBar from '@components/navigation-bar/navigation-bar'
  import CouponTab from './coupon-tab/coupon-tab'

  const PAGE_NAME = 'MINE_COUPON'

  export default {
    name: PAGE_NAME,
    components: {
      NavigationBar,
      CouponTab
    },
    data() {
      return {
        tabList: [
          {text: '可用', number: 0},
          {text: '不可用', number: 0}
        ]
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"

  .mine-coupon
    width: 100%
</style>
