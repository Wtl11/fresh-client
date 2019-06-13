<template>
  <div class="loading">
    <navigation-bar :title="shopName" :showArrow="false"></navigation-bar>
    <div class="loading-box" :style="{height: height + 'px'}">
      <loading-model></loading-model>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import NavigationBar from '@components/navigation-bar/navigation-bar'
  import LoadingModel from '@components/loading-model/loading-model'

  const PAGE_NAME = 'LOADING'

  export default {
    name: PAGE_NAME,
    data() {
      return {
        height: 0
      }
    },
    created() {
      let res = this.$wx.getSystemInfoSync()
      this.statusBarHeight = res.statusBarHeight || 20
      this.height = res.windowHeight - this.statusBarHeight - 44
    },
    components: {
      NavigationBar,
      LoadingModel
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">


</style>
