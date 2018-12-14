<template>
  <div class="loading-model">
    <div class="img-box">
      <img :src="imageUrl + '/yx-image/group/loading.gif'" v-if="imageUrl" class="error-img">
      <p class="text">玩命加载中...</p>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  const COMPONENT_NAME = 'LOADING_MODEL'

  export default {
    name: COMPONENT_NAME,
    data() {
      return {
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"
  .loading-model
    background: $color-white
    height: 100%
    padding-top: 22.48vh
    box-sizing: border-box

  .img-box
    display: flex
    flex-direction: column
    justify-content: center
    align-items: center
    height: 138.5px
    .error-img
      display: block
      height: 80px
      width: 80px
    .text
      text-align: center
      font-size: $font-size-14
      color: $color-text-sub
      font-family: $font-family-regular
      margin-top: 5px
</style>
