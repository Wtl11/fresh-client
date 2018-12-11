<template>
  <div class="wrap">
    <navigation-bar title="购物车" :translucent="false"></navigation-bar>
    <div class="order-banner">
      <div class="status">
        <div class="icon"><img v-if="imageUrl" class="icon-img" :src="imageUrl+'/yx-image/cart/icon-finish_xq@2x.png'" alt=""></div>
        <div class="statu-txt">已完成</div>
      </div>
      <div class="extract">提货单号: 20</div>
    </div>
    <div class="addr-info">
      <div class="top">
        <div class="addr">提货地址：广州市越秀区中山四路居家佳友便利店</div>
        <div class="warp">
          <div class="design">团长</div>
          <div class="name">陈小完</div>
          <div class="phone">19252926954</div>
        </div>
      </div>
      <div class="bot">提货人：19252926954</div>
    </div>
    <div class="gary-box"></div>
    <div class="order-list">
      <div class="order-item">
        <div class="goods-item">
          <div class="goodsinfo">
            <img class="goods-img" mode="aspectFill" src="http://service-ws-app-1254297111.picgz.myqcloud.com/300000/2018/12/01/154363269682158.png?imageView2/3/w/300/h/300" alt="">
            <div class="goods-info">
              <div class="tit">超值特惠 智利J级车厘子250g</div>
              <div class="guige">规格：包</div>
              <div class="price">
                <div class="amout"><span class="num">3.8</span>元</div>
                <div class="quantity">x<span class="num">1</span></div>
              </div>
            </div>
          </div>
        </div>
        <div class="goods-item">
          <div class="goodsinfo">
            <img class="goods-img" mode="aspectFill" src="http://service-ws-app-1254297111.picgz.myqcloud.com/300000/2018/12/01/154363269682158.png?imageView2/3/w/300/h/300" alt="">
            <div class="goods-info">
              <div class="tit">超值特惠 智利J级车厘子250g</div>
              <div class="guige">规格：包</div>
              <div class="price">
                <div class="amout"><span class="num">3.8</span>元</div>
                <div class="quantity">x<span class="num">1</span></div>
              </div>
            </div>
          </div>
        </div>
        <div class="actual-amount">
          <div class="sub">实付金额</div>
          <div class="price"><span class="num">3.5</span>元</div>
        </div>
      </div>
    </div>
    <div class="gary-box"></div>
    <div class="oinfo">
      <div class="o-item" v-if="false">退款金额：<span class="price"><span class="num">3.5</span>元</span></div>
      <div class="o-item" v-if="false">退款方式：微信红包</div>
      <div class="order-iden">
        <div class="txt">订单编号：65465416651651</div>
        <div class="copy-btn">复制</div>
      </div>
      <div class="order-time">下单时间：2018-06-05 17:23</div>
    </div>
    <div class="service">
      <div class="service-btn">联系团长</div>
    </div>
    <div class="operation">
      <div class="refund">退款</div>
    </div>
  </div>

</template>

<script type="text/ecmascript-6">
  import WePaint from '@components/we-paint/we-paint'
  // import { mapGetters } from 'vuex'
  import NavigationBar from '@components/navigation-bar/navigation-bar'
  import API from '@api'
  import {oauthComputed} from '@state/helpers'
  import Vue from 'vue'

  export default {
    components: {
      WePaint,
      NavigationBar
    },
    beforeCreate() {
    },
    data() {
      return {
        testSrc: ''
        // title: '',
        // headStyle: 'background: rgba(255, 255, 255, 0)',
        // titleColor: 'white'
      }
    },
    onShow() {
      if (getApp().globalData.imgUrl) {
        this.testSrc = getApp().globalData.imgUrl
      }
      console.log(Vue.Component)
    },
    computed: {
      ...oauthComputed
      // ...mapGetters(['role'])
    },
    methods: {
      testApi() {
        API.Jwt.getToken()
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"
  .wrap
    width: 100vw
    min-height: 100vh
    background: $color-white
    position: relative
    .operation
      position: fixed
      bottom: 0
      left: 0px
      width: 100vw
      height: 50px
      padding: 0 3.2vw
      box-sizing: border-box
      background: $color-white
      layout(row)
      justify-content: flex-end
      align-items: center
      box-shadow: 0 -0.5px 0 0 #E6E6E6
      .refund
        width: 77px
        height: 30px
        line-height: 30px
        font-family: $font-family-regular
        font-size: $font-size-14
        text-align: center
        color: $color-white
        background: #73C200
        border: 1px solid #73C200
        border-radius: 15px
    .order-banner
      width: 100vw
      height: 70px
      padding: 0 3.2vw
      box-sizing: border-box
      layout(row)
      justify-content: space-between
      align-items: center
      background-image: radial-gradient(95% -74%, #73C200 0%, #ABE300 100%)
      .status
        layout(row)
        .statu-txt
          font-family: $font-family-medium
          font-size: $font-size-18
          color: $color-white
          line-height: 31px
        .icon
          width: 31px
          height: 31px
         .icon-img
           width: 100%
           display: block
           height: 100%
      .extract
        font-family: $font-family-medium
        font-size: $font-size-16
        color: $color-white
  .addr-info
    padding-left: 3.2vw
    .bot
      font-family: $font-family-medium
      font-size: $font-size-15
      color: #000000
      height: 50px
      line-height: 50px
    .top
      height: 74px
      box-sizing: border-box
      padding:3.2vw 0
      border-bottom-1px(#e6e6e6)
    .addr
      font-family: $font-family-medium
      font-size: $font-size-15
      no-wrap()
      padding-bottom: 10px
      color: #000000
    .warp
      layout(row)
      align-items: center
      color: #808080
      .design
        width: 30px
        font-family: $font-family-regular
        border-1px(#73C200)
        text-align: center
        color: #73C200
        border-radius: 2px
        font-size: $font-size-12
        height: 15px
        box-sizing: border-box
        line-height: 15px
      .phone
        font-family: $font-family-regular
        font-size: $font-size-15
        color: #808080
      .name
        font-family: $font-family-regular
        font-size: $font-size-15
        padding: 0 5px 0 10px
        color: #808080
  .goods-item
    height: 105px
    box-sizing: border-box
    padding: 0 3.2vw
    position: relative
    layout(row)
    justify-content: space-between
    align-items: center
    border-bottom-1px(#e6e6e6)
    .goodsinfo
      layout(row)
      align-items: center
    .goods-img
      width: 20vw
      height: 20vw
    .arrlow
      width: 5.5px
      height: 10.5px
      .arr
        width: 100%
        height: 100%
        display: block
    .goods-info
      width: 73.6vw
      box-sizing: border-box
      padding-left: 2.67vw
      .tit
        font-family: $font-family-medium
        font-size: $font-size-14
        color: $color-sub
        letter-spacing: 0.3px
      .guige
        font-family: $font-family-regular
        font-size: $font-size-14
        color: #808080
        margin-top: 2px
        margin-bottom: 12px
      .price
        layout(row)
        align-items: center
        justify-content: space-between
        .quantity
          font-family: $font-family-regular
          font-size: $font-size-12
          color: #1F1F1F
          .num
            font-family: $font-family-regular
            font-size: $font-size-16
            color: $color-sub
         .amout
          font-family: $font-family-regular
          font-size: $font-size-11
          color: #1F1F1F
          .num
            font-family: $font-family-regular
            color: $color-sub
            font-size: $font-size-16
  .actual-amount
    layout(row)
    padding:0 3.2vw
    width: 100vw
    height: 45px
    align-items: center
    justify-content: space-between
    box-sizing: border-box
    .sub
      font-family: $font-family-regular
      font-size: $font-size-14
      color: #000000
    .price
      font-family: $font-family-medium
      font-size: $font-size-14
      color: #FF8300
      .num
        font-family: $font-family-medium
        font-size: $font-size-16
        color: #FF8300
  .oinfo
    box-sizing: border-box
    min-height: 80px
    padding: 16px 3.2vw
    .o-item
      padding-bottom: 16px
      font-family: $font-family-regular
      font-size: $font-size-14
      color: #000000
      line-height: 14px
      .price
        font-family: $font-family-medium
        font-size: $font-size-14
        color: #FF8300
        .num
          font-family: $font-family-medium
          font-size: $font-size-16
          color: #FF8300
    .order-iden
      layout(row)
      align-items: center
      .txt
        font-family: $font-family-regular
        font-size: $font-size-14
        color: #000000
        line-height: 14px
      .copy-btn
        width: 54px
        margin-left: 15px
        height: 20px
        border-1px(#b7b7b7, 10px)
        text-align: center
        line-height: 20px
        font-family: $font-family-regular
        font-size: $font-size-12
        color: #111111
        letter-spacing: 0.3px
    .order-time
      padding-top: 16px
      font-family: $font-family-regular
      font-size: $font-size-14
      color: #000000
      line-height: 14px
  .service
    width: 100vw
    padding-top: 15px
    padding-bottom: 80px
    layout(row)
    justify-content: center
    align-items: center
    background-color: #f7f7f7
    .service-btn
      width: 106px
      height: 34px
      text-align: center
      line-height: 34px
      border-1px(#b7b7b7, 17px)
      font-family: $font-family-regular
      font-size: $font-size-15
      color: #000000
  .gary-box
    width: 100vw
    height: 10px
    background: #f7f7f7
</style>
