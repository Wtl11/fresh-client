<template>
  <div class="home-flash-item" @click="navHandle">
    <figure class="goods-wrapper">
      <img
        class="img"
        mode="aspectFill"
        v-if="dataInfo.goods_cover_image"
        :src="dataInfo.goods_cover_image">
    </figure>
    <form class="bottom-wrapper"  action="" report-submit @submit="$getFormId" >
      <div class="title-wrapper">
        <p class="title">{{dataInfo.name}}</p>
      </div>
      <div class="price-wrapper">
        <div class="price">
          <p class="number">{{dataInfo.trade_price}}</p>
          <p class="unit">元</p>
        </div>
        <button class="button" formType="submit" @click.stop="submitHandle">
          <figure class="button-img">
            <img
              class="img"
              mode="aspectFit"
              v-if="imageUrl"
              :src="imageUrl + '/yx-image/2.1/icon-shopcart copy 2@2x.png'"
            >
          </figure>
        </button>
      </div>
    </form>
  </div>
</template>

<script type="text/ecmascript-6">
  import API from '@api'
  import {cartMethods} from '@state/helpers'

  const COMPONENT_NAME = 'HOME_FLASH_ITEM'

  export default {
    name: COMPONENT_NAME,
    props: {
      dataInfo: {
        type: Object,
        default: () => {}
      }
    },
    data() {
      return {

      }
    },
    onLoad() {
    },
    methods: {
      ...cartMethods,
      submitHandle() {
        this.addShoppingCart()
      },
      // 添加购物车
      async addShoppingCart() {
        let item = this.dataInfo
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
      },
      navHandle() {
        wx.navigateTo({
          url: `/pages/goods-detail?id=${this.dataInfo.goods_id}&activityId=${this.dataInfo.activity_id}`
        })
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@designCommon"

  .img
    width :100%
    height :100%
    display :block
    overflow :auto

  .home-flash-item
    width :26.666666666666668vw
    height :100%
    .goods-wrapper
      width :26.666666666666668vw
      height :26.666666666666668vw
    .bottom-wrapper
      position :relative
      .title-wrapper
        overflow :hidden
        .title
          padding-top :2.666666666666667vw
          font-family: $font-family-regular
          font-size: 3.4666666666666663vw
          color: #111111;
          no-wrap()
      .button-group-wrapper
        position :relative
        z-index :10
       .price-wrapper
          padding-top: 1.3333333333333335vw
          display :flex
          color: #FF8300
          font-family: $font-family-medium
          position :relative
          .price
            flex:1
            overflow :hidden
            display :flex
            .number
              font-size: 4.533333333333333vw
            .unit
              position :relative
              top:1.8vw
              margin-left :1px
              font-size :2.666666666666667vw
          .button
            position :absolute
            bottom :0
            right :1.5199999999999998vw
            width :10.666666666666668vw
            height :@width
            .button-img
              position :absolute
              bottom :0
              right :0
              width :6.14vw
              height :@width
</style>
