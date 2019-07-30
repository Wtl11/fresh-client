<template>
  <div class="content-articles">
    <navigation-bar title="内容文章"></navigation-bar>
    content-articles
  </div>
</template>

<script type="text/ecmascript-6">
  import NavigationBar from '@components/navigation-bar/navigation-bar'

  const PAGE_NAME = 'CONTENT_ARTICLES'

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

  .content-articles
    width: 100%
</style>
