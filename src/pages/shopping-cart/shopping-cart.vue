<template>
  <div class="wrap">
    <navigation-bar title="购物车" :showArrow="false" :translucent="false"></navigation-bar>
    <div class="shop-list">
      <div class="shop-item" v-for="(item, index) in [1]" :key="index">
        <!--<div class="sel-box"></div>-->
        <img class="sel-box" v-if="imgUrl" :src="imgUrl+'/yx-image/cart/icon-pick@2x.png'" alt="" />
        <div class="goods-image">
          <img class="goods-img" mode="aspectFill" src="http://service-ws-app-1254297111.picgz.myqcloud.com/300000/2018/12/01/154363269682158.png?imageView2/3/w/300/h/300" alt="">
        </div>
        <div class="good-info">
          <div class="top">
            <div class="title">超超值特惠 4斤新鲜柠檬</div>
            <div class="del">
              <img class="del-img" v-if="imgUrl" :src="imgUrl + '/ws-image/icon-delete@2x.png'" alt="">
            </div>
          </div>
          <div class="bot">
            <div class="left">
              <div class="spec">规格：包</div>
              <div class="remain">
                <div class="txt">仅剩10件</div>
              </div>
              <div class="price"><span class="num">3.8</span>元</div>
            </div>
            <div class="right">
              <div class="number-box">
                <div class="minus"></div>
                <div class="num">4</div>
                <div class="add"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="shop-item shop-item-opcta" v-for="(item, index) in [1]" :key="index">
        <img class="sel-box" v-if="imgUrl" :src="imgUrl+'/yx-image/cart/icon-pick@2x.png'" alt="" />
        <div class="goods-image">
          <img class="goods-img" mode="aspectFill" src="http://service-ws-app-1254297111.picgz.myqcloud.com/300000/2018/12/01/154363269682158.png?imageView2/3/w/300/h/300" alt="">
          <div class="robbed">已抢完</div>
        </div>
        <div class="good-info">
          <div class="top">
            <div class="title">超超值特惠 4斤新鲜柠檬</div>
            <div class="del">
              <img class="del-img" v-if="imgUrl" :src="imgUrl + '/ws-image/icon-delete@2x.png'" alt="">
            </div>
          </div>
          <div class="bot">
            <div class="left">
              <div class="spec">规格：包</div>
              <div class="remain">
                <div class="txt">仅剩10件</div>
              </div>
              <div class="price"><span class="num">3.8</span>元</div>
            </div>
            <div class="right">
              <div class="number-box">
                <div class="minus"></div>
                <div class="num">4</div>
                <div class="add"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!--结算-->
    <div class="payment">
      <div class="check-all">
        <img class="sel-box" v-if="imgUrl" :src="imgUrl+'/yx-image/cart/icon-pick@2x.png'" alt="" />
        <div class="txt">全选</div>
      </div>
      <div class="payment-content">
        <div class="price">合计 12元</div>
        <div class="pay-btn">结算</div>
      </div>
    </div>
    <!--没有商品-->
    <div class="without" v-if="false">
      <div class="without-img"><img class="img" v-if="imageUrl" :src="imageUrl+'/yx-image/cart/pic-gwc@2x.png'" alt=""></div>
      <div class="txt">购物车没有商品哦!</div>
      <div class="txt">赶快去挑选吧</div>
      <div class="btn">去逛逛</div>
    </div>
    <confirm-msg ref="msg"></confirm-msg>
  </div>

</template>

<script type="text/ecmascript-6">
  import WePaint from '@components/we-paint/we-paint'
  // import { mapGetters } from 'vuex'
  import NavigationBar from '@components/navigation-bar/navigation-bar'
  import ConfirmMsg from '@components/confirm-msg/confirm-msg'
  import API from '@api'
  import {oauthComputed} from '@state/helpers'
  import Vue from 'vue'

  export default {
    components: {
      WePaint,
      ConfirmMsg,
      NavigationBar
    },
    beforeCreate() {
    },
    data() {
      return {
        imgUrl: this.$imageUrl,
        testSrc: ''
        // title: '',
        // headStyle: 'background: rgba(255, 255, 255, 0)',
        // titleColor: 'white'
      }
    },
    onShow() {
      // setTimeout(() => {
      //   this.$refs.msg.show('lalal')
      // }, 100)
      console.log(this.$imageUrl)
      if (getApp().globalData.imgUrl) {
        this.testSrc = getApp().globalData.imgUrl
      }
      console.log(this.info, 'vuex helpers')
      console.log(Vue.Component)
    },
    computed: {
      ...oauthComputed
      // ...mapGetters(['role'])
    },
    // onPageScroll(e) {
    //   if (e.scrollTop >= 100) {
    //     this.headStyle = 'background: rgba(255, 255, 255, 1)'
    //     this.titleColor = '#000000'
    //     this.title = '导购'
    //   } else {
    //     this.headStyle = 'background: rgba(255, 255, 255, 0)'
    //     this.titleColor = 'white'
    //     this.title = ''
    //   }
    // },
    methods: {
      testApi() {
        API.Jwt.getToken()
      },
      navTo() {
        this.$wx.navigateTo({url: `/pages/other-page`})
      },
      testToast() {
        this.$wechat.showToast('123123')
      },
      createQrCode() {
        let str = JSON.stringify({ 'code': 8297128291, 'store_id': 8 }) // todo
        let img = this.$createQrCode.png(str) // png
        img = this.$createQrCode.svg(str) // svg
        this.testSrc = img
      },
      async editorAvatar() {
        try {
          let res = await this.$wechat.chooseImage()
          let file = res.tempFilePaths[0]
          getApp().globalData.imgUrl = file
          this.$wx.navigateTo({ url: '/pages/cut-picture?cutType=avatar' })
        } catch (e) {
          console.error(e)
        }
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"
  .wrap
    width: 100vw
    min-height: 100vh
    background: $color-background
    position: relative
  .payment
    position: fixed
    width: 100vw
    height: 50px
    background: $color-white
    left: 0
    padding: 0 3.2vw
    box-sizing: border-box
    bottom: 0
    layout(row)
    justify-content: space-between
    align-items: center
    .check-all
      layout(row)
      .sel-box
        display: block
        margin-right: 5px
        width: 5.34vw
        height: 5.34vw
        background: $color-white
        box-sizing: border-box
        border-radius: 50%
      .txt
        font-family: $font-family-regular
        font-size: $font-size-14
        color: $color-sub
        letter-spacing: 0.3px
    .payment-content
      layout(row)
      align-items: center
      .price
        font-family: $font-family-medium
        font-size: $font-size-18
        color: $color-money
      .pay-btn
        margin-left: 8px
        background: #73C200
        border-radius: 17px
        width: 26.67vw
        height: 34px
        text-align: center
        font-size: $font-size-16
        font-family: $font-family-medium
        line-height: 34px
        color: $color-white
  .shop-list
    background: $color-white
    .shop-item
      layout(row)
      align-items: center
      padding: 3.34vw 3.2vw
      widht: 100vw
      height: 115px
      box-sizing: border-box
      .sel-box
        display: block
        margin-right: 3.46vw
        width: 5.34vw
        height: 5.34vw
        background: $color-white
        box-sizing: border-box
        border-radius: 50%
      .goods-image
        background: #F6F9F4
        width: 24vw
        height: 24vw
        position: relative
        .robbed
          opacity: 0.75
          background: rgba(0, 0, 0, 0.6)
          position: absolute
          left: 50%
          top: 50%
          width: 15.7vw
          color: #fff
          font-family: $font-family-regular
          font-size: $font-size-12
          text-align: center
          line-height: 15.7vw
          border-radius: 50%
          height: 15.7vw
          margin-left: -7.85vw
          margin-top: -7.85vw
        .goods-img
          display: block
          width: 24vw
          height: 24vw
      .good-info
        width: 60.8vw
        padding-left: 3.46vw
        box-sizing: border-box
        layout()
        .top
          layout(row)
          justify-content: space-between
          align-items: center
          width: 100%
          height: 15px
          padding-bottom: 5px
          line-height: 15px
          .title
            width: 48.5vw
            no-wrap()
            family: $font-family-medium
            font-size: $font-size-14
            color: #111111
            letter-spacing: 0.3px
          .del
            .del-img
              width: 15px
              height: 15px
        .bot
          width: 100%
          layout(row)
          position: relative
          justify-content: space-between
          .right
            height: 24px
            position: absolute
            right: 0
            bottom: 0
            .number-box
              layout(row)
              align-items: flex-end
              width: 22.67vw
              height: 6.4vw
              background: $color-white
              border: 1px solid #EEEEEE
              border-radius: 1px
              .add
                width: 6.4vw
                height: 6.4vw
                position: relative
                text-align: center
                line-height: 6.4vw
                &:before
                  content: ''
                  position: absolute
                  left: 50%
                  top: 50%
                  width: 8px
                  height: 1px
                  margin-left: -4px
                  margin-top: -0.5px
                  background-color: #625E61
                &:after
                  content: ''
                  position: absolute
                  left: 50%
                  top: 50%
                  height: 8px
                  width: 1px
                  margin-left: -0.5px
                  margin-top: -4px
                  background-color: #625E61
              .minus
                width: 6.4vw
                height: 6.4vw
                position: relative
                text-align: center
                line-height: 6.4vw
                &:before
                  content: ''
                  position: absolute
                  left: 50%
                  top: 50%
                  width: 8px
                  height: 1px
                  margin-left: -4px
                  margin-top: -0.5px
                  background-color: #625E61
              .num
                font-family: $font-family-medium
                font-size: $font-size-14
                color: #111111
                width: 9.3vw
                height: 6.4vw
                text-align: center
                line-height: 24px
                border-left: 1px solid #EEEEEE
                border-right: 1px solid #EEEEEE


          .left
            width: 26.67vw
            .spec
              font-family: $font-family-regular
              font-size: $font-size-14
              color: #808080
              padding-bottom: 5px
            .remain
              layout(row)
              color: $color-money
              lin-height: 15px
              padding-bottom: 8px
              .txt
                padding: 0 1.34vw
                font-family: $font-family-regular
                font-size: $font-size-10
                color: $color-money
                height: 13px
                line-height: 13px
                box-sizing: border-box
                border-1px($color-money, 10px)
                border-radius: 10px
            .price
              font-family: $font-family-regular
              font-size: $font-size-12
              color: $color-money
              line-height: 19px
              .num
                font-family: $font-family-regular
                font-size: $font-size-18
                color: $color-money
    .shop-item-opcta
      .sel-box
        opacity: .5
      .good-info
        .top
          .title
            opacity: .5
        .bot
          opacity: .6
  .without
    widht: 100vw
    margin-top: 146px
    text-align: center
    .without-img
      width: 119.5px
      height: 109px
      margin: 0 auto
      margin-bottom: 11px
      .img
        display: block
        width: 100%
        height: 100%
    .txt
      font-family: $font-family-regular
      font-size: $font-size-14
      color: #808080
      line-height: 19px
    .btn
      width: 100px
      height: 32px
      box-sizing: border-box
      margin: 11px auto 0
      font-family: $font-family-regular
      font-size: $font-size-14
      color: $color-white
      line-height: 32px
      text-align: center
      background: #73C200
      border-1px(#73C200, 16px)
      border-radius: 16px
  .test
    background: #fff

</style>
