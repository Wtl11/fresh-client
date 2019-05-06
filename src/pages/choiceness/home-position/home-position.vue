<template>
  <div class="home-position" id="homePosition">
    <div class="community-main" @click="handleNav">
      <div class="community-img">
        <img class="p-img" mode="aspectFit" v-if="imageUrl" :src="imageUrl+'/yx-image/2.3/icon-address_sy@2x.png'">
      </div>
      <div class="community-text" v-if="locationStatus * 1 === 1 || locationStatus * 1 === 2">
        <span>{{gName}}</span>
      </div>
      <div class="community-text" v-else>定位中...</div>
      <img class="more-img" mode="aspectFit" v-if="imageUrl" :src="imageUrl+'/yx-image/2.3/icon-pressed_qhztd@2x.png'">
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
      gName() {
        let name = (this.groupInfo && this.groupInfo.social_name) || ''
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
      background: #FFFFFF;
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
      opacity :1
      .community-img
        width: 15.5px
        height: 17.5px
        margin-right: 8px
        img
          width: 100%
          height: 100%
          display: block
          border-radius: 50%
      .community-text
        color: $color-white
        font-size: $font-size-16
        font-family: $font-family-medium
        min-height: $font-size-18
        margin-right: 5px
        overflow :hidden
        white-space: nowrap
      .more-img
        width :8.5px
        height :5.5px

      .community-down
        width: 9px
        height: 6px
        display: block
    .carousel-wrapper
      width :35vw
      height: 24px
      padding: 0 9.5px 0 3px
      background: rgba(255,255,255,1)
      border-radius: 36px
      position :relative
      overflow :hidden
      .place-holder
        fill-box(absolute)
        z-index :3
      .carousel
        height :100%
        width :100%
        .content-wrapper
          layout(row)
          align-items: center
          .avatar-wrapper
            width: 20px
            height: 20px
            border-radius: 50%
            overflow: hidden
            margin :0 5px 0 0
            .img
              width: 100%
              height: 100%
          .text
            flex: 1
            font-family: $font-family-regular
            font-size: 12px
            color: $color-text-main
            no-wrap()

</style>
