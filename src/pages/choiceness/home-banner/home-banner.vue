<template>
  <div class="home-banner" id="homeBanner">
    <swiper class="banner" autoplay interval="5000" display-multiple-items="1" previous-margin="0px"
            next-margin="0px" circular @change="_setPraiseIndex">
      <block v-for="(item,index) in bannerArray" :key="index">
        <swiper-item  class="banner-item" :class="{'current-banner-active': false}">
          <img class="item-img" lazy-load mode="aspectFill" v-if="item.image_url" :src="item.image_url"
               @click="jumpDetail(item)">
        </swiper-item>
      </block>
    </swiper>
    <ul class="dot-wrapper">
      <li class="background">
        <img lazy-load class="img" mode="aspectFill" v-if="imageUrl" :src="imageUrl + '/yx-image/2.3/pic-switch@2x.png'">
      </li>
      <li class="dot">{{currentIndex}}</li>
      <li class="dot-line">/</li>
      <li class="dot right">{{arrayLength}}</li>
    </ul>
  </div>
</template>

<script type="text/ecmascript-6">
  const COMPONENT_NAME = 'HOME_BANNER'

  export default {
    name: COMPONENT_NAME,
    props: {
      bannerArray: {
        type: Array,
        default: () => []
      }
    },
    data() {
      return {
        currentIndex: 1
      }
    },
    computed: {
      arrayLength() {
        return this.bannerArray.length || 0
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
        this.currentIndex = e.target.current + 1
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
    .dot-wrapper
      position :absolute
      right :22px
      bottom :8px
      width :35px
      height :17.5px
      layout(row,block,nowrap)
      font-family: $font-family-regular
      font-size: 10px;
      color: #F1F5EB;
      .background
        fill-box(absolute)
        .img
          width :100%
          height:@width
          display :block
      .dot-line
        position :relative
        transform :scale(0.8)
        top:1px
      .dot
        position :relative
        width :17.5px
        height :@width
        text-align :center
        line-height :@height
    .banner
      width: 100vw
      height: 100%
      border-radius: 4px !important
      transform: translateY(0)
      overflow: hidden !important
      .banner-item
        width: 100%
        height: 100%
        position: relative
        border-radius: 4px !important
        transform: translateY(0)
        overflow: hidden !important
        layout(row)
        align-items: center
        .item-img
          width: 100%
          height: 100%
          display: block
          border-radius: 4px !important
          transform: translateY(0)
          overflow: hidden !important
          margin-left: 12px
          margin-right :12px
      .current-banner-active
        .item-img
          width: 100%
          height: 100%
          transition: all .5s
</style>
