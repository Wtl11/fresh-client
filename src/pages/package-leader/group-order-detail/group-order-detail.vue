<template>
  <div class="group-order-detail">
    <navigation-bar title="订单详情"></navigation-bar>
    <div class="order-status">
      <img :src="imageUrl + '/yx-image/group/bg-ddxq@2x.png'" v-if="imageUrl && corpName === 'platform'" class="order-status-bg">
      <img :src="imageUrl + '/yx-image/retuan/bg-ddxq@2x.png'" v-if="imageUrl && corpName === 'retuan'" class="order-status-bg">
      <div class="order-content">
        <img :src="orderDetail.status === 2 ? imageUrl + '/yx-image/cart/icon-delivery_xq@2x.png' : imageUrl + '/yx-image/group/icon_waiting@2x.png'" v-if="imageUrl && corpName === 'platform'" class="order-status-icon">
        <img :src="orderDetail.status === 2 ? imageUrl + '/yx-image/retuan/icon-delivery_xq@2x.png' : imageUrl + '/yx-image/retuan/icon_waiting@2x.png'" v-if="imageUrl && corpName === 'retuan'" class="order-status-icon">
        <p class="order-status-text">{{orderDetail.status_text}}</p>
      </div>
      <p class="order-num">提货单号: {{orderDetail.code}}</p>
    </div>
    <div class="group">
      <div class="group-address-box">
        <div class="customer-msg">
          <p class="group-tip" :class="'corp-' + corpName + '-bg'">团长</p>
          <p class="group-name">{{orderDetail.address.shop_name}}</p>
          <p class="group-social-name">{{orderDetail.address.social_name ?  orderDetail.address.social_name : ''}}</p>
          <!--<p class="group-phone">{{orderDetail.address.shop_mobile}}</p>-->
        </div>
        <div class="group-address">提货地址：{{orderDetail.address.shop_address}}</div>
      </div>
      <div class="customer">
        <p class="customer-phone">提货人手机：{{orderDetail.address.mobile}}</p>
        <img :src="imageUrl + '/yx-image/group/icon-phone-green@2x.png'" v-if="imageUrl && corpName === 'platform'" class="phone-icon" @click="_callPhone(orderDetail.address.mobile)">
        <img :src="imageUrl + '/yx-image/retuan/icon-telephone_xq@2x.png'" v-if="imageUrl && corpName === 'retuan'" class="phone-icon" @click="_callPhone(orderDetail.address.mobile)">
      </div>
      <img :src="imageUrl + '/yx-image/choiceness/pic-colour@2x.png'" v-if="imageUrl" mode="aspectFill" class="group-border">
    </div>
    <!--商品-->
    <div class="goods-wrapper">
      <block v-for="(item, index) in orderDetail.goods" :key="index">
        <div class="goods-item">
          <div class="goods-detail">
            <block v-if="item.image_url">
              <img :src="item.image_url" class="goods-img" mode="aspectFill">
            </block>
            <div class="goods-content">
              <p class="goods-title">
                <span v-if="item.is_gift" class="icon-tip m-r-4">赠品</span>
                <span class="goods-title-left">{{item.goods_name}}</span>
                <span class="goods-title-right" v-if="item.after_sale_status * 1 === 2">{{item.after_sale_status_text}}</span>
              </p>
              <div class="goods-sku">规格：{{item.goods_units}}</div>
              <p class="goods-money">
                {{item.price}}
                <span class="small">元</span>
                <span class="goods-num-box">x
                <span class="goods-num">{{item.num}}</span>
              </span>
              </p>
            </div>
          </div>
          <div v-if="item.delivery_status === 0" class="btn-box">
            <div class="goods-btn"
                 :class="'corp-' + corpName + '-goods-btn'"
                 v-if="orderDetail.status === 1 && orderDetail.delivery_status === 3 && (item.after_sale_status === 0 || item.after_sale_status === 1)"
                 @click="_showDialog('', item.order_detail_id)">确认提货</div>
          </div>
          <!--<block v-if="gifts[index]" v-for="(child,cIdx) in gifts[index]" :key="cIdx">-->
            <!--<div v-if="child.is_gift" class="goods-detail gift" :class="{'first-style': !cIdx}">-->
              <!--<block v-if="child.image_url">-->
                <!--<img :src="child.image_url" class="goods-img" mode="aspectFill">-->
              <!--</block>-->
              <!--<div class="goods-content">-->
                <!--<p class="goods-title">-->
                  <!--<span class="icon-tip m-r-4">赠品</span>-->
                  <!--<span class="goods-title-left">{{child.goods_name}}</span>-->
                  <!--<span class="goods-title-right" v-if="child.after_sale_status * 1 === 2">{{child.after_sale_status_text}}</span>-->
                <!--</p>-->
                <!--<div class="goods-sku">规格：{{child.goods_units}}</div>-->
                <!--<p class="goods-money">-->
                  <!--{{child.price}}-->
                  <!--<span class="small">元</span>-->
                  <!--<span class="goods-num-box">x-->
                <!--<span class="goods-num">{{child.num}}</span>-->
              <!--</span>-->
                <!--</p>-->
              <!--</div>-->
            <!--</div>-->
            <!--<div v-if="child.delivery_status === 0" class="btn-box">-->
              <!--<div class="goods-btn"-->
                   <!--:class="'corp-' + corpName + '-goods-btn'"-->
                   <!--v-if="orderDetail.status === 1 && orderDetail.delivery_status === 3 && (child.after_sale_status === 0 || child.after_sale_status === 1)"-->
                   <!--@click="_showDialog('', child.order_detail_id)">确认提货</div>-->
            <!--</div>-->
          <!--</block>-->
        </div>
      </block>
    </div>
    <section class="goods-total-wrapper">
      <p class="name">商品总价</p>
      <p class="price">{{originTotal}}</p>
      <p>元</p>
    </section>
    <ul class="coupon-info-wrapper" :class="'corp-' + corpName + '-money'">
      <li class="coupon-item">
        <p class="name">使用兑换券</p>
        <p v-if="orderDetail.gift_coupon_name" class="price">{{orderDetail.gift_coupon_name}}</p>
        <p v-else class="price-disable">未使用兑换券</p>
      </li>
      <li class="coupon-item">
        <p class="name">使用优惠券</p>
        <p v-if="orderDetail.promote_price > 0" class="price">-{{orderDetail.promote_price}}</p>
        <p v-if="orderDetail.promote_price > 0">元</p>
        <p v-else class="price-disable">未使用优惠券</p>
      </li>
      <li class="coupon-item">
        <p class="name">实付金额</p>
        <p class="price">{{orderDetail.total}}</p>
        <p>元</p>
      </li>
      <li class="coupon-item">
        <p class="name">提货日期</p>
        <p class="time">{{orderDetail.delivery_at}} ({{orderDetail.day_of_week}})</p>
      </li>
    </ul>
    <!--订单信息-->
    <div class="order-msg">
      <!--<div class="order-price">-->
        <!--<p class="price-title">实付金额</p>-->
        <!--<p  :class="'corp-' + corpName + '-money'">¥{{orderDetail.total}}</p>-->
      <!--</div>-->
      <div class="order-detail">
        <div class="order-sn">订单编号: {{orderDetail.order_sn}} <span class="copy" @click="_copyOrderSn(orderDetail.order_sn)">复制</span></div>
        <div class="order-time">下单时间: {{orderDetail.created_at}}</div>
      </div>
    </div>
    <!---->
    <div class="order-btn-box lost" v-if="orderDetail.status === 1 && orderDetail.delivery_status === 3">
      <form action="" report-submit @submit="$getFormId">
        <button class="order-btn order-dark" :class="{'order-disable': orderDetail.remind_status}" formType="submit" @click="_remind">{{orderDetail.remind_status ? '已提醒' : '提醒收货'}}</button>
        <!--<button class="order-btn order-dark" open-type="share">分享订单</button>-->
        <button class="order-btn order-main" :class="'corp-' + corpName + '-bg'" @click="_showDialog('all')">确认提货</button>
      </form>
    </div>
    <dialog-model ref="dialog" @confirm="_confirmDelivery"></dialog-model>
  </div>
</template>

<script type="text/ecmascript-6">
  import NavigationBar from '@components/navigation-bar/navigation-bar'
  import DialogModel from '@components/dialog-model/dialog-model'
  import API from '@api'
  import {floatAccAdd} from '@utils/common'

  const PAGE_NAME = 'GROUP_ORDER_DETAIL'

  export default {
    name: PAGE_NAME,
    components: {
      NavigationBar,
      DialogModel
    },
    data() {
      return {
        id: null,
        orderDetail: {address: {}, goods: []},
        ids: [],
        gifts: []
      }
    },
    async onLoad(option) {
      this.id = option.id || null
      await this._getOrderDetail()
    },
    computed: {
      originTotal() {
        return floatAccAdd(this.orderDetail.total, this.orderDetail.promote_price)
      }
    },
    methods: {
      // 获取订单详情
      async _getOrderDetail(loading = true) {
        let res = await API.Leader.groupOrder(this.id, loading)
        this.$wechat.hideLoading()
        if (res.error !== this.$ERR_OK) {
          this.$wechat.showToast(res.message)
          return
        }
        // let index = 0
        // let gifts = {}
        // res.data.goods = res.data.goods.filter((item) => {
        //   let flag = !item.is_gift
        //   if (flag) {
        //     index++
        //   } else {
        //     !gifts[index - 1] && (gifts[index - 1] = [])
        //     gifts[index - 1].push(item)
        //   }
        //   return flag
        // })
        // this.gifts = gifts
        this.orderDetail = res.data
      },
      _copyOrderSn(text) {
        wx.setClipboardData({
          data: text,
          success: (res) => {
          }
        })
      },
      _callPhone(phone) {
        wx.makePhoneCall({
          phoneNumber: phone
        })
      },
      _showDialog(type, id) {
        this.$refs.dialog.show({msg: '确定已经提货？'})
        let arr = [id]
        if (type === 'all') {
          arr = []
          arr = this.orderDetail.goods.map((item) => {
            return item.order_detail_id
          })
          for (let key in this.gifts) {
            arr = arr.concat(this.gifts[key].map(child => child.order_detail_id))
          }
        }
        this.ids = arr
      },
      // 提现收货
      async _remind() {
        let res = await API.Leader.remindDelivery({order_id: this.id})
        this.$wechat.showToast(res.message)
        if (res.error === this.$ERR_OK) {
          setTimeout(async () => {
            await this._getOrderDetail(false)
          }, 500)
        }
      },
      // 确认提货
      async _confirmDelivery() {
        let res = await API.Leader.delivery({ids: this.ids})
        this.$wechat.showToast(res.message)
        if (res.error === this.$ERR_OK) {
          setTimeout(async () => {
            await this._getOrderDetail(false)
          }, 500)
        }
      }
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
   padding :10.5px 12px 0
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
   .time
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



  button
    padding: 0
    margin: 0
    &:after
      border: none

  .group-order-detail
    box-sizing: border-box
    word-break: break-all
    min-height: 100vh
    padding-bottom: 95px
    background: $color-background

  .order-status
    height: 18.67vw
    overflow: hidden
    position: relative
    display: flex
    align-items: center
    padding: 0 15px
    box-sizing: border-box
    justify-content: space-between
    .order-status-bg
      position: absolute
      width: 100%
      height: 100%
      left: 0
      top: 0
    .order-content
      transform: translateY(3px)
      display: flex
      color: $color-white
      font-family: $font-family-regular
      font-size: $font-size-16
      position: relative
      z-index: 1
      align-items: center
      .order-status-icon
        width: 31px
        height: @width
      .order-status-text
        margin-left: 2px
        color: $color-white
        font-family: $font-family-medium
        transform: translateY(-2px)
    .order-num
      color: $color-white
      font-family: $font-family-regular
      font-size: $font-size-16
      position: relative
      z-index: 1

  .group
    font-family: $font-family-regular
    font-size: $font-size-15
    background: $color-white
    padding: 16px 0px 0 12px
    box-sizing: border-box
    position: relative
    overflow: hidden
    .group-border
      width: 100vw
      height: 3px
      left: 0
      bottom: 0
      position: absolute
    .group-address-box
      padding: 0 12px 14.5px 0px
      background: $color-white
      border-bottom-1px($color-line)
    .group-address
      line-height: 21px
      font-family: $font-family-regular
      color: #000000
      margin-top: 10px
    .customer-msg
      align-items: center
      display: flex
      color: $color-text-sub
      font-size: 15px
      .group-tip
        border-radius: 2px
        font-size: $font-size-12
        width: 30px
        padding: 2px 0
        text-align: center
        color: $color-white
      .group-name, .group-phone
        margin-left: 10px
        font-family: $font-family-medium
        line-height: 1.2
      .group-social-name
        font-size: $font-size-13
        color: $color-text-sub
        margin-left: 10px
      .group-phone
        margin-left: 10px
    .customer
      display: flex
      height: 44.5px
      align-items: center
      justify-content: space-between
      box-sizing: border-box
      padding-right: 12px
      .phone-icon
        height: 23px
        width: @height
      .customer-phone
        color #000
        font-family: $font-family-regular

  .icon-tip
    font-famliy: $font-family-regular
    font-size: 10px
    height: 14px
    padding: 0 4px
    background: rgba(255,104,3,0.10)
    border-1px(#FF6803,14px)
    border-radius: @height
    color: #FF6803;
    line-height: @height
  .m-r-4
    margin-right: 4px

  .goods-wrapper
    background: $color-white
    margin-top: 10px
    .goods-item
      padding: 10px 12px
      box-sizing: border-box
      border-bottom-1px($color-line)
      &:last-child
        border-none()
      .goods-detail
        display: flex
        background: #FAFAFA
        padding: 8px
        flex-wrap: nowrap
        &.gift
          margin-top :10px
        &.first-style
          margin-top: 15px
        .goods-img
          background: $color-white
          height: 60px
          width: 60px
        .goods-content
          flex: 1
          overflow hidden
          padding-left: 10px
          font-family: $font-family-regular
          line-height : 1
          .goods-title
            display :flex
            align-items: center
            color: $color-text-main
            font-size: $font-size-14
            .goods-title-left
              flex: 1
              no-wrap()
            .goods-title-right
              color: #ff8300
          .goods-money
            height: 14px
            padding-top: 13px
            font-size: $font-size-14
            color: $color-text-main
            .small
              font-size: $font-size-11
              margin-left: 1.5px
          .goods-sku
            padding-top: 7px
            color: $color-text-sub
            font-size $font-size-14
          .goods-num-box
            font-size: $font-size-12
            float :right
            .goods-num
              margin-left: 1.5px
              font-size: $font-size-16

      .btn-box
        padding-top :10px
        height: 25px
        display: flex
        justify-content: flex-end
        .goods-btn
          text-align: center
          box-sizing: border-box
          font-size: $font-size-12
          font-family: $font-family-regular
          line-height: 25px
          width: 70px
          height: 25px

  .order-msg
    margin-top: 0
    background: $color-white
    .order-price
      height: 50px
      display: flex
      padding: 0 12px
      box-sizing: border-box
      font-size: $font-size-14
      align-items: center
      font-family: $font-family-regular
      border-bottom-1px($color-line)
      justify-content: space-between
      .price-title
        color: $color-text-main
    .order-detail
      font-size: $font-size-14
      font-family: $font-family-regular
      color: $color-text-main
      line-height: 1
      padding: 6px 12px 27.5px
      box-sizing: border-box
      .order-sn
        margin: 9px 0
        .copy
          font-size: $font-size-12
          margin-left: 15px
          display: inline-block
          height: 22px
          line-height: 22px
          border-1px($color-text-assist, 11px)
          text-align: center
          width: 54px

  .order-btn-box
    display: flex
    justify-content: flex-end
    box-shadow: 0 -5px 10px 0 rgba(0, 0, 0, 0.03)
    background: $color-white
    position: fixed
    width: 100vw
    bottom: 0
    left: 0
    height: 55px
    align-items: center
    .order-btn
      width: 80px
      text-align: center
      font-size: $font-size-14
      font-family: $font-family-regular
      padding: 8px 0
      border-radius: 15px
      margin-right: 12px
      display: inline-block
    .order-dark
      color: $color-text-sub
      border-1px($color-text-assist, 15px)
    .order-main
      color: $color-white
    .order-disable
      border-none()
      color: $color-text-assist
      background: $color-background

</style>
