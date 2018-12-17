<template>
  <article class="confirm-msg" v-if="isShow" :animation="maskAnimation">
    <!--<div class="mask"  ></div>-->
    <section class="reminderContent" v-if="useType==='reminder'" :animation="modalAnimation">
      <div class="confirm-tip" v-if="tip">{{tip}}</div>
      <div class="msg">{{msg}}</div>
      <img :src="imageUrl + '/yx-image/group/icon-del@2x.png'" v-if="imageUrl" class="close" @tap="cancel">
    </section>
    <section class="content" v-else :animation="modalAnimation">
      <div class="msg">
        <div class="confirm-tip" v-if="tip">{{tip}}</div>
        <div class="text">{{msg}}</div>
      </div>
      <div class="btn-group">
        <div class="btn cancel" @tap="cancel">取消</div>
        <div class="btn confirm" @tap="confirm">{{sureString}}</div>
      </div>
    </section>
  </article>
</template>

<script type="text/ecmascript-6">
  export default {
    props: {
      useType: {
        type: String,
        default: '' // reminder 温馨提示弹窗； ''确认弹窗
      },
      sureString: {
        type: String,
        default: '确定'
      },
      tip: {
        type: String,
        default: ''
      },
      msg: {
        type: String,
        default: ''
      }
    },
    data() {
      return {
        msg: '',
        isShow: false,
        maskAnimation: '',
        modalAnimation: ''
      }
    },
    methods: {
      show(data) {
        if (data) {
          this.msg = data.msg || ''
        }
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
      close() {
        this.isShow = false
        this.$emit('cancel')
      },
      confirm() {
        this.cancel()
        this.$emit('confirm')
      },
      cancel() {
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
  @import "~@design"

  .confirm-msg
    background: rgba(0, 0, 0, 0.60)
    fill-box(fixed)
    z-index: 100
    layout()
    align-items: center
    .mask
      fill-box()
      background-color: $color-20202E
      opacity: 0.8
    .content
      margin-top: 38vh
      position: relative
      width: 320px
      height: 170px
      background-color: $color-white
      border-radius: 6px
      layout()
      .msg
        flex: 1
        layout()
        justify-content: center
        align-items: center
        font-family: $font-family-medium
        font-size: $font-size-16
        color: $color-text-main
        letter-spacing: 0.6px
        text-align: center
        padding-bottom: 4px
        box-sizing: border-box
        .confirm-tip
          font-family: $font-family-medium
          margin-bottom: 20px
      .btn-group
        height: 50px
        layout(row)
        justify-content: space-around
        border-top-1px($color-line)
        .btn
          box-sizing: border-box
          flex: 1
          layout()
          justify-content: center
          align-items: center
          border: 1px solid $color-374B63
          border-radius: 100px
          font-family: $font-family-regular
          font-size: $font-size-16
          color: $color-text-main
          letter-spacing: 0.6px
          &.confirm
            color: $color-main
            border-left-1px($color-line)
            background: $color-F94C5F
            border-radius: 100px
            border-color: transparent
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
      .msg
        width: 71.7%
        line-height: 23px
</style>
