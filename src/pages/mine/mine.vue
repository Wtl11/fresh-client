<template>
  <div class="wrap">
    <navigation-bar title="购物车" :showArrow="false" :translucent="false"></navigation-bar>
    <div class="mine-top">
      <div class="info">
        <div class="avatar">
          <img class="ava-img" :src="userInfo.avatar" alt="">
        </div>
        <div class="name">{{userInfo.nickname}}</div>
      </div>
      <div class="erwcode">
        <img class="ecode-img" v-if="imageUrl" :src="imageUrl+'/yx-image/cart/icon-code@2x.png'" @click="createQrCode">
      </div>
    </div>
    <div class="order-nav">
      <div class="order-item" v-for="(item, index) in orderNav" :key="index">
        <div class="icon"><img class="icon-img" v-if="imageUrl" :src="imageUrl+item.icon_url" alt=""></div>
        <div class="txt">{{item.name}}</div>
      </div>
      <div class="arr-order">
        <img class="eor-img" v-if="imageUrl" :src="imageUrl+'/yx-image/cart/mydivision@2x.png'" alt="">
      </div>
    </div>
    <div class="self-addr">
      <div class="self-top">
        <div class="tit">我的自提点</div>
        <div class="switch-btn" @click="toChangeShop">
          <div class="txt">切换自提点</div>
          <div class="arri"><img v-if="imageUrl" :src="imageUrl+'/yx-image/cart/icon-pressed@2x.png'" alt="" class="sowarr"></div>
        </div>
      </div>
      <div class="location-wrapper">
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
    <div class="self-addr group">
      <div class="self-top">
        <div class="tit">我的小区/小区管理</div>
        <div class="switch-btn">
          <div class="arri"><img v-if="imageUrl" :src="imageUrl+'/yx-image/cart/icon-pressed@2x.png'" alt="" class="sowarr"></div>
        </div>
      </div>
    </div>
    <div class="mine-model" v-if="showModal" :animation="maskAnimation" @click="_cancelQrCodeBox">
      <div class="model-con" :animation="modalAnimation">
        <div class="erm" @click.stop>
          <img class="erm-img" :src="testSrc">
        </div>
        <div class="txt">向团长出示二维码提货</div>
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
    {icon_url: '/yx-image/cart/icon-payment@2x.png', name: '代付款'},
    {icon_url: '/yx-image/cart/icon-delivery@2x.png', name: '待提货'},
    {icon_url: '/yx-image/cart/icon-finish@2x.png', name: '已完成'},
    {icon_url: '/yx-image/cart/icon-aftersales@2x.png', name: '售后'},
    {icon_url: '/yx-image/cart/icon-order@2x.png', name: '全部'}
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
          mobile: 18844514445
        },
        testSrc: '',
        showModal: false,
        maskAnimation: '',
        modalAnimation: ''
      }
    },
    async onLoad() {
      let storageUserInfo = await this.$wechat.getStorage('userInfo')
      this.userInfo = storageUserInfo.data
    },
    onShow() {
      this._getShopDetail()
    },
    computed: {
      ...oauthComputed
      // ...mapGetters(['role'])
    },
    methods: {
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
        // this.isShow = false
        // this.$emit('close')
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
      _getShopDetail() {
        API.Mine.getShopDetail()
          .then((res) => {
            if (res.error !== this.$ERR_OK) {
              return
            }
            let {city, district, address, longitude, latitude, mobile} = res.data
            this.detail.address = city + district + address
            this.detail.longitude = longitude
            this.detail.latitude = latitude
            this.detail.mobile = mobile
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
        .tit
          font-family: $font-family-medium
          font-size: $font-size-16
          color: $color-sub
          height: 24px
          line-height: 24px
          letter-spacing: 0.4px
        .switch-btn
          layout(row)
          align-items: center
          .txt
            font-family: $font-family-regular
            font-size: $font-size-13
            color: $color-text-sub
            height: 24px
            line-height: 24px
            padding-right: 10px
          .arri
            width: 5.5px
            height: 10.5px
            .sowarr
              display: block
              width: 5.5px
              height: 10.5px
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
            .item-wrapper
              layout(row)
              align-items: center
              &:last-child
                margin-top: 7.5px
              .icon
                width: 11px
                height: 11px
                margin-right: 3.5px
              .text
                font-size: $font-size-12
                color: $color-text-sub
          .maker-triangle
            width: 16px
            height: 9px
    .group
      padding: 0px 3.46vw 0px 3.2vw
    .mine-top
      width: 100vw
      height: 90px
      layout(row)
      align-items: center
      justify-content: space-between
      .info
        layout(row)
        align-items: center
        .avatar
          width: 14.6vw
          border-radius: 50%
          height: 14.6vw
          margin: 0 2.67vw 0 3.2vw
          .ava-img
            display: block
            border-radius: 50%
            width: 100%
            height: 100%
        .name
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
      width: 93.6vw
      height: 93.5px
      margin: 0 auto
      background: $color-white
      box-shadow: 0 3px 10px 0 rgba(17, 17, 17, 0.06)
      border-radius: 6px
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
        .icon
          width: 22px
          height: 20px
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

  .test
    height: 100px

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
      .txt
        margin-top: 28px
        color: $color-main
        font-family: $font-family-medium
        letter-spacing: 1px
        font-size: $font-size-16
</style>
