<template>
  <div class="wrap">
    <navigation-bar title="订单详情"></navigation-bar>
    <div class="order-banner">
      <div class="backdrop"><img v-if="imageUrl && corpName === 'retuan'"
                                 :src="imageUrl+'/yx-image/retuan/bg-ddxq@2x.png'" alt="" class="backdrop-img"></div>
      <div class="backdrop"><img v-if="imageUrl && corpName === 'platform'"
                                 :src="imageUrl+'/yx-image/cart/bg-ddxq@2x.png'" alt="" class="backdrop-img"></div>
      <div class="content">
        <div class="status">
          <div class="icon" v-if="orderMsg.status * 1 === 2">
            <img v-if="imageUrl && corpName === 'retuan'" class="icon-img"
                 :src="imageUrl+'/yx-image/retuan/icon-finish_xq@2x.png'" alt="">
            <img v-if="imageUrl && corpName === 'platform'" class="icon-img"
                 :src="imageUrl+'/yx-image/cart/icon-finish_xq@2x.png'" alt="">
          </div>
          <div class="icon" v-if="orderMsg.status * 1 === 3">
            <img v-if="imageUrl && corpName === 'retuan'" class="icon-img"
                 :src="imageUrl+'/yx-image/retuan/icon_close_xq@2x.png'" alt="">
            <img v-if="imageUrl && corpName === 'platform'" class="icon-img"
                 :src="imageUrl+'/yx-image/cart/icon_close_xq@2x.png'" alt="">
          </div>
          <div class="icon" v-if="orderMsg.status * 1 === 1">
            <img v-if="imageUrl && corpName === 'retuan'" class="icon-img"
                 :src="imageUrl+'/yx-image/retuan/icon-delivery_xq@2x.png'" alt="">
            <img v-if="imageUrl && corpName === 'platform'" class="icon-img"
                 :src="imageUrl+'/yx-image/cart/icon-delivery_xq@2x.png'" alt="">
          </div>
          <div class="icon" v-if="orderMsg.status * 1 === 0">
            <img v-if="imageUrl && corpName === 'retuan'" class="icon-img"
                 :src="imageUrl+'/yx-image/retuan/icon-payment_xq@2x.png'" alt="">
            <img v-if="imageUrl && corpName === 'platform'" class="icon-img"
                 :src="imageUrl+'/yx-image/cart/icon-payment_xq@2x.png'" alt="">
          </div>
          <div class="icon" v-if="orderMsg.status * 1 === 11">
            <img v-if="imageUrl" class="icon-img"
                 :src="imageUrl+'/yx-image/2.4/icon_refund_xq@2x.png'" alt="">
          </div>
          <div class="statu-txt">{{orderMsg.status === 11 || orderMsg.status_text === '活动中' ? '已付款' : orderMsg.status_text}}</div>
        </div>
        <div v-if="orderMsg.status * 1 === 0 && payTime" class="pay-countdown">剩余：{{payTime}}</div>
        <div class="extract" v-if="orderMsg.status === 2">提货单号: {{orderMsg.code}}</div>
        <div class="extract" v-if="orderMsg.status === 1">提货单号: {{orderMsg.code}}</div>
      </div>
    </div>
    <div v-if="isGroup" class="group-status" @click.stop="goToGroupBuy(orderMsg)">
      <img v-if="imageUrl" :src="imageUrl+'/yx-image/2.4/icon-spellgroup@2x.png'" alt="" class="group-icon">
      <span :class="'corp-' + corpName + '-money'">[{{orderMsg.groupon.groupon_status_str}}]</span>
      <template v-if="orderMsg.groupon.groupon_status === 0 && orderMsg.groupon.surplus_seconds && at_countdown">
        只差
        <span :class="'corp-' + corpName + '-money'">{{orderMsg.groupon.surplus_number}}人</span>成团，剩
        <span :class="'corp-' + corpName + '-money'">{{at_countdown.hour}}:{{at_countdown.minute}}:{{at_countdown.second}}</span>结束
      </template>
      <img v-if="imageUrl" :src="imageUrl+'/yx-image/cart/icon-pressed@2x.png'" alt="" class="arrow">
    </div>
    <div class="address-info">
      <div class="top">
        <div class="warp">
          <div class="design" :class="'corp-' + corpName + '-bg'">团长</div>
          <div class="icon-number"><span class="name">{{address.shop_name}}</span><span
            class="text">{{address.social_name}}</span></div>
        </div>
        <div class="address-text">提货地址：{{address.shop_address}}</div>
      </div>
      <div class="bot">提货人手机号：{{address.mobile}}</div>
    </div>
    <img v-if="imageUrl" :src="imageUrl + '/yx-image/choiceness/pic-colour@2x.png'" class="order-line">
    <div class="gary-box"></div>
    <div class="order-list" v-for="(bigItem, bigIndex) in submitList" :key="bigIndex">
      <div class="arrive-time-box">
        <img v-if="imageUrl" :src="imageUrl + '/yx-image/2.9/icon-order_yuji@2x.png'" class="arrive-time-img">
        <div class="arrive-text">预计{{bigItem.dayAt}}({{bigItem.dayWeek}}) 可提货</div>
      </div>
      <div class="order-item">
        <!--<div class="goods-item" v-for="(item, index) in bigItem.dayList" :key="index">-->
        <!--<div class="goods-item" :class="{isGift: orderMsg.goods[index+1] && orderMsg.goods[index+1].is_gift}" v-for="(item, index) in orderMsg.goods" :key="index">-->
        <div class="goods-item" v-for="(item, index) in bigItem.dayList" :key="index">
          <div class="goods-info-box">
            <img class="goods-img" mode="aspectFill" :src="item.image_url" alt="">
            <div class="goods-info">
              <div class="tit">
                <div class="name"><span v-if="item.is_gift" class="icon-tag">赠品</span>{{item.goods_name}}</div>
                <block v-if="!item.is_gift">
                  <div class="refund" @click.stop="isRefund(item)"
                       v-if="(orderMsg.status * 1 === 1 || orderMsg.status * 1 === 2) && (item.after_sale_status * 1 === 0 || item.after_sale_status * 1 === 1) && item.can_after_sale * 1 === 1">
                    退款
                  </div>
                </block>
                <div class="refund-text" :class="'corp-' + corpName + '-money'"
                     v-if="item.after_sale_status * 1 === 2 && item.can_after_sale * 1 === 1">
                  {{item.after_sale_status_text}}
                </div>
              </div>
              <div class="guige">规格：{{item.goods_units}}</div>
              <div class="price">
                <div class="amout"><span class="num">{{item.price}}</span>元</div>
                <div class="quantity">x<span class="num">{{item.num}}</span></div>
              </div>
            </div>
          </div>
        </div>
        <!--<div class="actual-amount">-->
        <!--<div class="sub">实付金额</div>-->
        <!--<div class="price" :class="'corp-' + corpName + '-money'"><span class="num" :class="'corp-' + corpName + '-money'">{{orderMsg.total}}</span>元</div>-->
        <!--</div>-->
      </div>
    </div>
    <section class="goods-total-wrapper">
      <p class="name">商品总价</p>
      <p :class="'corp-' + corpName + '-money'"><span class="price">{{orderMsg.price}}</span>元</p>
    </section>

    <ul class="coupon-info-wrapper" :class="'corp-' + corpName + '-money'">
      <!--    兑换券-->
      <li class="coupon-item">
        <p class="name">使用兑换券</p>
        <p v-if="orderMsg.gift_coupon_name" class="price">{{orderMsg.gift_coupon_name}}</p>
        <p v-else class="price-disable">未使用兑换券</p>
      </li>
      <!-- 优惠券   -->
      <li v-if="!isGroup"  class="coupon-item">
        <p class="name">使用优惠券</p>
        <p v-if="orderMsg.promote_price > 0" class="price">-{{orderMsg.promote_price}}</p>
        <p v-if="orderMsg.promote_price > 0">元</p>
        <p v-else class="price-disable">未使用优惠券</p>
      </li>
      <li class="coupon-item">
        <p class="name">实付金额</p>
        <p :class="'corp-' + corpName + '-money'"><span class="price">{{orderMsg.total}}</span>元</p>
      </li>
    </ul>
    <!--<div class="gary-box"></div>-->
    <div class="oinfo">
      <div class="order-iden">
        <div class="txt">订单编号：{{orderMsg.order_sn}}</div>
        <div class="copy-btn" @click.stop="clipOrderId">复制</div>
      </div>
      <div class="order-time">下单时间：{{orderMsg.created_at}}</div>
    </div>
    <div class="service" @click.stop="showGroupList">
      <img v-if="imageUrl" :src="imageUrl + '/yx-image/goods/icon-service@2x.png'" mode="widthFix" class="service-img">
      <div class="service-btn">联系团长</div>
    </div>
    <div class="service-line-box"></div>
    <div class="order-fixed" v-if="orderMsg.status * 1 === 0">
      <!--      <div class="order-bottom-left">-->
      <!--        <div>请在</div><div class="color-time" :class="'corp-' + corpName + '-money'">{{payTime}}</div><div>内付款</div>-->
      <!--      </div>-->
      <div class="order-bottom-right">
        <div class="refund close" @click="closeOrder">取消</div>
        <div class="refund" :class="'corp-' + corpName + '-bg'" @click="goPay">去付款</div>
      </div>
    </div>
    <confirm-msg ref="refundModel" useType="double" :msg="modelMsg" @confirm="confirm"></confirm-msg>
    <confirm-msg ref="colseModel" useType="close"></confirm-msg>
    <link-group ref="groupList" :wechatInfo="groupInfo"></link-group>
    <!--兑换券弹窗-->
    <coupon-modal ref="invModal"></coupon-modal>
  </div>
</template>

<script type="text/ecmascript-6">
  import LinkGroup from '@components/link-group/link-group'
  import NavigationBar from '@components/navigation-bar/navigation-bar'
  import ConfirmMsg from '@components/confirm-msg/confirm-msg'
  import API from '@api'
  import { oauthComputed, orderMethods } from '@state/helpers'
  import { floatAccAdd, countDownHandle } from '@utils/common'
  import GetOptions from '@mixins/get-options'
  import CouponModal from './coupon-modal/coupon-modal'

  export default {
    mixins: [GetOptions],
    data() {
      return {
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
        saleText: '',
        shareType: 0,
        at_countdown: { hour: 0, minute: 0, second: 0 },
        submitList: [] // 商品列表重置
      }
    },
    components: {
      NavigationBar,
      LinkGroup,
      ConfirmMsg,
      CouponModal
    },
    computed: {
      ...oauthComputed,
      originTotal() {
        return floatAccAdd(this.orderMsg.total, this.orderMsg.promote_price)
      },
      isGroup() {
        return (this.orderMsg.groupon && this.orderMsg.groupon.pay_status === 1) || false
      },
      groupData() {
        return this.orderMsg.groupon || {}
      }
    },
    // onLoad(options) {
    //   if (!isEmptyObject(options)) {
    //     this._options = options || {}
    //   }
    // },
    onShow() {
      this._initPageParams()
      this.getGoodsDetailData()
    },
    onUnload() {
      this.groupTimer && clearInterval(this.groupTimer)
      clearInterval(this._groupOrderTimer)
    },
    onHide() {
      this.groupTimer && clearInterval(this.groupTimer)
      clearInterval(this._groupOrderTimer)
    },
    methods: {
      ...orderMethods,
      _initPageParams() {
        let options = this._$$initOptions()
        this.orderId = options.id
      },
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
        this.$sendMsg({
          event_no: 1006,
          total: this.orderMsg.total
        })
        if (this.groupData.id > 0) {
          let count = 0
          this.$wechat.showLoading()
          API.Global.checkPayResult({ order_id: this.orderId }).then(res => {
            console.warn(res, '支付：')
            if (res.data.is_payed === 1) {
              setTimeout(() => {
                this.$wechat.hideLoading()
                // this.getGoodsDetailData()
                wx.redirectTo({ url: `${this.$routes.main.ORDER_LIST}?id=1&&index=2` })
              }, 1500)
            } else {
              this._groupOrderTimer = setInterval(() => {
                count++
                if (count > 5) {
                  this.$wechat.hideLoading()
                  clearInterval(this._groupOrderTimer)
                  // this.getGoodsDetailData()
                  wx.redirectTo({ url: `${this.$routes.main.ORDER_LIST}?id=1&&index=2` })
                  return
                }
                API.Global.checkPayResult({ order_id: this.orderId }).then(res => {
                  console.warn(res, '支付轮询：' + count)
                  if (res.data.is_payed === 1) {
                    clearInterval(this._groupOrderTimer)
                    setTimeout(() => {
                      this.$wechat.hideLoading()
                      // this.getGoodsDetailData()
                      wx.redirectTo({ url: `${this.$routes.main.ORDER_LIST}?id=1&&index=2` })
                    }, 1500)
                  }
                })
              }, 1000)
            }
          })
        } else {
          setTimeout(() => {
            // this.getGoodsDetailData()
            wx.redirectTo({ url: `${this.$routes.main.ORDER_LIST}?id=1&&index=2` })
          }, 1500)
        }
        this.getReceiveInviteCoupon()
        // this.getGoodsDetailData()
        // this.orderMsg.status = 1
        // this.orderMsg.status_text = '待提货'
      },
      getReceiveInviteCoupon() {
        API.Coupon.receiveInviteCoupon({ cond_type: 6 }, false, false)
          .then((res) => {
            if (res.error !== this.$ERR_OK) return
            this.couponItem = res.data
            this.couponItem.length && this.$refs.invModal.show(this.couponItem)
          })
      },
      isRefund(item) {
        this.$refs.colseModel.show()
        // this.curItem = item
        // if (item.is_time_out * 1 === 0) {
        //   this.modelMsg = '确定退款吗？'
        //   this.confirmtype = 1
        //   this.$refs.refundModel.show()
        // }
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
        API.Order.getOrderDetailData(this.orderId).then((res) => {
          if (res.error === this.$ERR_OK) {
            this.orderMsg = res.data
            this.address = res.data.address
            this.groupInfo = {
              wx_account: this.address.wx_account,
              mobile: this.address.shop_mobile
            }
            this._setListData(res.data.goods)
            if (this.orderMsg.status * 1 === 0) {
              this.getActiveEndTime(this.orderMsg.remind_timestamp)
            }
            let groupon = res.data.groupon
            if (this.isGroup && groupon && groupon.surplus_seconds) {
              this.at_countdown = countDownHandle(groupon.surplus_seconds)
              this._setGroupTimer()
            }
          } else {
            this.$wechat.showToast(res.message)
          }
        })
      },
      _setListData(goodsList) {
        let arr = JSON.parse(JSON.stringify(goodsList))
        let arrNull = []
        arr.forEach((item) => {
          if (arrNull.length !== 0) {
            let index = arrNull.findIndex((nullItem) => nullItem.dayStamp === item.delivery_timestamp)
            if (index === -1) {
              let obj = {
                dayWeek: item.day_of_week,
                dayAt: item.delivery_at,
                dayStamp: item.delivery_timestamp,
                dayList: new Array(item)
              }
              arrNull.push(obj)
            } else {
              arrNull[index].dayList.push(item)
            }
          } else {
            let obj = {
              dayWeek: item.day_of_week,
              dayAt: item.delivery_at,
              dayStamp: item.delivery_timestamp,
              dayList: new Array(item)
            }
            arrNull.push(obj)
          }
        })
        arrNull = arrNull.sort((a, b) => {
          return a.dayStamp - b.dayStamp
        })
        console.log(arrNull)
        this.submitList = arrNull
      },
      _setGroupTimer() {
        this.groupTimer && clearInterval(this.groupTimer)
        this.groupTimer = setInterval(() => {
          let surplusSeconds = this.orderMsg.groupon.surplus_seconds || 0
          if (surplusSeconds && surplusSeconds !== 0) {
            surplusSeconds--
            this.at_countdown = countDownHandle(surplusSeconds)
            this.orderMsg.groupon.surplus_seconds = surplusSeconds
          } else {
            clearInterval(this.groupTimer)
          }
        }, 1000)
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
      goToGroupBuy(item) {
        item.groupon && wx.navigateTo({ url: `${this.$routes.main.COLLAGE_DETAIL}?id=${item.groupon.id}` })
      },
      jumpGoodsDetail(item) {
        wx.navigateTo({
          url: `${this.$routes.main.GOODS_DETAIL}?id=${item.goods_id}`
        })
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@designCommon"

  .goods-total-wrapper
    padding: 15.5px 12px
    display: flex
    align-items: center
    justify-content: space-between
    font-family: $font-family-regular
    font-size: $font-size-14
    line-height: 1
    color: $color-text-main
    background: #fff
    margin-top: -1px
    border-bottom: 11px solid $color-background

    .name
      color: #000000

    .price
      font-size: $font-size-16
      font-family: $font-family-bold

  .coupon-info-wrapper
    border-bottom: 11px solid $color-background
    padding: 10.5px 12px
    font-family: $font-family-regular
    font-size: 14px;
    line-height: 1
    background: #fff

    .coupon-item
      display: flex
      align-items: center
      padding: 10px 0

    .name
      flex: 1
      color: #000000

    .price
      font-size: 16px
      font-family: $font-family-medium

    .price-disable
      font-size: 14px
      color: #808080

    .item-arrow-img
      margin-left: 5px
      display: block
      width: 7.5px
      height: 12.5px

      .img
        display: block
        width: 100%
        height: 100%

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

  .address-info
    padding-left: 3.2vw
    background: $color-white

    .bot
      font-family: $font-family-regular
      font-size: $font-size-15
      color: #000000
      height: 50px
      line-height: 50px
      border-top-1px($color-line)

    .top
      box-sizing: border-box
      padding: 3.2vw 0

    .address-text
      font-family: $font-family-regular
      font-size: $font-size-15
      color: #000000
      line-height: 1.3
      word-break: break-all
      padding-right: 3.2vw

    .warp
      layout(row)
      align-items: center
      color: $color-text-sub
      padding-bottom: 10px

      .design
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
        line-height: 25px

        .name
          font-size: $font-size-15
          color: $color-text-main
          font-family: $font-family-medium
          margin-right: 10px

        .text
          font-family: $font-family-regular
          font-size: $font-size-13
          color: $color-text-sub

  .goods-item
    height: 105px
    width: 100vw
    box-sizing: border-box
    padding-right: 10px
    position: relative
    layout(row)
    justify-content: space-between
    align-items: center
    border-bottom-1px(#E6E6E6)
    &.isGift
      position: relative
      &:after
        content: ""
        position: absolute
        bottom: 0
        right: 0
        left : 3.2vw
        transform: scaleY(.5) translateZ(0)
        border-bottom: 1px solid $color-line

    .goods-info-box
      height: 77px
      layout(row)
      flex: 1
      align-items: center
      overflow: hidden
      padding: 1px 0

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
      padding: 0 10px
      flex: 1
      overflow: hidden

      .tit
        layout(row)
        align-items: center
        height: 25px
        justify-content: space-between

        .name
          flex: 1
          overflow: hidden
          font-family: $font-family-regular
          font-size: $font-size-14
          color: $color-sub
          min-height: 16px
          letter-spacing: 0.3px
          align-items :center
          no-wrap()
          .icon-tag
            display :inline-block
            background: rgba(255,104,3,0.10);
            border-1px(#FF6803, 14px)
            border-radius: 14px;
            height: 14px
            line-height :@height
            padding :0 4px
            font-family: $font-family-regular
            font-size: 11px
            color: #FF6803;
            margin-right: 4px
        .quantity
          font-family: $font-family-regular
          font-size: $font-size-12
          color: #1F1F1F

          .num
            font-family: $font-family-regular
            font-size: $font-size-16
            color: $color-sub

      .share-tit
        .name
          width: 47.7vw

        .share-tit-btn
          font-size: $font-size-14
          color: $color-main
          border-1px($color-main, 11.5px)
          font-family: $font-family-regular
          height: 22px
          line-height: 22px
          width: 75px
          text-align: center

      .guige
        height: 20px
        font-family: $font-family-regular
        font-size: $font-size-14
        color: $color-text-sub
        margin-bottom: 9px

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

      .amout
        font-family: $font-family-regular
        font-size: $font-size-11
        color: #1F1F1F

        .num
          font-family: $font-family-regular
          color: $color-sub
          font-size: $font-size-16

      .quantity
        font-family: $font-family-regular
        font-size: $font-size-12
        color: #1F1F1F

        .num
          font-family: $font-family-regular
          font-size: $font-size-16
          color: $color-sub

  .order-list
    background: $color-white
    box-sizing: border-box
    .order-item
      padding-left: 12px
      border-bottom-1px(#E6E6E6)
      .goods-item
        &:last-child
          border-none()
  .actual-amount
    layout(row)
    padding: 0 3.2vw
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

      .num
        font-family: $font-family-medium
        font-size: $font-size-16

  .oinfo
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

  .order-line
    display: block
    height: 3px
    width: 100%

  .service
    width: 100%
    margin-top: 15px
    height: 50px
    layout(row)
    justify-content: center
    align-items: center
    background: $color-white

    .service-btn
      font-family: $font-family-regular
      font-size: $font-size-15
      color: #000000

    .service-img
      width: 17.5px
      height: 15px
      display: block
      margin-right: 6px

  .service-line-box
    background: $color-background
    height: 55px
    width: 100%

  .gary-box
    width: 100vw
    height: 10px
    background: $color-background

  .group-status
    position: relative
    padding: 0 12px
    height: 50px
    margin-bottom: 11px
    background: $color-white
    layout(row)
    align-items: center
    font-size: $font-size-14
    font-family: $font-family-regular
    .group-icon
      width: 15px
      height: @width
      margin-right: 4px
    .arrow
      width: 7.5px
      height: 12.5px
      col-center()
      right: 12px
  .arrive-time-box
    layout(row)
    align-items: center
    height: 45px
    border-bottom-1px(#E6E6E6)
    padding-left: 12px
    .arrive-time-img
      width: 12px
      height: @width
      margin-right: 5px
    .arrive-text
      font-size: $font-size-14
      font-family: $font-family-medium
      color: #111
</style>
