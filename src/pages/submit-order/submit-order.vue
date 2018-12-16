<template>
  <div class="submit-order">
    <navigation-bar title="提交订单" :showArrow="true" :translucent="false"></navigation-bar>
    <div class="order-title">请在11月20日 16:00到货后，到团长代理点自提</div>
    <div class="order-info">
      <div class="order-info-top">
        <div class="info-address">提货地址：广州市越秀区中山四路居家佳友便利店</div>
        <div class="info-phone">
          <div class="icon-text">团长</div>
          <div class="icon-number">19252926954</div>
        </div>
      </div>
      <div class="order-info-bottom">
        <div class="info-bottom-phone">提货人：{{userInfo.nickname}}</div>
        <div class="wechat-btn">使用微信手机号</div>
      </div>
    </div>
    <div class="order-list">
      <div class="list-item" v-for="(item, index) in info" :key="index">
        <div class="item-left-img"><img class="img" :src="item.goods_image_url" alt=""></div>
        <div class="item-right">
          <div class="title">{{item.goods_name}}</div>
          <div class="sub-title">规格：{{item.goods_units}}</div>
          <div class="price-box">
            <div class="price-left">
              <div class="number">{{item.price}}</div>
              <div class="icon">元</div>
            </div>
            <div class="price-right">
              <div class="icon">x</div>
              <div class="number">{{item.num}}</div>
            </div>
          </div>
        </div>
      </div>
      <!--<div class="list-item">
        <div class="item-left-img"></div>
        <div class="item-right">
          <div class="title">超值特惠 智利J级车厘子250g智利J级车厘子250g智利J级车厘子250g</div>
          <div class="sub-title">规格：包</div>
          <div class="price-box">
            <div class="price-left">
              <div class="number">3.4</div>
              <div class="icon">元</div>
            </div>
            <div class="price-right">
              <div class="icon">x</div>
              <div class="number">1</div>
            </div>
          </div>
        </div>
      </div>-->
    </div>
    <div class="fixed-btn">
      <div class="money">总计 {{totalPrice}}元</div>
      <div class="pay" @click.stop="_confirmOeder">去支付</div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import { orderComputed, orderMethods } from '@state/helpers'
  import NavigationBar from '@components/navigation-bar/navigation-bar'
  import API from '@api'
  const PAGE_NAME = 'SUBMIT_ORDER'

  export default {
    name: PAGE_NAME,
    data() {
      return {
        userInfo: '',
        goods: [],
        orderId: '',
        totalPrice: 0
      }
    },
    computed: {
      ...orderComputed
    },
    onShow() {
      this.userInfo = wx.getStorageSync('userInfo')
      this.orderTotal()
      console.log(this.info)
    },
    methods: {
      ...orderMethods,
      orderTotal() {
        let that = this
        that.totalPrice = 0
        this.info.forEach((item, index) => {
          that.totalPrice += item.price * item.num
          this.goods.push({
            sku_id: item.goods_sku_id,
            num: item.num
          })
        })
      },
      async _confirmOeder() {
        // 手机号码暂无，后面加入
        let data = {
          goods: this.goods,
          nickname: this.userInfo.nickname,
          mobile: ''
        }
        let res = await API.SubmitOrder.confirmOeder(data)
        if (res.error !== this.$ERR_OK) {
          this.$wechat.showToast(res.message)
        }
        console.log(res)
        this.orderId = res.data.order_id
        // const {timestamp, signType, nonceStr, package, paySign} = payRes
        wx.requestPayment({
          timestamp: res.timestamp,
          signType: res.signType,
          nonceStr: res.nonceStr,
          package: res.package,
          paySign: res.paySign,
          success(res) {},
          fail(res) { }
        })
        // this.orderList.splice(this.delIndex, 1)
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
    background: rgba(255,131,0,.12)
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
        font-family: $font-family-regular
        line-height: 18px
        min-height: 18px
        margin-bottom: 12px
      .info-phone
        layout(row)
        align-items: center
        .icon-text
          font-size: $font-size-12
          color: $color-main
          font-family: $font-family-regular
          border-1px($color-main, 2px)
          padding: 1px 4px 2px
          margin-right: 5px
        .icon-number
          font-size: $font-size-15
          color: $color-text-sub
          font-family: $font-family-regular
    .order-info-bottom
      height: 50px
      layout(row)
      align-items: center
      justify-content: space-between
      padding-right: 3.2vw
      box-sizing: border-box
      .info-bottom-phone
        font-size: $font-size-15
        color: #000000
        font-family: $font-family-medium
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
