<template>
  <div class="choose-coupon">
    <navigation-bar title="选择优惠券"></navigation-bar>
    <dl v-if="useArray.length" class="panel">
      <dt class="title">可用优惠券</dt>
      <dd class="coupon-item" v-for="(item, index) in useArray" :key="index">
        <div @click="chooseHandle(item, index)">
          <coupon-item :isChecked="useIndex===index"></coupon-item>
        </div>
      </dd>
    </dl>
    <dl v-if="disableArray.length" class="panel">
      <dt class="title">不可用优惠券</dt>
      <dd class="coupon-item" v-for="(item, index) in disableArray" :key="index">
        <coupon-item useType="disable"></coupon-item>
      </dd>
    </dl>
    <div v-if="isShowEmpty" class="empty-wrapper">
      <img class="img" mode="aspectFill" v-if="imageUrl" :src="imageUrl + '/yx-image/2.1/pic-kong@2x.png'">
      <p class="text">空空如也</p>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import NavigationBar from '@components/navigation-bar/navigation-bar'
  import CouponItem from './coupon-item/coupon-item'

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
        useArray: new Array(3).fill(1),
        disableArray: new Array(3).fill(1),
        useIndex: -1,
        isShowEmpty: false
      }
    },
    methods: {
      chooseHandle(item, index) {
        if (this.useIndex === index) {
          this.useIndex = -1
          return
        }
        this.useIndex = index
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
