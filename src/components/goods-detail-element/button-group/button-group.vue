<template>
  <div class="button-group">
    <div class="hlep-btn">
      <button formType="submit" class="hlep-btn-box" v-for="(item, index) in typeBtn" :key="index" @click.stop="switchItem(item)">
        <div class="hlep-top">
          <img v-if="imageUrl" :src="imageUrl + item.url" class="detail-img" mode="aspectFill">
          <div class="help-number" v-if="index * 1 === 1 && count * 1 >= 1">{{count * 1 > 99 ? 99 : count}}</div>
        </div>
        <div class="hlep-bottom">{{item.text}}</div>
      </button>
    </div>
    <form action="" report-submit @submit="$getFormId">
      <button v-if="isShowTwoButton" class="goods-btn goods-btn-active" formType="submit" @click="addShoppingCart">加入购物车</button>
    </form>
    <form action="" class="lost" report-submit @submit="$getFormId">
      <button v-if="isShowTwoButton" class="goods-btn" :class="'corp-' + corpName + '-bg'" formType="submit" @click="instantlyBuy">立即购买</button>
    </form>
    <div v-if="!isShowTwoButton" class="goods-btn goods-btn-assint">{{btnText}}</div>
  </div>
</template>

<script type="text/ecmascript-6">
  import {cartComputed} from '@state/helpers'

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
      }
    },
    data() {
      return {
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
      }
    },
    methods: {
      switchItem(item) {
        this.$emit('buttonGroupNav', item)
      },
      addShoppingCart() {
        this.$emit('addShoppingCart')
      },
      instantlyBuy() {
        this.$emit('instantlyBuy')
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@designCommon"

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
