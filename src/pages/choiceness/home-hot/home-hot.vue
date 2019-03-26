<template>
  <div class="home-hot" v-if="bigItem.module_name === 'navigation' && bigItem.content_data.length !== 0">
    <div class="nav-item" v-for="(navItem, navIndex) in bigItem.content_data.list" :key="navIndex"
         @click="jumpNavType(navItem)">
      <img v-if="navItem.image_url" :src="navItem.image_url" alt="" class="nav-top-box" mode="aspectFill">
      <div class="nav-top-text">{{navItem.title}}</div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  const COMPONENT_NAME = 'HOME_HOT'

  export default {
    name: COMPONENT_NAME,
    props: {
      bigItem: {
        type: Object,
        default: () => {}
      }
    },
    methods: {
      jumpNavType(item) {
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
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@designCommon"

  .home-hot
    layout(row)
    align-items: center
    padding-bottom: 23px
    .nav-item
      width: 20%
      margin-top: 15px
      .nav-top-box
        width: 52px
        height: 52px
        margin: 0 auto 5px
        display: block
        border-radius: 50%
      .nav-top-text
        font-size: $font-size-12
        font-family: $font-family-regular
        color: #333
        text-align: center
</style>
