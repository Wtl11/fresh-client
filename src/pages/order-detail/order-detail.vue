<template>
  <div class="wrap">
    <navigation-bar title="订单详情"></navigation-bar>
    <div class="order-banner">
      <div class="backdrop"><img v-if="imageUrl" :src="imageUrl+'/yx-image/cart/bg-ddxq@2x.png'" alt="" class="backdrop-img"></div>
      <div class="content">
        <div class="status">
          <div class="icon" v-if="orderType*1 === 0 && orderMsg.status * 1 === 2" v><img v-if="imageUrl" class="icon-img" :src="imageUrl+'/yx-image/cart/icon-finish_xq@2x.png'" alt=""></div>
          <div class="icon" v-if="orderType*1 === 0 && orderMsg.status * 1 === 3"><img v-if="imageUrl" class="icon-img" :src="imageUrl+'/yx-image/cart/icon_close_xq@2x.png'" alt=""></div>
          <div class="icon" v-if="orderType*1 === 0 && orderMsg.status * 1 === 1"><img v-if="imageUrl" class="icon-img" :src="imageUrl+'/yx-image/cart/icon-delivery_xq@2x.png'" alt=""></div>
          <div class="icon" v-if="orderType*1 === 0 && orderMsg.status * 1 === 0"><img v-if="imageUrl" class="icon-img" :src="imageUrl+'/yx-image/cart/icon-payment_xq@2x.png'" alt=""></div>
          <div class="icon" v-if="orderType * 1 === 1"><img v-if="imageUrl" class="icon-img" :src="imageUrl+'/yx-image/cart/icon_refund_xq@2x.png'" alt=""></div>
          <div class="statu-txt">{{orderType * 1 !== 1 ? orderMsg.status_text : saleText}}</div>
        </div>
        <div class="extract" v-if="orderType * 1 !== 1 && orderMsg.status === 2">提货单号: {{orderMsg.code}}</div>
        <div class="extract" v-if="orderType * 1 !== 1 && orderMsg.status === 1">提货单号: {{orderMsg.code}}</div>
      </div>
    </div>
    <div class="addr-info">
      <div class="top">
        <div class="addr" v-if="orderType * 1 !== 1">提货地址： {{address.shop_address}}</div>
        <div class="addr" v-if="orderType * 1 === 1">{{address.social_name}}</div>
        <div class="warp">
          <div class="design">团长</div>
          <div class="icon-number"><span class="name">{{address.shop_name}}</span><span
            class="text">{{address.shop_mobile}}</span></div>
        </div>
      </div>
      <div class="bot" v-if="orderType * 1 !== 1">提货人：{{address.mobile}}</div>
    </div>
    <div class="gary-box"></div>
    <div class="order-list">
      <div class="order-item">
        <div class="goods-item" v-for="(item, index) in orderMsg.goods" :key="index">
          <div class="goods-info-box">
            <img class="goods-img" mode="aspectFill" :src="item.image_url" alt="">
            <div class="goods-info">
              <div class="tit">
                <div class="name">{{item.goods_name}}</div>
                <div class="quantity">x<span class="num">{{item.num}}</span></div>
              </div>
              <div class="guige">规格：{{item.goods_units}}</div>
              <div class="price">
                <div class="amout"><span class="num">{{item.price}}</span>元</div>
                <div class="refund" @click="isRefund(item)" v-if="(orderMsg.status * 1 === 1 || orderMsg.status * 1 === 2) && item.after_sale_status * 1 === 0">退款</div>
                <div class="refund-text" v-if="item.after_sale_status * 1 === 1 || item.after_sale_status * 1 === 2">{{item.after_sale_status_text}}</div>
              </div>
            </div>
          </div>
        </div>
        <div class="actual-amount" v-if="orderType * 1 === 0">
          <div class="sub">实付金额</div>
          <div class="price"><span class="num">{{orderMsg.total}}</span>元</div>
        </div>
      </div>
    </div>
    <div class="gary-box" v-if="orderType * 1 === 0"></div>
    <div class="oinfo">
      <div class="o-item" v-if="orderType * 1 === 1">退款金额：<span class="price"><span class="num">{{orderMsg.total}}</span>元</span></div>
      <div class="o-item" v-if="orderType * 1 === 1">退款方式：{{orderMsg.refund_method}}</div>
      <div class="order-iden">
        <div class="txt">订单编号：{{orderMsg.order_sn}}</div>
        <div class="copy-btn" @click.stop="clipOrderId">复制</div>
      </div>
      <div class="order-time">{{orderType * 1 === 1 ? '申请时间' : '下单时间'}}：{{orderMsg.created_at}}</div>
    </div>
    <div class="service">
      <div class="service-btn" @click.stop="showGroupList">联系团长</div>
    </div>
    <div class="order-fixed" v-if="orderMsg.status * 1 === 0">
      <div class="order-bottom-left">
        <div>请在</div><div class="color-time">{{payTime}}</div><div>内付款</div>
      </div>
      <div class="order-bottom-right">
        <div class="refund close" @click="closeOrder">取消</div>
        <div class="refund" @click="goPay">去付款</div>
      </div>
    </div>
    <confirm-msg ref="refundModel" useType="double" :msg="modelMsg" @confirm="confirm"></confirm-msg>
    <confirm-msg ref="colseModel" useType="close"></confirm-msg>
    <link-group ref="groupList" :wechatInfo="groupInfo"></link-group>
  </div>
</template>

<script type="text/ecmascript-6">
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
        payTime: '',
        timeEnd: false,
        confirmtype: 0,
        orderType: 0,
        modelMsg: '确定退款吗？',
        curItem: '',
        saleText: ''
      }
    },
    onLoad(e) {
      this.orderId = e.id
      this.orderType = e.type
      if (this.orderType * 1 === 0) {
        this.getGoodsDetailData()
      } else {
        this.getAfterGoodsDetailData()
      }
      this._groupInfo()
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
          API.Order.reqSaleOrder(this.curItem.order_detail_id).then((res) => {
            if (res.error === this.$ERR_OK) {
              this.$wechat.showToast('申请退款售后成功')
              this.getGoodsDetailData()
            } else {
              this.$wechat.showToast(res.message)
            }
          })
        }
      },
      showGroupList() {
        this.$refs.groupList.showLink()
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
            const {timestamp, nonceStr, signType, paySign} = payRes
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
        this.orderMsg.status = 1
        this.orderMsg.status_text = '待提货'
      },
      isRefund(item) {
        this.curItem = item
        if (item.is_time_out * 1 === 0) {
          this.modelMsg = '确定退款吗？'
          this.confirmtype = 1
          this.$refs.refundModel.show()
        } else {
          this.$refs.colseModel.show()
        }
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
            this.address = res.data.address
            if (this.orderMsg.status * 1 === 0) {
              this.getActiveEndTime(this.orderMsg.remind_timestamp)
            }
          } else {
            this.$wechat.showToast(res.message)
          }
        })
      },
      getAfterGoodsDetailData() {
        API.Order.reqSaleOrderDetail(this.orderId).then((res) => {
          if (res.error === this.$ERR_OK) {
            this.orderMsg = res.data
            this.address.shop_name = res.data.shop_name
            this.address.shop_mobile = res.data.shop_mobile
            this.address.social_name = res.data.social_name
            switch (res.data.after_sale_status * 1) {
              case 0 :
                this.saleText = '审核中'
                break
              case 1 :
                this.saleText = '退款成功'
                break
              case 2 :
                this.saleText = '退款失败'
                break
              case 3 :
                this.saleText = '取消退款'
                break
            }
            let goodsData = {
              goods_name: res.data.goods_name,
              goods_units: res.data.goods_units,
              image_url: res.data.image_url,
              num: res.data.num,
              price: res.data.price
            }
            this.orderMsg.goods = [goodsData]
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
    background: $color-background
    min-height: 100vh
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
        z-index:2
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
        .extract
          font-family: $font-family-medium
          font-size: $font-size-16
          color: $color-white
  .addr-info
    padding-left: 3.2vw
    background: $color-white
    .bot
      font-family: $font-family-medium
      font-size: $font-size-15
      color: #000000
      height: 50px
      line-height: 50px
      border-top-1px($color-line)
    .top
      height: 74px
      box-sizing: border-box
      padding:3.2vw 0
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
        position: relative
        padding: 2px 0 1.5px
        font-size: $font-size-12
        box-sizing: border-box
      .icon-number
        line-height: 25px
        .name
          font-family: $font-family-regular
          font-size: $font-size-15
          padding: 0 5px 0 10px
          color: $color-text-sub
        .text
          font-family: $font-family-regular
          font-size: $font-size-15
          color: $color-text-sub
  .goods-item
    height: 105px
    width: 100vw
    box-sizing: border-box
    padding: 0 3.2vw
    position: relative
    layout(row)
    justify-content: space-between
    align-items: center
    border-bottom-1px($color-line)
    .goods-info-box
      layout(row)
      flex: 1
      align-items: center
    .goods-img
      width: 75px
      border-radius: 2px
      height: 75px
    .arrlow
      width: 5.5px
      height: 10.5px
      .arr
        width: 100%
        height: 100%
        display: block
    .goods-info
      box-sizing: border-box
      padding-left: 2.67vw
      flex: 1
      .tit
        layout(row)
        align-items: center
        height: 16px
        justify-content: space-between
        .name
          width: 61.2vw
          font-family: $font-family-medium
          font-size: $font-size-14
          color: $color-sub
          min-height: 16px
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
        margin-top: 7px
        margin-bottom: 20px
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
        .refund-text
          height: 25px
          line-height: 25px
          font-family: $font-family-regular
          font-size: $font-size-14
          color: $color-money
        .amout
          font-family: $font-family-regular
          font-size: $font-size-11
          color: #1F1F1F
          .num
            font-family: $font-family-regular
            color: $color-sub
            font-size: $font-size-16
  .order-list
    background: $color-white
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
    background: $color-white
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
    right :0
    justify-content: space-between
    padding: 0 3.2vw
    .order-bottom-left
      font-size: $font-size-14
      color: #000
      font-family: $font-family-regular
      layout(row)
      align-items: center
      .color-time
        color: #ff8300
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
        background: $color-main
        border: 0.5px solid $color-main
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
        border: 0.5px solid $color-text-assist
        box-sizing: border-box
  .service
    width: 100vw
    padding-top: 15px
    padding-bottom: 65px
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
