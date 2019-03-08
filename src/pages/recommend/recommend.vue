<template>
  <div class="recommend">
    <navigation-bar title="活动标题"></navigation-bar>
    <section class="logo"></section>
  </div>
</template>

<script type="text/ecmascript-6">
  import NavigationBar from '@components/navigation-bar/navigation-bar'

  const PAGE_NAME = 'RECOMMEND'

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

  .recommend
    .logo
      height :270px
</style>
