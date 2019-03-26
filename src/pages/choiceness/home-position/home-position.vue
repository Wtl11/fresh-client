<template>
  <div class="home-position">
    <div class="community-main">
      <!--<div class="community-main" @click="jumpSelfPoint">-->
      <div class="community-img">
        <img v-if="(locationStatus * 1 === 1 || locationStatus * 1 === 2) && imageUrl" :src="groupInfo.head_image_url || imageUrl+'/yx-image/order/icon-colonel_head@2x.png'">
      </div>
      <div class="community-text" v-if="locationStatus * 1 === 1 || locationStatus * 1 === 2">
        {{groupInfo.social_name}}
      </div>
      <div class="community-text" v-else>定位中...</div>
      <!--<img v-if="imageUrl && (locationStatus * 1 === 1 || locationStatus * 1 === 2) && groupInfo.social_name"-->
      <!--:src="imageUrl + '/yx-image/choiceness/icon-pitch@2x.png'" class="community-down">-->
    </div>
    <div class="carousel-wrapper" v-if="buyUsers.length > 0 && (locationStatus * 1 === 1 || locationStatus * 1 === 2)"
         :class="{'show': showBuyUser}">
      <div class="avatar-wrapper">
        <img :src="buyUsers[showUserIndex].head_image_url" alt="">
      </div>
      <div class="content">买了{{buyUsers[showUserIndex].goods_name}}</div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  const COMPONENT_NAME = 'HOME_POSITION'

  export default {
    name: COMPONENT_NAME,
    props: {
      buyUsers: {
        type: Array,
        default: () => []
      },
      showUserIndex: {
        type: Number,
        default: 0
      },
      showBuyUser: {
        type: Boolean,
        default: false
      },
      locationStatus: {
        type: Object,
        default: () => null
      },
      goodsListData: {
        type: Object,
        default: () => null
      },
      groupInfo: {
        type: Object,
        default: () => {}
      }
    },
    methods: {
      jumpSelfPoint() {
        wx.navigateTo({
          url: `/pages/self-point`
        })
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@designCommon"

  .home-position
    layout(row)
    justify-content: space-between
    align-items: center
    padding: 0 12px
    box-sizing: border-box
    margin-bottom: 8px
    .community-main
      layout(row)
      align-items: center
      .community-img
        width: 28px
        height: 28px
        margin-right: 8px
        img
          width: 100%
          height: 100%
          display: block
          border-radius: 50%
      .community-text
        color: $color-text-main
        font-size: $font-size-16
        font-family: $font-family-medium
        min-height: $font-size-18
        max-width: 40vw
        no-wrap()
        margin-right: 5px
      .community-down
        width: 9px
        height: 6px
        display: block
    .carousel-wrapper
      layout(row)
      max-width: 100%
      align-items: center
      height: 24px
      padding: 0 9.5px 0 3px
      background: rgba(0, 0, 0, .5)
      border-radius: 36px
      transition: opacity .3s
      opacity: 0
      &.show
        opacity: 1
      .avatar-wrapper
        width: 20px
        height: 20px
        margin-right: 3px
        border-radius: 50%
        overflow: hidden
        img
          width: 100%
          height: 100%
      .content
        flex: 1
        overflow: hidden
        font-size: $font-size-10
        line-height: 24px
        color: $color-white
        max-width: 24vw
        no-wrap()

</style>
