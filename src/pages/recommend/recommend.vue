<template>
  <div class="recommend">
    <navigation-bar ref="nav" :title="navBarTitle" :showArrow="showArrow"></navigation-bar>
    <div class="content">
      <header class="header">
        <img class="img" mode="aspectFill" v-if="activeImage" :src="activeImage" alt="">
      </header>
      <section class="banner">
        <img v-if="imageUrl" :src="imageUrl + '/yx-image/active/pic-shop@2x.png'" class="img">
      </section>
      <section class="panel logo">
        <img v-if="imageUrl" :src="imageUrl + '/yx-image/goods/pic-logo@2x.png'" class="logo-img">
        <circle-link></circle-link>
      </section>
      <ul class="active-wrapper">
        <li v-for="(item, index) in dataArray" :key="index" class="panel goods-wrapper">
          <circle-link v-if="index !== dataArray.length - 1"></circle-link>
          <figure class="goods-img">
            <div class="wrapper">
              <img class="img" mode="aspectFill" v-if="item.goods_cover_image" :src="item.goods_cover_image" alt="">
            </div>
          </figure>
          <article class="goods-info">
            <p class="title">{{item.name}}</p>
            <div class="button-group">
              <section class="price-wrapper">
                <p class="number">{{item.trade_price}}</p>
                <p class="unit">元</p>
                <p class="origin">{{item.original_price}}元</p>
              </section>
              <button class="button-wrapper" :open-type="isAuthor ? '' : 'getUserInfo'" @getuserinfo="buyHandle(item, $event)" @click="buyHandle(item)">
                <div class="b-left">{{btnLeftText}}</div>
                <div class="b-right"><p class="tri"></p><p class="trr"></p> 立即购买</div>
              </button>
            </div>
          </article>
        </li>
      </ul>
    </div>
    <pay-result ref="pay" :dataInfo="dataInfo"></pay-result>
    <active-end ref="activeEnd" :navBarTitle="navBarTitle"></active-end>
  </div>
</template>

<script type="text/ecmascript-6">
  import NavigationBar from '@components/navigation-bar/navigation-bar'
  import CircleLink from './circle-link/circle-link'
  import PayResult from './pay-result-com/pay-result-com'
  import ActiveEnd from './active-end/active-end'
  import API from '@api'
  import {getParams} from '@utils/common'

  const PAGE_NAME = 'RECOMMEND'

  export default {
    name: PAGE_NAME,
    components: {
      NavigationBar,
      CircleLink,
      PayResult,
      ActiveEnd
    },
    data() {
      return {
        activeImage: '',
        showArrow: !(process.env === 'production'),
        dataArray: [],
        isAuthor: false,
        marketId: 0,
        loginCode: '',
        nowTime: Date.now(),
        navBarTitle: '活动标题',
        dataInfo: {}
      }
    },
    computed: {
      btnLeftText() {
        let number = this.dataArray.length
        return number > 1 ? `${number}选1` : '优惠'
      }
    },
    async onLoad(options) {
      console.log(options)
      this.loginCode = await this.$wechat.login()
      this._getMarketId(options)
      this._authorization()
      this._getDetail()
    },
    async onShow() {
      if (Date.now() - this.nowTime > 1000 * 60 * 4 && !this.loginCode) {
        this.nowTime = Date.now()
        this.loginCode = await this.$wechat.login()
      }
    },
    onPullDownRefresh() {
      this._getDetail(false)
    },
    methods: {
      buyHandle(item, e) {
        console.log(this.isAuthor)
        this.dataInfo = item
        // this._ref('activeEnd', 'show')
        if (this.isAuthor) {
          this._pay(item)
        } else {
          this._login(e, () => {
            this._pay(item)
          })
        }
      },
      // 支付
      _pay(item) {
        item.marketId = this.marketId
        API.Market.createOrder(item).then((res) => {
          if (res.error !== this.$ERR_OK) {
            this.$wechat.showToast(res.message)
            return
          }
          let orderId = res.data.order_id
          let self = this
          let {timestamp, nonceStr, payRes, signType, paySign} = res.data
          console.log(res, '-=-=创建订单')
          wx.requestPayment({
            timeStamp: timestamp,
            nonceStr,
            package: payRes.package,
            signType,
            paySign,
            success (res) {
              console.log(res, 'asdsad')
              self._ref('pay', 'show')
            },
            fail (res) {
              self._closeOrder(orderId)
              console.error(res, 'asdadadaadas')
            }
          })
        })
      },
      _closeOrder(orderId) {
        API.Market.closeOrder({orderId}, false).then((res) => {
          if (res.error !== this.$ERR_OK) {
            console.error(res)
            return
          }
          console.log('关闭订单', res)
        })
      },
      // 获取活动详情
      _getDetail(loading) {
        API.Market.getDetail(this, loading).then((res) => {
          !loading && wx.stopPullDownRefresh()
          this.$wechat.hideLoading()
          if (res.error !== this.$ERR_OK) {
            this._ref('activeEnd', 'show')
            this.$wechat.showToast(res.message)
            return
          }
          if ('' + res.data.status !== '1') {
            this._ref('activeEnd', 'show')
          }
          // this.navBarTitle = res.data.activity_name
          this.navBarTitle = res.data.activity_name
          this._ref('nav', 'setNavigationBarTitle', this.navBarTitle)
          this.activeImage = res.data.activity_cover_image
          this.dataArray = res.data.activity_goods
        }).catch(e => {
          console.error(e)
          this._ref('activeEnd', 'show')
        })
      },
      // 调用组件的方法
      _ref(key, method, params) {
        this.$refs[key] && this.$refs[key][method] && this.$refs[key][method](params)
      },
      // 获取活动id
      _getMarketId(options) {
        try {
          const sceneMsg = decodeURIComponent(options.scene)
          const params = getParams(sceneMsg)
          this.marketId = +params.marketId || +options.marketId
          let shopId = +params.shopId || +options.shopId
          shopId && wx.setStorageSync('shopId', shopId)
        } catch (e) {
          console.error(e)
        }
      },
      // 静默授权
      async _authorization() {
        // let token = wx.getStorageSync('token')
        // if (token) {
        //   this.isAuthor = true
        //   return
        // }
        try {
          let res = await API.Login.getToken({code: this.loginCode.code}, false)
          if (res.error !== this.$ERR_OK) {
            console.error(res)
            this.loginCode = await this.$wechat.login()
            return
          }
          this.saveTokenInfo(res.data.access_token, res.data.customer_info)
        } catch (e) {
          this.loginCode = await this.$wechat.login()
          console.error(e)
        }
      },
      // 登录
      async _login(e, callback) {
        console.log(e)
        if (e.mp.detail.errMsg !== 'getUserInfo:ok') return
        console.info(e)
        let data = {code: this.loginCode.code, iv: e.target.iv, encryptedData: e.target.encryptedData}
        try {
          let res = await API.Login.getToken(data)
          this.$wechat.hideLoading()
          if (res.error !== this.$ERR_OK) {
            this.$wechat.showToast('登录失败，请重新登录')
            console.error(res)
            this.loginCode = await this.$wechat.login()
            return
          }
          this.saveTokenInfo(res.data.access_token, res.data.customer_info)
          callback && callback()
        } catch (e) {
          console.error(e)
        }
      },
      // saveTokenInfo
      saveTokenInfo(token, userInfo) {
        token && wx.setStorageSync('token', token)
        userInfo && wx.setStorageSync('userInfo', userInfo)
        this.isAuthor = true
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  $color-card-background = #F6FAF1
  $color-money-main = #FF8506
  @import "~@designCommon"
  .img
    width :100%
    height :100%
    font-size :0
    line-height :0
  .panel
    background: $color-card-background
    border-radius: 2.1333333333333333vw
    position :relative
    margin :0 5.333333333333334vw 2.666666666666667vw

  .recommend
    min-height :100vh
    background-image: linear-gradient(180deg, #D1EB92 0%, #A6C829 18%)
    .content
      position :relative
      background-image: linear-gradient(180deg, #D1EB92 0%, #A6C829 18%)
      padding-bottom :2vw
      .header
        height :64vw
        padding-bottom :4vw
      .banner
        position :absolute
        top:61.6vw
        right :-1px
        left : -1px
        height :15.733333333333333vw
        z-index :10
      .logo
        height :29.733333333333334vw
        display :flex
        align-items :center
        justify-content :center
        border-top :10px solid transparent
        .logo-img
          width :45.94666666666667vw
          height :15.893333333333334vw
      .active-wrapper
        .goods-wrapper
          height :113.33333333333333vw
          .goods-img
            width :100%
            height :0
            padding-top :100%
            position :relative
            .wrapper
              fill-box(absolute)
              background :$color-white
              border-radius :2.1333333333333333vw 2.1333333333333333vw 0 0
              overflow :hidden
              font-size :0
              line-height :0
          .goods-info
            padding : 0 4vw 0.5333333333333333vw 5.333333333333334vw
            .title
              padding :3.3333333333333335vw 0
              font-family: $font-family-medium
              font-size: 4.8vw
              line-height :4.266666666666667vw
              color: #343434
              no-wrap()
            .button-group
              display :flex
              align-items :center
              .price-wrapper
                flex: 1
                layout(row,block,nowrap)
                align-items :center
                height :6.666666666666667vw
                line-height :1
                .number
                  position :relative
                  font-family: DINAlternate-Bold
                  font-size: 8.266666666666666vw
                  color: $color-money-main
                .unit
                  position :relative
                  top: 1.6vw
                  margin-left :0.5333333333333333vw
                  font-family: $font-family-medium
                  font-size: 3.4666666666666663vw
                  color: $color-money-main
                .origin
                  position :relative
                  top: 1.866666666666667vw
                  text-decoration :line-through
                  margin-left :1.3333333333333335vw
                  opacity: 0.8
                  font-family: $font-family-regular
                  font-size: 3.733333333333334vw
                  color: #A0A0A0
              .button-wrapper
                button-reset()
                box-sizing :border-box
                height :8vw
                width :38vw
                border: 1px solid $color-money-main
                border-radius: @height
                font-family: $font-family-medium
                font-size: 4.266666666666667vw
                position :relative
                layout(row,block,nowrap)
                line-height :7.733333333333333vw
                text-align :right
                overflow :hidden
                background-color :$color-money-main
                .b-left
                  flex: 1
                  color: $color-money-main
                  background-color :$color-card-background
                  z-index :3
                .b-right
                  width 24.266666666666666vw
                  height :100%
                  color:#fff
                  box-sizing :border-box
                  position :relative
                  padding-right :4vw
                  .tri
                    position absolute
                    top:0
                    left:0
                    bottom :0
                    width :1.6vw
                    background :$color-card-background
                    transform :skew(-15deg)
                  .trr
                    position :absolute
                    top:0
                    left :0
                    height :50%
                    width :1.6vw
                    background :$color-card-background

</style>
