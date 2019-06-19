<template>
  <div class="classify-item" @click="jumpGoodsDetail(item)">
    <figure class="classify-box-top">
      <img v-if="imageUrl && corpName === 'platform'" :src="imageUrl + '/yx-image/2.4/icon-label@2x.png'" alt="" class="top-label" mode="aspectFill">
      <img v-if="item.goods_cover_image" :src="item.goods_cover_image" alt="" class="box-top-img" mode="aspectFill">
    </figure>
    <section class="classify-box-bottom">
      <div class="title">{{item.name}}</div>
      <div class="classify-price-box">
        <div class="price-left">
          <div class="price-number" :class="'corp-' + corpName + '-money'">{{item.trade_price}}</div>
          <div class="price-money" :class="'corp-' + corpName + '-money'">元</div>
          <div class="price-line">{{item.original_price}}元</div>
        </div>
        <form action="" report-submit @submit="$getFormId" @click.stop="addShoppingCart(item)">
          <button class="price-right" formType="submit">
            <img v-if="imageUrl && corpName === 'platform'" :src="imageUrl + '/yx-image/goods/icon-shopcart2@2x.png'" alt="" class="price-right-img">
            <img v-if="imageUrl && corpName === 'retuan'" :src="imageUrl + '/yx-image/retuan/icon-shopcart@2x.png'" alt="" class="price-right-img">
          </button>
        </form>
      </div>
    </section>
  </div>
</template>

<script type="text/ecmascript-6">
  import API from '@api'
  import {cartMethods} from '@state/helpers'
  const COMPONENT_NAME = 'GOODS_ITEM'

  export default {
    name: COMPONENT_NAME,
    props: {
      item: {
        type: Object,
        default: () => {}
      }
    },
    methods: {
      ...cartMethods,
      jumpGoodsDetail(item) {
        this.$emit('goToChildPage')
        wx.navigateTo({
          url: `${this.$routes.main.GOODS_DETAIL}?id=${item.goods_id}&activityId=${item.activity_id}`
        })
      },
      addShoppingCart(item) {
        if (!this.$isLogin()) {
          return
        }
        API.Choiceness.addShopCart({goods_sku_id: item.goods_sku_id, activity_id: item.activity_id}).then((res) => {
          if (res.error === this.$ERR_OK) {
            this.$sendMsg({
              event_no: 1007,
              goods_id: item.goods_id,
              title: item.name
            })
            this.$wechat.showToast('加入购物车成功', 1000, false)
            this.setCartCount()
          } else {
            this.$wechat.showToast(res.message, 1000, false)
          }
        })
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@designCommon"

  .img
    width: 100%
    height :@width
    display :block

  .classify-item
    background: #fff
    overflow: hidden
    padding: 10px 10px 15px
    box-sizing: border-box
    width: 100%
    border-radius: 4px
    box-shadow: 0 6px 20px 0 rgba(17,17,17,0.06)
    .classify-box-top
      padding-bottom: 100%
      height: 0
      width: 100%
      position: relative
      .top-label
        position: absolute
        left: -2.5px
        top: @left
        display: block
        width: 29px
        height: 31px
        z-index: 11
      .box-top-img
        position: absolute
        left: 0
        top: @left
        z-index: 2
        display: block
        width: 100%
        height: 100%
    .classify-box-bottom
      padding-top: 10px
      font-family: $font-family-regular
      .title
        color: $color-text-main
        font-size: $font-size-14
        min-height: $font-size-16
        no-wrap()
      .icon-img
        padding-top :5px
        width:38px
        height :14px
        display :block
      .icon
        width :37px
        height :14px
        margin :5px 0 0
        border: 1px solid #FA7500;
        border-radius: 14.5px;
        text-align :center
        line-height :@height
        font-family: $font-family-regular
        font-size: 10px;
        color: #FA7500;
      .classify-price-box
        layout(row)
        align-items: center
        justify-content: space-between
        .price-left
          layout(row)
          align-items: center
          font-size: $font-size-12
          font-family: $font-family-medium
          .price-number
            font-size: $font-size-18
            margin-right: 1px
          .price-money
            margin-right: 5px
            position :relative
            top:2px
          .price-line
            color: $color-text-assist
            text-decoration: line-through
            position :relative
            top:2px
        .price-right
          width: 23px
          height: 23px
          position: relative
          .price-right-img
            width: 23px
            height: 23px
            display: block
</style>
