<template>
  <div class="home-position" id="homePosition">
    <div class="community-main">
      <!--<div class="community-main" @click="jumpSelfPoint">-->
      <div class="community-img">
        <!--<img v-if="(locationStatus * 1 === 1 || locationStatus * 1 === 2) && imageUrl" :src="groupInfo.head_image_url || imageUrl+'/yx-image/order/icon-colonel_head@2x.png'">-->
        <img class="p-img" mode="aspectFit" v-if="imageUrl" :src="imageUrl+'/yx-image/2.3/icon-address_sy@2x.png'">
      </div>
      <div class="community-text" v-if="locationStatus * 1 === 1 || locationStatus * 1 === 2">
        <span>{{gName}}</span>
      </div>
      <div class="community-text" v-else>定位中...</div>
      <img class="more-img" mode="aspectFit" v-if="imageUrl" :src="imageUrl+'/yx-image/2.3/icon-pressed_qhztd@2x.png'">
      <!--<img v-if="imageUrl && (locationStatus * 1 === 1 || locationStatus * 1 === 2) && groupInfo.social_name"-->
      <!--:src="imageUrl + '/yx-image/choiceness/icon-pitch@2x.png'" class="community-down">-->
    </div>
    <!--<div class="carousel-wrapper" v-if="buyUsers.length > 0 && (locationStatus * 1 === 1 || locationStatus * 1 === 2)"-->
         <!--:class="{'show': showBuyUser}">-->
      <!--<div class="avatar-wrapper">-->
        <!--<img v-if="buyUsers[showUserIndex] && buyUsers[showUserIndex].head_image_url" :src="buyUsers[showUserIndex].head_image_url" alt="">-->
      <!--</div>-->
      <!--<div class="content">买了{{buyUsers[showUserIndex].goods_name}}</div>-->
    <!--</div>-->
    <section class="carousel-wrapper">
      <swiper
        v-if="buyUsers.length > 0 && (locationStatus * 1 === 1 || locationStatus * 1 === 2)"
        class="carousel"
        :autoplay="true"
        :interval="3000"
        :duration="500"
        circular
        vertical
      >
        <block v-for="(item, index) in buyUsers" :key="index">
          <swiper-item class="content-wrapper">
            <figure class="avatar-wrapper">
              <img v-if="item.head_image_url" lazy-load :src="item.head_image_url" alt="" class="img">
            </figure>
            <div class="text">买了{{item.goods_name}}</div>
          </swiper-item>
        </block>
      </swiper>
      <div class="place-holder"></div>
    </section>
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
    computed: {
      gName() {
        let name = (this.groupInfo && this.groupInfo.social_name) || ''
        return name.substring(0, 5) + (name.length > 5 ? '...' : '')
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
    margin-bottom: 10px
    height :27px
    position :relative
    .community-main
      layout(row)
      align-items: center
      opacity :0.8
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
        max-width: 83px
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
      background: rgba(255,255,255,0.2)
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
            color: #fff
            no-wrap()

</style>
