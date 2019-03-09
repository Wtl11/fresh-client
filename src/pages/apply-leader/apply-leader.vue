<template>
  <div class="apply-leader">
    <navigation-bar :translucent="translucent" :title="title"></navigation-bar>
    <div class="pic-wrapper1">
      <img v-if="imageUrl && corpName === 'platform'" :src="imageUrl + '/yx-image/mine/pic-apply_01@2x.jpg'" alt="">
      <img v-if="imageUrl && corpName === 'retuan'" :src="imageUrl + '/yx-image/retuan/pic-apply_01@2x.jpg'" alt="">
    </div>
    <div class="pic-wrapper2">
      <img v-if="imageUrl && corpName === 'platform'" :src="imageUrl + '/yx-image/mine/pic-apply_02@2x.jpg'" alt="">
      <img v-if="imageUrl && corpName === 'retuan'" :src="imageUrl + '/yx-image/retuan/pic-apply_02@2x.jpg'" alt="">
    </div>
    <div class="pic-wrapper3">
      <img v-if="imageUrl && corpName === 'platform'" :src="imageUrl + '/yx-image/mine/pic-apply_03@2x.jpg'" alt="">
      <img v-if="imageUrl && corpName === 'retuan'" :src="imageUrl + '/yx-image/retuan/pic-apply_03@2x.jpg'" alt="">
    </div>
    <div class="pic-wrapper4">
      <img v-if="imageUrl && corpName === 'platform'" :src="imageUrl + '/yx-image/mine/pic-apply_04@2x.jpg'" alt="">
      <img v-if="imageUrl && corpName === 'retuan'" :src="imageUrl + '/yx-image/retuan/pic-apply_04@2x.jpg'" alt="">
    </div>
    <div class="pic-wrapper5">
      <img v-if="imageUrl && corpName === 'platform'" :src="imageUrl + '/yx-image/mine/pic-apply_05@2x.jpg'" alt="">
      <img v-if="imageUrl && corpName === 'retuan'" :src="imageUrl + '/yx-image/retuan/pic-apply_05@2x.jpg'" alt="">
    </div>
    <div class="pic-wrapper6">
      <img v-if="imageUrl && corpName === 'platform'" :src="imageUrl + '/yx-image/mine/pic-apply_06@2x.jpg'" alt="">
      <img v-if="imageUrl && corpName === 'retuan'" :src="imageUrl + '/yx-image/retuan/pic-apply_06@2x.jpg'" alt="">
    </div>
    <div class="pic-wrapper7">
      <img v-if="imageUrl && corpName === 'platform'" :src="imageUrl + '/yx-image/mine/pic-apply_07@2x.jpg'" alt="">
      <img v-if="imageUrl && corpName === 'retuan'" :src="imageUrl + '/yx-image/retuan/pic-apply_07@2x.jpg'" alt="">
    </div>
    <div class="pic-wrapper8 action-wrapper">
      <img v-if="imageUrl && corpName === 'platform'" :src="imageUrl + '/yx-image/mine/pic-apply_08@2x.jpg'" alt="">
      <img v-if="imageUrl && corpName === 'retuan'" :src="imageUrl + '/yx-image/retuan/pic-apply_08@2x.jpg'" alt="">
      <img class="qr-code" :src="qrCodeImage" alt="">
      <div class="save-wrapper">
        <div class="save-btn" @click="saveImage">保存图片</div>
        <div class="tips">“目前仅开放广州白云区”</div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import NavigationBar from '@components/navigation-bar/navigation-bar'

  const PAGE_NAME = 'APPLY_LEADER'

  export default {
    name: PAGE_NAME,
    components: {
      NavigationBar
    },
    data() {
      return {
        translucent: true,
        title: '申请团长',
        qrCodeImage: ''
      }
    },
    onLoad() {
      this.qrCodeImage = this.imageUrl + '/yx-image/login/wx-qr-code.jpg'
    },
    methods: {
      saveImage() {
        this.$wx.downloadFile({
          url: this.qrCodeImage,
          success: (res) => {
            this.$wx.saveImageToPhotosAlbum({
              filePath: res.tempFilePath,
              success: () => {
                this.$wechat.showToast('保存成功')
              },
              fail: () => {
                // 拒绝授权重新调起授权
                setTimeout(() => {
                  wx.openSetting()
                }, 500)
              }
            })
          }
        })
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
 @import "~@designCommon"

  .apply-leader
    width: 100%
    img
      width: 100%
      height: 100%
      display: block
    .pic-wrapper1, .pic-wrapper2
      width: 100%
      height: 64.5333vw
    .pic-wrapper3
      width: 100%
      height: 142.6vw
    .pic-wrapper4
      width: 100%
      height: 111vw
    .pic-wrapper5, .pic-wrapper6
      width: 100%
      height: 94.6666vw
    .pic-wrapper7
      width: 100%
      height: 75.1333vw
    .pic-wrapper8
      width: 100%
      height: 108.5333vw
    .action-wrapper
      position: relative
      .qr-code
        position: absolute
        top: 32vw
        left: 32vw
        width: 36vw
        height: 36vw
      .save-wrapper
        position: absolute
        bottom: 15vw
        left: 0
        width: 100vw
        box-sizing: border-box
        padding: 0 15px
        .save-btn
          width: 100%
          height: 44px
          background: #FFE100
          border-radius: 44px
          box-shadow: 0 2px 10px 0 rgba(65,117,5,0.57)
          text-align: center
          line-height: 44px
          font-size: $font-size-16
          color: #161315
          font-family: $font-family-medium
        .tips
          margin-top: 13px
          text-align: center
          color: $color-white
          font-size: $font-size-14
</style>
