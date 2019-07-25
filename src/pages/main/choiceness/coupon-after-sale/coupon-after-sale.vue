<template>
  <div class="coupon-modal" v-if="isShow" :animation="maskAnimation">
    <section v-if="couponArray.length > 1" class="content" @touchmove.stop>
      <img class="img-bg"
           mode="aspectFill"
           v-if="imageUrl"
           :src="imageUrl + '/yx-image/2.4/pic-lqyhqtc-more.png'">
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
        <p hover-class="none" class="explain" @click="navHandle">优惠券已放入账号 <span class="look">查看></span></p>
        <img class="button"
             mode="aspectFill"
             v-if="imageUrl"
             :src="imageUrl + '/yx-image/2.3/btn-touse.png'"
             @click="submitHandle"
        >
      </article>
    </section>
    <section v-else class="content one" @touchmove.stop>
      <img class="img-bg"
           mode="aspectFill"
           v-if="imageUrl"
           :src="imageUrl + '/yx-image/2.4/pic-lqyhqtc.png'">
      <img class="close"
           mode="aspectFill"
           v-if="imageUrl"
           :src="imageUrl + '/yx-image/2.3/icon-deletetc@2x.png'"
           @click="cancelHandle"
      >
      <article class="wrapper">
        <div class="place-box one"></div>
        <div
          class="coupon-wrapper"
        >
          <div v-for="(item, index) in couponArray" :key="index" class="coupon-item-wrapper">
            <coupon-item :dataInfo="item"></coupon-item>
          </div>
        </div>
      </article>
      <article class="button-wrapper">
        <p hover-class="none" class="explain one" @click="navHandle">优惠券已放入账号 <span class="look">查看></span></p>
        <img class="button"
             mode="aspectFill"
             v-if="imageUrl"
             :src="imageUrl + '/yx-image/2.3/btn-touse.png'"
             @click="submitHandle"
        >
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
        isShow: false,
        couponArray: []
      }
    },
    methods: {
      _targetList() {
        let arr = this.couponArray.map((item) => {
          return item.coupon_activity_report_id || 0
        })
        API.Coupon.targetModal({coupon_activity_report_ids: arr}).catch(e => {
          console.error(e)
        })
      },
      navHandle() {
        this._targetList()
        this.hide()
        wx.navigateTo({url: `${this.$routes.main.COUPON_MINE}`})
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
    z-index: 997
    display :flex
    justify-content :center
    align-items :center
    .content
      position: relative
      width: 71.33333333333334vw
      height :102.26666666666667vw
      margin-top :-15%
      &.one
        height :86.26666666666667vw
      .button-wrapper
        position :absolute
        right :1.0666666666666667vw
        left :@right
        bottom :0
        height :27.73333333333333vw
        .explain
          position :relative
          padding-top :7.466666666666668vw
          font-family: $font-family-regular
          font-size: 3.2vw
          color: #FFFFFF;
          line-height: @font-size
          text-align :center
          &.one
            padding-top :10vw
          .look
            text-decoration :underline
        .button
          position :relative
          margin :2.666666666666667vw auto 0
          width :34.66666666666667vw
          height :8.666666666666668vw
          display :block
      .wrapper
        position :relative
        .place-box
          height :44vw
          &.one
            height :45.06666666666666vw
        .coupon-wrapper
          position :relative
          width :61.06666666666667vw
          height: 40vw
          margin :0 auto
          ::-webkit-scrollbar
            width :0
            height :0
            background-color:transparent
            display:none
          ::-webkit-scrollbar-button
            background-color:rgba(0,0,0,0)
          ::-webkit-scrollbar-track
            background-color:rgba(0,0,0,0)
          ::-webkit-scrollbar-track-piece
            background-color:rgba(0,0,0,0)
          ::-webkit-scrollbar-thumb
            background-color:rgba(0,0,0,0)
          ::-webkit-scrollbar-corner
            background-color:rgba(0,0,0,0)
          ::-webkit-scrollbar-resizer
            background-color:rgba(0,0,0,0)
          .-o-scrollbar
            -moz-appearance: none !important
            background: rgba(0,255,0,0) !important
          ::-o-scrollbar-button
            background-color:rgba(0,0,0,0)
          ::-o-scrollbar-track
            background-color:rgba(0,0,0,0)
          ::-o-scrollbar-track-piece
            background-color:rgba(0,0,0,0)
          ::-o-scrollbar-thumb
            background-color:rgba(0,0,0,0)
          ::-o-scrollbar-corner
            background-color:rgba(0,0,0,0)
          ::-o-scrollbar-resizer
            background-color:rgba(0,0,0,0)
          .coupon-item-wrapper
            width :100%
            padding-bottom :2.1333333333333333vw
            &:last-child
              padding-bottom :8vw

</style>
