<template>
  <div class="active-detail">
    <navigation-bar ref="navigationBar" :title="msgTitle" :showArrow="true" :translucent="true"></navigation-bar>
    active-detail
  </div>
</template>

<script type="text/ecmascript-6">
  import NavigationBar from '@components/navigation-bar/navigation-bar'

  const PAGE_NAME = 'ACTIVE_DETAIL'

  export default {
    name: PAGE_NAME,
    components: {
      NavigationBar
    },
    data() {
      return {
        msgTitle: ''
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@designCommon"

  .active-detail
    width: 100%
</style>
