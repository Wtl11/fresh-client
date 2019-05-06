<template>
  <form action="" report-submit @submit="$getFormId">
  <div class="active-detail">
    <navigation-bar ref="navigationBar" :title="msgTitle" :showArrow="true" :translucent="false"></navigation-bar>
    <section class="banner-box">
      <buy-users :buyUsers="buyUsers"></buy-users>
      <header-swiper :goodsMsg="goodsMsg"></header-swiper>
      <article class="header-title">
        <header-title-default
          v-if="activeType === 'DEFAULT'"
          :goodsMsg="goodsMsg"
        ></header-title-default>
        <header-title-flash
          ref="flash"
          v-if="activeType === 'FLASH'"
          :goodsMsg="goodsMsg"
          :activityId="activityId"
          @kanTimeEnd="kanTimeEnd"
        >
        </header-title-flash>
      </article>
    </section>
    <header-detail :goodsMsg="goodsMsg" :activityId="activityId" @showShare="handleShowShare"></header-detail>
    <buy-record
      v-if="userImgList.length > 0"
      :userImgList="userImgList"
      :userTotal="userTotal"
      @buyRecordNavTo="buyRecordNavTo"
    ></buy-record>
    <detail-image :goodsMsg="goodsMsg"></detail-image>
    <service-description></service-description>
    <button-group
      :buttonInfo="buttonInfo"
      @instantlyBuy="instantlyBuy"
      @buttonGroupNav="buttonGroupNav"
      @addShoppingCart="addShoppingCart"
    ></button-group>
    <add-number ref="addNumber" :msgDetail="goodsMsg" :msgDetailInfo="buyGoodsInfo" @comfirmNumer="comfirmNumer"></add-number>
    <link-group ref="groupList" :wechatInfo="groupInfo"></link-group>
    <link-group ref="shareList" :linkType="2" @saveImg="_actionDrawPoster"></link-group>
    <we-paint ref="wePaint" @drawDone="_drawPosterDone"></we-paint>
    <article class="share-goods" id="share-goods">
      <img v-if="imageUrl" :src="imageUrl + '/yx-image/choiceness/pic-sharegoods@2x.png'" class="share-bg" mode="aspectFill">
      <div class="share-box">
        <img v-if="imageUrl" :src="imageUrl + '/yx-image/choiceness/5@1x.png'" class="share-img" mode="aspectFill">
        <div class="share-bottom">
          <img v-if="imageUrl" :src="imageUrl + '/yx-image/choiceness/5@1x.png'" class="wem-img" mode="aspectFill">
          <div class="share-title">智利J级车厘子250g</div>
          <div class="share-sub-title">智利J级车厘子250g</div>
          <div class="share-group-box">团购价</div>
          <div class="price-box">
            <div class="share-price-number">{{goodsMsg.trade_price}}</div>
            <div class="share-price-icon">元</div>
            <div class="share-price-line">
              {{goodsMsg.original_price}}元
              <i class="share-money-line"></i>
            </div>
          </div>
        </div>
      </div>
    </article>
  </div>
  </form>
</template>

<script type="text/ecmascript-6">
  import NavigationBar from '@components/navigation-bar/navigation-bar'
  import clearWatch from '@mixins/clear-watch'
  import DrawPosterMixins from './drawPosterMixins'
  import {orderMethods, cartMethods} from '@state/helpers'
  import {SCENE_SHARE, SCENE_DEFAULT, SCENE_QR_CODE} from '@utils/contants'
  import ShareHandler, {EVENT_CODE} from '@mixins/share-handler'
  import API from '@api'
  import {resolveQueryScene} from '@utils/common'
  import HeaderSwiper from '@components/goods-detail-element/header-swiper/header-swiper'
  import BuyUsers from '@components/goods-detail-element/buy-users/buy-users'
  import HeaderTitleDefault from '@components/goods-detail-element/header-title-default/header-title-default'
  import HeaderTitleFlash from '@components/goods-detail-element/header-title-flash/header-title-flash'
  import HeaderDetail from '@components/goods-detail-element/header-detail/header-detail'
  import LinkGroup from '@components/link-group/link-group'
  import WePaint from '@components/we-paint/we-paint'
  import BuyRecord from '@components/goods-detail-element/buy-record/buy-record'
  import DetailImage from '@components/goods-detail-element/detail-image/detail-image'
  import ServiceDescription from '@components/goods-detail-element/service-description/service-description'
  import ButtonGroup from '@components/goods-detail-element/button-group/button-group'
  import AddNumber from '@components/add-number/add-number'
  import {BTN_STATUS, BTN_TEXT_CONSTANT} from './active-config'

  const PAGE_NAME = 'ACTIVE_DETAIL'
  const EVENT_NO_CONFIG = {
    [SCENE_QR_CODE]: 1001,
    [SCENE_SHARE]: 1002,
    [SCENE_DEFAULT]: 1003
  }
  const ald = getApp()
  export default {
    name: PAGE_NAME,
    mixins: [clearWatch, DrawPosterMixins, ShareHandler],
    components: {
      NavigationBar,
      HeaderSwiper,
      BuyUsers,
      HeaderTitleDefault,
      HeaderTitleFlash,
      HeaderDetail,
      LinkGroup,
      WePaint,
      BuyRecord,
      DetailImage,
      ServiceDescription,
      ButtonGroup,
      AddNumber
    },
    data() {
      return {
        msgTitle: '',
        isFirstLoad: true,
        goodsId: 0,
        activityId: 0,
        goodsMsg: {},
        buyUsers: [],
        shareImg: '',
        userImgList: [],
        userTotal: 0,
        buyGoodsInfo: {},
        eventCount: 0
      }
    },
    computed: {
      activeType() {
        let type = 'DEFAULT'
        if (this.activityId > 0) {
          type = 'FLASH'
        }
        return type
      },
      // 活动状态
      activeStatus() {
        let active = this.goodsMsg.activity || {}
        return +active.status
      },
      // 按钮文案
      btnText() {
        let key = this.activeStatus
        if (this.goodsMsg.usable_stock < 1) {
          key = 'NO_INVENTORY'
        }
        if (key == null) {
          key = BTN_STATUS.DOWN
        }
        return BTN_TEXT_CONSTANT[key]
      },
      // 是否显示两个按钮
      isShowTwoButton() {
        let flag = null
        if (this.activityId) {
          flag = this.goodsMsg.usable_stock > 0 && this.activeStatus === 1
        } else {
          flag = this.goodsMsg.usable_stock > 0
        }
        return flag
      },
      // buttonInfo信息
      buttonInfo() {
        return {
          activeStatus: this.activeStatus,
          btnText: this.btnText,
          isShowTwoButton: this.isShowTwoButton
        }
      },
      // 二维码
      thumb_image() {
        return this.goodsMsg.thumb_image
      },
      // 提货时间
      deliverAt() {
        return this.goodsMsg.delivery_at || ''
      }
    },
    onLoad(options) {
      ald.aldstat.sendEvent('商品详情')
      this._initPageParams(options)
      this.getQrCode()
    },
    onShow() {
      this._setEventNo()
      this._getBuyUsers()
      this._getGoodsDetailData()
      this.getUserImgList()
      this.getGoodsOtherInfo()
      this.setCartCount()
      this.$$shareHandler({
        event: EVENT_CODE.GOODS_DETAIL,
        activityId: this.activityId,
        goodsId: this.goodsId
      })
      this.isFirstLoad = false
    },
    onUnload() {
      this.$refs.navigationBar && this.$refs.navigationBar._initHeadStyle()
      this.eventCount = 0
      this.$refs.shareList && this.$refs.shareList.hideLink()
    },
    onShareAppMessage() {
      const self = this
      const shopId = wx.getStorageSync('shopId')
      const flag = Date.now()
      return {
        title: this.goodsMsg.name,
        path: `/pages/active-detail?id=${this.goodsId}&shopId=${shopId}&activityId=${this.activityId}&flag=${flag}`, // 商品详情
        imageUrl: this.thumb_image || this.goodsMsg.goods_cover_image,
        success: (res) => {
          // 转发成功
          self.$sendMsg({
            event_no: 1004,
            goods_id: self.goodsId,
            title: self.goodsMsg.name
          })
        },
        fail: (res) => {
          // 转发失败
        }
      }
    },
    methods: {
      ...orderMethods,
      ...cartMethods,
      // 添加购物车
      async addShoppingCart() {
        let isLogin = await this.$isLogin()
        if (!isLogin) {
          return
        }
        API.Choiceness.addShopCart({goods_sku_id: this.goodsMsg.goods_skus[0].goods_sku_id, activity_id: this.activityId}).then((res) => {
          if (res.error === this.$ERR_OK) {
            this.$sendMsg({
              event_no: 1007,
              goods_id: this.goodsId,
              title: this.goodsMsg.name
            })
            this.$wechat.showToast('加入购物车成功')
            this.setCartCount()
          } else {
            this.$wechat.showToast(res.message)
          }
        })
      },
      // 按钮导航
      buttonGroupNav(item) {
        switch (item.type) {
          case 0:
            wx.switchTab({url: '/pages/choiceness'})
            break
          case 1:
            // this.$refs.groupList.showLink()
            break
          case 2:
            if (this.$isLogin()) {
              wx.switchTab({url: '/pages/shopping-cart'})
            }
            break
        }
      },
      // 购买记录导航
      buyRecordNavTo() {
        const url = `/pages/goods-record?goodsId=${this.goodsId}&shopId=${this.shopId}&activityId=${this.activityId}`
        wx.navigateTo({url})
      },
      // 设置群数据事件号
      _setEventNo() {
        let entryAppType = wx.getStorageSync('entryAppType')
        this.eventNo = EVENT_NO_CONFIG[entryAppType]
      },
      comfirmNumer(number) {
        let goodsList = this.goodsMsg.goods_skus[0]
        goodsList.sku_id = goodsList.goods_sku_id
        goodsList.num = number
        goodsList.goods_units = this.goodsMsg.goods_units
        const total = (goodsList.trade_price * number).toFixed(2)
        let orderInfo = {
          goodsList: new Array(goodsList),
          total: total,
          deliverAt: this.deliverAt
        }
        this.setOrderInfo(orderInfo)
        wx.navigateTo({url: `/pages/submit-order`})
      },
      // 获取用户的购买信息
      getGoodsOtherInfo() {
        API.Choiceness.getGoodsBuyInfo(this.goodsId, {activity_id: this.activityId}).then((res) => {
          if (res.error === this.$ERR_OK) {
            this.buyGoodsInfo = res.data
          } else {
            this.$wechat.showToast(res.message)
          }
        })
      },
      // 执行购买
      async instantlyBuy() {
        let isLogin = await this.$isLogin()
        if (!isLogin) {
          return
        }
        ald.aldstat.sendEvent('立即购买')
        // 显示抢购限购数量
        if (this.buyGoodsInfo.person_all_buy_limit * 1 !== -1 && this.buyGoodsInfo.person_all_buy_count >= this.buyGoodsInfo.person_all_buy_limit) {
          this.$wechat.showToast(`该商品限购${this.buyGoodsInfo.person_all_buy_limit}件，您不能再购买了`)
          return
        }
        if (this.buyGoodsInfo.person_day_buy_limit * 1 === -1) {
          this._showAddNumber()
          return
        }
        if (this.buyGoodsInfo.person_day_buy_count >= this.buyGoodsInfo.person_day_buy_limit) {
          this.$wechat.showToast(`该商品限购${this.buyGoodsInfo.person_day_buy_limit}件，您不能再购买了`)
        } else {
          this._showAddNumber()
        }
      },
      // 显示添加数量控件
      _showAddNumber() {
        this.$refs.addNumber && this.$refs.addNumber.showLink()
      },
      // 显示分享控件
      handleShowShare() {
        if (this.activityId) {
          return
        }
        this.$refs.shareList && this.$refs.shareList.showLink()
      },
      // 获取站点购买的用户
      getUserImgList() {
        API.GoodsRecord.getList({goods_id: this.goodsId, limit: 5, page: 1, is_remove_duplicate: 1}, false).then((res) => {
          this.userImgList = res.data
          this.userTotal = res.not_duplicate_total || 0
        })
      },
      // 获取二维码
      getQrCode(loading) {
        let shopId = wx.getStorageSync('shopId')
        // 修改创建二维码的参数
        let path = `pages/goods-detail?g=${this.goodsId}&s=${shopId}&a=${this.activityId}`
        API.Choiceness.createQrCodeApi({path}, loading).then((res) => {
          if (res.error === this.$ERR_OK) {
            this.shareImg = res.data.image_url
          } else {
            console.warn(res)
          }
        }).catch(e => {
          console.warn(e)
        })
      },
      // 初始化页面参数
      _initPageParams(options) {
        if (options.scene) {
          let {shopId, activityId, goodsId} = resolveQueryScene(options.scene)
          this.goodsId = goodsId
          this.activityId = activityId
          this.shopId = shopId
        } else {
          this.goodsId = +options.id || +options.goodsId || 0
          this.activityId = +options.activityId || 0
          this.shopId = +options.shopId || 0
        }
        this.shopId && wx.setStorageSync('shopId', this.shopId)
      },
      // 获取购买者的用户信息
      _getBuyUsers() {
        API.Choiceness.getUserImg({limit: 20}).then((res) => {
          if (res.error !== this.$ERR_OK) {
            this.$wechat.showToast(res.message)
            return
          }
          this.buyUsers = res.data
        })
      },
      // 获取商品详情
      _getGoodsDetailData() {
        API.Choiceness.getGoodsDetail(this.goodsId, {activity_id: this.activityId}, this.isFirstLoad).then((res) => {
          this.$wechat.hideLoading()
          if (res.error === this.$ERR_OK) {
            this.goodsMsg = res.data
            this.$refs.navigationBar && this.$refs.navigationBar.setTranslucentTitle(this.goodsMsg.name)
            this._sendGoodsMsg()
            this._flashAction()
          } else {
            this.$wechat.showToast(res.message)
          }
        }).catch(e => {
          console.warn(e)
        })
      },
      // 限时抢购倒计时开始
      _flashAction() {
        this.$refs.flash && this.$refs.flash._clearTimer()
        if (!this.activityId) return
        if (this.activeStatus === BTN_STATUS.DOWN) {
          return
        }
        let diff = this.goodsMsg.at_diff || 0
        this.$refs.flash && this.$refs.flash._kanTimePlay(diff)
      },
      // 倒计时结束hook
      kanTimeEnd() {
        this._getGoodsDetailData()
        this.getGoodsOtherInfo()
      },
      // 发送商品实践号
      _sendGoodsMsg() {
        if (this.eventCount > -1) {
          this.eventCount++
          this.$sendMsg({
            event_no: this.eventNo,
            goods_id: this.goodsId,
            title: this.goodsMsg.name
          })
        }
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@designCommon"

  .share-goods
    padding: 32.8vw 5.3vw 17vw
    box-sizing: border-box
    position: fixed
    width: 100vw
    height: 100vh
    right :-100%
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


  .active-detail
    min-height: 100vh
    background: $color-background
    padding-bottom: 55px
    box-sizing: border-box
    overflow-x: hidden
    .banner-box
      position :relative
      .header-title
        position: absolute
        left: 12px
        right :@left
        bottom: -1px
</style>
