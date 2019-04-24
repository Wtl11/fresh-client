<template>
  <div class="coupon-modal" v-if="isShow" :animation="maskAnimation">
<!--    <section class="content" :class="{one: couponArray.length === 1}" :animation="modalAnimation">-->
<!--      <img class="img-bg"-->
<!--           mode="aspectFill"-->
<!--           v-if="imageUrl && couponArray.length === 1"-->
<!--           :src="imageUrl + '/yx-image/2.1/pic-lqyhqtc-one@2x.png'">-->
<!--      <img class="img-bg"-->
<!--           mode="aspectFill"-->
<!--           v-if="imageUrl && couponArray.length === 2"-->
<!--           :src="imageUrl + '/yx-image/2.1/pic-lqyhqtc@2x.png'">-->
<!--      <img class="img-bg"-->
<!--           mode="aspectFill"-->
<!--           v-if="imageUrl && couponArray.length === 1"-->
<!--           :src="imageUrl + '/yx-image/2.1/pic-lqyhqtc-one.png'">-->
<!--      <img class="img-bg"-->
<!--           mode="aspectFill"-->
<!--           v-if="imageUrl && couponArray.length === 2"-->
<!--           :src="imageUrl + '/yx-image/2.1/pic-lqyhqtc.png'">-->
<!--      <img class="close"-->
<!--           mode="aspectFill"-->
<!--           v-if="imageUrl"-->
<!--           :src="imageUrl + '/yx-image/2.1/icon-deletetc@2x.png'"-->
<!--           @click="cancelHandle"-->
<!--      >-->
<!--      <article class="wrapper">-->
<!--        <div class="place-box"></div>-->
<!--        <div v-for="(item, index) in couponArray" :key="item.coupon_id || index" class="coupon-wrapper">-->
<!--          <coupon-item :dataInfo="item"></coupon-item>-->
<!--        </div>-->
<!--        <p hover-class="none" class="explain" @click="navHandle">优惠券已放入账号 <span class="look">查看></span></p>-->
<!--        <div class="button" @click="submitHandle"></div>-->
<!--      </article>-->
<!--    </section>-->
    <section class="content" @touchmove.stop>
      <img class="img-bg"
           mode="aspectFill"
           v-if="imageUrl"
           :src="imageUrl + '/yx-image/2.3/pic-lqyhqtc.png'">
      <img class="close"
           mode="aspectFill"
           v-if="imageUrl"
           :src="imageUrl + '/yx-image/2.3/icon-deletetc@2x.png'"
           @click="cancelHandle"
      >
      <article class="wrapper">
        <div class="place-box"></div>
        <scroll-view
          class="coupon-wrapper"
          scroll-y
        >
          <div v-for="(item, index) in couponArray" :key="index" class="coupon-item-wrapper">
            <coupon-item :dataInfo="item"></coupon-item>
          </div>
        </scroll-view>
      </article>
      <article class="button-wrapper">
        <img class="img-bg"
             mode="aspectFill"
             v-if="imageUrl"
             :src="imageUrl + '/yx-image/2.3/pic-coupontc_up.png'">
      </article>
    </section>
  </div>
</template>

<script type="text/ecmascript-6">
  import AnimationModal from '@mixins/animation-modal'
  import CouponItem from './coupon-item/coupon-item'
  import API from '@api'

  const COMPONENT_NAME = 'COUPON_MODAL'

  export default {
    name: COMPONENT_NAME,
    mixins: [AnimationModal],
    components: {
      CouponItem
    },
    data() {
      return {
        isShow: true,
        couponArray: [1]
      }
    },
    methods: {
      _targetList() {
        let arr = this.couponArray.map((item) => {
          return item.coupon_activity_id || 0
        })
        API.Coupon.targetModal({coupon_activity_ids: arr}).catch(e => {
          console.error(e)
        })
      },
      navHandle() {
        this._targetList()
        this.hide()
        wx.navigateTo({url: '/pages/coupon-mine'})
      },
      cancelHandle() {
        this._targetList()
        this.hide()
      },
      submitHandle() {
        this._targetList()
        this.hide()
      },
      show(arr = []) {
        if (!arr.length) {
          return
        }
        this.couponArray = arr
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
        // todo some thing
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
    background-color: rgba(17, 17, 17, 0.7)
    fill-box(fixed)
    z-index: 999
    display :flex
    justify-content :center
    align-items :center
    .content
      position: relative
      width: 71.33333333333334vw
      height :102.26666666666667vw
      margin-top :-15%
      .button-wrapper
        position :absolute
        right :1.0666666666666667vw
        left :@right
        bottom :0
        height :27.73333333333333vw
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
      .wrapper
        position :relative
        .place-box
          height :165px
        .coupon-wrapper
          position :relative
          width :229px
          height: 150px
          margin :0 auto
          ::-webkit-scrollbar
            width: 0
            height: 0
            color: transparent
          .coupon-item-wrapper
            width :100%

</style>
