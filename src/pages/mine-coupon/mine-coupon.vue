<template>
  <div class="mine-coupon">
    <navigation-bar title="我的优惠券"></navigation-bar>
    mine-coupon
  </div>
</template>

<script type="text/ecmascript-6">
  import NavigationBar from '@components/navigation-bar/navigation-bar'

  const PAGE_NAME = 'MINE_COUPON'

  export default {
    name: PAGE_NAME,
    data() {
      return {

      }
    },
    components: {
      NavigationBar
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"

  .mine-coupon
    width: 100%
</style>
