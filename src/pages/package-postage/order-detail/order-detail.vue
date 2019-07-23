<template>
  <div class="order-detail">
    <navigation-bar title="订单详情"></navigation-bar>
    <div class="order-banner">
      <div class="backdrop"><img v-if="imageUrl" :src="imageUrl+'/yx-image/postage/bg-ddxq@2x.png'" alt="" class="backdrop-img"></div>
      <div class="content">
        <div class="status">
          <div class="icon">
            <img v-if="imageUrl && orderMsg.status * 1 === 2" class="icon-img" :src="imageUrl+'/yx-image/postage/icon-finish_xq@2x.png'" alt="">
            <img v-if="imageUrl && orderMsg.status * 1 === 3" class="icon-img" :src="imageUrl+'/yx-image/postage/icon_close_xq@2x.png'" alt="">
            <img v-if="imageUrl && orderMsg.status * 1 === 1" class="icon-img" :src="imageUrl+'/yx-image/postage/icon-delivery_xq@2x.png'" alt="">
            <img v-if="imageUrl && orderMsg.status * 1 === 0" class="icon-img" :src="imageUrl+'/yx-image/postage/icon-payment_xq@2x.png'" alt="">
            <img v-if="imageUrl && orderMsg.status * 1 === 11" class="icon-img" :src="imageUrl+'/yx-image/2.4/icon_refund_xq@2x.png'" alt="">
          </div>
          <div class="statu-txt">{{orderMsg.status === 11 || orderMsg.status_text === '活动中' ? '已付款' : orderMsg.status_text}}</div>
        </div>
        <div v-if="orderMsg.status * 1 === 0 && payTime" class="pay-countdown">剩余：{{payTime}}</div>
      </div>
    </div>
    <div class="select-info">
      <div class="info-top">
        <div class="info-top-name">张三丰</div>
        <div class="info-top-phone">13656567890</div>
      </div>
      <div class="info-bottom">收货地址：广东省广州市越秀区中山四路288号 (居家佳友便利店)</div>
    </div>
    <img v-if="imageUrl" :src="imageUrl + '/yx-image/choiceness/pic-colour@2x.png'" class="order-line">
    <div class="page-line"></div>
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
    <div class="order-all">
      <div class="order-left">实付金额</div>
      <div class="order-right"><span class="all-price">7.6</span><span class="all-text">元</span></div>
    </div>
    <div class="page-line"></div>
    <div class="order-info">
      <div class="order-iden">
        <div class="txt">订单编号：{{orderMsg.order_sn}}</div>
        <div class="copy-btn" @click.stop="clipOrderId">复制</div>
      </div>
      <div class="order-time">下单时间：{{orderMsg.created_at}}</div>
    </div>
    <div class="order-fixed">
      <div class="order-bottom-right">
        <div class="refund close" @click="closeOrder">取消</div>
        <div class="refund" @click="goPay">去付款</div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import NavigationBar from '@components/navigation-bar/navigation-bar'

  const PAGE_NAME = 'ORDER_DETAIL'

  export default {
    name: PAGE_NAME,
    components: {
      NavigationBar
    },
    data() {
      return {
        orderMsg: {
          status: 1,
          status_text: '发货'
        },
        payTime: '2222',
        goodsList: [
          {
            goods_cover_image: '',
            name: 'wqopewq',
            goods_units: 'wqopewq',
            trade_price: '2',
            num: '1'
          },
          {
            goods_cover_image: '',
            name: 'wqopewq',
            goods_units: 'wqopewq',
            trade_price: '2',
            num: '1'
          }
        ]
      }
    },
    methods: {
      clipOrderId() {
        let that = this
        that.$wx.setClipboardData({
          data: '订单详情',
          success: function(res) {
            that.$wx.getClipboardData({
              success: function(res) {
              }
            })
          }
        })
      },
      closeOrder() {
        wx.navigateTo({
          url: `${this.$routes.postage.DISTRIBUTION_DETAIL}`
        })
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@designCommon"

  .order-detail
    width: 100%
    padding-bottom: 0px
  .order-banner
    width: 100vw
    height: 70px
    box-sizing: border-box
    layout(row)
    justify-content: space-between
    align-items: center
    margin: 0
    position: relative
    background-image: radial-gradient(95% -74%, #73C200 0%, #ABE300 100%)

    .backdrop
      position: absolute
      left: 0
      top: 0
      width: 100vw
      height: 70px
      z-index: 2

      .backdrop-img
        width: 100%
        height: 100%

    .content
      position: absolute
      left: 0
      top: 0
      padding: 0 3.2vw
      width: 100vw
      height: 70px
      z-index: 9
      box-sizing: border-box
      layout(row)
      justify-content: space-between
      align-items: center

      .status
        layout(row)
        align-items: center

        .statu-txt
          font-family: $font-family-medium
          font-size: $font-size-18
          color: $color-white

        .icon
          width: 31px
          height: 31px

        .icon-img
          width: 100%
          display: block
          height: 100%

      .pay-countdown
        font-family: $font-family-medium
        font-size: $font-size-15
        color: $color-white

      .extract
        font-family: $font-family-medium
        font-size: $font-size-16
        color: $color-white

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
        color: #000
        margin-right: 10px
      .info-top-phone
        font-size: $font-size-15
        font-family: $font-family-regular
        color: #000
    .info-bottom
      font-size: $font-size-15
      font-family: $font-family-medium
      color: #111
      position: relative
      .item-arrow-img
        position: absolute
        right: 0
        top: 3px
  .order-line
    display: block
    height: 3px
    width: 100%
  .page-line
    display: block
    background: $color-background
    height: 10px
    width: 100%
  .order-all
    height: 45px
    layout(row)
    align-items: center
    justify-content: space-between
    padding: 0 12px
    border-top-1px()
    .order-left
      font-size: $font-size-14
      font-family: $font-family-regular
      color: #000
    .all-price
      font-size: $font-size-16
      font-family: 'PingFang-SC-Bold'
      color: #FF8300
    .all-text
      font-size: $font-size-14
      font-family: 'PingFang-SC-Bold'
      color: #FF8300
  //列表信息
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

  .order-info
    box-sizing: border-box
    min-height: 80px
    background: $color-white
    padding: 16px 3.2vw

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
        box-sizing: border-box
        font-family: $font-family-regular
        font-size: $font-size-12
        color: $color-text-main
        letter-spacing: 0.3px

    .order-time
      padding-top: 16px
      font-family: $font-family-regular
      font-size: $font-size-14
      color: #000000
      line-height: 14px

  .order-fixed
    z-index: 99
    layout(row)
    align-items: center
    background: #fff
    border-top-1px(#E6E6E6)
    position: fixed
    left: 0
    bottom: 0
    height: 50px
    right: 0
    justify-content: flex-end
    padding: 0 3.2vw

    .order-bottom-left
      font-size: $font-size-14
      color: #000
      font-family: $font-family-regular
      layout(row)
      align-items: center

      .color-time
        width: 42px
        text-align: center

    .order-bottom-right
      layout(row)
      align-items: center

      .refund
        width: 77px
        height: 28px
        line-height: 28px
        font-family: $font-family-regular
        font-size: $font-size-14
        text-align: center
        color: $color-white
        border-radius: 15px
        margin-left: 10px
        background: #FF5400

      .close
        width: 77px
        height: 28px
        line-height: 28px
        font-family: $font-family-regular
        font-size: $font-size-14
        text-align: center
        color: $color-text-main
        background: $color-white
        border: 0.5px solid $color-text-assist
        box-sizing: border-box

</style>
