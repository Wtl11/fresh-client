<template>
  <div class="wrap">
    <navigation-bar title="我的" :showArrow="false" :translucent="false"></navigation-bar>
    <div class="mine-top">
      <div class="info">
        <div class="avatar">
          <img class="avatar-img" :src="userInfo.avatar" alt="">
        </div>
        <div class="nickname">{{userInfo.nickname}}</div>
      </div>
      <div class="erwcode">
        <img class="ecode-img" v-if="imageUrl" :src="imageUrl+'/yx-image/cart/icon-code@2x.png'" @click="createQrCode">
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
                  <img class="banner-item-img" v-if="item.image_url" :src="item.image_url">
                  <div class="banner-text-box">
                    <div class="banner-text-status">{{item.status_str}}</div>
                    <div class="banner-text-time">{{item.text}}</div>
                  </div>
                </swiper-item>
              </block>
            </swiper>
          </div>
        </div>
      </div>
    </div>
    <div class="self-addr">
      <div class="self-top">
        <div class="subtitle">我的自提点</div>
        <div class="switch-btn" @click="toChangeShop">
          <div class="switch-content">切换自提点</div>
          <img v-if="imageUrl" :src="imageUrl+'/yx-image/cart/icon-pressed@2x.png'" alt="" class="arrow-img">
        </div>
      </div>
      <div class="location-wrapper" @click="navigateLocation">
        <img v-if="imageUrl" :src="imageUrl + '/yx-image/mine/pic-map_bg@2x.png'" alt="" class="map">
        <div class="maker-wrapper">
          <div class="maker-content">
            <div class="item-wrapper">
              <img v-if="imageUrl" :src="imageUrl+'/yx-image/choiceness/icon-address_small@2x.png'" alt="" class="icon">
              <div class="text">{{detail.address}}</div>
            </div>
            <div class="item-wrapper">
              <img v-if="imageUrl" :src="imageUrl+'/yx-image/mine/icon-phone_samll@2x.png'" alt="" class="icon">
              <div class="text">{{detail.mobile}}</div>
            </div>
          </div>
          <img v-if="imageUrl" :src="imageUrl+'/yx-image/mine/pic-map_triangle@2x.png'" class="maker-triangle">
        </div>
      </div>
    </div>
    <div class="self-addr group" @click="_goMyHosing">
      <div class="self-top">
        <div class="subtitle">{{isLeader ? '小区管理' : '我的小区'}}</div>
        <div class="switch-btn">
          <img v-if="imageUrl" :src="imageUrl+'/yx-image/cart/icon-pressed@2x.png'" alt="" class="arrow-img">
        </div>
      </div>
    </div>
    <div class="mine-model" v-if="showModal" :animation="maskAnimation" @click="_cancelQrCodeBox">
      <div class="model-con" :animation="modalAnimation">
        <div class="erm" @click.stop>
          <img class="erm-img" :src="testSrc">
        </div>
        <div class="erm-text">向团长出示二维码提货</div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import WePaint from '@components/we-paint/we-paint'
  // import { mapGetters } from 'vuex'
  import NavigationBar from '@components/navigation-bar/navigation-bar'
  import QrcodeMsg from '@components/qrcode-msg/qrcode-msg'
  import API from '@api'
  import {oauthComputed} from '@state/helpers'

  const ORRDER_NAV_LIST = [
    {icon_url: '/yx-image/cart/icon-payment@2x.png', name: '待付款', id: 0, index: 1, count: 0},
    {icon_url: '/yx-image/cart/icon-delivery@2x.png', name: '待提货', id: 1, index: 2, count: 0},
    {icon_url: '/yx-image/cart/icon-finish@2x.png', name: '已完成', id: 2, index: 3, count: 0},
    {icon_url: '/yx-image/cart/icon-aftersales@2x.png', name: '售后', id: 4, count: 0},
    {icon_url: '/yx-image/cart/icon-order@2x.png', name: '全部', id: '', index: 0, count: 0}
  ]

  export default {
    beforeCreate() {
    },
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
        isLeader: false
      }
    },
    onTabItemTap() {
      this.$isLogin()
    },
    async onLoad() {
      let storageUserInfo = await this.$wechat.getStorage('userInfo')
      this.userInfo = storageUserInfo.data
    },
    onShow() {
      this.isLeader = wx.getStorageSync('isLeader')
      this._getShopDetail()
      this._getOrderCount()
    },
    onHide() {
    },
    computed: {
      ...oauthComputed
      // ...mapGetters(['role'])
    },
    methods: {
      navigateLocation() {
        this.$wechat.openLocation({
          latitude: this.detail.latitude,
          longitude: this.detail.longitude,
          name: this.detail.socialName,
          address: this.detail.address
        })
      },
      // 跳转我的小区
      _goMyHosing() {
        let isLeader = wx.getStorageSync('isLeader') || false
        let page = isLeader ? '/pages/regimental-commander' : '/pages/mine-housing'
        wx.navigateTo({url: page})
      },
      _showQrCodeBox() {
        let modalAnimation = wx.createAnimation({
          duration: 500,
          timingFunction: 'cubic-bezier(1, -0.07, 0.51, 1.48)',
          delay: 0
        })
        let maskAnimation = wx.createAnimation({
          duration: 500,
          timingFunction: 'linear',
          delay: 0
        })
        maskAnimation.opacity(0).step()
        modalAnimation.scale(0.3).step()
        this.maskAnimation = maskAnimation.export()
        this.modalAnimation = modalAnimation.export()
        this.showModal = true
        setTimeout(() => {
          maskAnimation.opacity(1).step()
          modalAnimation.scale(1).step()
          this.maskAnimation = maskAnimation.export()
          this.modalAnimation = modalAnimation.export()
        }, 200)
      },
      _cancelQrCodeBox() {
        let modalAnimation = wx.createAnimation({
          duration: 300,
          timingFunction: 'linear',
          delay: 0
        })
        let maskAnimation = wx.createAnimation({
          duration: 300,
          timingFunction: 'linear',
          delay: 0
        })
        maskAnimation.opacity(0).step()
        modalAnimation.scale(0.3).step()
        this.maskAnimation = maskAnimation.export()
        this.modalAnimation = modalAnimation.export()
        setTimeout(() => {
          maskAnimation.opacity(1).step()
          modalAnimation.scale(1).step()
          this.maskAnimation = maskAnimation.export()
          this.modalAnimation = modalAnimation.export()
          this.showModal = false
        }, 300)
      },
      createQrCode() {
        let id = wx.getStorageSync('userInfo') ? wx.getStorageSync('userInfo').id : 0
        let str = JSON.stringify({'customer_id': id}) // todo
        let img = this.$createQrCode.png(str) // png
        img = this.$createQrCode.svg(str) // svg
        this.testSrc = img
        this._showQrCodeBox()
      },
      toChangeShop() {
        wx.navigateTo({url: '/pages/self-point'})
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
            let {city, district, address, longitude, latitude, mobile, social_name: socialName} = res.data
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
            url: `/pages/after-service`
          })
        } else {
          wx.navigateTo({
            url: `/pages/order-list?id=${item.id}&&index=${item.index}`
          })
        }
      },
      jumpOrderDetail(item) {
        wx.navigateTo({
          url: `/pages/order-detail?id=${item.id}`
        })
      }
    },
    components: {
      WePaint,
      QrcodeMsg,
      NavigationBar
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"

  cover-view
    border: none

  .wrap
    width: 100vw
    min-height: 100vh
    background: $color-white
    position: relative
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
                min-width :11px
                min-height :11px
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
      width: 100vw
      height: 60px
      layout(row)
      align-items: center
      padding-top: 5px
      box-sizing: border-box
      justify-content: space-between
      .info
        layout(row)
        align-items: center
        .avatar
          width: 14.6vw
          border-radius: 50%
          height: 14.6vw
          margin: 0 2.67vw 0 3.2vw
          .avatar-img
            display: block
            border-radius: 50%
            width: 100%
            height: 100%
        .nickname
          max-width: 53vw
          font-family: $font-family-medium
          font-size: $font-size-18
          color: #1F1F1F
          letter-spacing: 0.45px
          no-wrap()
      .erwcode
        width: 9.33vw
        height: 9.33vw
        margin-right: 5.34vw
        .ecode-img
          display: block
          width: 9.33vw
          height: 9.33vw
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
        padding-top: 6.93vw
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
    box-shadow: 0 4px 30px 0 rgba(17,17,17,0.06)
    border-radius: 6px
    margin: 30px auto 0
    width: 93.6vw
    background: $color-white
    overflow: hidden
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
            .banner-item-img
              width: 44px
              height: 44px
              display: block
              margin-right: 10px
              border-radius: 3px
            .banner-text-status
              font-size: $font-size-14
              color: $color-main
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
    background-color: rgba(17, 17, 17, 0.8)
    fill-box(fixed)
    z-index: 100
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
        color: $color-main
        font-family: $font-family-medium
        letter-spacing: 1px
        font-size: $font-size-16
</style>
