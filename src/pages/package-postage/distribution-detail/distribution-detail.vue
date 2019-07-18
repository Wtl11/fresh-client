<template>
  <div class="distribution-detail">
    <navigation-bar title="物流详情"></navigation-bar>
    distribution-detail
  </div>
</template>

<script type="text/ecmascript-6">
  import NavigationBar from '@components/navigation-bar/navigation-bar'

  const PAGE_NAME = 'DISTRIBUTION_DETAIL'

  export default {
    name: PAGE_NAME,
    components: {
      NavigationBar
    },
    data() {
      return {
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@designCommon"

  .distribution-detail
    width: 100%
</style>
