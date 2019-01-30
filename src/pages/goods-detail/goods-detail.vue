<template>
  <div class="goods-detail">
    <navigation-bar ref="navigationBar" :title="msgTitle" :showArrow="true" :translucent="true"></navigation-bar>
    <div class="banner-box">
      <swiper class="banner" @change="bannerChange" interval="5000">
        <block v-for="(item, index) in goodsMsg.goods_banner_images" :key="index">
          <swiper-item class="banner-item">
            <img v-if="item.image_url" :src="item.image_url" class="item-img" mode="aspectFill">
          </swiper-item>
        </block>
      </swiper>
      <div class="banner-number" v-if="goodsBanner.length !== 0">
        <div class="banner-number-box">{{currentNum}}/{{goodsBanner.length}}</div>
      </div>
      <div class="banner-title-box">
        <div class="banner-title-main" v-if="goodsMsg.is_activity * 1 === 1">
          <img v-if="imageUrl" :src="imageUrl + '/yx-image/choiceness/pic-spxq_bg@2x.png'" mode="aspectFill" class="banner-title-bg">
          <div class="banner-main-box">
            <div class="banner-main-left">
              <div class="left-price">{{goodsMsg.shop_price}}</div>
              <div class="left-price-text">元</div>
              <div class="left-price-line">
                <div class="line-price-top">
                  <img v-if="imageUrl" :src="imageUrl + '/yx-image/choiceness/pic-qgj@2x.png'" class="text-img" mode="aspectFill">
                  <div class="text">抢购价</div>
                </div>
                <div class="line-price-box">{{goodsMsg.original_price}}元</div>
              </div>
            </div>
            <div class="banner-main-right">
              <div class="time-text">距结束</div>
              <div class="time-all-box">{{activityTime.hour}}:{{activityTime.minute}}:{{activityTime.second}}</div>
            </div>
          </div>
        </div>
        <div class="banner-title-type" v-if="goodsMsg.is_activity * 1 === 0">
          <div class="left-price">{{goodsMsg.shop_price}}</div>
          <div class="left-price-text">
            <div class="price-text">元</div>
            <div class="line-price-text">{{goodsMsg.original_price}}元</div>
          </div>
        </div>
      </div>
    </div>
    <div class="detail-info-box">
      <div class="info-box">
        <div class="title">{{goodsMsg.name}}</div>
        <div class="info-sub">
          <img v-if="imageUrl" :src="imageUrl + '/yx-image/choiceness/icon-fast@2x.png'" mode="aspectFill" class="info-sub-img">
          <div class="sub-text">现在下单，预计({{goodsMsg.shelf_delivery_at}})可自提</div>
        </div>
        <div class="info-stock">已售<span class="stock-number">{{goodsMsg.sale_count}}</span>{{goodsMsg.goods_units}}<span v-if="goodsMsg.is_activity * 1 === 1">，剩余<span class="stock-number">{{goodsMsg.usable_stock}}</span>{{goodsMsg.goods_units}}</span></div>
      </div>
      <img v-if="imageUrl" :src="imageUrl + '/yx-image/goods/icon-share2@2x.png'" mode="aspectFill" class="banner-share" @click="showShare">
    </div>
    <div class="safeguard-box">
      <div class="safeguard-item" v-for="(item, index) in safeList" v-bind:key="index">
        <img v-if="imageUrl" :src="imageUrl + item.url" mode="aspectFill" class="icon">
        <div class="text">{{item.text}}</div>
      </div>
    </div>
    <div class="buy-record" v-if="userImgList.length > 0">
      <div class="record-title">
        <div class="record-text-main">购买记录</div>
        <div class="record-text-sub">本社区已有{{userImgData.buy_people_num}}人购买，共销售{{userImgData.shop_sale_count}}份</div>
      </div>
      <div class="record-image-box">
        <div class="image-item" v-for="(item, index) in bigUserImgList" :key="index">
          <img v-if="item.head_image_url" :src="item.head_image_url" mode="aspectFill" class="image-item-img">
        </div>
        <div class="image-item" v-if="userImgList.length > 13 && showMoreImg" @click="showMoreBtn">
          <div class="image-item-text">更多</div>
        </div>
      </div>
    </div>
    <div class="detail-title">
      <img v-if="imageUrl" :src="imageUrl + '/yx-image/goods/pic-tital_spxq@2x.png'" mode="widthFix" class="detail-title-img">
    </div>
    <div class="detail-img-box">
      <img v-for="(item, index) in goodsMsg.goods_detail_images" v-if="item.image_url" :src="item.image_url" class="detail-img" mode="widthFix" :key="index">
    </div>
    <div class="send-box">
      <img v-if="imageUrl" :src="imageUrl + '/yx-image/goods/pic-logo@2x.png'" mode="widthFix" class="send-box-img">
      <div class="send-title">服务说明</div>
      <div class="send-item-list">
        <span class="list-title">• 发货须知：</span><span class="list-sub">当天下午23:00前下单，当天发货次日达；当天下午23:00后下单，次日发货。</span>
      </div>
      <div class="send-item-list">
        <span class="list-title">• 划线价格：</span><span class="list-sub">指商品的厂商指导价、价签价格或该商品的曾经展示过的价格，</span><span class="list-line">并非原价</span><span class="list-sub">，仅供参考。</span>
      </div>
      <div class="send-item-list">
        <span class="list-title">• 未划线价格：</span><span class="list-sub">指商品的实时价格，不因表述的差异改变性质。具体成交价根据商品参加活动发生变化，</span><span class="list-line">最终以订单结算页价格为准</span>。
      </div>
    </div>
    <div class="fixed-btn">
      <div class="hlep-btn">
        <div class="hlep-btn-box" v-for="(item, index) in typeBtn" :key="index" @click.stop="switchItem(item)">
          <div class="hlep-top">
            <img v-if="imageUrl" :src="imageUrl + item.url" class="detail-img" mode="aspectFill">
            <div class="hlep-number" v-if="index * 1 === 1 && count * 1 >= 1">{{count * 1 > 99 ? 99 : count}}</div>
          </div>
          <div class="hlep-bottom">{{item.text}}</div>
        </div>
      </div>
      <form action="" report-submit @submit="$getFormId">
        <button v-if="goodsMsg.usable_stock * 1 !== 0" class="goods-btn" formType="submit" @click="addShoppingCart">加入购物车</button>
      </form>
      <form action="" report-submit @submit="$getFormId">
        <button v-if="goodsMsg.usable_stock * 1 !== 0" class="goods-btn goods-btn-active" formType="submit" @click="instantlyBuy">立即购买</button>
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
  const TYPEBTN = [{url: '/yx-image/goods/icon-homepage@2x.png', text: '首页', type: 0}, {url: '/yx-image/goods/icon-shopcart@2x.png', text: '购物车', type: 2}]
  const SAFELIST = [{url: '/yx-image/choiceness/icon-lightning@2x.png', text: '次日达', type: 0}, {url: '/yx-image/choiceness/icon-ok@2x.png', text: '100%售后', type: 1}, {url: '/yx-image/choiceness/icon-ok@2x.png', text: '直采直销', type: 2}]
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
        currentNum: 1,
        typeBtn: TYPEBTN,
        safeList: SAFELIST,
        goodsId: 0,
        goodsMsg: {},
        timeEnd: false,
        groupInfo: {},
        userImgList: [],
        bigUserImgList: [],
        goodsBanner: [],
        deliverAt: '',
        shareImg: '',
        shopCrile: 0,
        showOpen: false,
        msgTitle: '',
        userImgData: {},
        showMoreImg: true
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
      if (options.shopId) {
        wx.setStorageSync('shopId', options.shopId)
      }
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
      this.goodsBanner = []
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
        API.Choiceness.getUserImg({id: this.goodsId, limit: 200}).then((res) => {
          if (res.error === this.$ERR_OK) {
            this.userImgList = res.data
            this.bigUserImgList = this.userImgList.slice(0, 13)
            this.userImgData = res
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
        if (this.goodsMsg.buy_limit * 1 === -1) {
          this.$refs.addNumber.showLink()
          return
        }
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
            this.goodsBanner = res.data.goods_banner_images
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
        const total = (goodsList.shop_price * number).toFixed(2)
        let orderInfo = {
          goodsList: new Array(goodsList),
          total: total,
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
        API.Choiceness.createQrCodeApi({path}).then((res) => {
          if (res.error === this.$ERR_OK) {
            this.shareImg = res.data.image_url
          } else {
          }
        })
      },
      showMoreBtn() {
        this.bigUserImgList = this.userImgList
        this.showMoreImg = false
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
  .detail-img-box
    padding: 0 12px
    box-sizing: border-box
    border-radius: 8px
    overflow: hidden
    box-shadow: 0 2px 15px 0 rgba(17,17,17,0.06)
  .goods-detail
    width: 100%
    min-height: 100vh
    background: $color-background
    padding-bottom: 55px
    box-sizing: border-box
    overflow-x: hidden
  .detail-title-img
    width: 38vw
    margin: 20px auto
    display: block
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
    .banner-number
      position: absolute
      bottom: 13.3vw
      left: 0
      layout(row)
      align-items: center
      justify-content: center
      width: 100%
      .banner-number-box
        display: inline-block
        font-size: $font-size-12
        background: rgba(0, 0, 0, .5)
        color: $color-white
        box-sizing: border-box
        padding: 3px 8px 4px
        border-radius: 20px
  .banner-title-box
    padding: 0 12px
    box-sizing: border-box
    position: absolute
    left: 0
    bottom: -1px
    width: 100%
    .banner-title-main
      padding-bottom: 13vw
      width: 100%
      position: relative
      .banner-title-bg
        position: absolute
        left: 0
        bottom: 0
        width: 100%
        height: 100%
      .banner-main-box
        position: absolute
        left: 0
        bottom: 0
        width: 100%
        height: 100%
        padding: 0 19px 0 10px
        box-sizing: border-box
        layout(row)
        align-items: center
        justify-content: space-between
        .banner-main-left
          layout(row)
          align-items: center
          .left-price
            font-size: 30px
            font-family: 'PingFang-SC-Bold'
            color: $color-white
          .left-price-text
            font-size: 22px
            font-family: $font-family-medium
            color: $color-white
            margin-right: 6px
          .line-price-top
            height: 11px
            width: 36.5px
            position: relative
            .text-img
              width: 100%
              height: 100%
              display: block
              position: absolute
              left: 0
              bottom: 0
            .text
              height: 11px
              font-size: 9px
              color: $color-money
              line-height: 11px
              font-family: $font-family-regular
              text-align: center
              position: relative
              z-index: 11
          .line-price-box
            font-size: $font-size-12
            font-family: $font-family-regular
            text-decoration: line-through
            line-height: 1
            color: #fff
            margin-top: 2px

        .banner-main-right
          text-align: center
          .time-text
            font-size: $font-size-13
            color: $color-text-main
            font-family: $font-family-regular
            margin-bottom: 4px
          .time-all-box
            font-size: $font-size-13
            color: $color-text-main
            font-family: $font-family-regular
    .banner-title-type
      height: 13vw
      background: #FFF2E9
      width: 100%
      border-top-left-radius: 8px
      border-top-right-radius: 8px
      layout(row)
      align-items: center
      padding-left: 10px
      box-sizing: border-box
      .left-price
        color: #FF7113
        font-size: 30px
        font-family: PingFang-SC-Bold
      .left-price-text
        layout(row)
        align-items: flex-end
        .price-text
          color: #FF7012
          font-size: 22px
          font-family: $font-family-medium
          margin-right: 5px
        .line-price-text
          font-size: $font-size-14
          font-family: $font-family-regular
          text-decoration: line-through
          line-height: 1
          color: #A0A0A0
  .detail-info-box
    padding: 0 12px
    box-sizing: border-box
    position: relative
    .info-box
      background: $color-white
      width: 100%
      border-bottom-left-radius: 8px
      border-bottom-right-radius: 8px
      padding: 15px 10px 23px
      box-sizing: border-box
      margin-bottom: 10px
      box-shadow: 0 6px 20px 0 rgba(17,17,17,0.06)
      .title
        width: 100%
        font-size: $font-size-17
        color: #1F1F1F
        line-height: 1
        min-height: 19px
        font-family: $font-family-medium
        margin-bottom: 15px
        no-wrap()
      .info-sub
        layout(row)
        align-items: center
        margin-bottom: 16px
        .info-sub-img
          width: 14.5px
          height: 15.5px
          display: block
          margin-right: 5px
        .sub-text
          color: #9B9B9B
          font-size: $font-size-14
          font-family: $font-family-regular
    .info-stock
      font-size: $font-size-14
      color: #9e9e9e
      font-family: $font-family-regular
      .stock-number
        color: $color-money
  .safeguard-box
    padding-left: 10px
    height: 60px
    background: $color-white
    border-radius: 8px
    box-sizing: border-box
    margin: 0 12px 10px
    box-shadow: 0 2px 15px 0 rgba(17,17,17,0.06)
    layout(row)
    align-items: center
    .safeguard-item
      margin-right: 30px
      layout(row)
      align-items: center
      .icon
        width: 14px
        height: 14px
        margin-right: 5px
        display: block
      .text
        font-family: $font-family-regular
        font-size: $font-size-14
        color: $color-text-main
  .buy-record
    padding-left: 10px
    background: $color-white
    border-radius: 8px
    box-sizing: border-box
    margin: 0 12px 10px
    box-shadow: 0 2px 15px 0 rgba(17,17,17,0.06)
    .record-title
      layout(row)
      align-items: center
      height: 45px
      border-bottom-1px($color-line)
      .record-text-main
        font-family: $font-family-medium
        font-size: $font-size-16
        color: $color-text-main
        margin-right: 5px
      .record-text-sub
        font-family: $font-family-regular
        font-size: $font-size-14
        color: #9B9B9B
    .record-image-box
      padding-bottom: 23px
      padding-top: 1.7vw
      box-sizing: border-box
      layout(row)
      .image-item
        width: 10.66vw
        height: 10.66vw
        border-radius: 50%
        margin-right: 2.23vw
        margin-top: 2.2vw
        .image-item-img
          width: 10.66vw
          height: 10.66vw
          border-radius: 50%
          display: block
        .image-item-text
          width: 10.66vw
          height: 10.66vw
          border-radius: 50%
          display: block
          font-size: $font-size-10
          color: #9b9b9b
          font-family: $font-family-regular
          text-align: center
          line-height: 10.66vw
          background: #F4F4F4
      .image-item:nth-of-type(7n)
        margin-right: 0
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
    width: 36px
    height: 36px
    right: 29px
    bottom: 26px
    z-index: 22
    display: block
    border-radius: 50%

  .send-box
    padding: 20px 20px 28px 18px
    background: $color-white
    border-radius: 8px
    box-sizing: border-box
    margin: 10px 12px 10px
    box-shadow: 0 2px 15px 0 rgba(17,17,17,0.06)
    .send-box-img
      width: 32vw
      display: block
      margin: 0 auto 20px
    .send-title
      font-family: $font-family-medium
      color: $color-text-main
      font-size: $font-size-14
      margin-bottom: 15px
  .send-item-list
    text-align: justify
    margin-bottom: 19px
    line-height: 19px
    .list-title
      font-family: $font-family-regular
      color: $color-text-main
      font-size: $font-size-13
    .list-sub
      font-family: $font-family-regular
      color: $color-text-sub
      font-size: $font-size-13
    .list-line
      font-family: $font-family-regular
      color: #000
      text-decoration: underline
      font-size: $font-size-13
  .send-item-list:last-child
    margin-bottom: 0
  .detail-img
    display: block
    width: 100%
    height: auto

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
      width: 30vw
      height: 55px
      layout(row)
      border-top-1px(#E6E6E6)
      .hlep-btn-box
        width: 50%
        layout()
        justify-content: center
        align-items: center
        .hlep-top
          width: 20px
          height: 20px
          margin-bottom: 8px
          position: relative
          .detail-img
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
      width: 35vw
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
      width: 70vw
</style>
