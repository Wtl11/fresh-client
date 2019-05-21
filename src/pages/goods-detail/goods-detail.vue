<template>
  <form action="" report-submit @submit="$getFormId">
    <div class="active-detail">
      <navigation-bar ref="navigationBar" :title="msgTitle" :showArrow="true" :translucent="false"></navigation-bar>
      <section class="banner-box">
        <buy-users :buyUsers="buyUsers"></buy-users>
        <header-swiper :goodsMsg="goodsMsg"></header-swiper>
        <article class="header-title-wrapper">
          <section v-if="activityType === ACTIVE_TYPE.FLASH" class="header-title">
            <div class="banner-title-main">
              <img v-if="imageUrl" :src="imageUrl + '/yx-image/choiceness/pic-spxq_bg@2x.png'" mode="aspectFill" class="banner-title-bg">
              <div class="banner-main-box">
                <div class="banner-main-left">
                  <div class="left-price">{{goodsMsg.trade_price}}</div>
                  <div class="left-price-text">元</div>
                  <div class="left-price-line">
                    <div class="line-price-top">
                      <img v-if="imageUrl" :src="imageUrl + '/yx-image/choiceness/pic-qgj@2x.png'" class="text-img" mode="aspectFill">
                      <div class="text">秒杀价</div>
                    </div>
                    <div class="line-price-box">{{goodsMsg.original_price}}元</div>
                  </div>
                </div>
                <div class="banner-main-right">
                  <div class="time-text">{{goodsMsg.at_diff_str}}</div>
                  <div class="time-all-box">{{activityTime.hour}}:{{activityTime.minute}}:{{activityTime.second}}</div>
                </div>
              </div>
            </div>
          </section>
          <section v-if="activityType === ACTIVE_TYPE.DEFAULT" class="header-title-default">
            <div class="left-price" :class="'corp-' + corpName + '-money'">{{goodsMsg.trade_price}}</div>
            <div class="left-price-text">
              <div class="price-text" :class="'corp-' + corpName + '-money'">元</div>
              <div class="line-price-text">{{goodsMsg.original_price}}元</div>
            </div>
          </section>
          <section v-else-if="activityType !== ACTIVE_TYPE.FLASH"
                   class="header-title active-common"
          >
            <div class="banner-title-main">
              <div class="banner-main-box">
                <div class="banner-main-left">
                  <div class="left-price">{{goodsMsg.trade_price}}</div>
                  <div class="left-price-text">元</div>
                  <div class="left-price-line">
                    <div class="line-price-top">
                      <img v-if="imageUrl" :src="imageUrl + '/yx-image/choiceness/pic-qgj@2x.png'" class="text-img" mode="aspectFill">
                      <div class="text">{{iconText}}</div>
                    </div>
                    <div class="line-price-box">{{goodsMsg.original_price}}元</div>
                  </div>
                </div>
              </div>
            </div>
          </section>
<!--          <header-title-default-->
<!--            v-if="activeType === 'DEFAULT'"-->
<!--            :goodsMsg="goodsMsg"-->
<!--          ></header-title-default>-->
<!--          <header-title-flash-->
<!--            ref="flash"-->
<!--            v-if="activeType === ACTIVE_TYPE.FLASH"-->
<!--            :goodsMsg="goodsMsg"-->
<!--            :activityId="activityId"-->
<!--            @kanTimeEnd="kanTimeEnd"-->
<!--          >-->
<!--          </header-title-flash>-->
<!--          <header-title-common-active-->
<!--            v-else-->
<!--            :activeType="activeType"-->
<!--            :goodsMsg="goodsMsg"-->
<!--          ></header-title-common-active>-->
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
      <draw-poster
        v-if="activityType === ACTIVE_TYPE.DEFAULT"
        ref="drawPoster"
        :goodsMsg="goodsMsg"
        :shareImg="shareImg"
      ></draw-poster>
    </div>
  </form>
</template>

<script type="text/ecmascript-6">
  import NavigationBar from '@components/navigation-bar/navigation-bar'
  import clearWatch from '@mixins/clear-watch'
  import {orderMethods, cartMethods} from '@state/helpers'
  import {SCENE_SHARE, SCENE_DEFAULT, SCENE_QR_CODE, ACTIVE_TYPE} from '@utils/contants'
  import ShareHandler, {EVENT_CODE} from '@mixins/share-handler'
  import API from '@api'
  import {resolveQueryScene, countDownHandle} from '@utils/common'
  import HeaderSwiper from '@components/goods-detail-element/header-swiper/header-swiper'
  import BuyUsers from '@components/goods-detail-element/buy-users/buy-users'
  // import HeaderTitleDefault from '@components/goods-detail-element/header-title-default/header-title-default'
  // import HeaderTitleFlash from '@components/goods-detail-element/header-title-flash/header-title-flash'
  import HeaderDetail from '@components/goods-detail-element/header-detail/header-detail'
  // import HeaderTitleCommonActive from '@components/goods-detail-element/header-title-common-active/header-title-common-active'
  import LinkGroup from '@components/link-group/link-group'
  import BuyRecord from '@components/goods-detail-element/buy-record/buy-record'
  import DetailImage from '@components/goods-detail-element/detail-image/detail-image'
  import ServiceDescription from '@components/goods-detail-element/service-description/service-description'
  import DrawPoster from '@components/goods-detail-element/draw-poster/draw-poster'
  import ButtonGroup from '@components/goods-detail-element/button-group/button-group'
  import AddNumber from '@components/add-number/add-number'
  import {BTN_STATUS, BTN_TEXT_CONSTANT} from './config'

  const PAGE_NAME = 'ACTIVE_DETAIL'
  const PAGE_ROUTE_NAME = 'active-detail'
  const EVENT_NO_CONFIG = {
    [SCENE_QR_CODE]: 1001,
    [SCENE_SHARE]: 1002,
    [SCENE_DEFAULT]: 1003
  }
  const ald = getApp()
  export default {
    name: PAGE_NAME,
    mixins: [clearWatch, ShareHandler],
    components: {
      NavigationBar,
      HeaderSwiper,
      BuyUsers,
      // HeaderTitleDefault,
      // HeaderTitleFlash,
      HeaderDetail,
      LinkGroup,
      BuyRecord,
      DetailImage,
      ServiceDescription,
      ButtonGroup,
      AddNumber,
      DrawPoster
      // HeaderTitleCommonActive
    },
    data() {
      return {
        msgTitle: '',
        isFirstLoad: true,
        goodsId: 0,
        activityId: 0,
        activityType: '',
        goodsMsg: {},
        buyUsers: [],
        shareImg: '',
        userImgList: [],
        userTotal: 0,
        buyGoodsInfo: {},
        eventCount: 0,
        ACTIVE_TYPE: ACTIVE_TYPE,
        activityTime: {
          hour: '00',
          minute: '00',
          second: '00'
        },
        timer: null
      }
    },
    computed: {
      iconText() {
        let text = ''
        switch (this.activityType) {
          case ACTIVE_TYPE.GROUP_ON :
            text = '团购价'
            break
          case ACTIVE_TYPE.NEW_CLIENT:
            text = '新人价'
            break
          case ACTIVE_TYPE.GOODS_HOT_TAG:
            text = '爆款价'
            break
          default:
            break
        }
        return text
      },
      // 活动状态
      activeStatus() {
        let active = this.goodsMsg.activity || {}
        return +active.status || 0
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
        return BTN_TEXT_CONSTANT[key] || ''
      },
      // 是否显示两个按钮
      isShowTwoButton() {
        let flag = false
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
        return this.goodsMsg.thumb_image || ''
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
    onHide() {
      this._clearTimer()
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
        path: `/pages/${PAGE_ROUTE_NAME}?id=${this.goodsId}&shopId=${shopId}&activityId=${this.activityId}&activityType=${this.activityType}&flag=${flag}`, // 商品详情
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
      _kanTimePlay(diff) {
        this.activityTime = countDownHandle(diff)
        this.timer = setTimeout(() => {
          diff--
          if (diff < 0) {
            diff = 0
          }
          this.activityTime = countDownHandle(diff)
          if (this.activityTime.differ <= 0) {
            this._clearTimer()
            this.kanTimeEnd()
          } else {
            return this._kanTimePlay(diff)
          }
        }, 1000)
      },
      _clearTimer() {
        clearTimeout(this.timer)
        clearInterval(this.timer)
      },
      // 画商品海报
      _actionDrawPoster() {
        if (!this.shareImg) {
          this.$wechat.showToast('图片生成失败，请重新尝试！')
          this.getQrCode()
          return
        }
        this.$refs.drawPoster && this.$refs.drawPoster.action()
        this.$sendMsg({ event_no: 1005, goods_id: this.goodsId, title: this.goodsMsg.name })
      },
      // 添加购物车
      async addShoppingCart() {
        let isLogin = await this.$isLogin()
        if (!isLogin) {
          return
        }
        let goodsId = this.goodsMsg.goods_sku_id || this.goodsMsg.goods_skus[0].goods_sku_id
        API.Choiceness.addShopCart({goods_sku_id: goodsId, activity_id: this.activityId}).then((res) => {
          console.log(res)
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
      // addNumber控件确定按钮
      comfirmNumer(number) {
        let goodsList = this.goodsMsg.goods_skus[0]
        goodsList.sku_id = this.goodsMsg.goods_sku_id || goodsList.goods_sku_id
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
        let path = `pages/${PAGE_ROUTE_NAME}?g=${this.goodsId}&s=${shopId}&a=${this.activityId}`
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
        this.goodsId = +options.id || +options.goodsId || 0
        this.activityId = +options.activityId || 0
        this.shopId = +options.shopId || 0
        if (options.scene) {
          let {shopId, activityId, goodsId} = resolveQueryScene(options.scene)
          this.goodsId = goodsId
          this.activityId = activityId
          this.shopId = shopId
        }
        this.shopId && wx.setStorageSync('shopId', this.shopId)
        console.warn(options.activityType, '==->')
        this._initPageType(options.activityType)
      },
      _initPageType(type = 'DEFAULT') {
        if (type === ACTIVE_TYPE.GUESS) {
          type = ACTIVE_TYPE.DEFAULT
        } else if (this.activityId > 0 && type === ACTIVE_TYPE.DEFAULT) {
          type = ACTIVE_TYPE.FLASH
        }
        this.activityType = type
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
        if (this._activityType !== ACTIVE_TYPE.FLASH) return
        if (this.activeStatus === BTN_STATUS.DOWN) {
          return
        }
        let diff = this.goodsMsg.at_diff || 0
        this._kanTimePlay(diff)
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

  .active-detail
    min-height: 100vh
    background: $color-background
    padding-bottom: 55px
    box-sizing: border-box
    overflow-x: hidden
    .banner-box
      position :relative
      .header-title-wrapper
        position: absolute
        left: 12px
        right :@left
        bottom: -1px
  // 普通商品
  .header-title-default
    height: 13vw
    background: #ff6d0d
    width: 100%
    border-top-left-radius: 8px
    border-top-right-radius: 8px
    layout(row)
    align-items: center
    padding-left: 10px
    box-sizing: border-box
    .left-price
      font-size: 30px
      font-family: $font-family-medium
      color:rgba(255,255,255,1)
    .left-price-text
      layout(row)
      align-items: flex-end
      .price-text
        font-size: 22px
        font-family: $font-family-medium
        margin-right: 5px
        color:rgba(255,255,255,1)
      .line-price-text
        font-size: $font-size-12
        font-family: $font-family-regular
        text-decoration: line-through
        line-height: 1
        color:rgba(255,255,255,0.8)
        position :relative
        bottom :4px
  // 限时抢购-title
    .header-title
      position relative
      &.active-common
        height: 13vw
        background: #ff6d0d
        width: 100%
        border-top-left-radius: 8px
        border-top-right-radius: 8px
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
              font-family: $font-family-medium
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
              line-height:15px
            .time-all-box
              font-size: $font-size-13
              color: $color-text-main
              font-family: $font-family-regular
              line-height:15px
</style>
