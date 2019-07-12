<template>
  <div class="coupon-common">
    <div class="img-wrapper">
      <img class="img" mode="aspectFill" v-if="imageUrl" :src="imageUrl + '/yx-image/2.1/pic-lqcoupon.png'">
      <img class="img" mode="aspectFill" v-if="imageUrl" :src="imageUrl + '/yx-image/2.1/pic-lqcoupon@2x.png'">
    </div>
    <div class="content">
      <section class="coupon-info-wrapper">
        <div class="coupon-item-wrapper">
          <coupon-item :dataInfo="couponInfo"></coupon-item>
        </div>
        <div class="line-wrapper">
          <img class="line" v-if="imageUrl" :src="imageUrl + '/yx-image/2.1/pic-wire@2x.png'">
        </div>
        <div class="button-wrapper" :style="pageConfig.btnStyle">
          <button
            :open-type="pageConfig.openType"
            @getuserinfo="getUserInfoHandle"
            @click="buttonHandle"
            class="button"
            :class="pageConfig.btnCName"
          >
            {{pageConfig.btnText}}
          </button>
        </div>
        <p v-if="pageConfig.btnExplain" class="explain">{{pageConfig.btnExplain}}</p>
      </section>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import CouponItem from './coupon-item/coupon-item'
  const COMPONENT_NAME = 'COUPON_COMMON'

  export default {
    name: COMPONENT_NAME,
    components: {
      CouponItem
    },
    props: {
      pageConfig: {
        type: Object,
        default: () => {}
      },
      couponInfo: {
        type: Object,
        default: () => undefined
      }
    },
    data() {
      this.allowButton = true
      return {
      }
    },
    onUnload() {
      this.allowButton = true
      clearTimeout(this.timer)
    },
    methods: {
      getUserInfoHandle(e) {
        this.$emit('getUserInfo', e)
      },
      buttonHandle() {
        if (this.allowButton) {
          this.allowButton = false
          this.$emit('buttonHandle')
          this.timer = setTimeout(() => {
            this.allowButton = true
          }, 500)
        }
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@designCommon"

  .img
    fill-box(absolute)
    width :100%
    height :100%
    line-height :0
    font-size :0

  .coupon-common
    .img-wrapper
      height :100vw
      position :relative
    .content
      padding :10.5px 15px
      .coupon-info-wrapper
        font-family: $font-family-regular
        padding :0 15px
        background: rgba(255,244,216,0.7)
        border-radius: 6px
        .coupon-item-wrapper
          padding-top :15px
        .line-wrapper
          padding:16.5px 0
          width :100%
          height :1px
          .line
            display :block
            width :100%
            height :1px
        .button-wrapper
          padding-bottom :0
          .button
            height :12vw
            background: #FF8506
            border-radius: 6px;
            font-size: 18px;
            color: #FFFFFF;
            text-align: center;
            line-height: @height
            &.disable
              background :#b7b7b7
        .explain
          padding :7.5px 0 15px
          font-size: 11px;
          color: rgba(224,112,0,0.8)
          text-align: center
          line-height: 12px;
</style>
