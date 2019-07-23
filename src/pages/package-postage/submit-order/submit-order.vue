<template>
  <form action="" report-submit @submit="$getFormId">
    <div class="submit-order">
      <navigation-bar title="提交订单"></navigation-bar>
      <div class="order-title" :class="'corp-' + corpName + '-submit-order'">含有快递配送商品必须选择您的具体地址</div>
      <div class="select-address" v-if="addressMsg.name.length === 0" @click="selectAddress">
        <div class="select-left">请选择收货地址</div>
        <img v-if="imageUrl" :src="imageUrl+'/yx-image/cart/icon-pressed@2x.png'" alt="" class="item-arrow-img">
      </div>
      <div class="select-info" v-if="addressMsg.name.length !== 0" @click="selectAddress">
        <div class="info-top">
          <div class="info-top-name">{{addressMsg.name}}</div>
          <div class="info-top-phone">{{addressMsg.mobile}}</div>
        </div>
        <div class="info-bottom">收货地址：{{addressMsg.province}}{{addressMsg.city}}{{addressMsg.area}}{{addressMsg.address}}
          <img v-if="imageUrl" :src="imageUrl+'/yx-image/cart/icon-pressed@2x.png'" alt="" class="item-arrow-img">
        </div>
      </div>
      <img v-if="imageUrl" :src="imageUrl + '/yx-image/choiceness/pic-colour@2x.png'" class="order-line">
      <div class="order-list">
        <div class="order-title">
          <img v-if="imageUrl" :src="imageUrl+'/yx-image/postage/icon-baoyou_shopping@2x.png'" alt="" class="order-title-icon">
          <div class="order-title-name">全国包邮</div>
        </div>
        <div class="list-item" v-for="(item, index) in goodsList" :key="index">
          <div class="item-left-img"><img class="img" :src="item.goods_cover_image" alt=""></div>
          <div class="item-right">
            <div class="title">{{item.name}}</div>
            <div class="sub-title">规格：{{item.goods_units}}</div>
            <div class="price-box">
              <div class="price-left">
                <div class="number">{{item.trade_price}}</div>
                <div class="icon">元</div>
              </div>
              <div class="price-right">
                <div class="icon">x</div>
                <div class="number">{{item.num}}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="fixed-btn">
        <div class="money" :class="'corp-' + corpName + '-money'">
          <p>总计 {{total}}元</p>
        </div>
        <button formType="submit" class="pay" :class="'corp-' + corpName + '-bg'" @click.stop="goPay">去支付</button>
      </div>
    </div>
  </form>
</template>

<script type="text/ecmascript-6">
  import NavigationBar from '@components/navigation-bar/navigation-bar'
  import API from '@api'
  import { postageComputed, postageMethods } from '@state/helpers'

  const PAGE_NAME = 'SUBMIT_ORDER'

  export default {
    name: PAGE_NAME,
    components: {
      NavigationBar
    },
    onLoad() {
      this._getAddressDetail(0)
    },
    data() {
      return {
        goodsList: [
          {
            goods_cover_image: '',
            name: 'wqopewq',
            goods_units: 'wqopewq',
            trade_price: '2',
            num: '1'
          }
        ],
        total: 22
      }
    },
    computed: {
      ...postageComputed
    },
    methods: {
      ...postageMethods,
      _getAddressDetail() {
        API.Postage.addressDetail(0).then((res) => {
          if (res.error === this.$ERR_OK) {
            this.setCurrentAddress(res.data)
          } else {
            console.log(22)
            this.setCurrentAddress({name: ''})
          }
        })
      },
      selectAddress() {
        wx.navigateTo({
          url: `${this.$routes.postage.ADDRESS_MANAGE}?select=1`
        })
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@designCommon"

  .submit-order
    width: 100%
    min-height: 100vh
    background: $color-background
    padding-bottom: 50px
    box-sizing: border-box
  .order-title
    height: 35px
    line-height: 35px
    box-sizing: border-box
    padding: 0 3.2vw
    font-size: $font-size-13
    font-family: $font-family-regular
  .select-info
    padding: 15px 12px
    box-sizing: border-box
    background: $color-white
    .info-top
      layout(row)
      align-items: center
      margin-bottom: 10px
      .info-top-name
        font-size: $font-size-15
        font-family: $font-family-medium
        color: #111
        margin-right: 10px
      .info-top-phone
        font-size: $font-size-13
        font-family: $font-family-regular
        color: #808080
    .info-bottom
      font-size: $font-size-15
      font-family: $font-family-medium
      color: #111
      position: relative
      padding-right: 20px
      .item-arrow-img
        position: absolute
        right: 0
        top: 3px
  .select-address
    height: 47px
    padding: 0 3.2vw
    box-sizing: border-box
    background: $color-white
    layout(row)
    align-items: center
    justify-content: space-between
    .select-left
      font-size: $font-size-14
      font-family: $font-family-regular
      color: #808080
  .order-line
    display: block
    height: 3px
    width: 100%
    margin-bottom: 11px
  .item-arrow-img
    margin-left: 5px
    display: block
    width: 7.5px
    height: 12.5px
  .order-list
    background: #fff
    padding-left: 3.2vw
    box-sizing: border-box
    .order-title
      layout(row)
      align-items: center
      height: 45px
      .order-title-icon
        width: 12.5px
        height: 12.5px
        display: block
        margin-right: 5px
      .order-title-name
        font-size: $font-size-14
        font-family: $font-family-medium
        color: #111
    .list-item
      padding-right: 3.2vw
      box-sizing: border-box
      height: 28vw
      layout(row)
      align-items: center
      border-top-1px(#e6e6e6)
      .item-left-img
        width: 20vw
        height: 20vw
        margin-right: 2.6vw
        img
          width: 100%
          height: 100%
          background: #fff
          border-radius: 2px
      .item-right
        flex: 1
        overflow: hidden
        .title
          font-size: $font-size-14
          color: $color-sub
          font-family: $font-family-regular
          line-height: 1
          margin-bottom: 7px
          min-height: 16px
          no-wrap()
        .sub-title
          font-size: $font-size-14
          color: $color-text-sub
          font-family: $font-family-regular
          line-height: 1
          margin-bottom: 23px
          min-height: $font-size-14
        .price-box
          layout(row)
          align-items: center
          justify-content: space-between
          .price-left
            layout(row)
            align-items: flex-end
            .number
              font-size: $font-size-16
              color: $color-text-main
              font-family: $font-family-regular
            .icon
              font-size: $font-size-11
              color: #1f1f1f
              font-family: $font-family-regular
              padding-bottom: 2px
          .price-right
            layout(row)
            align-items: flex-end
            .number
              font-size: $font-size-16
              color: $color-text-main
              font-family: $font-family-regular
            .icon
              font-size: $font-size-12
              color: #1f1f1f
              font-family: $font-family-regular
              padding-bottom: 2px

  .fixed-btn
    position: fixed
    width: 100%
    height: 50px
    left: 0
    bottom: 0
    layout(row)
    align-items: center
    justify-content: space-between
    padding: 0 3.2vw
    box-sizing: border-box
    background: #fff
    .money
      font-size: $font-size-16
      font-family: $font-family-medium
      display: flex
      align-items: flex-end
      .explain
        font-family: $font-family-regular
        font-size: 14px
        color: $color-text-main
    .pay
      position absolute
      right: 0
      bottom: 0
      height: 50px
      width: 33.33333333333333vw
      font-size: $font-size-16
      color: #fff
      font-family: $font-family-medium
      line-height: @height
      text-align: center
      background: #73C200

</style>
