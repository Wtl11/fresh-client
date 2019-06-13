<template>
  <div class="reminder-modal">
    <article class="confirm-msg" v-if="isShow" :animation="maskAnimation" @click="cancel">
      <section class="reminderContent" :animation="modalAnimation" @click.stop>
        <div class="confirm-tip" >温馨提示</div>
        <div class="message-wrapper">
          <div>该账号被冻结，请联系客服处理</div>
          <div class="action-wrapper">
            <div>客服微信：weixin0021</div>
            <div class="copy-btn" :class="'corp-' + corpName + '-goods-btn'" @click="copy">复制</div>
          </div>
        </div>
        <img :src="imageUrl + '/yx-image/group/icon-del@2x.png'" v-if="imageUrl" class="close" @click="cancel">
      </section>
    </article>
  </div>
</template>

<script type="text/ecmascript-6">
  const COMPONENT_NAME = 'REMINDER_MODAL'

  export default {
    name: COMPONENT_NAME,
    data() {
      return {
        isShow: false,
        maskAnimation: '',
        modalAnimation: '',
        wechatNumber: 'weixin0021'
      }
    },
    methods: {
      show() {
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
      cancel() {
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
      },
      copy() {
        this.$wx.setClipboardData({
          data: this.wechatNumber
        })
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
 @import "~@designCommon"

  .confirm-msg
    background: rgba(0, 0, 0, 0.60)
    fill-box(fixed)
    z-index: 100
    layout()
    align-items: center
    .reminderContent
      border-radius: 6px
      background: $color-white
      display: flex
      align-items: center
      justify-content: center
      flex-direction: column
      position: relative
      height: 150px
      width: 290px
      margin-top: 38vh
      font-size: $font-size-16
      font-family: $font-family-regular
      text-align: center
      .close
        position: absolute
        top: 13px
        right: 13px
        height: 13px
        width: @height
      .confirm-tip
        margin-bottom: 18px
        font-family: $font-family-medium
      .message-wrapper
        font-size: $font-size-16
        .action-wrapper
          layout(row)
          align-items: center
          margin-top: 15px
          .copy-btn
            margin-left: 10px
            padding: 5.5px 17px
            font-size: $font-size-13

</style>
