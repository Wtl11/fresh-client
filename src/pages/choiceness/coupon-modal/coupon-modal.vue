<template>
  <div class="coupon-modal" v-if="isShow" :animation="maskAnimation">
    <section class="content" :class="{one: couponArray.length === 1}" :animation="modalAnimation">
      <img class="img-bg"
           mode="aspectFill"
           v-if="imageUrl && couponArray.length === 1"
           :src="imageUrl + '/yx-image/2.1/pic-lqyhqtc-one@2x.png'">
      <img class="img-bg"
           mode="aspectFill"
           v-if="imageUrl && couponArray.length === 2"
           :src="imageUrl + '/yx-image/2.1/pic-lqyhqtc@2x.png'">
      <img class="img-bg"
           mode="aspectFill"
           v-if="imageUrl && couponArray.length === 1"
           :src="imageUrl + '/yx-image/2.1/pic-lqyhqtc-one.png'">
      <img class="img-bg"
           mode="aspectFill"
           v-if="imageUrl && couponArray.length === 2"
           :src="imageUrl + '/yx-image/2.1/pic-lqyhqtc.png'">
      <img class="close"
           mode="aspectFill"
           v-if="imageUrl"
           :src="imageUrl + '/yx-image/2.1/icon-deletetc@2x.png'"
           @click="cancelHandle"
      >
      <article class="wrapper">
        <div class="place-box"></div>
        <div v-for="(item, index) in couponArray" :key="index" class="coupon-wrapper">
          <coupon-item></coupon-item>
        </div>
        <p hover-class="none" class="explain" @click="navHandle">优惠券已放入账号 <span class="look">查看></span></p>
        <div class="button" @click="submitHandle"></div>
      </article>
    </section>
  </div>
</template>

<script type="text/ecmascript-6">
  import AnimationModal from '@mixins/animation-modal'
  import CouponItem from './coupon-item/coupon-item'
  const COMPONENT_NAME = 'COUPON_MODAL'

  export default {
    name: COMPONENT_NAME,
    mixins: [AnimationModal],
    components: {
      CouponItem
    },
    data() {
      return {
        isShow: false,
        couponArray: new Array(2).fill(1)
      }
    },
    methods: {
      navHandle() {
        this.hide()
        wx.navigateTo({url: '/pages/coupon-mine'})
      },
      cancelHandle() {
        this.hide()
      },
      submitHandle() {
        this.hide()
      },
      show() {
        if (this.isShow) {
          return
        }
        this.isShow = true
        this._resetStatus()
        this.showAnimation()
      },
      hide() {
        this.hideAnimation(() => {
          this.isShow = false
        })
      },
      _resetStatus() {
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@designCommon"

  .img-bg
    fill-box(absolute)
    display :block
    width :100%
    height :100%
    font-size :0
    line-height :0

  .close
    width :8vw
    height :@width
    position :absolute
    right :-1.3333333333333335vw
    top:-2.66vw
    z-index :3

  .coupon-modal
    background-color: rgba(17, 17, 17, 0.8)
    fill-box(fixed)
    z-index: 100
    .content
      position: relative
      width: 71.33333333333334vw
      height :102.26666666666667vw
      margin :39.6vw auto 0
      &.one
        height :86.26666666666667vw
      .wrapper
        position :relative
        .place-box
          height :47.733333333333334vw
        .coupon-wrapper
          position :relative
          margin :0 auto 1.6vw
          z-index :2
          width :50.4vw
        .explain
          padding-top :4.266666666666667vw
          font-family: $font-family-regular
          font-size: 3.2vw
          color: #FFFFFF;
          line-height: @font-size
          text-align :center
          .look
            text-decoration :underline
        .button
          margin :1.866666666666667vw auto
          height :8.799999999999999vw
          width :35.46666666666667vw
</style>
