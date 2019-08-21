<template>
  <form action="" report-submit @submit="$getFormId">
    <div class="submit-order">
      <navigation-bar title="提交订单" :showArrow="true" :translucent="false"></navigation-bar>
      <!--<div class="order-title" :class="'corp-' + corpName + '-submit-order'">请在{{deliverAt}}到货后，到团长代理点自提</div>-->
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
      <div class="order-list" :class="{'order-none': bigIndex + 1 === submitList.length}" v-for="(bigItem, bigIndex) in submitList" :key="bigIndex">
        <div class="arrive-time-box">
          <img v-if="imageUrl" :src="imageUrl + '/yx-image/2.9/icon-order_yuji@2x.png'" class="arrive-time-img">
          <div class="arrive-text">预计{{bigItem.dayAt}}({{bigItem.dayWeek}}) 可提货</div>
        </div>
        <div class="list-item" v-for="(item, index) in bigItem.dayList" :key="index">
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
        <div class="total-wrapper">
          <p class="name">商品总价</p>
          <p class="price">{{beforeTotal}}</p>
          <p>元</p>
        </div>
        <p v-if="isShowNewCustomer" class="new-rule-wrapper">不符合新人购买资格，按原价结算</p>
      </section>
      <ul class="coupon-info-wrapper" :class="'corp-' + corpName + '-money'">
        <li v-if="isFree" class="coupon-item">
          <p class="name">使用商品券</p>
          <p v-if="goodsDiscount > 0" class="price">-{{goodsDiscount}}</p>
          <p v-else class="price-disable">未使用商品券</p>
          <p v-if="goodsDiscount > 0">元</p>
          <!--<div class="item-arrow-img">-->
          <!--<img v-if="imageUrl" :src="imageUrl+'/yx-image/cart/icon-pressed@2x.png'" alt="" class="img">-->
          <!--</div>-->
        </li>
        <!--兑换券 -->
        <li v-if="!isFree" class="coupon-item" @click="chooseCertificateHandle">
          <p class="name">使用兑换券</p>
          <p v-if="certificate.customer_coupon_id" class="price">{{certificate.coupon_name}}</p>
          <p v-else class="price-disable">未使用兑换券</p>
          <div class="item-arrow-img">
            <img v-if="imageUrl" :src="imageUrl+'/yx-image/cart/icon-pressed@2x.png'" alt="" class="img">
          </div>
        </li>
        <!--优惠券 -->
        <li v-if="isGroupModal && !isFree" class="coupon-item">
          <p class="name">使用优惠券</p>
          <p class="price-disable">该商品不支持使用优惠券</p>
        </li>
        <li v-if="!isGroupModal && !isFree" class="coupon-item" @click="chooseCouponHandle">
          <p class="name">使用优惠券</p>
          <p v-if="discount > 0" class="price">-{{discount}}</p>
          <p v-else class="price-disable">未使用优惠券</p>
          <p v-if="discount > 0">元</p>
          <div class="item-arrow-img">
            <img v-if="imageUrl" :src="imageUrl+'/yx-image/cart/icon-pressed@2x.png'" alt="" class="img">
          </div>
        </li>
        <li class="coupon-item">
          <p class="name">实付金额</p>
          <p v-if="!isFree" class="price">{{total}}</p>
          <p v-else class="price">0</p>
          <p>元</p>
        </li>
      </ul>
      <div v-if="!isFree" class="fixed-btn">
        <div class="money" :class="'corp-' + corpName + '-money'">
          <p>总计 {{total}}元</p>
          <p class="explain">(已优惠<span :class="'corp-' + corpName + '-money'">{{discount}}</span>元)</p>
        </div>
        <button formType="submit" class="pay" :class="'corp-' + corpName + '-bg'" @click.stop="goPay">去支付</button>
      </div>
      <div v-if="isFree" class="fixed-btn">
        <div class="money" :class="'corp-' + corpName + '-money'">
          <p>总计 0元</p>
          <p class="explain">(已优惠<span :class="'corp-' + corpName + '-money'">{{total}}</span>元)</p>
        </div>
        <button formType="submit" class="pay" :class="'corp-' + corpName + '-bg'" @click.stop="_goPayAction">去支付</button>
      </div>
      <article class="share-panel-wrapper">
        <div v-if="isShowPayModal" class="share-mask" @click="_hidePayModal"></div>
        <section class="share-panel" :class="{show: isShowPayModal}">
          <p class="title">提货地址距离当前位置<span class="distance">{{distance}}km</span>请确认提货信息</p>
          <!--<p class="sub-title">预计{{deliverAt}}可提货</p>-->
          <article class="box-wrapper">
            <!--          <div class="item-wrapper">-->
            <!--            <p class="left">提货人：</p>-->
            <!--            <p class="right">{{groupInfo.name}}</p>-->
            <!--          </div>-->
            <div class="item-wrapper">
              <p class="left">团长：</p>
              <p class="right">{{groupInfo.name}}</p>
            </div>
            <div class="item-wrapper">
              <p class="left">提货地点：</p>
              <p class="right">{{groupInfo.province}}{{groupInfo.city}}{{groupInfo.district}}{{groupInfo.address}}</p>
            </div>
            <!--          <div class="item-wrapper">-->
            <!--            <p class="left">团长：</p>-->
            <!--            <p class="right">{{groupInfo.name}}</p>-->
            <!--          </div>-->
            <div class="item-wrapper">
              <p class="left">商品总价：</p>
              <p class="right">{{beforeTotal}}元</p>
            </div>
            <div class="item-wrapper mar-0">
              <p class="left">兑换券：</p>
              <p v-if="certificate.customer_coupon_id" class="right">{{certificate.coupon_name}}</p>
              <p v-else class="right">未使用兑换券</p>
            </div>
            <div class="item-wrapper mar-0">
              <p class="left">优惠券：</p>
              <p v-if="discount > 0" class="right">-{{discount}}元</p>
              <p v-else class="right">0元</p>
            </div>
            <div class="last-item-wrapper">
              <p class="l-title">实付金额：</p>
              <p class="l-number">{{total}}</p>
              <p class="l-unit">元</p>
            </div>
          </article>
          <div class="button-group">
            <p class="button-wrapper left" @click="_hidePayModal">取消</p>
            <p class="button-wrapper right" @click="_goPayAction">去支付</p>
          </div>
        </section>
      </article>
    </div>
  </form>
</template>

<script type="text/ecmascript-6">
  import { orderComputed, orderMethods } from '@state/helpers'
  import NavigationBar from '@components/navigation-bar/navigation-bar'
  import { ACTIVE_TYPE } from '@utils/contants'
  import API from '@api'
  import Ald from '@utils/ald'
  // import { isEmptyObject } from '@utils/common'

  // const ald = getApp()
  const PAGE_NAME = 'SUBMIT_ORDER'

  export default {
    name: PAGE_NAME,
    data() {
      return {
        code: '',
        mobile: '',
        groupInfo: {},
        userInfo: {},
        isShowNewCustomer: false,
        distance: 0,
        isShowPayModal: false,
        isFirst: true,
        isFree: false,
        submitList: [] // 商品列表重置
      }
    },
    computed: {
      ...orderComputed,
      discount() {
        return +this.couponInfo.promote_price || 0
      },
      isGroupModal() {
        return this.goodsList[0].url || false
      },
      isGoodsModal() {
        return false
      },
      goodsDiscount() {
        return this.commodityItem ? +this.commodityItem.denomination ? +this.commodityItem.denomination : 0 : 0
      }
    },
    onLoad() {
      this.isFree = (this.$mp && this.$mp.query && this.$mp.query.isFree) || false
      // 重置优惠券
      this.$wechat.showLoading()
      // this._getGoodsInfo()
      if (!this.isFree) {
        this._getCouponInfo()
      }
      this._checkIsNewClient()
      // 修改数据
      this._setListData(this.goodsList)
    },
    onUnload() {
      this.setCommodityItem({})
      this.saveCoupon({})
      this.setArticleId(0)
      this['SAVE_CERTIFICATE']()
      this.saveCoupon({})
    },
    async onShow() {
      // 文章进入详情 带参数
      console.warn('this.articleId', this.articleId)
      // ald && ald.aldstat.sendEvent('去支付')
      Ald.sendEvent('去支付')
      this._getCode()
      this._setMobile()
      this._getShopDetail()
      await this._getLocation()
      this._getDistance()
      this.$wechat.hideLoading()
    },
    methods: {
      ...orderMethods,
      chooseCertificateHandle() {
        wx.navigateTo({url: `${this.$routes.activity.CHOOSE_CERTIFICATE}`})
      },
      // 免费兑换
      goFree() {

      },
      _getGoodsInfo() {
        if (this.isGoodsModal) {
          return
        }
        API.Coupon.getChooseList({ goods: this.goodsList, is_usable: 1, tag_type: 1 })
          .then((res) => {
            if (res.data.length) {
              let coupon = res.data[0]
              this.setCommodityItem(coupon)
            }
          })
      },
      chooseGoodsCouponHandle() {
        wx.navigateTo({ url: `${this.$routes.main.INVITATION_CHOOSE}` })
      },
      _setListData(goodsList) {
        console.log(goodsList)
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
      // 获取地理位置
      async _getLocation() {
        if (this.latitude && this.longitude) return
        try {
          let res = await this.$wechat.getLocation()
          this.longitude = res.longitude
          this.latitude = res.latitude
          if (!this.latitude || !this.longitude) {
            wx.navigateTo({ url: `${this.$routes.main.OPEN_LOCATION}` })
          }
        } catch (e) {
          this.longitude = 0
          this.latitude = 0
          wx.navigateTo({ url: `${this.$routes.main.OPEN_LOCATION}` })
        }
      },
      _checkIsNewClient() {
        let flag = (this.goodsList && this.goodsList.some(val => val.activity && val.activity.activity_theme === ACTIVE_TYPE.NEW_CLIENT))
        if (flag) {
          API.Global.checkIsNewCustomer().then(res => {
            this.isShowNewCustomer = res.data.is_new_client === 0 // 老人0 新人1
          })
        }
      },
      _getCouponInfo() {
        // 获取最佳兑换券
        API.Coupon.getChooseList({ goods: this.goodsList, is_usable: 1, tag_type: 2 })
          .then((res) => {
            if (!res.data.length) {
              this['SAVE_CERTIFICATE']()
              return
            }
            this['SAVE_CERTIFICATE'](res.data[0])
          })
        // 获取最佳优惠券
        if (this.isGroupModal) {
          return
        }
        API.Coupon.getChooseList({ goods: this.goodsList, is_usable: 1 })
          .then((res) => {
            if (!res.data.length) {
              this.saveCoupon({})
              return
            }
            let coupon = res.data[0]
            this.saveCoupon(coupon)
          })
      },
      chooseCouponHandle() {
        wx.navigateTo({ url: `${this.$routes.main.COUPON_CHOOSE}` })
      },
      _getCode() {
        this.$wechat.login()
          .then(res => {
            this.code = res.code
          })
      },
      _getDistance() {
        let longitude = this.longitude
        let latitude = this.latitude
        API.Global.getDistance({ longitude, latitude }).then(res => {
          this.distance = Number(res.data.distance / 1000).toFixed(2)
        })
      },
      _showPayModal() {
        this.isShowPayModal = true
      },
      _hidePayModal() {
        this.isShowPayModal = false
      },
      async goPay() {
        if (this.distance > 5) {
          this._showPayModal()
        } else {
          this._goPayAction()
        }
      },
      async _goPayAction() {
        this._hidePayModal()
        if (this._paying) return
        this._paying = true
        clearTimeout(this._payTimer)
        this._payTimer = setTimeout(() => {
          this._paying = false
        }, 1500)
        this.$wechat.showLoading()
        let url = this.goodsList[0].url || ''
        let source = this.goodsList[0].source || ''
        let customerCouponId = this.isFree ? this.commodityItem.customer_coupon_id : this.couponInfo.customer_coupon_id ? this.couponInfo.customer_coupon_id : 0
        //  commodityItem
        let longitude = this.longitude
        let latitude = this.latitude
        let orderInfo = {
          goods: this.goodsList,
          nickname: this.userInfo.nickname,
          mobile: this.mobile,
          customer_coupon_id: customerCouponId,
          open_gid: wx.getStorageSync('openGId') || 0,
          url,
          source: this.isFree ? 'c_exchange' : source,
          latitude,
          longitude,
          gift_exchange_customer_coupon_id: this.certificate.customer_coupon_id || 0
        }
        this.userInfo.mobile = this.mobile

        // 文章进入直接支付
        if (this.articleId) {
          orderInfo.scenes = 'article'
          orderInfo.scenes_data = this.articleId
        }
        this.$wechat.setStorage('userInfo', this.userInfo)
        await this.submitOrder({ orderInfo, isFree: this.isFree })
      },
      _payback(res, id) {
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
  // 支付模块
  .share-panel-wrapper
    .share-mask
      position: fixed
      left: 0
      top: 0
      bottom: 0
      right: 0
      z-index: 999
      background: rgba(17, 17, 17, 0.7)

    .share-panel
      position: fixed
      bottom: -130%
      left: 0
      background: #fff
      width: 100%
      z-index: 9999
      transition: all .5s

      &.show
        bottom: 0

      .title
        padding-top: 22px
        font-family: $font-family-medium
        font-size: 16px
        color: #111111
        text-align: center

        .distance
          color: #FA7500
          padding: 0 3px

      .sub-title
        padding-top: 6px
        font-family: $font-family-regular
        font-size: 14px
        color: #FA7500
        letter-spacing: 0
        text-align: center

      .box-wrapper
        background: #F7F7F7
        border-radius: 4px
        margin: 20px 12px 14.5px
        padding: 20px 15px

        .item-wrapper
          display: flex
          font-family: $font-family-regular
          font-size: 14px
          margin-bottom: 16px

          .left
            width: 80px
            color: #616161

          .right
            flex: 1
            color: $color-text-main

        .last-item-wrapper
          display: flex
          font-family: $font-family-regular

          .l-title
            flex: 1
            font-size: 14px
            color: $color-text-main
            text-align: right

          .l-number
            font-family: $font-family-bold
            font-size: 16px;
            color: #FF8506;
            position: relative
            bottom: 1px

          .l-unit
            font-size: 14px;
            color: #FF8506;
            margin-left: 1px
            position: relative
            bottom: 0px

      .button-group
        display: flex

        .button-wrapper
          flex: 1
          height: 55px
          font-family: $font-family-medium
          font-size: 16px
          color: $color-text-main
          text-align: center
          line-height: @height
          box-sizing: border-box

          &.left
            border-top: 1px solid $color-line

          &.right
            background: #73C200;
            color: #FFFFFF;

  .goods-total-wrapper
    padding: 15.5px 12px 12px
    font-family: $font-family-regular
    color: $color-text-main
    background: #fff
    border-top-1px(#e6e6e6)
    border-bottom: 11px solid $color-background

    .new-rule-wrapper
      padding-top: 6px
      font-size: 12px;
      text-align: right;
      color: #FF8506

    .total-wrapper
      display: flex
      align-items: center
      font-size: 14px
      line-height: 1

      .name
        flex: 1
        color: #000000

      .price
        font-family: $font-family-medium

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
    border-bottom-1px($color-line, dashed)

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


    .arrive-time-box
      layout(row)
      align-items: center
      height: 45px
      border-bottom-1px($color-line)
      .arrive-time-img
        width: 12px
        height: @width
        margin-right: 5px
      .arrive-text
        font-size: $font-size-14
        font-family: $font-family-medium
        color: #111
  .order-none
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
      display: flex
      align-items: flex-end

      .explain
        font-family: $font-family-regular
        font-size: 14px
        color: $color-text-main

    .pay
      position absolute
      right: 0
      bottom: 0
      height: 50px
      width: 33.33333333333333vw
      font-size: $font-size-16
      color: #fff
      font-family: $font-family-medium
      line-height: @height
      text-align: center
      background: #73C200

  .submit-order
    width: 100%
</style>
