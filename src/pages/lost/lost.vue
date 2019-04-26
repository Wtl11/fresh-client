<template>
  <div class="lost">
    <navigation-bar :title="shopName" :showArrow="false"></navigation-bar>
    <div class="img-box">
      <img :src="imageUrl + '/yx-image/group/pic-miss@2x.png'" v-if="imageUrl" class="error-img">
      <p class="text">抱歉！您访问的页面丢失啦</p>
    </div>
    <navigator class="btn" :class="'corp-' + corpName + '-bg'" open-type="switchTab" url="/pages/choiceness">返回首页</navigator>
  </div>
</template>

<script type="text/ecmascript-6">
  import NavigationBar from '@components/navigation-bar/navigation-bar'

  const PAGE_NAME = 'LOST'

  export default {
    name: PAGE_NAME,
    data() {
      return {}
    },
    onLoad(e) {
      if (e && e.shopId) {
        const shopId = wx.getStorageSync('defaultShopId')
        if (shopId) {
          wx.setStorageSync('shopId', shopId)
        }
        // wx.setStorageSync('shopId', wx.getStorageSync('defaultShopId'))
      }
    },
    components: {
      NavigationBar
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
 @import "~@designCommon"

  .lost
    padding-top: 22.48vh
    box-sizing: border-box

  .img-box
    display: flex
    flex-direction: column
    justify-content: center
    align-items: center
    height: 138.5px
    .error-img
      display: block
      height: 110px
      width: 116px
    .text
      text-align: center
      font-size: $font-size-14
      color: $color-text-sub
      font-family: $font-family-regular
      margin-top: 14.5px

  .btn
    width: 100px
    height: 32px
    line-height: 32px
    text-align: center
    border-radius: 16px
    color: $color-white
    font-size: $font-size-14
    margin: 30px auto
</style>
