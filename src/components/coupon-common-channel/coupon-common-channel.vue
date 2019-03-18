<template>
  <div class="coupon-common">
    <div class="img-wrapper">
      <img class="img" mode="aspectFill" v-if="imageUrl" :src="imageUrl + '/yx-image/2.1/pic-lqcoupon@2x.png'">
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  const COMPONENT_NAME = 'COUPON_COMMON'

  export default {
    name: COMPONENT_NAME,
    data() {
      return {

      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@designCommon"
  .img
    width :100%
    height :100%
  .coupon-common
    .img-wrapper
      height :100vw
</style>
