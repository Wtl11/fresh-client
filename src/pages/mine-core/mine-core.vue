<template>
  <div class="wrap">
    <navigation-bar title="购物车" :showArrow="false" :translucent="false"></navigation-bar>
    <div class="mine-top">
      <div class="info">
        <div class="avatar">
          <img class="ava-img" src="https://wx.qlogo.cn/mmopen/vi_32/DYAIOgq83er1Y2xVxQibcgQO7xblfYjo5yWt2Jo5GiaW1MsAoyHkV8fmffNkwDnBXP7If0cn9sdw3kfWFbByG0aw/132" alt="">
        </div>
        <div class="name">Excellent</div>
      </div>
      <div class="erwcode">
        <img class="ecode-img" v-if="imageUrl" :src="imageUrl+'/yx-image/cart/icon-code@2x.png'" alt="">
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
      <div class="selt-top">
        <div class="tit">我的自提点</div>
        <div class="switch-btn">
          <div class="txt">切换自提点</div>
          <div class="arri"><img v-if="imageUrl" :src="imageUrl+'/yx-image/cart/icon-pressed@2x.png'" alt="" class="sowarr"></div>
        </div>
      </div>
      <div class="selt-location">
        <map class="map-box" id="map" longitude="113.3172" latitude="23.08331" markers="" show-location style="width: 100%; height:100%">
          <cover-view class="map-model">
            <cover-view class="map-addr map-model-item">
              <cover-image v-if="imageUrl" :src="imageUrl+'/yx-image/cart/icon-phone_samll@2x.png'" alt="" class="icon"></cover-image>
              <cover-view class="txt">白云黄边北路国颐堂店</cover-view>
            </cover-view>
            <cover-view class="map-phone map-model-item">
              <cover-image v-if="imageUrl" :src="imageUrl+'/yx-image/choiceness/icon-address_small@2x.png'" alt="" class="icon"></cover-image>
              <cover-view class="txt">18844514445</cover-view>
            </cover-view>
          </cover-view>
          <cover-view class="cover-icon"></cover-view>
        </map>
      </div>
    </div>
    <div class="self-addr group">
      <div class="selt-top">
        <div class="tit">我的小区/小区管理</div>
        <div class="switch-btn">
          <div class="arri"><img v-if="imageUrl" :src="imageUrl+'/yx-image/cart/icon-pressed@2x.png'" alt="" class="sowarr"></div>
        </div>
      </div>
    </div>
    <div class="mine-model" v-if="showModal" :animation="maskAnimation">
      <div class="model-con" :animation="modalAnimation">
          <div class="erm">
            <img class="erm-img" src="" alt="">
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
  import Vue from 'vue'

  const ORRDERLIST = [
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
        testSrc: '',
        orderNav: ORRDERLIST,
        markers: [{
          iconPath: '',
          id: 0,
          latitude: 23.08331,
          longitude: 113.3172,
          showModal: false,
          callout: {
            content: '白云黄边北路国颐堂店',
            bgColor: '#fff',
            display: 'ALWAYS',
            padding: '5px'
          },
          width: 10,
          height: 10
        }]
        // title: '',
        // headStyle: 'background: rgba(255, 255, 255, 0)',
        // titleColor: 'white'
      }
    },
    onShow() {
      if (getApp().globalData.imgUrl) {
        this.testSrc = getApp().globalData.imgUrl
      }
      console.log(Vue.Component)
    },
    computed: {
      ...oauthComputed
      // ...mapGetters(['role'])
    },
    methods: {
      testApi() {
        API.Jwt.getToken()
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
  .wrap
    width: 100vw
    min-height: 100vh
    background: $color-white
    position: relative
    .self-addr
      width: 100vw
      box-sizing: border-box
      padding: 30px 3.46vw 25px 3.2vw
      .selt-location
        width: 92vw
        margin: 0 auto
        height: 90px
        position: relative
        .cover-icon
          position: absolute
          left: 50%
          width: 0
          height: 0
          border-width: 0 10px 10px
          border-style: solid
          z-index: 15
          border-color: transparent transparent #333
        .map-model
          position: absolute
          width: 156px
          height: 46px
          left: 50%
          margin-top: 20px
          margin-left: -78px
          background: $color-white
          .map-model-item
            layout(row)
            align-items: center
            .icon
              width: 11px
              height: 11px
              padding: 0 3.5px 0 10px
              display: block
            .txt
              font-family: $font-family-regular
              font-size: $font-size-12
              color: $color-text-sub
              line-height: 13px
            &:first-child
              margin-bottom: 7px
              margin-top: 7px
        .map-box
          width: 92vw
          height: 90px
      .selt-top
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
      box-shadow: 0 3px 10px 0 rgba(17,17,17,0.06)
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

</style>
