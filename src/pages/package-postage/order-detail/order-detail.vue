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
            <img v-if="imageUrl && orderMsg.status * 1 === 4" class="icon-img" :src="imageUrl+'/yx-image/postage/icon-fahuo_xq@2x.png'" alt="">
          </div>
          <div class="statu-txt">{{orderMsg.status === 11 || orderMsg.status_text === '活动中' ? '已付款' : orderMsg.status_text}}</div>
        </div>
        <div v-if="orderMsg.status * 1 === 0 && payTime" class="pay-countdown">剩余：{{payTime}}</div>
      </div>
    </div>
    <div class="select-info">
      <div class="info-top">
        <div class="info-top-name">{{address.nickname}}</div>
        <div class="info-top-phone">{{address.mobile}}</div>
      </div>
      <div class="info-bottom">收货地址：{{address.address}}</div>
    </div>
    <img v-if="imageUrl" :src="imageUrl + '/yx-image/choiceness/pic-colour@2x.png'" class="order-line">
    <div class="page-line"></div>
    <div class="order-list">
      <div class="order-title">
        <img v-if="imageUrl" :src="imageUrl+'/yx-image/postage/icon-baoyou_shopping@2x.png'" alt="" class="order-title-icon">
        <div class="order-title-name">全国包邮</div>
      </div>
      <div class="list-big-item" v-for="(item, index) in goodsList" :key="index">
        <div class="list-item">
          <div class="item-left-img"><img class="img" :src="item.image_url" alt=""></div>
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
        <div class="btn-box" v-if="orderMsg.status * 1 === 1 || orderMsg.delivery_status * 1 === 0">
          <div class="btn-text" :class="delivery_status * 1 === 0 ? 'btn-text-color' : ''" @click.stop="jumpTrace(item)" v-if="orderMsg.status * 1 === 1">物流信息</div>
          <div class="btn-text" @click.stop="deliverySubmit(item)" v-if="orderMsg.delivery_status * 1 === 0">确认收货</div>
        </div>
      </div>
    </div>
    <div class="order-all">
      <div class="order-left">实付金额</div>
      <div class="order-right"><span class="all-price">{{orderMsg.total}}</span><span class="all-text">元</span></div>
    </div>
    <div class="page-line"></div>
    <div class="order-info">
      <div class="order-iden">
        <div class="txt">订单编号：{{orderMsg.order_sn}}</div>
        <div class="copy-btn" @click.stop="clipOrderId">复制</div>
      </div>
      <div class="order-time">下单时间：{{orderMsg.created_at}}</div>
    </div>
    <div class="order-fixed" v-if="orderMsg.status * 1 === 0">
      <div class="order-bottom-right">
        <div class="refund close" @click="closeOrder">取消</div>
        <div class="refund" @click="goPay">去付款</div>
      </div>
    </div>
    <confirm-msg ref="refundModel" useType="double" :msg="modelMsg" @confirm="confirm"></confirm-msg>
  </div>
</template>

<script type="text/ecmascript-6">
  import NavigationBar from '@components/navigation-bar/navigation-bar'
  import GetOptions from '@mixins/get-options'
  import ConfirmMsg from '@components/confirm-msg/confirm-msg'
  import API from '@api'

  const PAGE_NAME = 'ORDER_DETAIL'

  export default {
    name: PAGE_NAME,
    components: {
      NavigationBar,
      ConfirmMsg
    },
    mixins: [GetOptions],
    data() {
      return {
        orderMsg: {
          status: 1,
          status_text: '发货'
        },
        payTime: '',
        goodsList: [],
        address: {}
      }
    },
    onShow() {
      this._initPageParams()
      this.getGoodsDetailData()
    },
    methods: {
      _initPageParams() {
        let options = this._$$initOptions()
        this.orderId = options.id
      },
      clipOrderId() {
        let that = this
        that.$wx.setClipboardData({
          data: this.orderMsg.order_sn,
          success: function(res) {
            that.$wx.getClipboardData({
              success: function(res) {
              }
            })
          }
        })
      },
      getGoodsDetailData() {
        API.Postage.getOrderDetailData(this.orderId).then((res) => {
          if (res.error === this.$ERR_OK) {
            this.orderMsg = res.data
            this.address = res.data.address
            this.goodsList = res.data.goods
            console.log(this.orderMsg)
            if (this.orderMsg.status * 1 === 0) {
              this.getActiveEndTime(this.orderMsg.remind_timestamp)
            }
          } else {
            this.$wechat.showToast(res.message)
          }
        })
      },
      _groupTimeCheckoutNoDay(time) {
        // let nowSecond = parseInt(Date.now() / 1000)
        // let differ = time * 1 - nowSecond
        let differ = time * 1
        let hour = Math.floor(differ / (60 * 60))
        hour = hour >= 10 ? hour : '0' + hour
        let minute = Math.floor(differ / 60) - (hour * 60)
        minute = minute >= 10 ? minute : '0' + minute
        let second = Math.floor(differ) - (hour * 60 * 60) - (minute * 60)
        second = second >= 10 ? second : '0' + second
        let times
        if (differ > 0) {
          times = {
            hour,
            minute,
            second
          }
          this.timeEnd = false
        } else {
          times = {
            hour: '00',
            minute: '00',
            second: '00'
          }
          this.timeEnd = true
        }
        return times
      },
      getActiveEndTime(time) {
        clearInterval(this.timer)
        this.end_time = time
        this.timer = setInterval(() => {
          if (this.end_time > 0) {
            this.end_time--
          }
          let endTime = this._groupTimeCheckoutNoDay(this.end_time)
          this.payTime = `${endTime.minute}分${endTime.second}秒`
          if (this.timeEnd) {
            clearInterval(this.timer)
          }
        }, 1000)
      },
      goPay() {
        API.SubmitOrder.rePayment(this.orderId)
          .then(res => {
            this.$wechat.hideLoading()
            if (res.error !== this.$ERR_OK) {
              this.$wechat.showToast(res.message)
              return
            }
            let payRes = res.data
            const { timestamp, nonceStr, signType, paySign } = payRes
            this.orderId = res.data.order_id
            wx.requestPayment({
              timeStamp: timestamp,
              nonceStr,
              package: payRes.package,
              signType,
              paySign,
              success: this._paySuccess
            })
          })
      },
      _paySuccess(res) {
        let count = 0
        this.$wechat.showLoading()
        API.Global.checkPayResult({ order_id: this.orderId }).then(res => {
          console.warn(res, '支付：')
          if (res.data.is_payed === 1) {
            setTimeout(() => {
              this.$wechat.hideLoading()
              this.getGoodsDetailData()
            }, 1500)
          } else {
            this._groupOrderTimer = setInterval(() => {
              count++
              if (count > 5) {
                this.$wechat.hideLoading()
                clearInterval(this._groupOrderTimer)
                this.getGoodsDetailData()
                return
              }
              API.Global.checkPayResult({ order_id: this.orderId }).then(res => {
                console.warn(res, '支付轮询：' + count)
                if (res.data.is_payed === 1) {
                  clearInterval(this._groupOrderTimer)
                  setTimeout(() => {
                    this.$wechat.hideLoading()
                    this.getGoodsDetailData()
                  }, 1500)
                }
              })
            }, 1000)
          }
        })
      },
      // 关闭订单
      closeOrder() {
        this.modelMsg = '确定取消该订单？'
        this.$refs.refundModel.show()
      },
      confirm() {
        API.Order.colseOrder(this.orderId).then((res) => {
          if (res.error === this.$ERR_OK) {
            this.$wechat.showToast('取消订单成功')
            this.getGoodsDetailData()
          } else {
            this.$wechat.showToast(res.message)
          }
        })
      },
      // 跳转物流信息
      jumpTrace(item) {
        console.log(item)
        wx.navigateTo({url: `${this.$routes.postage.DISTRIBUTION_DETAIL}?id=${item.goods_sku_id}&orderSn=${this.orderMsg.market_order_sn}`})
      },
      // 确认收货
      deliverySubmit(item) {
        console.log(item)
        let arr = []
        arr[0] = item.order_detail_id
        API.Postage.deliverySubmitFn({ids: arr}).then(res => {
          if (res.error !== this.$ERR_OK) {
            return
          }
          this.getGoodsDetailData()
        })
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@designCommon"

  .order-detail
    width: 100%
    padding-bottom: 0
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
          padding-bottom: 5px

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
      font-family: $font-family-regular
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
        width: 15px
        height: 15px
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
  .btn-box
    padding-right: 3.2vw
    margin: 5px 0 15px
    layout(row)
    justify-content: flex-end
    .btn-text
      font-family: $font-family-regular
      color: $color-main
      font-size: $font-size-12
      width: 70px
      height: 25px
      margin-left: 15px
      line-height: 25px
      text-align: center
      border-1px($color-main, 15px)
    .btn-text-color
      color: #111111
      border-1px(#B7B7B7, 15px)
</style>
