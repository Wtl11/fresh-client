<template>
  <div class="goods-detail">
    <navigation-bar :title="goodsMsg.name" :showArrow="true" :translucent="true"></navigation-bar>
    <div class="banner-box">
      <div class="banner-share" @click="showShare">
        <img v-if="imageUrl" :src="imageUrl + '/yx-image/choiceness/icon-share3@2x.png'"  mode="aspectFill">
      </div>
      <swiper class="banner" @change="bannerChange" interval="5000">
        <block v-for="(item, index) in goodsMsg.goods_banner_images" :key="index">
          <swiper-item class="banner-item">
            <img v-if="item.image_url" :src="item.image_url" class="item-img"  mode="aspectFill">
          </swiper-item>
        </block>
      </swiper>
      <!--<span class="page-box"><text class="currentNum">{{currentNum}}</text>/{{bannerImgs.length}}</span>-->
    </div>
    <div class="group-price">
      <img v-if="imageUrl" :src="imageUrl + '/yx-image/choiceness/bg-details@2x.png'"  mode="aspectFill" class="group-bg">
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
        <div class="info-top-left">
          <div class="title">{{goodsMsg.name}}</div>
          <div class="sub-title">{{goodsMsg.describe}}</div>
        </div>
        <div class="info-top-right">
          <div class="sales-number">已售{{goodsMsg.sale_count}}{{goodsMsg.goods_units}}</div>
          <div class="stock-number">库存{{goodsMsg.usable_stock}}{{goodsMsg.goods_units}}</div>
        </div>
      </div>
      <div class="goods-info-bootom" v-if="userImgList.length > 0">
        <div class="info-bootom-list" v-for="(item, index) in userImgList" :key="index">
          <div class="info-user">
            <img v-if="imageUrl" :src="item.url ? item.url : imageUrl + '/yx-image/choiceness/default_avatar@2x.png'" class="detail-img"  mode="widthFix">
          </div>
          <div class="info-name">{{item.name}}</div>
        </div>
        <div class="info-bootom-text">等刚刚购买了此商品</div>
      </div>
    </div>
    <div class="detail-title">商品详情</div>
    <img v-for="(item, index) in goodsMsg.goods_detail_images" v-if="item.image_url" :src="item.image_url" class="detail-img"  mode="widthFix" :key="index">
    <div class="send-box">
      <div class="send-title">发货须知</div>
      <div class="send-sub-title">当天下午23:00前下单，当天发货次日送达；</div>
      <div class="send-sub-title">当天下午23:00后下单，次日发货；</div>
    </div>
    <div class="fixed-btn">
      <div class="hlep-btn">
        <div class="hlep-btn-box" v-for="(item, index) in typeBtn" :key="index" @click.stop="switchItem(item)">
          <div class="hlep-top">
            <img v-if="imageUrl" :src="imageUrl + item.url" class="detail-img"  mode="widthFix">
          </div>
          <div class="hlep-bottom">{{item.text}}</div>
        </div>
      </div>
      <div v-if="goodsMsg.usable_stock * 1 !== 0" class="goods-btn" @click="addShoppingCart">加入购物车</div>
      <div v-if="goodsMsg.usable_stock * 1 !== 0" class="goods-btn goods-btn-active" @click="instantlyBuy">立即购买</div>
      <div v-if="goodsMsg.usable_stock * 1 === 0" class="goods-btn goods-btn-assint">已抢完</div>
    </div>
    <add-number ref="addNumber" :msgDetail="goodsMsg" @comfirmNumer="comfirmNumer"></add-number>
    <link-group ref="groupList" :wechatInfo="groupInfo"></link-group>
    <link-group ref="shareList" :linkType="2"></link-group>
    <we-paint ref="wePaint" @drawDone="_drawDone"></we-paint>
    <div class="share-goods" style="display: none">
      <img v-if="imageUrl" :src="imageUrl + '/yx-image/choiceness/pic-sharegoods@2x.png'" class="share-bg"  mode="aspectFill">
      <div class="share-box">
        <img v-if="imageUrl" :src="imageUrl + '/yx-image/choiceness/5@1x.png'" class="share-img"  mode="aspectFill">
        <div class="share-bottom">
          <img v-if="imageUrl" :src="imageUrl + '/yx-image/choiceness/5@1x.png'" class="wem-img"  mode="aspectFill">
          <div class="share-title">智利J级车厘子250g</div>
          <div class="share-sub-title">智利J级车厘子250g</div>
          <div class="share-group-box">团购价</div>
          <div class="price-box">
            <div class="share-price-number">3.8</div>
            <div class="share-price-icon">元</div>
            <div class="share-price-line">12元</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import { orderMethods } from '@state/helpers'
  import NavigationBar from '@components/navigation-bar/navigation-bar'
  import AddNumber from '@components/add-number/add-number'
  import LinkGroup from '@components/link-group/link-group'
  import WePaint from '@components/we-paint/we-paint'
  import API from '@api'
  const PAGE_NAME = 'GOODS_DETAIL'
  const TYPEBTN = [{url: '/yx-image/choiceness/icon-homepage@2x.png', text: '首页', type: 0}, {url: '/yx-image/choiceness/icon-service@2x.png', text: '客服', type: 1}, {url: '/yx-image/choiceness/icon-shopcart@2x.png', text: '购物车', type: 2}]

  export default {
    name: PAGE_NAME,
    data() {
      return {
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
        deliverAt: ''
      }
    },
    onLoad(e) {
      this.goodsId = e.id
      this.getGoodsDetailData()
      this._groupInfo()
      this.getUserImgList()
    },
    methods: {
      ...orderMethods,
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
            wx.switchTab({ url: '/pages/choiceness' })
            break
          case 1:
            this.$refs.groupList.showLink()
            break
          case 2:
            wx.switchTab({ url: '/pages/shopping-cart' })
            break
        }
      },
      showShare() {
        this.$refs.shareList.showLink()
      },
      addShoppingCart() {
        API.Choiceness.addShopCart({sku_id: this.goodsMsg.shop_skus[0].id}).then((res) => {
          if (res.error === this.$ERR_OK) {
            this.$wechat.showToast('加入购物车成功')
            this.changeShoppingNumber()
          } else {
            this.$wechat.showToast(res.message)
          }
        })
      },
      changeShoppingNumber() {
        API.Choiceness.shopCartNumber().then((res) => {
          if (res.error === this.$ERR_OK) {
            console.log(res.data)
            wx.setTabBarBadge({
              index: 1,
              text: res.data.count + ''
            })
          } else {
            this.$wechat.showToast(res.message)
          }
        })
      },
      instantlyBuy() {
        if (this.goodsMsg.buy_count >= this.goodsMsg.buy_limit) {
          this.$wechat.showToast(`该商品限购${this.goodsMsg.buy_limit}件`)
        } else {
          this.$refs.addNumber.showLink()
        }
      },
      _action() {
        // let name = this.postMsg.coupon ? this.postMsg.coupon.activity_name.length >= 18 ? this.postMsg.coupon.activity_name.slice(0, 18) + '...' : this.postMsg.coupon.activity_name : ''
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
              // width: this.deviceInfo.width
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
              source: this.imageUrl + '/yx-image/choiceness/5@1x.png',
              mode: 'aspectFill'
            },
            {
              el: '.share-title', // 店铺名称
              drawType: 'text-area',
              source: '智利J级车厘子250g',
              fontSize: 16,
              color: '#1f1f1f'
            },
            {
              el: '.share-sub-title', // 签名
              drawType: 'text-area',
              source: `智利J级车厘子250g`,
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
              source: '3.8',
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
              source: '12元',
              fontSize: 17,
              color: '#B7B7B7'
            },
            {
              el: '.wem-img',
              drawType: 'img',
              source: this.imageUrl + '/yx-image/choiceness/5@1x.png'
            }
          ]
        }
        let optionsNull = {
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
              // width: this.deviceInfo.width
            },
            {
              el: '.share-img', // 图片
              drawType: 'img',
              source: this.imageUrl + '/yx-image/choiceness/5@1x.png',
              mode: 'aspectFill'
            },
            {
              el: '.share-title', // 店铺名称
              drawType: 'text-area',
              source: '智利J级车厘子250g',
              fontSize: 16,
              color: '#1f1f1f'
            },
            {
              el: '.share-sub-title', // 签名
              drawType: 'text-area',
              source: `智利J级车厘子250g`,
              fontSize: 14,
              align: 'center',
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
              source: '3.8',
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
              source: '12元',
              fontSize: 17,
              color: '#B7B7B7'
            },
            {
              el: '.wem-img',
              drawType: 'img',
              source: this.qrCode
            }
          ]
        }
        let obj = options
        console.log(optionsNull)
        this.$refs.wePaint.action(obj, false)
      },
      _drawDone(pic) {
        this.pic = pic
        // 保存到本地，并预览
        this.$wx.saveImageToPhotosAlbum({
          filePath: pic,
          success: () => {
            console.log(11)
            this.$wechat.previewImage({ urls: [pic] })
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
            this.deliverAt = res.data.shelf_delivery_at
            this._kanTimePlay()
          } else {
            this.$wechat.showToast(res.message)
          }
        })
      },
      comfirmNumer(number) {
        let goodsList = this.goodsMsg.shop_skus[0]
        goodsList.sku_id = goodsList.id
        goodsList.num = number
        let orderInfo = {
          goodsList: new Array(goodsList),
          total: goodsList.shop_price * number,
          deliverAt: this.deliverAt
        }
        this.setOrderInfo(orderInfo)
        wx.redirectTo({url: `/pages/submit-order`})
      },
      _kanTimePlay() {
        clearInterval(this.timer)
        this.activityTime = this._groupTimeCheckout(this.goodsMsg.shelf_end_at)
        console.log(this.activityTime)
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
    position: relative
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
      box-shadow: 0 2px 11px 0 rgba(0,0,0,0.10)
      z-index: 11
      position: relative
      .share-img
        display: block
        width:  89.4vw
        height: 89.4vw
        border-top-left-radius: 10px
        border-top-right-radius: 10px
    .share-bottom
      padding: 15px 15px 30px
      position: relative
    .wem-img
      position: absolute
      right: 15px
      bottom: 30px
      width: 90px
      height: 90px
      display: block
    .share-title
      font-size: $font-size-16
      color: #1f1f1f
      font-family: $font-family-medium
      margin-bottom: 8px
    .share-sub-title
      font-size: $font-size-14
      color: $color-text-sub
      font-family: $font-family-regular
      margin-bottom: 11px
    .share-group-box
      font-size: $font-size-14
      color: $color-money
      font-family: $font-family-regular
      width: 55px
      height: 20px
      text-align: center
      line-height: 20px
      border-1px($color-money, 2px)
      margin-bottom: 11px
    .price-box
      layout(row)
      align-items: flex-end
      .share-price-number
        font-size: 30px
        color: $color-money
        font-family: $font-family-medium
        line-height: 1
      .share-price-icon
        font-size: $font-size-17
        color: $color-money
        font-family: $font-family-medium
        line-height: 1
        padding-bottom: 2px
        margin-right: 7px
      .share-price-line
        font-size: $font-size-17
        color: #b7b7b7
        font-family: $font-family-regular
        line-height: 1
        padding-bottom: 2px
        text-decoration: line-through
  .goods-detail
    width: 100%
    min-height: 100vh
    background: $color-background
    padding-bottom: 55px
    box-sizing: border-box
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
    right: 15px
    bottom: 15px
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
    padding: 0 3.2vw
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
          font-family: 'PingFang-SC-Bold'
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
          line-height: 1
          padding: 1.5px 2px 3px 3px
          color: #fff
          border-1px(#FFFFFF, 2px)
      .main-box-right
        layout(row)
        align-items: center
        .time-text
          font-size: $font-size-14
          font-family: $font-family-regular
          color: rgba(255,255,255,.8)
          margin-right: 5px
        .time-box
          font-size: $font-size-13
          font-family: 'PingFang-SC-Bold'
          background: rgba(255,255,255,1)
          width: 20px
          text-align: center
          line-height: 20px
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
    padding: 0 3.2vw
    box-sizing: border-box
    width: 100%
    background: #fff
    margin-bottom: 11px
  .goods-info-top
    padding: 17px 0
    layout(row)
    align-items: center
    justify-content: space-between
    .title
      width: 180px
      font-size: $font-size-16
      color: #1F1F1F
      line-height: 1
      min-height: 18px
      font-family: $font-family-medium
      margin-bottom: 9px
      no-wrap()
    .sub-title
      width: 170px
      font-size: $font-size-14
      color: $color-text-sub
      line-height: 1
      min-height: 16px
      font-family: $font-family-regular
      no-wrap()
    .sales-number
      font-size: $font-size-12
      color: #fff
      font-family: $font-family-regular
      border-radius: 8px
      background: rgba(128,128,128,.5)
      padding: 2px 5px 3px
      margin-bottom: 8px
    .stock-number
      font-size: $font-size-12
      color: $color-text-sub
      font-family: $font-family-regular
      text-align: center
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
    font-family: $font-family-regular
    padding-left: 3.2vw
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
    padding: 17px 0 25px 3.2vw
    box-sizing: border-box
    background: #fff
    .send-title
      font-size: $font-size-14
      color: $color-text-main
      font-family: $font-family-medium
      margin-bottom: 12px
    .send-sub-title
      font-size: $font-size-13
      color: $color-text-sub
      font-family: $font-family-regular
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
          img
            width: 100%
            height: 100%
            display: block
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
    .goods-btn-active
      color: #fff
      background: $color-main
    .goods-btn-assint
      color: #fff
      background: $color-text-assist
      width: 60vw
</style>
