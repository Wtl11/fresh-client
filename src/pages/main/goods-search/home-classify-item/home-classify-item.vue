<template>
  <div class="home-classify-item" @click="jumpGoodsDetail(item)">
    <div class="goods-left">
      <img class="goods-left-img" lazy-load mode="aspectFill" v-if="item.goods_cover_image" :src="item.goods_cover_image">
      <img class="goods-left-icon" lazy-load mode="aspectFill" v-if="imageUrl && item.purchase_cycle * 1 === 1"
           :src="imageUrl + '/yx-image/choiceness/icon-label@2x.png'">
    </div>
    <div class="goods-right">
      <div class="goods-right-top">
        <div class="title">{{item.name}}</div>
        <div class="text-sub" v-if="item.describe" :class="item.describe ? 'has-title' : ''">{{item.describe}}</div>
        <!--<div class="text-sales-box">-->
        <!--<div class="text-sales">已售{{item.sale_count}}件</div>-->
        <!--</div>-->
      </div>
      <div class="add-box">
        <div class="add-box-left">
          <section class="left">
            <!--<div class="text-group" :class="'corp-' + corpName + '-money'">团购价</div>-->
            <img class="text-group-img" mode="aspectFill" lazy-load v-if="imageUrl && corpName === 'platform'"
                 :src="imageUrl + '/yx-image/choiceness/pic-price_bg@2x.png'">
            <img class="text-group-img" mode="aspectFill" lazy-load v-if="imageUrl && corpName === 'retuan'"
                 :src="imageUrl + '/yx-image/retuan/pic-price_rtbg@2x.png'">
          </section>
          <div class="price-box">
            <div class="money" :class="'corp-' + corpName + '-money'">{{item.trade_price}}</div>
            <div class="unit" :class="'corp-' + corpName + '-money'">元</div>
            <div class="lineation">{{item.original_price}}元</div>
          </div>
        </div>
        <div class="right">
          <button class="add-box-right" v-if="item.usable_stock * 1 > 0 && item.activity_theme === 'groupon'">
            <div class="add-goods-btn" style="background: #fa7500">
              <div class="add-text">去拼团</div>
            </div>
          </button>
          <form v-else action="" report-submit @submit="$getFormId" @click.stop="addShoppingCart(item)">
            <button class="add-box-right" v-if="item.usable_stock * 1 > 0" formType="submit">
              <div class="add-goods-btn" :class="'corp-' + corpName + '-bg'">
                <div class="add-icon">
                  <div class="add1"></div>
                  <div class="add2"></div>
                </div>
                <div class="add-text">购物车</div>
              </div>
            </button>
          </form>
          <div class="add-box-right" v-if="item.usable_stock * 1 <= 0" @click.stop>
            <div class="add-goods-btn add-goods-btn-active">
              <div class="add-text">已抢完</div>
            </div>
          </div>
          <div class="add-text-sales">已售{{item.sale_count}}{{item.goods_units}}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import API from '@api'
  import {cartMethods} from '@state/helpers'

  const COMPONENT_NAME = 'HOME_CLASSIFY_ITEM'

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
          url: `${this.$routes.main.GOODS_DETAIL}?id=${item.goods_id}&activityId=${item.activity_id}`
        })
      },
      async addShoppingCart(item) {
        let isLogin = await this.$isLogin()
        if (!isLogin) {
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

  .has-title
    no-wrap-plus()
  .add-text-sales
    font-size: $font-size-10
    font-family: $font-family-regular
    color: $color-text-sub
    margin-top: 1.5px
    text-align: center
  .add-box-right
    &:after
      border: none

  .home-classify-item
    height: 37.733333333333334vw
    layout(row)
    border-bottom-1px(#e6e6e6)
    align-items: center
    margin : 0 12px
    .goods-left
      position: relative
      width: 29.33vw
      height: 29.33vw
      margin-right: 12px
      .goods-left-img
        width: 100%
        height: 100%
        border-radius: 3px
        display: block
      .goods-left-icon
        width: 32px
        height: 32px
        position: absolute
        left: -2.5px
        top: -2.5px
        display: block
    .goods-right
      flex: 1
      overflow: hidden
      layout()
      justify-content: space-between
      min-height: 29.33vw
      .title
        padding-top: 3px
        font-size: $font-size-16
        font-family: $font-family-medium
        color: $color-text-main
        line-height: 1
        min-height: $font-size-18
        margin-bottom: 2px
        no-wrap()
      .text-sub
        font-size: $font-size-13
        font-family: $font-family-regular
        color: $color-text-sub
        min-height: $font-size-15
        margin-bottom: 5px
        line-height: $font-size-16
        box-sizing: border-box
      .text-sales-box
        layout(row)
        .text-sales
          font-size: $font-size-10
          font-family: $font-family-regular
          color: $color-text-sub
          margin-bottom: 11px
          border-radius: 10px
          height: 13px
          line-height: 13px
          border-1px($color-text-sub, 10px)
          padding: 0 5px
      .add-box
        layout(row)
        justify-content: space-between
        align-items: center
        .left
          layout(row)
          .text-group
            font-size: $font-size-10
            font-family: $font-family-regular
            height: 13px
            line-height: 13px
            margin-bottom: 3px
            border-radius: 10px
          .text-group-img
            width: 37px
            height: 17px
            display: block
        .price-box
          layout(row)
          align-items: flex-end
          .money
            font-family: $font-family-medium
            font-size: $font-size-20
            line-height: 1
          .unit
            font-family: $font-family-medium
            font-size: $font-size-12
            line-height: 1
            margin-right: 2px
            padding-bottom: 2.5px
          .lineation
            font-family: $font-family-regular
            color: $color-text-assist
            font-size: $font-size-12
            text-decoration line-through
            padding-bottom: 1px
            line-height: 1
            position :relative
            bottom:1px
        .add-goods-btn
          layout(row)
          width: 75px
          height: 28px
          justify-content: center
          align-items: center
          border-radius: 14px
          .add-text
            font-size: $font-size-14
            font-family: $font-family-regular
            color: #fff
          .add-icon
            width: 11px
            height: 11px
            position: relative
            margin-right: 2px
            .add1
              width: 11px
              height: 1.5px
              background-color: #fff
              position: absolute
              left: 0
              top: 4.5px
              border-radius: 30px
            .add2
              width: 1.5px
              height: 11px
              background-color: #fff
              border-radius: 30px
              position: absolute
              left: 4.5px
              top: 0

        .add-goods-btn-active
          background: #b7b7b7

</style>
