<template>
  <div class="lost">
    <navigation-bar title="开启定位"></navigation-bar>
    <div class="img-box">
      <img :src="imageUrl + '/yx-image/order/pic-address@2x.png'" v-if="imageUrl" class="error-img">
      <p class="text">亲，我们未获得您的位置信息</p>
    </div>
    <button class="btn" open-type="openSetting" @click="openLocation" :class="'corp-' + corpName + '-bg'">开启定位</button>
    <!--<navigator class="btn select-btn" url="/pages/self-point">手动选择自提点</navigator>-->
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
    onLoad() {},
    onShow() {
      wx.getSetting({
        success: (data) => {
          if (data.authSetting['scope.userLocation']) {
            wx.getLocation({
              success(res) {
                wx.setStorageSync('locationData', res)
                wx.setStorageSync('locationShow', 1)
                if (wx.getStorageSync('lastPage')) {
                  wx.navigateTo({url: wx.getStorageSync('lastPage')})
                  wx.removeStorage('lastPage')
                } else {
                  wx.switchTab({
                    url: `/pages/choiceness`
                  })
                }
              }
            })
          }
        }
      })
    },
    methods: {
      openLocation() {
        wx.getLocation({
          success(res) {
          },
          fail(res) {
            wx.openSetting({})
          }
        })
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
    width: 72vw
    height: 45px
    line-height: 45px
    text-align: center
    border-radius: 50px
    color: $color-white
    font-size: $font-size-16
    margin: 50px auto 0
  .select-btn
    background: $color-white
    border-1px($color-text-assist, 50px)
    color: $color-text-main
    margin: 20px auto 0
    &:active
      color: $color-text-main
      background: $color-white
</style>
