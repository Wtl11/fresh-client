<template>
  <div class="coupon-modal" v-if="isShow" :class="cname"  :animation="maskAnimation" @touchmove.stop>
    <section class="content" @touchmove.stop>
      <img class="close"
           mode="aspectFill"
           v-if="imageUrl"
           :src="imageUrl + '/yx-image/2.4/icon-deletetc@2x.png'"
           @click="submitHandle"
      >
      <img class="top-img" mode="aspectFill" v-if="imageUrl" :src="imageUrl + '/yx-image/certificate/pic-spqtc@2x.png'">
      <div class="coupon-con" :class="couponArray.length === 1?'one':''">
        <div v-if="couponArray.length === 1" class="coupon-list">
          <img class="item-bg" mode="aspectFill" v-if="imageUrl" :src="imageUrl + '/yx-image/2.4/pic-dcoupon@2x.png'">
          <div class="item-con">
            <div class="img-box">
              <img v-if="couponArray[0].coupon && couponArray[0].coupon.other_info" :src="couponArray[0].coupon.other_info.goods_cover_image" mode="aspectFill" class="img-item">
            </div>
            <div class="right-box">
              <div class="title">
                <!--<p class="type" v-if="couponArray[0].coupon.range_type_str">{{couponArray[0].coupon.range_type_str}}</p>-->
                <p class="txt">{{couponArray[0].coupon.coupon_name}}</p>
              </div>
              <div class="condition">有效期至 {{couponArray[0].coupon.end_at}}</div>
            </div>
          </div>
        </div>
        <scroll-view v-else class="coupon-list" scroll-y>
          <div v-for="(item, index) in couponArray" :key="index" class="coupon-item">
            <img class="item-bg" mode="aspectFill" v-if="imageUrl" :src="imageUrl + '/yx-image/2.4/pic-coupon_lqtc@2x.png'">
            <div class="item-con">
              <div class="img-box">
                <img v-if="item.coupon && item.coupon.other_info" :src="item.coupon.other_info.goods_cover_image" mode="aspectFill" class="img-item">
              </div>
              <div class="right-box" v-if="item.coupon">
                <div class="title">
                  <!--<p class="type" v-if="item.range_type_str">{{item.range_type_str}}</p>-->
                  <p class="txt">{{item.coupon.coupon_name}}</p>
                </div>
                <div class="condition">有效期至 {{item.coupon.end_at}}</div>
              </div>
            </div>
          </div>
        </scroll-view>
        <img class="bottom-bg"
             mode="aspectFill"
             v-if="imageUrl && couponArray.length > 1"
             :src="imageUrl + '/yx-image/2.4/pic-coupontc_up@2x.png'"
             @click="submitHandle"
        >
        <div class="bottom-con">
          <p hover-class="none" class="explain" @click="navHandle">兑换券已放入账号 <span class="look">查看></span></p>
          <img class="coupon-btn"
               mode="aspectFill"
               v-if="imageUrl"
               :src="imageUrl + '/yx-image/2.4/btn-touse@2x.png'"
               @click="submitHandle"
          >
        </div>
      </div>
    </section>
  </div>
</template>

<script type="text/ecmascript-6">
  import AnimationModal from '@mixins/animation-modal'
  import Coupon from '../invitation-modal/coupon-item/coupon'
  // import API from '@api'

  const COMPONENT_NAME = 'COUPON_MODAL'

  export default {
    name: COMPONENT_NAME,
    mixins: [AnimationModal],
    props: {
      cname: {
        type: String,
        default: ''
      }
    },
    data() {
      return {
        isShow: true,
        couponArray: [new Coupon(), new Coupon()]
      }
    },
    methods: {
      _targetList() {
        // let arr = this.couponArray.map((item) => {
        //   return item.coupon_activity_report_id || 0
        // })
        // // todo
        // console.log(arr)
      },
      navHandle() {
        this._targetList()
        this.hide()
        wx.navigateTo({ url: this.$routes.activity.COMMODITY_CERTIFICATES })
      },
      cancelHandle() {
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
        this.showAnimation()
      },
      hide() {
        this.hideAnimation(() => {
          this.isShow = false
        })
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@designCommon"

  .coupon-modal
    background-color: rgba(17, 17, 17, 0.75)
    fill-box(fixed)
    display: flex
    justify-content: center
    align-items: center
    &.z1000
      z-index :1000

    .content
      position: relative
      width: 259px
      margin-top: -5.3333vw
      .close
        width: 30px
        height: @width
        position: absolute
        right: 0
        top: -45px
        z-index: 3
      .top-img
        width: 100%
        height: 82.5px
        display: block
        margin: 0
      .coupon-con
        margin: 0
        box-sizing: border-box
        width: 100%
        height: 221px
        padding: 12px 15px 15px
        layout(row)
        justify-content: center
        background: linear-gradient(to bottom right, #9EC65A, #7eb62c)
        border-bottom-left-radius: 6px
        border-bottom-right-radius: 6px
        .coupon-list
          position: relative
          width: 229px
          height: 128px
          .coupon-item
            width: 100%
            height: 70px
            position: relative
            margin-bottom: 8px
          .item-bg
            fill-box(absolute)
            z-index: 1
            width: 100%
            height: 100%
          .item-con
            fill-box(absolute)
            z-index: 2
            box-sizing: border-box
            width: 100%
            height: 100%
            padding: 0 14px
            font-size: $font-size-14
            layout(row)
            justify-content: space-between
            align-items: center
            .price-box
              font-family: $font-family-medium
              font-size: $font-size-15
              max-width: 70px
              text-align: center
              color: #f8612c
              flex: 1
              .price
                font-size: 34px
                line-height: 1
                margin-bottom: -2px
            .img-box
              max-width: 50px
              width: 50px
              margin-right: 10px
              height: 50px
              border-radius: 1px
              overflow: hidden
              .img-item
                width: 100%
                height: 100%
            .right-box
              flex: 1
              overflow: hidden
              .title
                layout(row, block, nowrap)
                align-items: center
                color: $color-text-main
                .type
                  font-family: $font-family-medium
                  height: 12px
                  line-height: 10px
                  border: 1px solid rgba(29, 32, 35, 0.75)
                  border-radius: 2px
                  font-size: $font-size-10
                  padding: 0 2px
                  layout(row)
                  align-items: center
                  opacity: 0.8
                .txt
                  padding-left: 2px
                  font-family: $font-family-medium
                  font-size: $font-size-14
                  no-wrap()
              .condition
                padding-top: 4px
                opacity: 0.8
                font-size: $font-size-13
                color: #808080
                no-wrap()
        &.one
          height: 194.5px
          .coupon-list
            position: relative
            width: 229px
            height: 101.5px
            .item-con
              padding: 0 20px
              .price-box
                max-width: 62px
          .title
            padding-top: 8px

        .bottom-bg
          position: absolute
          bottom: 0
          left: 0
          width: 100%
          height: 98px
          z-index: 1
        .bottom-con
          position: absolute
          bottom: 0
          left: 0
          z-index: 2
          width: 100%
          height: 82px
          layout()
          justify-content: center
          align-items: center
          .explain
            position: relative
            margin-bottom: 7px
            font-family: $font-family-light
            font-size: $font-size-13
            color: $color-white
            line-height: @font-size
            text-align: center
          .coupon-btn
            width: 150px
            height: 32.5px

        .coupon-list
          ::-webkit-scrollbar
            width: 0
            height: 0
            background-color: transparent
            display: none

          ::-webkit-scrollbar-button
            background-color: rgba(0, 0, 0, 0)

          ::-webkit-scrollbar-track
            background-color: rgba(0, 0, 0, 0)

          ::-webkit-scrollbar-track-piece
            background-color: rgba(0, 0, 0, 0)

          ::-webkit-scrollbar-thumb
            background-color: rgba(0, 0, 0, 0)

          ::-webkit-scrollbar-corner
            background-color: rgba(0, 0, 0, 0)

          ::-webkit-scrollbar-resizer
            background-color: rgba(0, 0, 0, 0)

          .-o-scrollbar
            -moz-appearance: none !important
            background: rgba(0, 255, 0, 0) !important

          ::-o-scrollbar-button
            background-color: rgba(0, 0, 0, 0)

          ::-o-scrollbar-track
            background-color: rgba(0, 0, 0, 0)

          ::-o-scrollbar-track-piece
            background-color: rgba(0, 0, 0, 0)

          ::-o-scrollbar-thumb
            background-color: rgba(0, 0, 0, 0)

          ::-o-scrollbar-corner
            background-color: rgba(0, 0, 0, 0)

          ::-o-scrollbar-resizer
            background-color: rgba(0, 0, 0, 0)
</style>
