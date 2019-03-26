<template>
  <div class="home-banner" v-if="bigItem.module_name === 'bannar' && bigItem.content_data.length !== 0">
    <swiper class="banner" autoplay interval="5000" display-multiple-items="1" previous-margin="7.5px"
            next-margin="17.5px" circular @change="_setPraiseIndex">
      <block v-for="(item,index) in bigItem.content_data.list" :key="index">
        <swiper-item class="banner-item" :class="{'current-banner-active': praiseIndex === index}">
          <img class="item-img" mode="aspectFill" v-if="item.image_url" :src="item.image_url"
               @click="jumpDetail(item)">
        </swiper-item>
      </block>
    </swiper>
  </div>
</template>

<script type="text/ecmascript-6">
  const COMPONENT_NAME = 'HOME_BANNER'

  export default {
    name: COMPONENT_NAME,
    props: {
      bigItem: {
        type: Object,
        default: () => {}
      },
      praiseIndex: {
        type: Number,
        default: 0
      }
    },
    methods: {
      jumpDetail(item) {
        if (item.type === 'mini_goods') {
          wx.navigateTo({
            url: `/pages/goods-detail?id=${item.other_id}&activityId=${item.activity_id}`
          })
        } else if (item.type === 'goods_cate') {
          wx.navigateTo({
            url: `/pages/classify?id=${item.other_id}`
          })
        } else if (item.type === 'mini_link') {
          wx.navigateTo({
            url: `${item.url}`
          })
        } else {
          wx.navigateTo({
            url: `/pages/out-html?url=${item.url}`
          })
        }
      },
      _setPraiseIndex(e) {
        this.$emit('bannerChange', e.target.current)
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@designCommon"

  .home-banner
    height: 40vw
    box-sizing: border-box
    position: relative
    border-radius: 6px !important
    overflow: hidden !important
    .banner
      width: 100vw
      height: 100%
      border-radius: 6px !important
      transform: translateY(0)
      overflow: hidden !important
      .banner-item
        width: 100%
        height: 100%
        position: relative
        border-radius: 6px !important
        transform: translateY(0)
        overflow: hidden !important
        layout(row)
        align-items: center
        .item-img
          width: 100%
          height: 95%
          display: block
          border-radius: 6px !important
          transform: translateY(0)
          overflow: hidden !important
          margin-left: 10px
      .current-banner-active
        .item-img
          width: 100%
          height: 100%
          transition: all .5s
</style>
