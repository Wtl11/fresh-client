<template>
  <div class="goods-detail">
    <navigation-bar ref="navigationBar" :title="msgTitle" :showArrow="true" :translucent="true"></navigation-bar>
    <div class="banner-box">
      <div class="banner-share" @click="showShare">
        <img v-if="imageUrl" :src="imageUrl + '/yx-image/choiceness/icon-share3@2x.png'" mode="aspectFill">
      </div>
      <swiper class="banner" @change="bannerChange" interval="5000">
        <block v-for="(item, index) in goodsMsg.goods_banner_images" :key="index">
          <swiper-item class="banner-item">
            <img v-if="item.image_url" :src="item.image_url" class="item-img" mode="aspectFill">
          </swiper-item>
        </block>
      </swiper>
      <div class="sales-number">已售{{goodsMsg.sale_count}}{{goodsMsg.goods_units}}</div>
    </div>
    <div class="group-price">
      <img v-if="imageUrl" :src="imageUrl + '/yx-image/choiceness/bg-details@2x.png'" mode="aspectFill" class="group-bg">
      <div class="group-main-box">
        <div class="main-box-left">
          <div class="left-price">{{goodsMsg.shop_price}}</div>
          <div class="left-price-text">元</div>
          <div class="small-box">
            <div class="line-price">{{goodsMsg.original_price}}元</div>
            <div class="line-price-text">团购价</div>
          </div>
        </div>
        <div class="main-box-right">
          <div class="time-text">距结束</div>
          <div class="time-box">{{activityTime.hour}}</div>
          <div class="time-line">:</div>
          <div class="time-box">{{activityTime.minute}}</div>
          <div class="time-line">:</div>
          <div class="time-box">{{activityTime.second}}</div>
        </div>
      </div>
    </div>
    <div class="goods-info">
      <div class="goods-info-top">
        <div class="info-top">
          <div class="title">{{goodsMsg.name}}</div>
          <div class="stock-number">库存{{goodsMsg.usable_stock}}{{goodsMsg.goods_units}}</div>
        </div>
        <div class="info-bottom" :style="{height: describeHeight + 'px'}">
          <span class="sub-title">{{goodDescribe}}</span>
          <span class="open" v-if="showOpen" @click="showMoreDescribe">
            <img v-if="imageUrl" :src="imageUrl + '/yx-image/wallet/icon-open@3x.png'" alt="">
          </span>
        </div>
      </div>
      <div class="goods-info-bootom" v-if="userImgList.length > 0">
        <div class="info-bootom-list" v-for="(item, index) in userImgList" :key="index">
          <div class="info-user">
            <img v-if="imageUrl" :src="item.head_image_url ? item.head_image_url : imageUrl + '/yx-image/choiceness/default_avatar@2x.png'" class="detail-img" mode="aspectFill">
          </div>
          <div class="info-name">{{item.nickname}}</div>
        </div>
        <div class="info-bootom-text"><span v-if="userImgList.length >= 3">等</span>刚刚购买了此商品</div>
      </div>
    </div>
    <div class="detail-title">商品详情</div>
    <img v-for="(item, index) in goodsMsg.goods_detail_images" v-if="item.image_url" :src="item.image_url" class="detail-img" mode="widthFix" :key="index">
    <div class="send-box">
      <div class="send-title">发货须知</div>
      <div class="send-sub-title">当天下午23:00前下单，当天发货次日送达；</div>
      <div class="send-sub-title">当天下午23:00后下单，次日发货。</div>
    </div>
    <div class="fixed-btn">
      <div class="hlep-btn">
        <div class="hlep-btn-box" v-for="(item, index) in typeBtn" :key="index" @click.stop="switchItem(item)">
          <div class="hlep-top">
            <img v-if="imageUrl" :src="imageUrl + item.url" class="detail-img" mode="widthFix">
            <div class="hlep-number" v-if="index * 1 === 2 && count * 1 >= 1">{{count * 1 > 99 ? 99 : count}}</div>
          </div>
          <div class="hlep-bottom">{{item.text}}</div>
        </div>
      </div>
      <form action="" report-submit @submit="$getFormId">
        <button v-if="goodsMsg.usable_stock * 1 !== 0" class="goods-btn" open-type="getUserInfo" formType="submit" @click="addShoppingCart">加入购物车</button>
      </form>
      <form action="" report-submit @submit="$getFormId">
        <button v-if="goodsMsg.usable_stock * 1 !== 0" class="goods-btn goods-btn-active" open-type="getUserInfo" formType="submit" @click="instantlyBuy">立即购买</button>
      </form>
      <div v-if="goodsMsg.usable_stock * 1 === 0" class="goods-btn goods-btn-assint">已抢完</div>
    </div>
    <add-number ref="addNumber" :msgDetail="goodsMsg" @comfirmNumer="comfirmNumer"></add-number>
    <link-group ref="groupList" :wechatInfo="groupInfo"></link-group>
    <link-group ref="shareList" :linkType="2" @saveImg="_action"></link-group>
    <we-paint ref="wePaint" @drawDone="_drawDone"></we-paint>
    <div class="share-goods">
      <img v-if="imageUrl" :src="imageUrl + '/yx-image/choiceness/pic-sharegoods@2x.png'" class="share-bg" mode="aspectFill">
      <div class="share-box">
        <img v-if="imageUrl" :src="imageUrl + '/yx-image/choiceness/5@1x.png'" class="share-img" mode="aspectFill">
        <div class="share-bottom">
          <img v-if="imageUrl" :src="imageUrl + '/yx-image/choiceness/5@1x.png'" class="wem-img" mode="aspectFill">
          <div class="share-title">智利J级车厘子250g</div>
          <div class="share-sub-title">智利J级车厘子250g</div>
          <div class="share-group-box">团购价</div>
          <div class="price-box">
            <div class="share-price-number">{{goodsMsg.shop_price}}</div>
            <div class="share-price-icon">元</div>
            <div class="share-price-line">
              {{goodsMsg.original_price}}元
              <i class="share-money-line"></i>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import {orderMethods, cartMethods, cartComputed} from '@state/helpers'
  import NavigationBar from '@components/navigation-bar/navigation-bar'
  import AddNumber from '@components/add-number/add-number'
  import LinkGroup from '@components/link-group/link-group'
  import {getParams} from '@utils/common'
  import WePaint from '@components/we-paint/we-paint'
  import API from '@api'

  const PAGE_NAME = 'GOODS_DETAIL'
  const TYPEBTN = [{url: '/yx-image/goods/icon-homepage@2x.png', text: '首页', type: 0}, {url: '/yx-image/goods/icon-service@2x.png', text: '客服', type: 1}, {url: '/yx-image/goods/icon-shopcart@2x.png', text: '购物车', type: 2}]
  const DESCRIBE_HEIGHT = 21
  const ald = getApp()

  export default {
    name: PAGE_NAME,
    data() {
      return {
        describeNum: 0,
        describeHeight: DESCRIBE_HEIGHT,
        goodDescribe: '',
        activityTime: {
          day: '00',
          hour: '00',
          minute: '00',
          second: '00'
        },
        currentNum: 0,
        typeBtn: TYPEBTN,
        goodsId: 0,
        goodsMsg: {},
        timeEnd: false,
        groupInfo: {},
        userImgList: [],
        deliverAt: '',
        shareImg: '',
        shopCrile: 0,
        showOpen: false,
        msgTitle: ''
      }
    },
    computed: {
      ...cartComputed
    },
    onShareAppMessage() {
      let shopId = wx.getStorageSync('shopId')
      return {
        title: this.goodsMsg.name,
        path: `/pages/goods-detail?id=${this.goodsMsg.id}&shopId=${shopId}`, // 商品详情
        imageUrl: this.goodsMsg.thumb_image || this.goodsMsg.goods_cover_image,
        success: (res) => {
          // 转发成功
        },
        fail: (res) => {
          // 转发失败
        }
      }
    },
    onLoad(options) {
      ald.aldstat.sendEvent('商品详情')
      if (options.scene) {
        let scene = decodeURIComponent(options.scene)
        let params = getParams(scene)
        this.goodsId = params.id
      } else {
        this.goodsId = options.id
      }
      this._setDescriptionNum()
    },
    onShow() {
      this.getGoodsDetailData()
      this._groupInfo()
      this.getUserImgList()
      this.setCartCount()
      this.getQrCode()
    },
    onUnload() {
      clearInterval(this.timer)
      this.$refs.navigationBar._initHeadStyle()
    },
    methods: {
      ...orderMethods,
      ...cartMethods,
      _setDescriptionNum() {
        let res = this.$wx.getSystemInfoSync()
        let usableWidth = res.windowWidth - 24
        this.describeLineNum = Math.floor(usableWidth / 14)
        this.describeNum = this.describeLineNum * 2 - 3
      },
      _handleDescribe() {
        let describe = this.goodsMsg.describe || ''
        let line = Math.ceil(describe.length / this.describeLineNum)
        if (line >= 2) {
          this.describeHeight = this.showOpen ? DESCRIBE_HEIGHT * 2 : DESCRIBE_HEIGHT * line
        }
        this.goodDescribe = this.showOpen ? describe.slice(0, this.describeNum) + '…' : describe
      },
      showMoreDescribe() {
        this.showOpen = false
        this._handleDescribe()
      },
      async _groupInfo() {
        let res = await API.Choiceness.getGroupInfo()
        this.$wechat.hideLoading()
        if (res.error !== this.$ERR_OK) {
          this.$wechat.showToast(res.message)
        }
        this.groupInfo = res.data
      },
      getUserImgList() {
        API.Choiceness.getUserImg({id: this.goodsId, limit: 3}).then((res) => {
          if (res.error === this.$ERR_OK) {
            this.userImgList = res.data
          } else {
            this.$wechat.showToast(res.message)
          }
        })
      },
      bannerChange(e) {
        this.currentNum = e.mp.detail.current * 1 + 1
      },
      switchItem(item) {
        switch (item.type) {
          case 0:
            wx.switchTab({url: '/pages/choiceness'})
            break
          case 1:
            this.$refs.groupList.showLink()
            break
          case 2:
            if (this.$isLogin()) {
              wx.switchTab({url: '/pages/shopping-cart'})
            }
            break
        }
      },
      showShare() {
        this.$refs.shareList.showLink()
      },
      addShoppingCart() {
        if (!this.$isLogin()) {
          return
        }
        API.Choiceness.addShopCart({sku_id: this.goodsMsg.shop_skus[0].id}).then((res) => {
          if (res.error === this.$ERR_OK) {
            this.$wechat.showToast('加入购物车成功')
            this.setCartCount()
          } else {
            this.$wechat.showToast(res.message)
          }
        })
      },
      instantlyBuy() {
        if (!this.$isLogin()) {
          return
        }
        ald.aldstat.sendEvent('立即购买')
        if (this.goodsMsg.buy_count >= this.goodsMsg.buy_limit) {
          this.$wechat.showToast(`该商品限购${this.goodsMsg.buy_limit}件，您不能在购买了`)
        } else {
          this.$refs.addNumber.showLink()
        }
      },
      _action() {
        let name = this.goodsMsg.name.length >= 12 ? this.goodsMsg.name.slice(0, 12) + '...' : this.goodsMsg.name
        let subName = this.goodsMsg.describe.length >= 12 ? this.goodsMsg.describe.slice(0, 12) + '...' : this.goodsMsg.describe
        this.shareImg = this.shareImg || this.imageUrl + '/yx-image/choiceness/5@1x.png'
        let options = {
          canvasId: 'we-paint',
          multiple: 1,
          panel: {
            el: '.share-goods'
          },
          els: [
            {
              el: '.share-goods',
              drawType: 'rect',
              color: '#fff'
            },
            {
              el: '.share-bg', // 背景图
              drawType: 'img',
              mode: 'aspectFill',
              source: this.imageUrl + '/yx-image/choiceness/pic-sharegoods@2x.png'
            },
            {
              el: '.share-box',
              drawType: 'rect-shadow',
              color: '#fff',
              shadow: [0, 2, 22, 'rgba(0,0,0,0.10)', '#fff', 0]
            },
            {
              el: '.share-img', // 图片
              drawType: 'img',
              source: this.goodsMsg.goods_cover_image,
              mode: 'aspectFill'
            },
            {
              el: '.share-title', // 店铺名称
              drawType: 'text-area',
              source: name,
              fontSize: 16,
              color: '#1f1f1f'
            },
            {
              el: '.share-sub-title', // 签名
              drawType: 'text-area',
              source: subName,
              fontSize: 14,
              align: 'left',
              color: '#808080'
            },
            {
              el: '.share-group-box',
              drawType: 'text-area',
              source: '团购价',
              fontSize: 14,
              color: '#FF8300'
            },
            {
              el: '.share-price-number',
              drawType: 'text',
              source: this.goodsMsg.shop_price,
              fontSize: 30,
              color: '#FF8300'
            },
            {
              el: '.share-price-icon',
              drawType: 'text',
              source: '元',
              fontSize: 17,
              color: '#FF8300'
            },
            {
              el: '.share-price-line',
              drawType: 'text',
              source: `${this.goodsMsg.original_price}元`,
              fontSize: 17,
              color: '#B7B7B7'
            },
            {
              el: '.share-money-line',
              drawType: 'rect',
              color: '#b7b7b7'
            },
            {
              el: '.wem-img',
              drawType: 'img',
              source: this.shareImg
            }
          ]
        }
        let obj = options
        this.$refs.wePaint.action(obj, false)
      },
      _drawDone(pic) {
        this.pic = pic
        // 保存到本地，并预览
        this.$wx.saveImageToPhotosAlbum({
          filePath: pic,
          success: () => {
          },
          fail: () => {
            // 拒绝授权重新调起授权
            this.active = 1
            this.$wx.openSetting()
          }
        })
      },
      getGoodsDetailData() {
        API.Choiceness.getGoodsDetail(this.goodsId).then((res) => {
          if (res.error === this.$ERR_OK) {
            this.goodsMsg = res.data
            this.showOpen = this.goodsMsg.describe.length > this.describeNum
            this.deliverAt = res.data.shelf_delivery_at
            this.msgTitle = this.goodsMsg.name
            this._kanTimePlay()
            this._handleDescribe()
          } else {
            this.$wechat.showToast(res.message)
          }
        })
      },
      comfirmNumer(number) {
        let goodsList = this.goodsMsg.shop_skus[0]
        goodsList.sku_id = goodsList.id
        goodsList.num = number
        goodsList.goods_units = this.goodsMsg.goods_units
        let orderInfo = {
          goodsList: new Array(goodsList),
          total: goodsList.shop_price * number,
          deliverAt: this.deliverAt
        }
        this.setOrderInfo(orderInfo)
        wx.navigateTo({url: `/pages/submit-order`})
      },
      _kanTimePlay() {
        clearInterval(this.timer)
        this.activityTime = this._groupTimeCheckout(this.goodsMsg.shelf_end_at)
        this.timer = setInterval(() => {
          this.activityTime = this._groupTimeCheckout(this.goodsMsg.shelf_end_at)
          if (this.timeEnd) {
            clearInterval(this.timer)
          }
        }, 1000)
      },
      _groupTimeCheckout(time) {
        let nowSecond = parseInt(Date.now() / 1000)
        let differ = time * 1 - nowSecond
        let day = Math.floor(differ / (60 * 60 * 24))
        day = day >= 10 ? day : '0' + day
        let hour = Math.floor(differ / (60 * 60)) - (day * 24)
        hour = hour >= 10 ? hour : '0' + hour
        let minute = Math.floor(differ / 60) - (day * 24 * 60) - (hour * 60)
        minute = minute >= 10 ? minute : '0' + minute
        let second = Math.floor(differ) - (day * 24 * 60 * 60) - (hour * 60 * 60) - (minute * 60)
        second = second >= 10 ? second : '0' + second
        let times
        if (differ > 0) {
          times = {
            day,
            hour,
            minute,
            second
          }
        } else {
          times = {
            day: '00',
            hour: '00',
            minute: '00',
            second: '00'
          }
          this.timeEnd = true
        }
        return times
      },
      getQrCode() {
        let shopId = wx.getStorageSync('shopId')
        let path = `pages/goods-detail?id=${this.goodsId}&shopId=${shopId}`
        console.log(path, '1111')
        API.Choiceness.createQrCodeApi({path}).then((res) => {
          if (res.error === this.$ERR_OK) {
            this.shareImg = res.data.image_url
          } else {
          }
        })
      }
    },
    components: {
      NavigationBar,
      AddNumber,
      WePaint,
      LinkGroup
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"
  .share-goods
    padding: 32.8vw 5.3vw 17vw
    box-sizing: border-box
    position: fixed
    width: 100vw
    height: 100vh
    right: -100%
    .share-bg
      position: absolute
      left: 0
      top: 0
      height: 52.5vw
      width: 100vw
      display: block
      z-index: 9
    .share-box
      border-radius: 10px
      background: #fff
      box-shadow: 0 2px 11px 0 rgba(0, 0, 0, 0.10)
      z-index: 11
      position: relative
      .share-img
        display: block
        width: 89.4vw
        height: 89.4vw
        border-top-left-radius: 10px
        border-top-right-radius: 10px
    .share-bottom
      padding: 15px 15px 30px
      position: relative
    .wem-img
      position: absolute
      right: 15px
      bottom: 15px
      width: 90px
      height: 90px
      display: block
    .share-title
      font-size: $font-size-16
      color: #1f1f1f
      font-family: $font-family-medium
      margin-bottom: 5px
    .share-sub-title
      font-size: $font-size-14
      color: $color-text-sub
      font-family: $font-family-regular
      margin-bottom: 16px
    .share-group-box
      font-size: $font-size-14
      color: $color-money
      font-family: $font-family-regular
      width: 55px
      height: 20px
      text-align: center
      line-height: 20px
      margin-bottom: -5px
    .price-box
      layout(row)
      align-items: flex-end
      .share-price-number
        font-size: 30px
        color: $color-money
        font-family: $font-family-medium
        line-height: 1
        margin-right: 1px
      .share-price-icon
        font-size: $font-size-17
        color: $color-money
        font-family: $font-family-medium
        line-height: 1
        margin-right: 1px
        padding-bottom: 2px
      .share-price-line
        font-size: $font-size-17
        color: #b7b7b7
        font-family: $font-family-regular
        line-height: 1
        padding-bottom: 2px
        position: relative
        .share-money-line
          height: 1px
          width: 100%
          background: #888
          col-center()

  .goods-detail
    width: 100%
    min-height: 100vh
    background: $color-background
    padding-bottom: 55px
    box-sizing: border-box
    overflow-x: hidden

  .banner-box
    width: 100vw
    height: 100vw
    position: relative
    .banner
      width: 100vw
      height: 100vw
      .banner-item
        width: 100%
        height: 100%
        position: relative
        .item-img
          width: 100%
          height: 100%
        .play
          all-center()
          height: 63px
          width: 63px
    .sales-number
      position: absolute
      left: 12px
      bottom: 12px
      font-size: $font-size-12
      color: #fff
      font-family: $font-family-regular
      border-radius: 8px
      background: $color-text-sub
      padding: 0 5px
      height: 16px
      line-height: 16px
      margin-bottom: 8px

  .page-box
    position: absolute
    right: 15px
    bottom: 15px
    padding: 0 6.5px
    height: 20px
    line-height: 20px
    border-radius: 10px
    background: rgba(130, 138, 162, 0.4)
    font-family: DINAlternate-Bold
    font-size: $font-size-12
    color: $color-white
    vertical-align: text-bottom
    .currentNum
      font-family: DINAlternate-Bold
      font-size: $font-size-16
      color: $color-white

  .banner-share
    position: absolute
    width: 40px
    height: 40px
    right: 16.5px
    bottom: 15.5px
    z-index: 22
    img
      width: 100%
      height: 100%
      display: block
      border-radius: 50%

  .group-price
    width: 100%
    height: 50px
    position: relative
    padding: 0 12px
    box-sizing: border-box
    .group-bg
      position: absolute
      left: 0
      top: 0
      width: 100%
      height: 100%
      display: block
    .group-main-box
      layout(row)
      align-items: center
      justify-content: space-between
      position: relative
      height: 100%
      width: 100%
      z-index: 11
      .main-box-left
        layout(row)
        align-items: center
        .left-price
          font-size: 28px
          font-family: $font-family-medium
          color: #fff
        .left-price-text
          font-size: $font-size-22
          font-family: $font-family-medium
          color: #fff
          margin-right: 8px
        .line-price
          font-size: $font-size-10
          font-family: $font-family-regular
          text-decoration: line-through
          line-height: 1
          color: #fff
          margin-bottom: 2px
        .line-price-text
          font-size: $font-size-10
          font-family: $font-family-regular
          line-height: 13px
          padding-left: 2px
          padding-right: 1px
          color: #fff
          height: 13px
          border-1px(#FFFFFF, 2px)
      .main-box-right
        layout(row)
        align-items: center
        .time-text
          font-size: $font-size-14
          font-family: $font-family-regular
          color: rgba(255, 255, 255, .8)
          margin-right: 5px
        .time-box
          font-size: $font-size-13
          font-family: $font-family-medium
          background: $color-white
          width: 20px
          text-align: center
          line-height: 22px
          height: 20px
          border-radius: 3px
          color: $color-main
        .time-line
          font-size: $font-size-12
          font-family: $font-family-regular
          color: #fff
          margin: 0 4px 3px 3px

  .goods-info
    background: #fff
    padding: 0 12px
    box-sizing: border-box
    width: 100%
    background: #fff
    margin-bottom: 11px

  .goods-info-top
    padding: 17px 0
    .info-top
      layout(row)
      justify-content: space-between
      .title
        width: 220px
        font-size: $font-size-16
        color: #1F1F1F
        line-height: 1
        min-height: 18px
        font-family: $font-family-medium
        margin-bottom: 9px
        no-wrap()
      .stock-number
        font-size: $font-size-12
        color: $color-text-sub
        font-family: $font-family-regular
        text-align: right
    .info-bottom
      position: relative
      transition: all .3s
      .sub-title
        font-size: $font-size-14
        color: $color-text-sub
        line-height: 1.4
        font-family: $font-family-regular
      .open
        position: absolute
        right: -3px
        bottom: -3px
        display: block
        width: 12.5px
        height: 12.5px
        padding: 10px
        img
          width: 12.5px
          height: 12.5px

  .goods-info-bootom
    border-top-1px(#E6E6E6)
    height: 45px
    layout(row)
    align-items: center
    .info-bootom-list
      layout(row)
      align-items: center
      padding-right: 5px
    .info-user
      layout(row)
      align-items: center
      width: 25px
      height: 25px
      margin-right: 3px
      img
        width: 25px
        height: 25px
        display: block
        border-radius: 50%
        background: #fff
    .info-name
      font-size: $font-size-12
      color: $color-text-sub
      font-family: $font-family-regular
      max-width: 35px
      no-wrap()

  .info-bootom-text
    font-size: $font-size-12
    color: $color-text-sub
    font-family: $font-family-regular

  .detail-title
    font-size: $font-size-16
    color: $color-text-main
    font-family: $font-family-medium
    padding-left: 12px
    box-sizing: border-box
    background: #fff
    height: 50px
    line-height: 50px
    letter-spacing: 0.8px

  .detail-img
    display: block
    width: 100%
    height: auto

  .send-box
    padding: 17px 0 25px 12px
    box-sizing: border-box
    background: #fff
    .send-title
      font-size: $font-size-16
      color: $color-text-main
      line-height: 18px
      font-family: $font-family-medium
      margin-bottom: 12px
    .send-sub-title
      font-size: $font-size-13
      color: $color-text-sub
      font-family: $font-family-regular
      line-height: 19.5px
      margin-bottom: 1px

  .fixed-btn
    position: fixed
    left: 0
    bottom: 0
    height: 55px
    width: 100%
    background: #fff
    layout(row)
    z-index: 111
    .hlep-btn
      width: 40vw
      height: 55px
      layout(row)
      border-top-1px(#E6E6E6)
      .hlep-btn-box
        width: 33.33%
        layout()
        justify-content: center
        align-items: center
        .hlep-top
          width: 20px
          height: 20px
          margin-bottom: 8px
          position: relative
          img
            width: 100%
            height: 100%
            display: block
          .hlep-number
            position: absolute
            top: -5px
            right: -7px
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
        .hlep-bottom
          font-size: $font-size-10
          font-family: $font-family-regular
          color: $color-text-main
          line-height: 1
    .goods-btn
      width: 30vw
      line-height: 55px
      height: 55px
      text-align: center
      font-size: $font-size-14
      font-family: $font-family-regular
      color: $color-text-main
      background: $color-tag
      &:after
        border: none
    .goods-btn-active
      color: #fff
      background: $color-main
    .goods-btn-assint
      color: #fff
      background: $color-text-assist
      width: 60vw
</style>
