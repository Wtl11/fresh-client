<template>
  <div class="detail-image">
    <div class="detail-title">
      <img v-if="imageUrl" :src="imageUrl + '/yx-image/goods/pic-tital_spxq@2x.png'" mode="widthFix" class="detail-title-image">
    </div>
    <div class="detail-img-box">
      <img v-for="(item, index) in goodsMsg.goods_detail_images" v-if="item.image_url" :src="item.image_url" lazy-load="true" class="detail-img" mode="widthFix" :key="index">
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  const COMPONENT_NAME = 'DETAIL_IMAGE'

  export default {
    name: COMPONENT_NAME,
    props: {
      goodsMsg: {
        type: Object,
        default: () => {}
      }
    },
    data() {
      return {
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@designCommon"

  .detail-image
    position relative
    .detail-title-image
      width: 38vw
      margin: 20px auto
      display: block
    .detail-img-box
      margin: 0 12px
      box-sizing: border-box
      border-radius: 8px
      overflow: hidden
      box-shadow: 0 2px 15px 0 rgba(17, 17, 17, 0.06)
    .detail-img
      display: block
      width: 100%
      height: auto
</style>
