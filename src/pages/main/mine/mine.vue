<template>
  <div class="wrap">
    <navigation-bar title="我的" :showArrow="false" :translucent="true"></navigation-bar>
    <!--    <mine-r-test v-if="ENV === 'test'"></mine-r-test>-->
    <div :style="{height: placeHeight+'px'}"></div>
    <section class="top-background" :style="{height: backgroundHeight+'px'}">
      <img class="img" mode="aspectFill" v-if="imageUrl" :src="imageUrl + '/yx-image/2.3/bg-top_me.png'">
    </section>
    <div class="mine-top">
      <div class="info">
        <div class="avatar">
          <img class="avatar-img" :src="userInfo.avatar" alt="">
        </div>
        <div class="nickname">{{userInfo.nickname}}</div>
      </div>
      <div class="erwcode" @click="createQrCode">
        <img class="ecode-img" v-if="imageUrl" :src="imageUrl+'/yx-image/invitation/icon-code@2x.png'">
        <p class="ecode-text">提货码</p>
      </div>
    </div>
    <div class="order-nav-box">
      <div class="order-nav">
        <div class="order-item" v-for="(item, index) in orderNav" :key="index" @click="jumpOrder(item)">
          <div class="icon"><img class="icon-img" v-if="imageUrl" :src="imageUrl+item.icon_url" alt=""></div>
          <div class="txt">{{item.name}}</div>
          <div class="mark" v-if="(index === 0 || index === 1 || index === 3) && item.count > 0">{{item.count > 99 ? 99 : item.count}}</div>
        </div>
        <div class="arr-order">
          <img class="eor-img" v-if="imageUrl" :src="imageUrl+'/yx-image/cart/mydivision@2x.png'" alt="">
        </div>
      </div>
      <div class="order-banner-box" v-if="lastOrderList.length !== 0">
        <div class="order-banner-box-small">
          <div class="banner-box">
            <swiper class="banner" autoplay interval="5000" vertical="true" circular @change="_setPraiseIndex">
              <block v-for="(item, index) in lastOrderList" :key="item.id">
                <swiper-item class="banner-item" @click="jumpOrderDetail(item)">
                  <div class="banner-img-box">
                    <img class="banner-item-img" v-if="item.image_url" :src="item.image_url">
                  </div>
                  <div class="banner-text-box">
                    <div class="banner-text-status" :class="'corp-' + corpName + '-text'">{{item.status_str}}</div>
                    <div class="banner-text-time">{{item.text}}</div>
                  </div>
                </swiper-item>
              </block>
            </swiper>
          </div>
        </div>
      </div>
    </div>
    <banner v-if="enable"></banner>
    <mine-navigation
      :detail="detail"
      :couponNumber="couponNumber"
      :goodsNumber="goodsNumber"
      :isLeader="isLeader"
      :isInvitation="enable"
    ></mine-navigation>
    <div class="mine-model" v-if="showModal" :animation="maskAnimation" @click="_cancelQrCodeBox">
      <div class="model-con" :animation="modalAnimation">
        <div class="erm" @click.stop>
          <img class="erm-img" :src="testSrc">
        </div>
        <div class="erm-text" :class="'corp-' + corpName + '-text'">向团长出示二维码提货</div>
      </div>
    </div>
    <!--    <official-account></official-account>-->
    <!--    <div style="height: 50px"></div>-->
    <custom-tab-bar currentType="mine"></custom-tab-bar>
  </div>
</template>

<script type="text/ecmascript-6">
  import WePaint from '@components/we-paint/we-paint'
  import NavigationBar from '@components/navigation-bar/navigation-bar'
  import CustomTabBar from '@components/custom-tab-bar/custom-tab-bar'
  import QrcodeMsg from '@components/qrcode-msg/qrcode-msg'
  import API from '@api'
  import { oauthComputed } from '@state/helpers'
  import MineRTest from './mine-r-test/mine-r-test'
  import MineNavigation from './mine-navigation/mine-navigation'
  import AnimationModal from '@mixins/animation-modal'
  import ClearWatch from '@mixins/clear-watch'
  import Banner from './banner/banner'

  const ORRDER_NAV_LIST = [
    { icon_url: '/yx-image/cart/icon-payment@2x.png', name: '待付款', id: 0, index: 1, count: 0 },
    { icon_url: '/yx-image/cart/icon-delivery@2x.png', name: '待提货', id: 1, index: 2, count: 0 },
    { icon_url: '/yx-image/cart/icon-finish@2x.png', name: '已完成', id: 2, index: 3, count: 0 },
    { icon_url: '/yx-image/cart/icon-aftersales@2x.png', name: '售后', id: 4, count: 0 },
    { icon_url: '/yx-image/cart/icon-order@2x.png', name: '全部', id: '', index: 0, count: 0 }
  ]

  export default {
    beforeCreate() {
    },
    mixins: [AnimationModal, ClearWatch],
    data() {
      return {
        userInfo: {},
        orderNav: ORRDER_NAV_LIST,
        detail: {
          longitude: 113.3172,
          latitude: 23.08331,
          address: '',
          mobile: 18844514445,
          socialName: ''
        },
        testSrc: '',
        showModal: false,
        maskAnimation: '',
        modalAnimation: '',
        lastOrderList: [],
        isLeader: false,
        // BUTTON_GROUP: BUTTON_GROUP,
        couponNumber: 0,
        goodsNumber: 0,
        ENV: false,
        statusBarHeight: 0,
        backgroundHeight: 0,
        placeHeight: 0,
        enable: true
      }
    },
    onLoad() {
      this.ENV = process.env
      let res = this.$wx.getSystemInfoSync()
      this.statusBarHeight = res.statusBarHeight || 20
      this.placeHeight = 44 + this.statusBarHeight
      this.backgroundHeight = 0.32 * res.screenWidth + this.placeHeight
    },
    async onTabItemTap() {
      await this.$isLogin()
    },
    async onShow() {
      if (!wx.getStorageSync('token')) return
      let storageUserInfo = await this.$wechat.getStorage('userInfo')
      this.userInfo = storageUserInfo.data
      this.isLeader = wx.getStorageSync('isLeader') || false
      this._isOpenInvitation()
      this._getShopDetail()
      this._getOrderCount()
      this._getCouponNumber()
    },
    onHide() {
    },
    onPageScroll(e) {
      this._changeNavigation(e)
    },
    computed: {
      ...oauthComputed
      // ...mapGetters(['role'])
    },
    methods: {
      _isOpenInvitation() {
        API.Mine.activityInviteEnable()
          .then((res) => {
            this.enable = !!res.data.enable
            console.log(res)
          })
      },
      _changeNavigation(e) {
        let flag = e.scrollTop < 184
        const color = flag ? `#ffffff` : `#000000`
        wx.setNavigationBarColor({
          frontColor: color,
          backgroundColor: '#ffffff',
          animation: {
            duration: 0,
            timingFunc: 'easeIn'
          }
        })
      },
      _showQrCodeBox() {
        if (this.showModal) return
        this.showModal = true
        this.showAnimation()
      },
      _cancelQrCodeBox() {
        this.hideAnimation(() => {
          this.showModal = false
        })
      },
      createQrCode() {
        let id = wx.getStorageSync('userInfo') ? wx.getStorageSync('userInfo').id : 0
        let str = JSON.stringify({ 'customer_id': id }) // todo
        let img = this.$createQrCode.png(str) // png
        img = this.$createQrCode.svg(str) // svg
        this.testSrc = img
        this._showQrCodeBox()
      },
      _getOrderCount() {
        API.Mine.getOrderCount()
          .then((res) => {
            this.$wechat.hideLoading()
            if (res.error !== this.$ERR_OK) {
              return
            }
            this.lastOrderList = res.data.last_orders.map(item => item)
            res.data.status_count.forEach((item, index) => {
              if (item.status === 0) {
                this.orderNav[0].count = item.count
              }
              if (item.status === 1) {
                this.orderNav[1].count = item.count
              }
            })
          })
      },
      _getAfterOrderCount() {
        API.Mine.getAfterOrderCount()
          .then((res) => {
            this.$wechat.hideLoading()
            if (res.error !== this.$ERR_OK) {
              return
            }
            this.orderNav[3].count = res.data.count
          })
      },
      _getShopDetail() {
        API.Mine.getShopDetail()
          .then((res) => {
            if (res.error !== this.$ERR_OK) {
              return
            }
            let { city, district, address, longitude, latitude, mobile, social_name: socialName } = res.data
            this.detail.address = city + district + address
            this.detail.longitude = longitude
            this.detail.latitude = latitude
            this.detail.mobile = mobile
            this.detail.socialName = socialName
          })
      },
      jumpOrder(item) {
        if (item.id === 4) {
          wx.navigateTo({
            url: `${this.$routes.main.AFTER_SERVICE}`
          })
        } else {
          wx.navigateTo({
            url: `${this.$routes.main.ORDER_LIST}?id=${item.id}&&index=${item.index}`
          })
        }
      },
      jumpOrderDetail(item) {
        wx.navigateTo({
          url: `${this.$routes.main.ORDER_DETAIL}?id=${item.id}`
        })
      },
      // 获取头部数量
      _getCouponNumber() {
        API.Coupon.getClientListNumber('', false).then(res => {
          this.couponNumber = res.data.can_used_count
          this.goodsNumber = res.data.goods_can_used_count
        })
      }
    }, // 235
    components: {
      WePaint,
      QrcodeMsg,
      NavigationBar,
      CustomTabBar,
      MineRTest,
      MineNavigation,
      Banner
    }
  }
</script>


<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@designCommon"

  .img
    width: 100%
    height: 100%
    font-size: 0
    line-height: 0

  cover-view
    border: none

  .wrap
    width: 100vw
    min-height: 100vh
    background: $color-white
    position: relative
    .top-background
      position: absolute
      left: 0
      right: 0
      top: 0
      background-color: #73c200
    .button-group
      position: relative
      .button-item
        padding: 30px 12px 0
        &:last-child
          padding: 30px 12px
        .item-wrapper
          layout(row)
          justify-content: center
          font-family: $font-family-medium
          font-size: $font-size-16
          color: $color-sub
          height: 24px
          line-height: 24px
          letter-spacing: 0.4px
          .item-text
            flex: 1
          .right-number
            font-family: $font-family-regular
            font-size: 14px
            color: #808080
            padding: 0 6px
            position: relative
            bottom: 1px
          .item-arrow-img
            display: block
            width: 7.5px
            height: 12.5px
    .self-addr
      width: 100vw
      box-sizing: border-box
      padding: 30px 12px 25px 12px
      .self-top
        layout(row)
        align-items: center
        justify-content: space-between
        padding-bottom: 12px
        .subtitle
          font-family: $font-family-medium
          font-size: $font-size-16
          color: $color-sub
          height: 24px
          line-height: 24px
          letter-spacing: 0.4px
        .switch-btn
          layout(row)
          align-items: center
          justify-content: flex-start
          .switch-content
            font-family: $font-family-regular
            font-size: $font-size-13
            color: $color-text-sub
            height: 24px
            line-height: 24px
            padding-right: 10px
          .arrow-img
            display: block
            width: 7.5px
            height: 12.5px
      .location-wrapper
        position: relative
        width: 100%
        height: 0
        padding-top: 26.0869%
        background-color: $color-white
        .map
          position: absolute
          top: 0
          left: 0
          width: 100%
          height: 100%
        .maker-wrapper
          position: absolute
          top: 0
          left: 0
          width: 100%
          height: 100%
          layout()
          align-items: center
          justify-content: center
          .maker-content
            padding: 7.5px 10px
            background: $color-white
            box-shadow: 0 3px 8px 0 rgba(17, 17, 17, 0.12)
            border-radius: 3px
            width: 156px
            .item-wrapper
              layout(row)
              align-items: center
              flex-wrap: nowrap
              &:last-child
                margin-top: 7.5px
              .icon
                width: 11px
                height: 11px
                min-width: 11px
                min-height: 11px
                margin-right: 3.5px
              .text
                no-wrap()
                font-size: $font-size-12
                color: $color-text-sub
          .maker-triangle
            width: 16px
            height: 9px
    .group
      padding: 0 3.46vw 0 3.2vw
    .mine-top
      padding: 10px 12px 0 23px
      layout(row, block, nowrap)
      align-items: center
      position: relative
      justify-content: space-between
      .info
        layout(row)
        align-items: center
        flex: 1
        .avatar
          width: 55px
          height: @width
          border-radius: 50%
          border: 2px solid rgba(255, 255, 255, 0.80)
          .avatar-img
            display: block
            border-radius: 50%
            width: 100%
            height: 100%
        .nickname
          padding-left: 17px
          max-width: 53vw
          font-family: $font-family-medium
          font-size: $font-size-18
          color: #fff
          letter-spacing: 0.9px
          no-wrap()
      .erwcode
        display: flex
        background: #FAFFF2
        border-radius: 20px
        align-items: center
        justify-content: center
        height: 32px
        width: 90px
        .ecode-text
          font-family: $font-family-medium
          font-size: $font-size-13
          color: $color-main
          margin-left: 6px
        .ecode-img
          display: block
          width: 15px
          height: @width
    .order-nav
      width: 100%
      height: 88px
      position: relative
      layout(row)
      .arr-order
        position: absolute
        top: 50%
        margin-top: -20.5px
        right: 20.6vw
        width: 4px
        height: 45px
        .eor-img
          width: 4px
          height: 45px
          display: block
      .order-item
        width: 12.8vw
        margin: 0 2.667vw
        padding-top: 5.93vw
        text-align: center
        position: relative
        .mark
          position: absolute
          right: 3px
          top: 19px
          min-width: 16px
          text-align: center
          height: 16px
          line-height: 14px
          padding: 0 3px
          box-sizing: border-box
          font-family: $font-family-medium
          color: $color-white
          font-size: $font-size-10
          border: 1px solid $color-white
          background: #FF3B39
          border-radius: 50%
        .icon
          width: 22px
          height: 22px
          margin: 0 auto
          padding-bottom: 12.5px
          .icon-img
            display: block
            width: 100%
            height: 100%
        .txt
          font-family: $font-family-regular
          font-size: $font-size-12
          color: $color-sub
        &:last-child
          margin-left: 20px

  .order-nav-box
    box-shadow: 0 4px 30px 0 rgba(17, 17, 17, 0.06)
    border-radius: 6px
    /*width: 93.6vw*/
    margin: 17px 12px 0 12px
    background: $color-white
    overflow: hidden
    position: relative
    .order-banner-box
      padding: 0 10px 10px
      box-sizing: border-box
      width: 100%
      height: 70px
      .order-banner-box-small
        background: #F7F7F7
        padding: 0 9px
        box-sizing: border-box
        border-radius: 6px !important
      .banner-box
        height: 60px
        width: 100%
        box-sizing: border-box
        position: relative
        border-radius: 6px !important
        overflow: hidden !important
        .banner
          width: 100%
          height: 100%
          border-radius: 6px !important
          transform: translateY(0)
          overflow: hidden !important
          .banner-item
            width: 100%
            height: 100%
            position: relative
            border-radius: 6px !important
            transform: translateY(0)
            overflow: hidden !important
            layout(row)
            align-items: center
            .banner-img-box
              width: 44px
              height: 44px
              display: block
              margin-right: 10px
              border-radius: 3px
              text-align: center
              overflow: hidden
            .banner-item-img
              width: 100%
              height: 100%
              display: block
            .banner-text-status
              font-size: $font-size-14
              font-family: $font-family-regular
              margin-bottom: 10px
            .banner-text-time
              font-size: $font-size-12
              color: $color-text-sub
              font-family: $font-family-regular

  .mine-model
    position: fixed
    top: 0
    left: 0
    bottom: 0
    right: 0
    background-color: rgba(17, 17, 17, 0.7)
    fill-box(fixed)
    z-index: 555
    layout()
    justify-content: center
    align-items: center
    .model-con
      display: flex
      align-items: center
      justify-content: center
      border: 1px solid rgba(32, 32, 46, 0.10)
      border-radius: 8px
      background: $color-white
      width: 290px
      height: 319.5px
      flex-direction: column
      .erm-img
        height: 150px
        width: 150px
      .erm-text
        margin-top: 28px
        font-family: $font-family-medium
        letter-spacing: 1px
        font-size: $font-size-16
</style>
