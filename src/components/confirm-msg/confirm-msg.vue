<template>
  <form action="" report-submit @submit="$getFormId">
  <article class="confirm-msg" v-if="isShow" :animation="maskAnimation" @click="cancelIncome">
    <!--<div class="mask"  ></div>-->
    <button class="content" v-if="useType==='single'" :animation="modalAnimation">
      <div class="msg">{{showMsg || msg}}</div>
      <div class="btn-group">
        <div class="btn confirm" @tap="confirm" :class="'corp-' + corpName + '-text'">知道了</div>
      </div>
    </button>
    <section class="content" v-else-if="useType==='double'" :animation="modalAnimation">
      <div class="msg">{{showMsg || msg}}</div>
      <div formType="submit" class="btn-group">
        <div formType="submit" class="btn cancel" @tap="cancel">取消</div>
        <div  formType="submit" class="btn confirm" @tap="confirm" :class="'corp-' + corpName + '-text'">{{sureString}}</div>
      </div>
    </section>
    <section class="content" v-else-if="useType==='close'" :animation="modalAnimation">
      <div class="title">{{title}}</div>
      <div class="close" @click.stop="cancel"><img :src="imageUrl+'/ws-image/ws-saas/icon-close@2x.png'" alt="" class="close-img"></div>
      <div class="coninfo">{{showMsg || msg}}</div>
      <!--<div class="msg">{{msg}}</div>-->
    </section>
    <section class="content income-content" v-else-if="useType==='income'" :animation="modalAnimation"  @click.stop>
      <div class="income-colse" @click="cancelIncome">
        <img v-if="imageUrl" :src="imageUrl + '/yx-image/wallet/icon-del@2x.png'" alt="">
      </div>
      <div class="income-title">亲爱的团长：</div>
      <div class="income-msg">为保障您享有合法的收益权利，在以下两种场景，该订单产生的收益由待入账自动转入已入账中。</div>
      <img v-if="imageUrl && corpName === 'platform'" mode="widthFix" :src="imageUrl + '/yx-image/wallet/pic-account_entry1@2x.png'" alt="" class="income-img income-img-bottom">
      <img v-if="imageUrl && corpName === 'platform'" mode="widthFix" :src="imageUrl + '/yx-image/wallet/Rectangle@2x.png'" alt="" class="income-img">
      <img v-if="imageUrl && corpName === 'retuan'" mode="widthFix" :src="imageUrl + '/yx-image/retuan/pic-flow@2x.png'" alt="" class="income-img">
    </section>
    <section class="content" v-else :animation="modalAnimation">
      <div class="title item">{{title}}</div>
      <div class="coninfo show">{{showMsg || msg}}</div>
      <div class="btn-group">
        <div class="btn cancel" @tap="cancel">取消</div>
        <div class="btn confirm" :class="'corp-' + corpName + '-text'" @tap="confirm">{{sureString}}</div>
      </div>
    </section>
  </article>
  </form>
</template>

<script type="text/ecmascript-6">
  // import wx from 'wx'
  import AnimationModal from '@mixins/animation-modal'
  export default {
    mixins: [AnimationModal],
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
        default: '如您购买的商品有任何问题,请联系团长进行退款。'
      }
    },
    data () {
      return {
        isShow: false,
        // maskAnimation: '',
        // modalAnimation: ''
        showMsg: ''
      }
    },
    onUnload() {
      this.isShow = false
      this.showMsg = ''
    },
    methods: {
      show (msg) {
        if (msg) {
          this.showMsg = msg
        }
        // let modalAnimation = wx.createAnimation({
        //   duration: 500,
        //   timingFunction: 'cubic-bezier(1, -0.07, 0.51, 1.48)',
        //   delay: 0
        // })
        // let maskAnimation = wx.createAnimation({
        //   duration: 500,
        //   timingFunction: 'linear',
        //   delay: 0
        // })
        // maskAnimation.opacity(0).step()
        // // modalAnimation.scale(0.3).step()
        // this.maskAnimation = maskAnimation.export()
        // this.modalAnimation = modalAnimation.export()
        // this.isShow = true
        // setTimeout(() => {
        //   maskAnimation.opacity(1).step()
        //   // modalAnimation.scale(1).step()
        //   this.maskAnimation = maskAnimation.export()
        //   this.modalAnimation = modalAnimation.export()
        // }, 200)
        if (this.isShow) {
          return
        }
        this.isShow = true
        this.showAnimation()
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
        // let modalAnimation = wx.createAnimation({
        //   duration: 300,
        //   timingFunction: 'linear',
        //   delay: 0
        // })
        // let maskAnimation = wx.createAnimation({
        //   duration: 300,
        //   timingFunction: 'linear',
        //   delay: 0
        // })
        // maskAnimation.opacity(0).step()
        // // modalAnimation.scale(0.3).step()
        // this.maskAnimation = maskAnimation.export()
        // this.modalAnimation = modalAnimation.export()
        // setTimeout(() => {
        //   maskAnimation.opacity(1).step()
        //   // modalAnimation.scale(1).step()
        //   this.maskAnimation = maskAnimation.export()
        //   this.modalAnimation = modalAnimation.export()
        //   this.isShow = false
        // }, 300)
        this.hideAnimation(() => {
          this.isShow = false
        })
        this.$emit('cancel')
      },
      cancelIncome () {
        if (this.useType !== 'income') return
        // this.isShow = false
        // this.$emit('close')
        // let modalAnimation = wx.createAnimation({
        //   duration: 300,
        //   timingFunction: 'linear',
        //   delay: 0
        // })
        // let maskAnimation = wx.createAnimation({
        //   duration: 300,
        //   timingFunction: 'linear',
        //   delay: 0
        // })
        // maskAnimation.opacity(0).step()
        // // modalAnimation.scale(0.3).step()
        // this.maskAnimation = maskAnimation.export()
        // this.modalAnimation = modalAnimation.export()
        // setTimeout(() => {
        //   maskAnimation.opacity(1).step()
        //   // modalAnimation.scale(1).step()
        //   this.maskAnimation = maskAnimation.export()
        //   this.modalAnimation = modalAnimation.export()
        //   this.isShow = false
        // }, 300)
        this.isShow = true
        this.showAnimation()
        this.$emit('cancel')
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
 @import "~@designCommon"

  .confirm-msg
    background-color: rgba(17, 17, 17, 0.7)
    fill-box(fixed)
    z-index: 500
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
      opacity :1
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
        font-family: $font-family-medium
        font-size: $font-size-16
        color: $color-text-main
        letter-spacing: 0.05px
        text-align: center
        padding :0 34.5px
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
        &:first-child
          border-right-1px(#E0E2E5)
          color: #1F1F1F
    .income-content
      padding: 25px 20px
      position: relative
      .income-colse
        position: absolute
        width: 13px
        height: 13px
        top: 15px
        right: 15px
        img
          width: 100%
          height: 100%
          display: block
      .income-title
        font-size: $font-size-16
        font-family: $font-family-medium
        color: $color-text-main
        margin-bottom: 15px
      .income-msg
        font-size: $font-size-14
        font-family: $font-family-regular
        color: $color-text-main
        line-height: 22px
        margin-bottom: 10px
        padding-right: 10px
      .income-assist
        font-size: $font-size-12
        font-family: $font-family-regular
        color: $color-text-assist
        margin-bottom: 15px
      .income-img
        width: 100%
        display: block
      .income-img-bottom
        margin-bottom: 10px
</style>
