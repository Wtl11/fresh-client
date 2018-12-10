<template>
  <div class="regimental-commander">
    <navigation-bar :translucent="true"></navigation-bar>
    <div class="reg-img-box">
      <img class="reg-img" :src="imageUrl + '/yx-image/group/group-bg@2x.png'" v-if="imageUrl">
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import NavigationBar from '@components/navigation-bar/navigation-bar'

  const PAGE_NAME = 'REGIMENTAL_COMMANDER'

  export default {
    name: PAGE_NAME,
    data() {
      return {}
    },
    components: {
      NavigationBar
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"
  .regimental-commander
    min-height: 100vh
    background: $color-background

  .reg-img-box
    width: 100vw
    height: 195px
    position: relative
    .reg-img
      position: absolute
      top: 0
      left: 0
      width: 100%
      height: 100%
</style>
