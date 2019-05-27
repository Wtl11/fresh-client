<template>
<!--  团购-->
  <form action="" report-submit @submit="$getFormId">
  <div v-if="ACTIVE_TYPE.GROUP_ON === activityType" class="button-group">
    <section v-if="buttonInfo.tipTop" class="tip-top">{{buttonInfo.tipTop}}</section>
    <div class="hlep-btn">
      <button formType="submit" class="hlep-btn-box" v-for="(item, index) in typeBtn" :key="index" @click.stop="switchItem(item)">
        <div class="hlep-top">
          <img v-if="imageUrl" :src="imageUrl + item.url" class="detail-img" mode="aspectFill">
          <div class="help-number" v-if="index * 1 === 1 && count * 1 >= 1">{{count * 1 > 99 ? 99 : count}}</div>
        </div>
        <div class="hlep-bottom">{{item.text}}</div>
      </button>
    </div>
      <button v-if="showLeftButton" class="common-btn group left" formType="submit" @click="instantlyBuy('goods_sale_price')">
        <p class="money">¥{{buttonInfo.salePrice}}元</p>
        <p class="text">单独购买</p>
      </button>
      <div v-else-if="activeStatus === 1" class="common-btn over o-6">已抢完</div>
      <button v-if="showRightButton" class="common-btn group right" :class="{disable: buttonInfo.tipTop}"  formType="submit" @click="handleGroupBuy">
        <p class="money">¥{{buttonInfo.tradePrice}}元</p>
        <p class="text">发起团购</p>
      </button>
    <div v-else-if="activeStatus === 1" class="common-btn over">已抢完</div>
    <div v-if="!showRightButton && !showLeftButton" class="goods-btn goods-btn-assint">{{btnText}}</div>
  </div>
<!--  一般-->
  <div v-else class="button-group">
    <div class="hlep-btn">
      <button formType="submit" class="hlep-btn-box" v-for="(item, index) in typeBtn" :key="index" @click.stop="switchItem(item)">
        <div class="hlep-top">
          <img v-if="imageUrl" :src="imageUrl + item.url" class="detail-img" mode="aspectFill">
          <div class="help-number" v-if="index * 1 === 1 && count * 1 >= 1">{{count * 1 > 99 ? 99 : count}}</div>
        </div>
        <div class="hlep-bottom">{{item.text}}</div>
      </button>
    </div>
      <button v-if="isShowTwoButton" class="goods-btn goods-btn-active" formType="submit" @click="addShoppingCart">加入购物车</button>
      <button v-if="isShowTwoButton" class="goods-btn" :class="'corp-' + corpName + '-bg'" formType="submit" @click="instantlyBuy">立即购买</button>
    <div v-if="!isShowTwoButton" class="goods-btn goods-btn-assint">{{btnText}}</div>
  </div>
  </form>
</template>

<script type="text/ecmascript-6">
  import {cartComputed} from '@state/helpers'
  import {ACTIVE_TYPE} from '@utils/contants'

  const COMPONENT_NAME = 'BUTTON_GROUP'
  const TYPE_BTN = [
    {url: '/yx-image/goods/icon-homepage@2x.png', text: '首页', type: 0},
    {url: '/yx-image/goods/icon-shopcart@2x.png', text: '购物车', type: 2}
  ]

  export default {
    name: COMPONENT_NAME,
    props: {
      buttonInfo: {
        type: Object,
        default: () => {}
      },
      activityType: {
        type: String,
        default: ACTIVE_TYPE.DEFAULT
      }
    },
    data() {
      return {
        ACTIVE_TYPE,
        typeBtn: TYPE_BTN
      }
    },
    computed: {
      ...cartComputed,
      activeStatus() {
        return this.buttonInfo.activeStatus
      },
      btnText() {
        return this.buttonInfo.btnText
      },
      isShowTwoButton() {
        return this.buttonInfo.isShowTwoButton
      },
      showLeftButton() {
        return this.activeStatus === 1 && this.buttonInfo.base_usable_stock > 0
      },
      showRightButton() {
        return this.activeStatus === 1 && this.buttonInfo.usable_stock > 0
      }
    },
    methods: {
      switchItem(item) {
        this.$emit('buttonGroupNav', item)
      },
      addShoppingCart() {
        this.$emit('addShoppingCart')
      },
      instantlyBuy(type = '') {
        this.$emit('instantlyBuy', type)
      },
      handleGroupBuy() {
        if (this.buttonInfo.tipTop) {
          this.$wechat.showToast(this.buttonInfo.tipTop)
          return
        }
        this.$emit('instantlyBuy')
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@designCommon"

  button
    reset-button()

  .common-btn
    width: 35vw
    height: 55px
    text-align: center
    font-size: $font-size-14
    font-family: $font-family-regular
    &.disable
      background: #B7B7B7 !important
    &.over
      layout()
      justify-content :center
      align-items :center
      font-size :14px
      background: #B7B7B7
      color: $color-white
      &.o-6
        opacity :0.6
    &.group
      layout()
      justify-content :center
      align-items :center
      .money
        font-family :$font-family-medium
        display :flex
        font-size :16px
      .text
        font-size :12px
        padding-top :3px
    &.right
      background:#73C200
      color: #fff
    &.left
      background :#FFE500
      color: $color-text-main
  .tip-top
    position absolute
    height :40px
    top:-39px
    left :0
    right :0
    background: #FFEBD6
    padding :0 12px
    line-height :@height
    font-family: $font-family-regular
    font-size: 15px;
    color: #FA7500;
    z-index :115
    no-wrap()
  .button-group
    position: fixed
    left: 0
    bottom: 0
    height: 55px
    width: 100%
    background: #fff
    layout(row)
    z-index: 111
    .hlep-btn
      width: 30vw
      height: 55px
      layout(row)
      border-top-1px(#E6E6E6)
      .hlep-btn-box
        width: 50%
        layout()
        justify-content: center
        align-items: center
        .hlep-top
          width: 20px
          height: 20px
          margin-bottom: 8px
          position: relative
          .detail-img
            width: 100%
            height: 100%
            display: block
          .help-number
            position: absolute
            top: -5px
            right: -7px
            min-width: 16px
            text-align: center
            height: 16px
            line-height: 14px
            padding: 0 3px
            box-sizing: border-box
            font-family: $font-family-medium
            color: $color-white
            font-size: $font-size-10
            border: 1px solid $color-white
            background: #FF3B39
            border-radius: 50%
        .hlep-bottom
          font-size: $font-size-10
          font-family: $font-family-regular
          color: $color-text-main
          line-height: 1
    .goods-btn
      width: 35vw
      line-height: 55px
      height: 55px
      text-align: center
      font-size: $font-size-14
      font-family: $font-family-regular
      color: #fff
      background:#73C200
      &:after
        border: none
    .goods-btn-active
      color: $color-text-main
      background: $color-tag
    .goods-btn-assint
      color: #fff
      background: $color-text-assist
      width: 70vw
</style>
