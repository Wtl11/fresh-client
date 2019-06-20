<template>
  <div class="banner">
    <swiper
      class="banner-swiper"
      autoplay
      circular
      interval="5000"
    >
      <block>
        <swiper-item>
          <img mode="aspectFill" v-if="imageUrl" :src="imageUrl + '/yx-image/invitation/pic-yqylbanner@2x.png'" class="banner-img" @click="goInv">
        </swiper-item>
      </block>
    </swiper>
  </div>
</template>

<script type="text/ecmascript-6">
  const PAGE_NAME = 'BANNER'

  export default {
    name: PAGE_NAME,
    props: {
      bannerList: {
        type: Array,
        default: () => {
          return [
            {image_url: 'http://social-shopping-api-1254297111.picgz.myqcloud.com/1/2019/06/12/156032756916647.png'},
            {image_url: ''}
          ]
        }
      }
    },
    data() {
      return {}
    },
    methods: {
      goInv() {
        wx.navigateTo({url: this.$routes.activity.INVITATION_INTRODUCTION})
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@designCommon"

  .banner
    border-radius: 6px
    overflow: hidden
    height: 70px
    margin: 12px 12px 0

  .banner-swiper
    border-radius: 6px
    overflow: hidden
    width: 100%
    height: 100%

  .banner-img
    border-radius: 6px
    width: 100%
    height: 100%
</style>
