<template>
  <div class="classify-item" @click="jumpGoodsDetail(item)">
    <figure class="classify-box-top">
      <img v-if="imageUrl && corpName === 'platform'" :src="imageUrl + '/yx-image/choiceness/icon-label2@2x.png'" alt="" class="top-label" mode="aspectFill">
      <img v-if="imageUrl && corpName === 'retuan'" :src="imageUrl + '/yx-image/retuan/icon-label2@2x.png'" alt="" class="top-label" mode="aspectFill">
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
  const COMPONENT_NAME = 'CLASSIFY_ITEM'

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
        wx.navigateTo({
          url: `/pages/goods-detail?id=${item.goods_id}&activityId=${item.activity_id}`
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
            this.$emit('_getShopCart')
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

  .classify-item
    background: #fff
    overflow: hidden
    padding: 10px 7px 10px
    box-sizing: border-box
    width: 100%
    border-radius: 4px
    .classify-box-top
      padding-bottom: 100%
      height: 0
      width: 100%
      overflow: hidden
      position: relative
      .top-label
        position: absolute
        left: 0
        top: 0
        display: block
        width: 31.2px
        height: 31.4px
        z-index: 11
      .box-top-img
        position: absolute
        left: 0
        top: 0
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
        margin-bottom: 8.5px
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
            margin-right: 2px
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
