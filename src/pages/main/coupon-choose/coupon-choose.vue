<template>
  <div class="choose-coupon">
    <navigation-bar title="选择优惠券"></navigation-bar>
    <dl v-if="useArray.length" class="panel">
      <dt class="title">可用优惠券</dt>
      <dd class="coupon-item" v-for="(item, index) in useArray" :key="item.coupon_id || index">
        <div @click="chooseHandle(item, index)">
          <coupon-item :isChecked="useIndex===index" :dataInfo="item"></coupon-item>
        </div>
      </dd>
    </dl>
    <dl v-if="disableArray.length" class="panel">
      <dt class="title">不可用优惠券</dt>
      <dd class="coupon-item" v-for="(item, index) in disableArray" :key="item.coupon_id || index">
        <coupon-item useType="disable" :dataInfo="item"></coupon-item>
      </dd>
    </dl>
    <div v-if="isShowEmpty > 1" class="empty-wrapper">
      <img class="img" mode="aspectFill" v-if="imageUrl" :src="imageUrl + '/yx-image/2.1/pic-kong@2x.png'">
      <p class="text">空空如也</p>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import NavigationBar from '@components/navigation-bar/navigation-bar'
  import CouponItem from './coupon-item/coupon-item'
  import {orderComputed, orderMethods} from '@state/helpers'
  import API from '@api'

  const PAGE_NAME = 'CHOOSE_COUPON'
  // /cart/icon-pick1@2x.png
  // /yx-image/retuan/icon-pick_gwc@2x.png'

  export default {
    name: PAGE_NAME,
    components: {
      NavigationBar,
      CouponItem
    },
    data() {
      return {
        useArray: [],
        disableArray: [],
        useIndex: -1,
        isShowEmpty: 0
      }
    },
    computed: {
      ...orderComputed
    },
    onLoad() {
      this._getCouponInfo()
    },
    methods: {
      ...orderMethods,
      chooseHandle(item, index) {
        if (this.useIndex === index) {
          this.useIndex = -1
          this.saveCoupon({})
          return
        }
        this.useIndex = index
        this.saveCoupon(item)
        wx.navigateBack()
      },
      _getCouponInfo() {
        API.Coupon.getChooseList({goods: this.goodsList, is_usable: 1}, true).then((res) => {
          this.useArray = res.data
          this.useIndex = res.data.findIndex(val => val.coupon_id === this.couponInfo.coupon_id)
          if (!res.data.length) {
            this.isShowEmpty++
          }
        })
        API.Coupon.getChooseList({goods: this.goodsList, is_usable: 0}, false).then((res) => {
          this.disableArray = res.data
          if (!res.data.length) {
            this.isShowEmpty++
          }
        })
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@designCommon"

  .empty-wrapper
    padding-top :106px
    .img
      display :block
      margin :0 auto
      width :116px
      height :110px
    .text
      padding-top :15px
      font-family: $font-family-regular
      font-size: 14px
      color: $color-text-sub
      text-align: center

  .choose-coupon
    background :$color-background
    min-height :100vh
    padding-bottom :20px
    box-sizing :border-box
    .panel
      padding :15px 12px 5px
      .title
        padding-bottom :10px
        font-family: $font-family-regular
        font-size: 14px
        color: $color-text-main
        line-height: @font-size
      .coupon-item
        padding-bottom :12px
        &:last-child
          padding-bottom :0
</style>
