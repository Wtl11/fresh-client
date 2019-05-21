<template>
  <div class="header-swiper">
    <swiper class="banner" @change="bannerChange" interval="5000">
      <block v-for="(item, index) in goodsBanner" :key="index">
        <swiper-item class="banner-item">
          <img :src="item.image_url + '?' + goodsMsg.image_view" class="item-img item-img-one" mode="aspectFill">
          <img :src="item.image_url" class="item-img item-img-two" mode="aspectFill">
        </swiper-item>
      </block>
    </swiper>
    <article class="banner-number" v-if="goodsBannerLength !== 0">
      <div class="banner-number-box">{{currentNum}}/{{goodsBannerLength}}</div>
    </article>
  </div>

</template>

<script type="text/ecmascript-6">
  const COMPONENT_NAME = 'HEADER_SWIPER'

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
        currentNum: 1
      }
    },
    computed: {
      goodsBanner() {
        return this.goodsMsg.goods_banner_images || []
      },
      goodsBannerLength() {
        return this.goodsBanner.length || 0
      }
    },
    onUnload() {
      this.currentNum = 1
    },
    methods: {
      bannerChange(e) {
        this.currentNum = e.target.current * 1 + 1
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@designCommon"

  .header-swiper
    width: 100vw
    height: 100vw
    position: relative
    .banner
      width: 100vw
      height: 100vw
      .banner-item
        width: 100%
        height: 100%
        position: relative
        .item-img
          width: 100%
          height: 100%
          position: absolute
          left: 0
          top: 0
        .item-img-one
          z-index: 1
        .item-img-two
          z-index: 2
        .play
          all-center()
          height: 63px
          width: 63px
    .banner-number
      position: absolute
      bottom: 13.3vw
      left: 0
      layout(row)
      align-items: center
      justify-content: center
      width: 100%
      .banner-number-box
        display: inline-block
        font-size: $font-size-12
        background: rgba(0, 0, 0, .5)
        color: $color-white
        box-sizing: border-box
        padding: 3px 8px 4px
        border-radius: 20px

</style>
