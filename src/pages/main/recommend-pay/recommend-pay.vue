<template>
  <form action="" report-submit @submit="$getFormId">
  <div class="submit-order">
    <navigation-bar title="提交订单" :showArrow="true" :translucent="false"></navigation-bar>
    <div class="order-title" :class="'corp-' + corpName + '-submit-order'">请在{{deliverAt}}到货后，到团长代理点自提</div>
    <div class="order-info">
      <div class="order-info-top">
        <div class="info-phone">
          <div class="icon-text" :class="'corp-' + corpName + '-bg'">团长</div>
          <div class="icon-number"><span class="name">{{groupInfo.name}}</span><span
            class="txt">{{groupInfo.social_name}}</span></div>
        </div>
        <div class="info-address">
          提货地址：{{groupInfo.province}}{{groupInfo.city}}{{groupInfo.district}}{{groupInfo.address}}
        </div>
      </div>
      <div class="order-info-bottom">
        <div class="info-bottom-phone">
          <div class="lable">提货人手机号：</div>
          <div class="mobile"><input class="mobile-content" type="text" v-model="mobile"></div>
        </div>
        <form class="btn-box" report-submit @submit="getFormId">
          <button class="wechat-btn" v-if="corpName === 'platform'" formType="submit" open-type="getPhoneNumber" @getphonenumber="getPhoneNumber">使用微信手机号</button>
          <button class="wechat-btn wechat-btn-retuan" v-if="corpName === 'retuan'" formType="submit" open-type="getPhoneNumber" @getphonenumber="getPhoneNumber">使用微信手机号</button>
        </form>
      </div>
    </div>
    <img v-if="imageUrl" :src="imageUrl + '/yx-image/choiceness/pic-colour@2x.png'" class="order-line">
    <div class="order-list">
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
    <section class="goods-total-wrapper">
      <p class="name">商品总价</p>
      <p class="price">{{beforeTotal}}</p>
      <p>元</p>
    </section>
    <ul class="coupon-info-wrapper" :class="'corp-' + corpName + '-money'">
      <li class="coupon-item" @click="chooseCouponHandle">
        <p class="name">使用优惠券</p>
        <p v-if="discount > 0" class="price">-{{discount}}</p>
        <p v-else class="price-disable">不可使用优惠券</p>
        <p v-if="discount > 0">元</p>
        <div class="item-arrow-img">
          <img v-if="imageUrl" :src="imageUrl+'/yx-image/cart/icon-pressed@2x.png'" alt="" class="img">
        </div>
      </li>
      <li class="coupon-item">
        <p class="name">实付金额</p>
        <p class="price">{{total}}</p>
        <p>元</p>
      </li>
    </ul>
    <div class="fixed-btn">
      <div class="money" :class="'corp-' + corpName + '-money'">
        <p>总计 {{total}}元</p>
        <p class="explain">(已优惠<span :class="'corp-' + corpName + '-money'">{{discount}}</span>元)</p>
      </div>
      <button formType="submit" class="pay" :class="'corp-' + corpName + '-bg'" @click.stop="goPay">去支付</button>
    </div>
  </div>
  </form>
</template>

<script type="text/ecmascript-6">
  import {orderComputed, orderMethods} from '@state/helpers'
  import NavigationBar from '@components/navigation-bar/navigation-bar'
  import API from '@api'
  import Ald from '@utils/ald'
  // const ald = getApp()
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
      ...orderComputed,
      discount() {
        return 0
      }
    },
    async onShow() {
      // ald && ald.aldstat.sendEvent('去支付')
      Ald.sendEvent('去支付')
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
        if (this._paying) return
        this._paying = true
        clearTimeout(this._payTimer)
        this._payTimer = setTimeout(() => {
          this._paying = false
        }, 1500)
        this.$wechat.showLoading()
        let orderInfo = {
          goods: this.goodsList,
          nickname: this.userInfo.nickname,
          mobile: this.mobile,
          customer_coupon_id: 0,
          source: 'c_offline'
        }
        this.userInfo.mobile = this.mobile
        this.$wechat.setStorage('userInfo', this.userInfo)
        this._pay(orderInfo)
      },
      // 支付
      _pay(data) {
        API.Market.createOrder(data).then((res) => {
          if (res.error !== this.$ERR_OK) {
            this.$wechat.hideLoading()
            this.$wechat.showToast(res.message)
            return
          }
          let orderId = res.data.order_id
          let self = this
          let {timestamp, nonceStr, signType, paySign} = res.data
          wx.requestPayment({
            timeStamp: timestamp,
            nonceStr,
            package: res.data.package,
            signType,
            paySign,
            success (res) {
              setTimeout(() => {
                self.$wechat.hideLoading()
                wx.redirectTo({url: `${self.$routes.main.PAY_RESULT}?orderId=${orderId}&&type=0&total=${self.total}&payType=offline`})
              }, 1500)
            },
            fail (res) {
              self.$wechat.hideLoading()
              self._closeOrder(orderId)
              self.$wechat.showToast('支付失败!')
              console.error(res, '支付失败!')
            },
            complete() {
            }
          })
        })
      },
      _closeOrder(orderId) {
        API.Market.closeOrder({orderId}, false).then((res) => {
          if (res.error !== this.$ERR_OK) {
            console.error(res, '关闭订单失败!')
          }
        })
      },
      _setMobile() {
        this.$wechat.getStorage('userInfo')
          .then(res => {
            this.userInfo = res.data
            this.mobile = this.userInfo.mobile
          })
      },
      getFormId(e) {
        this.$getFormId(e)
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
            if (res.data.mobile.length === 0) {
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
  @import "~@designCommon"
  .goods-total-wrapper
    padding :15.5px 12px
    display :flex
    align-items :center
    font-family: $font-family-regular
    font-size: 14px
    line-height: 1
    color: $color-text-main
    background :#fff
    border-top-1px(#e6e6e6)
    border-bottom :11px solid $color-background
    .name
      flex:1
      color: #000000
    .price
      font-family: $font-family-medium

  .coupon-info-wrapper
    border-bottom :11px solid $color-background
    padding :10.5px 12px
    font-family: $font-family-regular
    font-size: 14px;
    line-height: 1
    background :#fff
    .coupon-item
      display :flex
      align-items :center
      padding :10px 0
    .name
      flex:1
      color: #000000
    .price
      font-size: 16px
      font-family: $font-family-medium
    .price-disable
      font-size :14px
      color: #808080
    .item-arrow-img
      margin-left :5px
      display: block
      width: 7.5px
      height: 12.5px
      .img
        display :block
        width :100%
        height :100%

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

  .order-info
    box-sizing: border-box
    padding-left: 3.2vw
    background: #fff
    .order-info-top
      padding: 15px 3.2vw 15px 0
      box-sizing: border-box
      border-bottom-1px(#e6e6e6)
      .info-address
        font-size: 15px
        color: #000000
        font-family: $font-family-regular
        line-height: 20px
        min-height: 20px
      .info-phone
        layout(row)
        align-items: center
        margin-bottom: 10px
        .icon-text
          font-size: $font-size-12
          color: $color-white
          text-align: center
          font-family: $font-family-regular
          width: 30px
          position: relative
          padding: 2px 0
          box-sizing: border-box
          margin-right: 10px
          border-radius: 2px
        .icon-number
          font-size: $font-size-15
          color: $color-text-sub
          font-family: $font-family-regular
          .name
            font-size: $font-size-15
            color: $color-text-main
            font-family: $font-family-medium
            margin-right: 10px
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
            font-size: $font-size-15
            height: 20px
            line-height: 20px
            padding: 0 2px
      .wechat-btn
        font-size: $font-size-12
        color: $color-main
        font-family: $font-family-regular
        height: 28px
        line-height: 28px
        width: 104px
        text-align: center
        border-1px($color-main, 15px)
      .wechat-btn-retuan
        color: #FC4D1A
        border-1px(#FC4D1A, 15px)

  .order-line
    display: block
    height: 3px
    width: 100%
    margin-bottom: 11px
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
      font-family: $font-family-medium
      display :flex
      align-items :flex-end
      .explain
        font-family: $font-family-regular
        font-size: 14px
        color: $color-text-main
    .pay
      font-size: $font-size-16
      color: #fff
      font-family: $font-family-medium
      height: 34px
      line-height: 34px
      width: 26.7vw
      text-align: center
      border-radius: 17px

  .submit-order
    width: 100%
</style>
