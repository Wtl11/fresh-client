<template>
  <div class="submit-order">
    <navigation-bar title="提交订单" :showArrow="true" :translucent="false"></navigation-bar>
    <div class="order-title">请在{{deliverAt}}到货后，到团长代理点自提</div>
    <div class="order-info">
      <div class="order-info-top">
        <div class="info-address">
          提货地址：{{groupInfo.province}}{{groupInfo.city}}{{groupInfo.district}}{{groupInfo.address}}
        </div>
        <div class="info-phone">
          <div class="icon-text">团长</div>
          <div class="icon-number"><span class="name">{{groupInfo.name}}</span><span
            class="txt">{{groupInfo.mobile}}</span></div>
        </div>
      </div>
      <div class="order-info-bottom">
        <div class="info-bottom-phone">
          <div class="lable">提货人手机号：</div>
          <div class="mobile"><input class="mobile-content" type="text" v-model="mobile"></div>
        </div>
        <button class="wechat-btn" open-type="getPhoneNumber" @getphonenumber="getPhoneNumber">使用微信手机号</button>
      </div>
    </div>
    <div class="order-list">
      <div class="list-item" v-for="(item, index) in goodsList" :key="index">
        <div class="item-left-img"><img class="img" :src="item.goods_cover_image" alt=""></div>
        <div class="item-right">
          <div class="title">{{item.name}}</div>
          <div class="sub-title">规格：{{item.goods_units}}</div>
          <div class="price-box">
            <div class="price-left">
              <div class="number">{{item.shop_price}}</div>
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
      <div class="money">总计 {{total}}元</div>
      <div class="pay" @click.stop="goPay">去支付</div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import {orderComputed, orderMethods} from '@state/helpers'
  import NavigationBar from '@components/navigation-bar/navigation-bar'
  import API from '@api'

  const PAGE_NAME = 'SUBMIT_ORDER'

  export default {
    name: PAGE_NAME,
    data() {
      return {
        code: '',
        mobile: '',
        groupInfo: {},
        userInfo: {}
      }
    },
    computed: {
      ...orderComputed
    },
    async onShow() {
      this._getCode()
      this._setMobile()
      this._getShopDetail()
    },
    methods: {
      ...orderMethods,
      _getCode() {
        this.$wechat.login()
          .then(res => {
            this.code = res.code
          })
      },
      async goPay() {
        let orderInfo = {
          goods: this.goodsList,
          nickname: this.userInfo.nickname,
          mobile: this.mobile
        }
        this.userInfo.mobile = this.mobile
        this.$wechat.setStorage('userInfo', this.userInfo)
        await this.submitOrder({
          orderInfo,
          complete: this._payComplete
        })
      },
      _payComplete(id) {
        wx.redirectTo({url: `/pages/order-detail?id=${id}&&type=0`})
      },
      _setMobile() {
        this.$wechat.getStorage('userInfo')
          .then(res => {
            this.userInfo = res.data
            this.mobile = this.userInfo.mobile
          })
      },
      _getShopDetail() {
        API.Mine.getShopDetail()
          .then((res) => {
            if (res.error !== this.$ERR_OK) {
              return
            }
            this.groupInfo = res.data
          })
      },
      getPhoneNumber(e) {
        let data = {
          code: this.code,
          iv: e.mp.detail.iv,
          encryptedData: e.mp.detail.encryptedData
        }
        API.Mine.getWechatMobile(data)
          .then(res => {
            if (res.error !== this.$ERR_OK) {
              return
            }
            this.mobile = res.data.mobile ? res.data.mobile : ''
            this.userInfo.mobile = this.mobile
            this.$wechat.setStorage('userInfo', this.userInfo)
          })
      }
    },
    components: {
      NavigationBar
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"
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
    color: $color-money
    font-family: $font-family-regular
    background: rgba(255, 131, 0, .12)

  .order-info
    box-sizing: border-box
    padding-left: 3.2vw
    background: #fff
    margin-bottom: 11px
    .order-info-top
      padding: 16px 3.2vw 16px 0
      box-sizing: border-box
      border-bottom-1px(#e6e6e6)
      .info-address
        font-size: 15px
        color: #000000
        font-family: $font-family-medium
        line-height: 18px
        min-height: 18px
        margin-bottom: 12px
      .info-phone
        layout(row)
        align-items: center
        .icon-text
          font-size: $font-size-12
          color: $color-main
          text-align: center
          font-family: $font-family-regular
          border-1px($color-main, 2px)
          width: 30px
          height: 15px
          line-height: 15px
          margin-right: 8px
        .icon-number
          font-size: $font-size-15
          color: $color-text-sub
          font-family: $font-family-regular
          .name
            font-size: $font-size-15
            color: $color-text-sub
            font-family: $font-family-regular
            margin-right: 8px
          .txt
            font-size: $font-size-15
            color: $color-text-sub
            font-family: $font-family-regular
    .order-info-bottom
      height: 56px
      line-height: 56px
      layout(row)
      align-items: center
      justify-content: space-between
      padding-right: 3.2vw
      box-sizing: border-box
      .info-bottom-phone
        font-size: $font-size-15
        color: #000000
        font-family: $font-family-medium
        layout(row)
        align-items: center
        .lable
          font-size: $font-size-15
          color: #000000
          font-family: $font-family-medium
        .mobile
          font-size: $font-size-15
          color: #000000
          border-1px()
          height: 100%
          line-height: 100%
          font-family: $font-family-medium
          .mobile-content
            width: 34vw
            box-sizing: border-box
            font-size: $font-size-13
            height: 20px
            line-height: 20px
            box-sizing: border-box
            padding: 0px 2px
      .wechat-btn
        font-size: $font-size-12
        color: $color-main
        font-family: $font-family-regular
        height: 28px
        line-height: 28px
        width: 104px
        text-align: center
        border-1px($color-main, 15px)

  .order-list
    background: #fff
    padding-left: 3.2vw
    box-sizing: border-box
    .list-item
      padding-right: 3.2vw
      box-sizing: border-box
      height: 28vw
      layout(row)
      align-items: center
      border-bottom-1px(#e6e6e6)
      .item-left-img
        width: 20vw
        height: 20vw
        background: #333
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
          min-height: $font-size-14
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
      &:last-child
        border-none()

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
      color: $color-money
      font-family: $font-family-medium
    .pay
      font-size: $font-size-16
      color: #fff
      font-family: $font-family-medium
      height: 34px
      line-height: 34px
      width: 26.7vw
      text-align: center
      border-radius: 17px
      background: $color-main

  .submit-order
    width: 100%
</style>
