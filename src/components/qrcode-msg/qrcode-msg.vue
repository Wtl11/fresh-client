<template>
  <article class="confirm-msg mine-model" v-if="isShow" :animation="maskAnimation">
    <div class="content model-con" :animation="modalAnimation">
      <div class="erm">
        <img class="erm-img" :src="cordImgUrl" alt="">
      </div>
      <div class="txt">向团长出示二维码提货</div>
    </div>
  </article>
</template>

<script type="text/ecmascript-6">
  import wx from 'wx'
  export default {
    props: {
      useType: String,
      cordImgUrl: {
        type: String,
        default: ''
      }
    },
    data () {
      return {
        isShow: false,
        maskAnimation: '',
        modalAnimation: ''
      }
    },
    methods: {
      show () {
        let modalAnimation = wx.createAnimation({
          duration: 500,
          timingFunction: 'cubic-bezier(1, -0.07, 0.51, 1.48)',
          delay: 0
        })
        let maskAnimation = wx.createAnimation({
          duration: 500,
          timingFunction: 'linear',
          delay: 0
        })
        maskAnimation.opacity(0).step()
        modalAnimation.scale(0.3).step()
        this.maskAnimation = maskAnimation.export()
        this.modalAnimation = modalAnimation.export()
        this.isShow = true
        setTimeout(() => {
          maskAnimation.opacity(1).step()
          modalAnimation.scale(1).step()
          this.maskAnimation = maskAnimation.export()
          this.modalAnimation = modalAnimation.export()
        }, 200)
        this.$emit('show')
      },
      close () {
        this.isShow = false
        this.$emit('cancel')
      },
      confirm () {
        this.cancel()
        this.$emit('confirm')
      },
      cancel () {
        // this.isShow = false
        // this.$emit('close')
        let modalAnimation = wx.createAnimation({
          duration: 300,
          timingFunction: 'linear',
          delay: 0
        })
        let maskAnimation = wx.createAnimation({
          duration: 300,
          timingFunction: 'linear',
          delay: 0
        })
        maskAnimation.opacity(0).step()
        modalAnimation.scale(0.3).step()
        this.maskAnimation = maskAnimation.export()
        this.modalAnimation = modalAnimation.export()
        setTimeout(() => {
          maskAnimation.opacity(1).step()
          modalAnimation.scale(1).step()
          this.maskAnimation = maskAnimation.export()
          this.modalAnimation = modalAnimation.export()
          this.isShow = false
        }, 300)
        this.$emit('cancel')
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
 @import "~@designCommon"
  .confirm-msg
    background-color: rgba(17, 17, 17, 0.8)
    fill-box(fixed)
    z-index: 100
    layout()
    align-items: center
    .mask
      fill-box()
      background-color: $color-20202E
      opacity: 0.8
    .content
      position: relative
      width: 290px
      min-height: 320px
      background-color: $color-white
      border: 1px solid rgba(32, 32, 46, 0.10)
      border-radius: 8px
      layout()
      left:0
      top:0
      bottom:0
      right:0
      margin:auto
      .erm
        width: 150px
        height: 150px
        background-color: #f6f6f6
        margin: 65px auto 0
        .erm-img
          display: block
          width: 100%
          height: 100%
      .txt
        font-family: $font-family-medium
        font-size: $font-size-16
        color: $color-main
        margin-top: 29px
        text-align: center
        letter-spacing: 0.5px
</style>
