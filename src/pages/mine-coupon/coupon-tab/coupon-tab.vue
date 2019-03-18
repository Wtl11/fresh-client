<template>
  <div class="coupon-tab">
  </div>
</template>

<script type="text/ecmascript-6">
  const COMPONENT_NAME = 'COUPON_TAB'

  export default {
    name: COMPONENT_NAME,
    props: {
      tabList: {
        type: Array,
        default: []
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

  .coupon-tab
    padding :34.5px 0
</style>
