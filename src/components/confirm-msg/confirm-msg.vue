<template>
  <article class="confirm-msg" v-if="isShow" :animation="maskAnimation">
    <!--<div class="mask"  ></div>-->
    <section class="content" v-if="useType==='single'" :animation="modalAnimation">
      <div class="msg">{{msg}}</div>
      <div class="btn-group">
        <div class="btn confirm" @tap="confirm">知道了</div>
      </div>
    </section>
    <section class="content" v-else-if="useType==='double'" :animation="modalAnimation">
      <div class="msg">{{msg}}</div>
      <div class="btn-group">
        <div class="btn cancel" @tap="cancel">取消</div>
        <div class="btn confirm" @tap="confirm">{{sureString}}</div>
      </div>
    </section>
    <section class="content" v-else-if="useType==='close'" :animation="modalAnimation">
      <div class="title">{{title}}</div>
      <div class="close" @click.stop="cancel"><img :src="imageUrl+'/ws-image/ws-saas/icon-close@2x.png'" alt="" class="close-img"></div>
      <div class="coninfo">{{msg}}</div>
      <!--<div class="msg">{{msg}}</div>-->
    </section>
    <section class="content" v-else :animation="modalAnimation">
      <div class="title item">{{title}}</div>
      <div class="coninfo show">{{msg}}</div>
      <div class="btn-group">
        <div class="btn cancel" @tap="cancel">取消</div>
        <div class="btn confirm" @tap="confirm">{{sureString}}</div>
      </div>
    </section>
  </article>
</template>

<script type="text/ecmascript-6">
  import wx from 'wx'
  export default {
    props: {
      useType: String,
      sureString: {
        type: String,
        default: '确定'
      },
      title: {
        type: String,
        default: '温馨提示'
      },
      msg: {
        type: String,
        default: '如您购买的商品有任何问题请联系团长进行退款。'
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
  @import "~@design"

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
      min-height: 150px
      background-color: $color-white
      border: 1px solid rgba(32, 32, 46, 0.10)
      border-radius: 6px
      layout()
      left:0
      top:0
      bottom:0
      right:0
      margin:auto
      .title
        font-family: $font-family-medium
        font-size: $font-size-16
        color: $color-sub
        text-align: center
        padding: 35px 0 18px 0
        line-height: 16px
      .item
        padding: 25px 0 18px 0
      .coninfo
        font-family: $font-family-regular
        font-size: $font-size-16
        width: 208px
        margin: 0 auto
        color: $color-text-main
        text-align: center
        line-height: 23px
      .show
        padding-bottom: 28px
      .msg
        flex: 1
        layout()
        justify-content: center
        align-items: center
        font-family: $font-family-regular
        font-size: $font-size-16
        color: $color-text-main
        letter-spacing: 0.05px
        text-align: center
      .close
        width: 30px
        right: 5px
        top: 5px
        position: absolute
        layout(row)
        justify-content: center
        align-items: center
        height: 30px
      .close-img
        display: block
        width: 13px
        height: 13px
      .btn-group
        width: 100%
        height: 45px
        border-top-1px(#E0E2E5)
        layout(row)
      .btn
        width: 50%
        height: 45px
        text-align: center
        line-height: 45px
        box-sizing: border-box
        font-family: $font-family-regular
        font-size: $font-size-16
        color: $color-main
        &:first-child
          border-right-1px(#E0E2E5)
          color: #1F1F1F
</style>
