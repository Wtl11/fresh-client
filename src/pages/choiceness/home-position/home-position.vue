<template>
  <div class="home-position" id="homePosition">
    <div class="community-main" @click="handleNav">
      <img v-if="imageUrl" :src="imageUrl+'/yx-image/2.1/icon-address_sy@2x.png'" alt="" class="community-img">
      <p class="community-text">{{gName}}</p>
      <img class="more-img" mode="aspectFit" v-if="imageUrl" :src="imageUrl+'/yx-image/2.1/icon-pressed_qhztd@2x.png'">
    </div>
    <section class="search-wrapper" @click="handleSearch">
      <img class="s-img" mode="aspectFit" v-if="imageUrl" :src="imageUrl+'/yx-image/2.3/icon-search@2x.png'">
      <p>搜索商品</p>
    </section>
  </div>
</template>

<script type="text/ecmascript-6">
  const COMPONENT_NAME = 'HOME_POSITION'

  export default {
    name: COMPONENT_NAME,
    props: {
      locationStatus: {
        type: Object,
        default: () => null
      },
      groupInfo: {
        type: Object,
        default: () => {}
      }
    },
    computed: {
      socialName() {
        return (this.groupInfo || {}).social_name || ''
      },
      gName() {
        let name = (this.locationStatus * 1 === 1 || this.locationStatus * 1 === 2) ? this.socialName : '定位中...'
        return name.substring(0, 6) + (name.length > 6 ? '...' : '')
      }
    },
    methods: {
      handleNav() {
        getApp().globalData.$groupInfo = this.groupInfo
        wx.navigateTo({
          url: `/pages/choose-pickup`
        })
      },
      handleSearch() {
        wx.navigateTo({
          url: `/pages/goods-search`
        })
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@designCommon"

  .home-position
    layout(row,block,nowrap)
    justify-content: space-between
    align-items: center
    padding: 0 12px
    box-sizing: border-box
    margin-bottom: 10px
    height :27px
    position :relative
    .search-wrapper
      width :40vw
      height :27px
      background: #F0F0F0;
      border-radius: @height
      display :flex
      align-items :center
      font-family: $font-family-regular
      font-size: 13px;
      color: #B7B7B7;
      .s-img
        padding-left :13px
        padding-right :4px
        width :14px
        height :13.5px
    .community-main
      layout(row,block,nowrap)
      align-items: center
      .community-img
        width: 15.5px
        height: 17.5px
        margin-right: 8px
      .community-text
        color: #1D2023
        font-size: $font-size-16
        font-family: $font-family-medium
        min-height: $font-size-18
        margin-right: 5px
        overflow :hidden
        white-space: nowrap
      .more-img
        width :8.5px
        height :5.5px
</style>
