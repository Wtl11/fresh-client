<template>
  <div class="one-notify" @click="handleRemind">
    <img class="notify-img" v-if="imageUrl" :src="imageUrl + '/yx-image/2.3/icon-informall@2x.png'">
    <div v-if="isShow" class="top-content">一键通知提货<p class="triangle"></p> </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import API from '@api'
  const COMPONENT_NAME = 'ONE_NOTIFY'

  export default {
    name: COMPONENT_NAME,
    data() {
      return {
        isShow: false
      }
    },
    onLoad() {
      const isShow = wx.getStorageSync('showGroupNotify')
      if (!isShow) {
        this.isShow = !isShow
        // wx.setStorageSync('showGroupNotify', 'showGroupNotify')
        // setTimeout(() => {
        //   this.isShow = false
        // }, 3000)
      }
    },
    methods: {
      handleRemind() {
        if (this.isShow) {
          wx.setStorageSync('showGroupNotify', 'showGroupNotify')
          this.isShow = false
        }
        API.Notification.remindDeliveries().then(res => {
          if (res.error !== this.$ERR_OK) {
            if (res.message === '系统异常') {
              this.$wechat.showToast('系统繁忙，请稍后再试。')
              return
            }
            this.$wechat.showToast(res.message)
            return
          }
          this.$wechat.showToast(res.message)
        })
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@designCommon"

  .one-notify
    position fixed
    right :13.5px
    bottom :4%
    width :58px
    height @width
    z-index :99
    display :flex
    align-items :center
    .notify-img
      width: 100%
      height :@width
      display :block
    .top-content
      col-center()
      top:45%
      left: -116px
      border-radius: 6px
      padding:11px
      background: rgba(17,17,17,.7)
      display: flex
      align-items: center
      font-family: $font-family-regular
      font-size: 15px;
      color: #FFFFFF;
      .triangle
        col-center()
        width: 0
        height: 0
        border: 5px solid rgba(17,17,17,.7)
        border-top: 4px solid transparent
        border-bottom: 5px solid transparent
        border-right: 5px solid transparent
        right: -9.8px
        z-index :3
</style>
