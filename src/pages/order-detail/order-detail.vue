<template>
  <div class="wrap">
    <navigation-bar title="订单详情"></navigation-bar>
    <div class="order-banner">
      <div class="status">
        <div class="icon" v-if="orderMsg.status * 1 === 2" v><img v-if="imageUrl" class="icon-img" :src="imageUrl+'/yx-image/cart/icon-finish_xq@2x.png'" alt=""></div>
        <div class="icon" v-if="orderMsg.status * 1 === 3"><img v-if="imageUrl" class="icon-img" :src="imageUrl+'/yx-image/cart/icon_close_xq@2x.png'" alt=""></div>
        <div class="icon" v-if="orderMsg.status * 1 === 1"><img v-if="imageUrl" class="icon-img" :src="imageUrl+'/yx-image/cart/icon_refund_xq@2x.png'" alt=""></div>
        <div class="icon" v-if="orderMsg.status * 1 === 0"><img v-if="imageUrl" class="icon-img" :src="imageUrl+'/yx-image/cart/icon-delivery_xq@2x.png'" alt=""></div>
        <div class="statu-txt">{{orderMsg.status_text}}</div>
      </div>
      <div class="extract">提货单号: {{address.code}}</div>
    </div>
    <div class="addr-info">
      <div class="top">
        <div class="addr">提货地址： {{address.delivery_address}}</div>
        <div class="warp">
          <div class="design">团长</div>
          <div class="name">{{address.shop_manager_name}}</div>
          <div class="phone">{{address.shop_manager_mobile}}</div>
        </div>
      </div>
      <div class="bot">提货人：{{address.customer_mobile}}</div>
    </div>
    <div class="gary-box"></div>
    <div class="order-list">
      <div class="order-item">
        <div class="goods-item" v-for="(item, index) in orderMsg.goods" :key="index">
          <div class="goodsinfo">
            <img class="goods-img" mode="aspectFill" :src="item.goods_image_url" alt="">
            <div class="goods-info">
              <div class="tit">
                <div class="name">{{item.goods_name}}</div>
                <div class="quantity">x<span class="num">{{item.num}}</span></div>
              </div>
              <div class="guige">规格：{{item.goods_units}}</div>
              <div class="price">
                <div class="amout"><span class="num">{{item.price}}</span>元</div>
                <!--<div class="refund" @click="isRefund" v-if="orderMsg.status * 1 === 1 || orderMsg.status * 1 === 2">退款</div>-->
              </div>
            </div>
          </div>
        </div>
        <div class="actual-amount">
          <div class="sub">实付金额</div>
          <div class="price"><span class="num">{{orderMsg.total}}</span>元</div>
        </div>
      </div>
    </div>
    <div class="gary-box"></div>
    <div class="oinfo">
      <div class="o-item" v-if="false">退款金额：<span class="price"><span class="num">3.5</span>元</span></div>
      <div class="o-item" v-if="false">退款方式：微信红包</div>
      <div class="order-iden">
        <div class="txt">订单编号：{{orderMsg.order_sn}}</div>
        <div class="copy-btn" @click.stop="clipOrderId">复制</div>
      </div>
      <div class="order-time">下单时间：{{orderMsg.created_at}}</div>
    </div>
    <div class="service">
      <div class="service-btn" @click.stop="showGroupList">联系团长</div>
    </div>
    <!--<div class="operation">-->
      <!--<div class="refund">退款</div>-->
    <!--</div>-->
    <div class="order-fixed" v-if="orderMsg.status * 1 === 0">
      <div class="order-bottom-left">
        <span>请在</span><span class="color-time">{{payTime}}</span><span>内付款</span>
      </div>
      <div class="order-bottom-right">
        <div class="refund close" @click="closeOrder">取消</div>
        <div class="refund" @click="goPay">去付款</div>
      </div>
    </div>
    <confirm-msg ref="refundModel" useType="double" :msg="modelMsg" @confirm="confirm"></confirm-msg>
    <!--<confirm-msg ref="colseModel" useType="close"></confirm-msg>-->
    <link-group ref="groupList" :wechatInfo="groupInfo"></link-group>
  </div>
</template>

<script type="text/ecmascript-6">
  import WePaint from '@components/we-paint/we-paint'
  import LinkGroup from '@components/link-group/link-group'
  import NavigationBar from '@components/navigation-bar/navigation-bar'
  import ConfirmMsg from '@components/confirm-msg/confirm-msg'
  import API from '@api'
  import {oauthComputed, orderMethods} from '@state/helpers'

  export default {
    data() {
      return {
        testSrc: '',
        orderId: '',
        orderMsg: {},
        groupInfo: {},
        address: {},
        payTime: '00:00',
        timeEnd: false,
        confirmtype: 0,
        modelMsg: '确定退款吗？'
      }
    },
    onLoad(e) {
      this.orderId = e.id
      this.getGoodsDetailData()
      this._groupInfo()
    },
    onShow() {
    },
    computed: {
      ...oauthComputed
    },
    methods: {
      ...orderMethods,
      closeOrder() {
        this.modelMsg = '确定取消该订单？'
        this.confirmtype = 0
        this.$refs.refundModel.show()
      },
      confirm() {
        if (this.confirmtype === 0) {
          API.Order.colseOrder(this.orderId).then((res) => {
            if (res.error === this.$ERR_OK) {
              this.$wechat.showToast('取消订单成功')
              this.getGoodsDetailData()
            } else {
              this.$wechat.showToast(res.message)
            }
          })
        } else {
          console.log(111)
          this.$refs.colseModel.show()
        }
      },
      showGroupList() {
        this.$refs.groupList.showLink()
      },
      goPay() {
        let orderInfo = {
          goods: this.orderMsg.goods,
          nickname: this.address.customer_name,
          mobile: this.address.customer_mobile
        }
        this.submitOrder({
          orderInfo,
          success: this._paySuccess
        })
      },
      _paySuccess(res) {
        console.log(res)
        this.orderMsg.status = 1
        this.orderMsg.status_text = '待取货'
      },
      isRefund() {
        console.log(111)
        this.modelMsg = '确定退款吗？'
        this.confirmtype = 1
        this.$refs.refundModel.show()
      },
      clipOrderId() {
        let that = this
        that.$wx.setClipboardData({
          data: this.orderMsg.order_sn,
          success: function(res) {
            that.$wx.getClipboardData({
              success: function(res) {}
            })
          }
        })
      },
      async _groupInfo() {
        let res = await API.Choiceness.getGroupInfo()
        this.$wechat.hideLoading()
        if (res.error !== this.$ERR_OK) {
          this.$wechat.showToast(res.message)
        }
        this.groupInfo = res.data
      },
      getGoodsDetailData() {
        API.Order.getOrderDetailData(this.orderId).then((res) => {
          if (res.error === this.$ERR_OK) {
            this.orderMsg = res.data
            console.log(this.orderMsg)
            this.address = res.data.address
            if (this.orderMsg.status * 1 === 0) {
              this.getActiveEndTime(this.orderMsg.remind_timestamp)
            }
            console.log(res.data)
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
          this.payTime = `${endTime.minute}:${endTime.second}`
          if (this.timeEnd) {
            clearInterval(this.timer)
          }
        }, 1000)
      }
    },
    components: {
      WePaint,
      NavigationBar,
      LinkGroup,
      ConfirmMsg
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"
  .wrap
    width: 100vw
    background: $color-white
    min-height: 100vh
    .operation
      position: fixed
      bottom: 0
      left: 0
      width: 100vw
      height: 50px
      padding: 0 3.2vw
      box-sizing: border-box
      background: $color-white
      layout(row)
      justify-content: flex-end
      align-items: center
      box-shadow: 0 -0.5px 0 0 $color-line
      .refund
        width: 77px
        height: 30px
        line-height: 30px
        font-family: $font-family-regular
        font-size: $font-size-14
        text-align: center
        color: $color-white
        background: $color-main
        border: 1px solid $color-main
        border-radius: 15px
    .order-banner
      width: 100vw
      height: 70px
      padding: 0 3.2vw
      box-sizing: border-box
      layout(row)
      justify-content: space-between
      align-items: center
      margin: 0
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
      border-bottom-1px($color-line)
    .addr
      font-family: $font-family-medium
      font-size: $font-size-15
      no-wrap()
      padding-bottom: 10px
      color: #000000
    .warp
      layout(row)
      align-items: center
      color: $color-text-sub
      .design
        width: 30px
        font-family: $font-family-regular
        border-1px($color-main)
        text-align: center
        color: $color-main
        border-radius: 2px
        font-size: $font-size-12
        height: 15px
        box-sizing: border-box
        line-height: 15px
      .phone
        font-family: $font-family-regular
        font-size: $font-size-15
        color: $color-text-sub
      .name
        font-family: $font-family-regular
        font-size: $font-size-15
        padding: 0 5px 0 10px
        color: $color-text-sub
  .goods-item
    height: 105px
    box-sizing: border-box
    padding: 0 3.2vw
    position: relative
    layout(row)
    justify-content: space-between
    align-items: center
    border-bottom-1px($color-line)
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
        layout(row)
        align-items: center
        height: 15px
        justify-content: space-between
        .name
          width: 61.2vw
          font-family: $font-family-medium
          font-size: $font-size-14
          color: $color-sub
          letter-spacing: 0.3px
          no-wrap()
        .quantity
          font-family: $font-family-regular
          font-size: $font-size-12
          color: #1F1F1F
          .num
            font-family: $font-family-regular
            font-size: $font-size-16
            color: $color-sub
      .guige
        font-family: $font-family-regular
        font-size: $font-size-14
        color: $color-text-sub
        margin-top: 6px
        margin-bottom: 16px
      .price
        layout(row)
        align-items: center
        justify-content: space-between
        .refund
          width: 65px
          height: 25px
          line-height: 25px
          font-family: $font-family-regular
          font-size: $font-size-12
          color: #000000
          text-align: center
          background: $color-white
          border-1px($color-text-assist, 15px)
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
      color: $color-money
      .num
        font-family: $font-family-medium
        font-size: $font-size-16
        color: $color-money
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
        color: $color-money
        .num
          font-family: $font-family-medium
          font-size: $font-size-16
          color: $color-money
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
        color: $color-text-main
        letter-spacing: 0.3px
    .order-time
      padding-top: 16px
      font-family: $font-family-regular
      font-size: $font-size-14
      color: #000000
      line-height: 14px
  .order-fixed
    position: fixed
    left: 0
    bottom: -45px
    height: 50px
    width: 100%
    z-index: 99
    layout(row)
    align-items: center
    border-top-1px(#E6E6E6)
    justify-content: space-between
    padding: 0 3.2vw
    box-sizing: border-box
    .order-bottom-left
      font-size: $font-size-14
      color: #000
      font-family: $font-family-regular
      .color-time
        color: #ff8300
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
        background: $color-main
        border: 1px solid $color-main
        border-radius: 15px
        margin-left: 10px
      .close
        width: 77px
        height: 28px
        line-height: 28px
        font-family: $font-family-regular
        font-size: $font-size-14
        text-align: center
        color: $color-text-main
        background: $color-white
        border: 1px solid $color-text-main
  .service
    width: 100vw
    padding-top: 15px
    padding-bottom: 15px
    layout(row)
    justify-content: center
    align-items: center
    background-color: $color-background
    .service-btn
      width: 106px
      height: 34px
      text-align: center
      line-height: 34px
      border-1px($color-text-assist, 17px)
      font-family: $font-family-regular
      font-size: $font-size-15
      color: #000000
  .gary-box
    width: 100vw
    height: 10px
    background: $color-background
</style>
