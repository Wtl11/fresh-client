<template>
  <div class="out-html">
    <navigation-bar title="" :showArrow="true"></navigation-bar>
    <web-view :src="url"></web-view>
  </div>
</template>

<script type="text/ecmascript-6">
  import NavigationBar from '@components/navigation-bar/navigation-bar'

  const PAGE_NAME = 'OUT_HTML'

  export default {
    name: PAGE_NAME,
    data() {
      return {
        url: ''
      }
    },
    components: {
      NavigationBar
    },
    onLoad(e) {
      console.log(e.url)
      this.url = e.url
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"

  .out-html
    width: 100%
</style>
