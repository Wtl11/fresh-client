<template>
  <div class="coupon-share-modal" v-if="isShow" :animation="maskAnimation">
    <div class="mask" @click="hide"></div>
    <section class="content" :animation="modalAnimation">
      <div class="title">发送优惠券</div>
      <ul class="btn-group">
        <li
          v-for="(item, index) in buttonArray"
          :key="index"
          class="button-item"
          :class="{active: buttonIndex === index}"
          @click="chooseHandle(item, index)"
        >
          <div class="border-wrapper" :class="{active: buttonIndex === index}"></div>
          <input
            v-if="item.type === 'input' && !isShowing"
            type="number"
            class="input-wrapper"
            maxlength="9"
            placeholder="自定义"
            placeholder-class="input-placeholder"
            :adjust-position="true"
            v-model="buttonArray[buttonArray.length-1].text"
          >
          <p v-else>{{item.text}}</p>
          <p v-if="item.type === 'input' && isShowing" class="input-placeholder">自定义</p>
        </li>
        <!--<div class="btn confirm" @tap="confirm" :class="'corp-' + corpName + '-text'">知道了</div>-->
      </ul>
      <div class="submit-wrapper">
        <div class="btn" :class="'corp-' + corpName + '-bg'" @click="submitHandle">确定</div>
      </div>
    </section>
  </div>
</template>

<script type="text/ecmascript-6">
  import AnimationModal from '@mixins/animation-modal'
  const COMPONENT_NAME = 'COUPON_SHARE_MODAL'

  export default {
    name: COMPONENT_NAME,
    mixins: [AnimationModal],
    data() {
      return {
        isShow: false,
        isShowing: true,
        buttonArray: [
          {text: 1},
          {text: 5},
          {text: 10},
          {text: 15},
          {text: 20},
          {text: '', type: 'input'}
        ],
        buttonIndex: 1
      }
    },
    onUnload() {
      this._resetStatus()
    },
    methods: {
      show() {
        if (this.isShow) {
          return
        }
        this.isShow = true
        this._resetStatus()
        this.showAnimation((duration) => {
          setTimeout(() => {
            this.isShowing = false
          }, duration)
        })
      },
      hide() {
        if (this.isShowing) {
          return
        }
        this.hideAnimation(() => {
          this.isShow = false
          this.isShowing = true
        })
      },
      submitHandle() {
        let val = this.buttonArray[this.buttonIndex].text
        if (val < 1) {
          return
        }
        this.hide()
        wx.navigateTo({url: `/pages/coupon-share?packetId=11`})
      },
      chooseHandle(item, index) {
        this.buttonIndex = index
      },
      _resetStatus() {
        this.buttonIndex = 1
        this.buttonArray[this.buttonArray.length - 1].text = ''
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@designCommon"

  .input-placeholder
    font-family: $font-family-regular
    font-size: 14px
    color: #B7B7B7
    text-align: center

  .coupon-share-modal
    background-color: rgba(17, 17, 17, 0.8)
    fill-box(fixed)
    z-index: 100
    .mask
      fill-box(absolute)
    .content
      position: relative
      width: 290px
      background-color: $color-white
      border-radius: 6px
      margin :56vw auto 0
      font-family :$font-family-medium
      line-height :1
      color: $color-text-main
      text-align :center
      .title
        padding:25px
        font-size: 16px
      .btn-group
        font-family: $font-family-regular
        font-size: 14px;
        color: $color-text-main
        padding :0 24px
        layout(row)
        justify-content :space-between
        .button-item
          width :75px
          height :31px
          background: #F6F6F6;
          border-radius: 2px;
          line-height :@height
          margin-bottom :9px
          position: relative
          &.active
            background: rgba(115,194,0,0.12);
          .border-wrapper
            fill-box(absolute)
            border: 1px solid transparent
            border-radius: 2px
            transition: border  0.3s
            &.active
              border-color: $color-main
          .input-wrapper
            height :31px
            padding :0 5px
            line-height :31px
      .submit-wrapper
        padding :16px 0 20px
        font-family: $font-family-regular
        font-size: 16px
        color: #FFFFFF
        .btn
          margin :0 auto
          width :134px
          height :36px
          border-radius :@height
          line-height :@height
</style>
