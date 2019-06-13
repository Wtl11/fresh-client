<template>
  <div class="error lost">
    <navigation-bar :title="shopName" :showArrow="false"></navigation-bar>
    <div class="img-box">
      <img src="/static/img/pic-wifi@2x.png" class="error-img">
      <p class="text">网络繁忙，稍后再试吧！</p>
    </div>
    <div class="btn" :class="'corp-' + corpName + '-bg'" @click="_refresh">刷新</div>
  </div>
</template>

<script type="text/ecmascript-6">
  import NavigationBar from '@components/navigation-bar/navigation-bar'
  import app from '@src/main'

  const PAGE_NAME = 'ERROR'
  const TAB_BAR = app.config.tabBar.list
  export default {
    name: PAGE_NAME,
    data() {
      return {
        isTab: false,
        targetPage: ''
      }
    },
    onLoad() {
      this.targetPage = wx.getStorageSync('errorUrl')
      this.isTab = TAB_BAR.findIndex((item) => this.targetPage.includes(item.pagePath))
    },
    methods: {
      _refresh() {
        if (!getApp().globalData.isConnected) {
          this.$wechat.showToast('请检查您的网络')
          return
        }
        if (this.isTab) {
          wx.redirectTo({url: '/' + this.targetPage})
          return
        }
        wx.switchTab({url: '/' + this.targetPage})
      }
    },
    components: {
      NavigationBar
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
 @import "~@designCommon"

  .error
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
