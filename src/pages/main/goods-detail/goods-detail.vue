<template>
  <form action="" report-submit @submit="$getFormId">
    <div class="active-detail">
      <navigation-bar ref="navigationBar" :title="msgTitle" :translucent="true" :arrowUrl="arrowUrl" @scrollingShowTitle="scrollingShowTitle"></navigation-bar>
      <section class="banner-box">
        <section v-if="buyUsers.length" class="buy-users" :style="{top: statusBarHeight + 44 + 'px'}">
          <swiper
            class="carousel"
            :autoplay="true"
            :interval="3000"
            :duration="500"
            circular
            vertical
          >
            <block v-for="(item, index) in buyUsers" :key="index">
              <swiper-item class="content-wrapper">
                <figure class="avatar-wrapper">
                  <img v-if="item.avatar" :src="item.avatar" alt="" class="img">
                </figure>
                <div class="text">{{item.text}}</div>
              </swiper-item>
            </block>
          </swiper>
          <div class="place-holder"></div>
        </section>
        <div class="header-swiper">
          <swiper v-if="goodsBanner && goodsBanner.length" :current="swiperIdx" class="banner" @change="bannerChange" interval="5000">
            <block v-if="hasVideo&&goodsMsg.goods_videos">
              <swiper-item class="banner-item">
                <video v-if="goodsMsg.goods_videos && goodsMsg.goods_videos[0] && goodsMsg.goods_videos[0].full_url" class="item-img" id="goodsVideo" :src="goodsMsg.goods_videos[0].full_url" :poster="videoPoster" :muted="true" :show-mute-btn="true" :show-center-play-btn="false" :enable-progress-gesture="false" @ended='videoEnd' @waiting="videoWaiting" @progress="videoLoaded"></video>
                <img v-if="goodsBanner[0].image_url" :class="!playBefore?'hide':''" :src="goodsBanner[0].image_url" mode="aspectFill" class="item-img video-img">
                <div class="play-btn" @click="playVideo && playVideo(false)">
                  <img v-if="imageUrl&&!videoPlaying" :src="imageUrl + '/yx-image/2.6.5/icon-play_big@2x.png'" mode="aspectFill" class="play-btn-icon" @click.stop="playVideo && playVideo(true)">
                </div>
              </swiper-item>
            </block>
            <block v-for="(item, index) in goodsBanner" :key="index">
              <swiper-item class="banner-item">
                <img :src="item.image_url + '?' + goodsMsg.image_view" class="item-img item-img-one" mode="aspectFill">
                <img :src="item.image_url" class="item-img item-img-two" mode="aspectFill">
              </swiper-item>
            </block>
          </swiper>
          <article class="banner-number" v-if="goodsBannerLength !== 0">
            <div></div>
            <div v-if="hasVideo" class="banner-btn-con">
              <div :class="currentNum===0?'active':''" class="banner-number-box banner-btn" @click="changeCurrentNum(0)">
                <img v-if="imageUrl&&currentNum===0" :src="imageUrl + '/yx-image/2.6.5/icon-play_white@2x.png'" mode="aspectFill" class="banner-btn-icon">
                <img v-if="imageUrl&&currentNum!==0" :src="imageUrl + '/yx-image/2.6.5/icon-play_black@2x.png'" mode="aspectFill" class="banner-btn-icon">
                视频
              </div>
              <div :class="currentNum!==0?'active':''" class="banner-number-box banner-btn" @click="changeCurrentNum(1)">图片</div>
            </div>
            <div :style="{opacity: currentNum!==0?'1':'0'}" class="banner-number-box">{{currentNum}}/{{goodsBannerLength}}</div>
          </article>
        </div>
        <article :style="{zIndex: hasVideo&&videoPlaying?'-1':'1'}" class="header-title-wrapper">
          <section v-if="activityType === ACTIVE_TYPE.DEFAULT" class="header-title-default">
            <div class="left-price" :class="'corp-' + corpName + '-money'">{{goodsMsg.trade_price}}</div>
            <div class="left-price-text">
              <div class="price-text" :class="'corp-' + corpName + '-money'">元</div>
              <div class="line-price-text">{{goodsMsg.original_price}}元</div>
            </div>
          </section>
          <section v-else-if="activityType === ACTIVE_TYPE.GROUP_ON"
                   class="header-title active-common group"
          >
            <div class="banner-title-main">
              <img v-if="imageUrl" :src="imageUrl + '/yx-image/2.4/pic-pintuan_xq@2x.png'" mode="aspectFill" class="banner-title-bg">
              <div class="banner-main-box">
                <figure class="group-icon-wrapper">
                  <div class="left">{{limitPerson}}</div>
                  <p class="right">人拼</p>
                </figure>
                <div class="banner-main-left">
                  <div class="left-price">{{goodsMsg.trade_price}}</div>
                  <div class="left-price-text">元</div>
                  <div class="left-price-line">
                    <div class="line-price-top">
                    </div>
                    <div class="line-price-box group">{{goodsMsg.original_price}}元</div>
                  </div>
                </div>
                <div class="banner-main-right">
                  <div class="time-text">{{goodsMsg.at_diff_str}}</div>
                  <div class="time-all-box">{{activityTime.hour}}:{{activityTime.minute}}:{{activityTime.second}}</div>
                </div>
              </div>
            </div>
          </section>
          <section v-else class="header-title">
            <div class="banner-title-main">
              <img v-if="imageUrl" :src="imageUrl + '/yx-image/choiceness/pic-spxq_bg@2x.png'" mode="aspectFill" class="banner-title-bg">
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
                <div class="banner-main-right">
                  <div class="time-text">{{goodsMsg.at_diff_str}}</div>
                  <div class="time-all-box">{{activityTime.hour}}:{{activityTime.minute}}:{{activityTime.second}}</div>
                </div>
              </div>
            </div>
          </section>
        </article>
      </section>
      <div class="header-detail">
        <div class="share-wrapper" formType="submit" :open-type="activityType !== ACTIVE_TYPE.DEFAULT? 'share': ''" @click="handleShowShare">
          <img v-if="imageUrl" :src="imageUrl + '/yx-image/2.3/icon-sharexq@2x.png'" mode="aspectFill" class="share-img">
          <p class="share-text">分享</p>
        </div>
        <div class="info-box">
          <article class="title-wrapper">
            <!--<div class="title" :class="goodsMsg.name ? 'has-title' : ''">{{goodsMsg.name}}</div>-->
            <div class="title" :class="goodsMsg.name ? 'has-title' : ''"><span v-if="activityType === ACTIVE_TYPE.CENTRALIZE_PURCHASE" class="title-label">集采</span>{{goodsMsg.name}}</div>
            <div class="has-sub-title" v-if="goodsMsg.describe">{{goodsMsg.describe}}</div>
          </article>
          <div class="info-sub">
            <!--<img v-if="imageUrl && corpName === 'platform'" :src="imageUrl + '/yx-image/choiceness/icon-fast@2x.png'" mode="aspectFill" class="info-sub-img">-->
            <img v-if="imageUrl && corpName === 'platform'" :src="imageUrl + '/yx-image/2.9/icon-fast@2x.png'" mode="aspectFill" class="info-sub-img">
            <div class="sub-text">现在下单，预计(<span class="sub-text-color">{{goodsMsg.delivery_at}}</span>)可自提</div>
          </div>
          <div class="info-stock">已售<span :class="'corp-' + corpName + '-money'">{{goodsMsg.sale_count}}</span>{{goodsMsg.goods_units}}<span v-if="activityId * 1 > 0">，剩余<span :class="'corp-' + corpName + '-money'">{{goodsMsg.usable_stock}}</span>{{goodsMsg.goods_units}}</span></div>
        </div>
      </div>
      <!--拼团列表-->
      <div v-if="activityType === ACTIVE_TYPE.GROUP_ON" class="collage-box">
        <div v-if="collageList.length > 0" class="title">{{collageTotal}}位邻居正在拼单，可直接参与</div>
        <swiper v-if="collageList.length > 1" class="collage-scroll" :autoplay="autoplay" circular vertical interval="5000" :display-multiple-items="2">
          <block v-for="(item, index) in collageList" :key="index">
            <swiper-item class="collage-content">
              <div class="left">
                <img :src="item.avatar" alt="" class="logo">
                <span class="name">{{item.nickname}}</span>
              </div>
              <div class="right">
                <div class="context">
                  <p class="text">还差<span class="color">{{item.surplus_number}}人</span>拼成</p>
                  <span v-if="item.diff" class="time">剩余{{item.diff.hour}}:{{item.diff.minute}}:{{item.diff.second}}</span>
                </div>
                <button formType="submit" class="go-collage" @click="jumpToCollage(item)">去参团</button>
              </div>
            </swiper-item>
          </block>
        </swiper>
        <article v-if="collageList.length === 1" class="collage-scroll single">
          <block v-for="(item, index) in collageList" :key="index">
            <section class="collage-content">
              <div class="left">
                <img :src="item.avatar" alt="" class="logo">
                <span class="name">{{item.nickname}}</span>
              </div>
              <div class="right">
                <div class="context">
                  <p class="text">还差<span class="color">{{item.surplus_number}}人</span>拼成</p>
                  <span v-if="item.diff" class="time">剩余{{item.diff.hour}}:{{item.diff.minute}}:{{item.diff.second}}</span>
                </div>
                <button formType="submit" hover-class="none" class="go-collage" @click="jumpToCollage(item)">去参团</button>
              </div>
            </section>
          </block>
        </article>
        <!--        <div class="collage-scroll" v-if="collageList.length === 0">-->
        <!--          <div class="nothing">暂无参团信息~</div>-->
        <!--        </div>-->
        <p class="group-rule-wrapper" :class="{active: collageList.length > 0}">
          <span class="number">1</span>
          <span class="text">.发起拼团/参团</span>
          <img v-if="imageUrl" :src="imageUrl + '/yx-image/2.4/pic-ptwf@2x.png'" class="icon-arrow">
          <span class="number">2</span>
          <span class="text">.拼团成功</span>
          <img v-if="imageUrl" :src="imageUrl + '/yx-image/2.4/pic-ptwf@2x.png'" class="icon-arrow">
          <span class="number">3</span>
          <span class="text">.拼主返券</span>
        </p>
      </div>
      <buy-record
        v-if="userImgList.length > 0"
        :userImgList="userImgList"
        :userTotal="userTotal"
        @buyRecordNavTo="buyRecordNavTo"
      ></buy-record>
      <detail-image :goodsMsg="goodsMsg"></detail-image>
      <service-description :runTime="runTime"></service-description>
      <button-group
        :buttonInfo="buttonInfo"
        :activityType="activityType"
        @instantlyBuy="instantlyBuy"
        @buttonGroupNav="buttonGroupNav"
        @addShoppingCart="addShoppingCart"
      ></button-group>
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
    <add-number ref="addNumber" :msgDetail="goodsMsg" :msgDetailInfo="buyGoodsInfo" @comfirmNumer="comfirmNumer" @hide="handleHideAddNumber"></add-number>
    <!--    <link-group ref="groupList" :wechatInfo="groupInfo"></link-group>-->
    <!--    <link-group ref="shareList" :linkType="2" @saveImg="_actionDrawPoster"></link-group>-->
    <we-paint ref="wePaint" @drawDone="_drawPosterDone"></we-paint>
    <article class="share-panel-wrapper">
      <div v-if="showSharePanel" class="share-mask" @click="handleHideSharePanel">
      </div>
      <section class="share-panel" :class="{show: showSharePanel}">
        <div class="header">
          <p>分享</p>
          <img v-if="imageUrl" :src="imageUrl + '/yx-image/2.4/icon-del@2x.png'" class="close-icon" @click="handleHideSharePanel">
        </div>
        <div class="container">
          <share-button v-if="product" type="3" :product="product" class="container-item-wrapper" @click="handleHideSharePanel">
            <img v-if="imageUrl" :src="imageUrl + '/yx-image/2.4/icon-tjhwq@2x.png'" class="item-icon">
            <p class="text">推荐到好物圈</p>
            <div class="tip-wrapper">
              <p>好物推荐，和大家一起分享你发现的好物</p>
              <div class="triangle"></div>
            </div>
          </share-button>
          <button open-type="share" class="container-item-wrapper" @click="handleHideSharePanel">
            <img v-if="imageUrl" :src="imageUrl + '/yx-image/2.4/pic-wechat@2x.png'" class="item-icon">
            <p class="text button">分享给好友</p>
            <div v-if="product" class="line"></div>
          </button>
          <nav class="container-item-wrapper" @click="_actionDrawPoster">
            <img v-if="imageUrl" :src="imageUrl + '/yx-image/2.4/icon-wechatq@2x.png'" class="item-icon">
            <p class="text">生成分享海报</p>
            <div class="line"></div>
          </nav>
        </div>
      </section>
    </article>
  </form>
</template>

<script type="text/ecmascript-6">
  import NavigationBar from '@components/navigation-bar/navigation-bar'
  import clearWatch from '@mixins/clear-watch'
  import { orderMethods, cartMethods } from '@state/helpers'
  import { SCENE_SHARE, SCENE_DEFAULT, SCENE_QR_CODE, ACTIVE_TYPE } from '@utils/contants'
  import ShareHandler, { EVENT_CODE } from '@mixins/share-handler'
  import API from '@api'
  import { resolveQueryScene, countDownHandle } from '@utils/common'
  import LinkGroup from '@components/link-group/link-group'
  import BuyRecord from '@components/goods-detail-element/buy-record/buy-record'
  import DetailImage from '@components/goods-detail-element/detail-image/detail-image'
  import ServiceDescription from '@components/goods-detail-element/service-description/service-description'
  import ButtonGroup from '@components/goods-detail-element/button-group/button-group'
  import AddNumber from '@components/add-number/add-number'
  import WePaint from '@components/we-paint/we-paint'
  import base64src from '@utils/create-qr-code-wx'
  import GoodsDetailMixins from '@mixins/goods-detail'
  import ShareTrick from '@mixins/share-trick'
  import GetOptions from '@mixins/get-options'
  import Ald from '@utils/ald'

  const PAGE_NAME = 'ACTIVE_DETAIL'
  const PAGE_ROUTE_NAME = 'goods-detail'
  const ARROW_URL = ['/yx-image/2.3/icon-return_white@2x.png', '/zd-image/1.2/icon-title_back@2x.png']
  // 按钮状态映射
  export const BTN_STATUS = {
    WILL: 0,
    ACTION: 1,
    DOWN: 2
  }
  // 按钮文案
  export const BTN_TEXT_CONSTANT = {
    [BTN_STATUS.WILL]: '即将开抢',
    [BTN_STATUS.ACTION]: '',
    [BTN_STATUS.DOWN]: '已结束',
    'NO_INVENTORY': '已抢完'
  }

  const EVENT_NO_CONFIG = {
    [SCENE_QR_CODE]: 1001,
    [SCENE_SHARE]: 1002,
    [SCENE_DEFAULT]: 1003
  }
  // const ald = getApp()
  export default {
    name: PAGE_NAME,
    mixins: [clearWatch, ShareHandler, GoodsDetailMixins, ShareTrick, GetOptions],
    components: {
      NavigationBar,
      LinkGroup,
      BuyRecord,
      DetailImage,
      ServiceDescription,
      ButtonGroup,
      AddNumber,
      WePaint
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
        currentNum: 1,
        collageList: [],
        collageTotal: 0,
        autoplay: true,
        statusBarHeight: -100,
        product: null,
        showSharePanel: false,
        runTime: '',
        articleId: 0,
        hasVideo: false,
        isIos: false,
        videoPoster: '',
        videoPlaying: false,
        playBefore: true,
        videoLoading: false,
        videoContext: '',
        swiperIdx: 0,
        arrowUrl: ARROW_URL[1],
        isShowOldCustomerButton: false
      }
    },
    computed: {
      activityInfo() {
        return this.goodsMsg.activity || {}
      },
      limitPerson() {
        return (this.activityInfo.config || {}).person_limit || 0
      },
      goodsBanner() {
        return this.goodsMsg.goods_banner_images || []
      },
      goodsBannerLength() {
        return this.goodsBanner.length || 0
      },
      iconText() {
        let text = ''
        switch (this.activityType) {
          case ACTIVE_TYPE.GROUP_ON :
            text = '拼团价'
            break
          case ACTIVE_TYPE.NEW_CLIENT:
            text = '新人价'
            break
          case ACTIVE_TYPE.GOODS_HOT_TAG:
            text = '爆款价'
            break
          case ACTIVE_TYPE.FLASH:
            text = '秒杀价'
            break
          case ACTIVE_TYPE.CENTRALIZE_PURCHASE:
            text = '集采价'
            break
          default:
            text = '团购价'
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
          activeStatus: this.activeStatus || 0,
          btnText: this.btnText || '',
          isShowTwoButton: this.isShowTwoButton || false,
          tradePrice: this.goodsMsg.trade_price || 0,
          salePrice: this.goodsMsg.goods_sale_price || 0,
          base_usable_stock: this.goodsMsg.base_usable_stock || 0, // 非活动库存
          usable_stock: this.goodsMsg.usable_stock || 0, // 库存
          tipTop: this.tipTop || '',
          isShowOldCustomerButton: this.isShowOldCustomerButton
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
      // if (!isEmptyObject(options)) {
      //   this._options = options || {}
      // }
      // ald && ald.aldstat.sendEvent('商品详情')
      Ald.sendEvent('商品详情')
    },
    onShow() {
      // 分享锁
      if (this._isSharing) {
        this._isSharing = false
        return
      }
      this.checkSystem()
      this._initPageParams()
      if (this.goodsId < 1) return
      this._checkIsNewClient()
      this.getQrCode()
      this._getLocation()
      this._getGoodsDetailData()
      this.getUserImgList()
      this.getGoodsOtherInfo()
      this.setCartCount()
      this._setEventNo()
      this._getBuyUsers()
      this._getProduct()
      this._getRunTime()
      this.$$shareHandler({
        event: EVENT_CODE.GOODS_DETAIL,
        activityId: this.activityId,
        goodsId: this.goodsId
      })
      this.isFirstLoad = false
      const _track = this.activityType === ACTIVE_TYPE.DEFAULT ? 'product' : 'activity'
      this.$$sendEvent({ goodsId: this.goodsId, activityId: this.activityId, _track })
    },
    onHide() {
      // this._clearTimer()
      clearInterval(this._allActiveTimer)
      clearInterval(this._groupTimer)
      this.autoplayTimer && clearTimeout(this.autoplayTimer)
    },
    onReady() {
      let res = this.$wx.getSystemInfoSync()
      this.statusBarHeight = res.statusBarHeight || 20
    },
    onUnload() {
      clearInterval(this._allActiveTimer)
      clearInterval(this._groupTimer)
      this.autoplayTimer && clearTimeout(this.autoplayTimer)
      this.$refs.navigationBar && this.$refs.navigationBar._initHeadStyle()
      this.eventCount = 0
      this.$refs.shareList && this.$refs.shareList.hideLink()
      this._isSharing = false
    },
    onShareAppMessage() {
      // 分享锁
      this._isSharing = true
      const self = this
      const shopId = wx.getStorageSync('shopId')
      const flag = Date.now()
      self.$sendMsg({
        event_no: 1004,
        goods_id: self.goodsId,
        title: self.goodsMsg.name
      })
      return {
        title: this.goodsMsg.name,
        path: `${this.$routes.main.PACKAGE}/${PAGE_ROUTE_NAME}?id=${this.goodsId}&shopId=${shopId}&activityId=${this.activityId}&activityType=${this.activityType}&flag=${flag}`, // 商品详情
        imageUrl: this.thumb_image || this.goodsMsg.goods_cover_image,
        success: (res) => {
          // 转发成功
        },
        fail: (res) => {
          // 转发失败
        }
      }
    },
    methods: {
      ...orderMethods,
      ...cartMethods,
      scrollingShowTitle(flag) {
        if (!this.videoPlaying) {
          return
        }
        this.arrowUrl = ARROW_URL[flag ? 1 : 0]
      },
      checkSystem() {
        let res = wx.getSystemInfoSync()
        let system = res.system
        this.isIos = /Ios/i.test(system)
      },
      _getRunTime() {
        API.Global.getRunTime().then(res => {
          this.runTime = res.data.run_time
        })
      },
      _getProduct() {
        const shopId = wx.getStorageSync('shopId')
        const miniPath = `${this.$routes.main.PACKAGE}/${PAGE_ROUTE_NAME}?id=${this.goodsId}&shopId=${shopId}&activityId=${this.activityId}&activityType=${this.activityType}`
        API.Global.getProduct({ goods_id: this.goodsId }).then(res => {
          // console.warn(res.data)
          if (res.data) {
            let product = Object.assign({}, res.data, { src_mini_program_path: miniPath })
            product.src_wxapp_path && delete product.src_wxapp_path
            this.product = product
          }
        })
      },
      _getFinishGroupList() {
        if (this.activityType !== ACTIVE_TYPE.GROUP_ON) return
        let data = {
          activity_id: this.goodsMsg.activity_id,
          goods_id: this.goodsMsg.goods_id,
          page: 1,
          limit: 20
        }
        API.Global.getFinishGroupList(data).then(res => {
          this.buyUsers = res.data.map(item => {
            let nickName = item.nickname || ''
            return {
              avatar: item.avatar,
              text: `${nickName.substring(0, 6) + (nickName.length > 6 ? '...' : '')}拼单成功`
            }
          })
        })
      },
      async _checkAbleCreateGroup(groupId = 0, num = 1) {
        try {
          let data = {
            activity_id: this.goodsMsg.activity_id,
            goods_sku_id: this.goodsMsg.goods_skus[0].goods_sku_id,
            groupon_id: groupId,
            num,
            longitude: this.longitude,
            latitude: this.latitude
          }
          const res = await API.Global.checkAbleCreateGroup(data)
          if (res.error === this.$ERR_OK) {
            return true
          } else {
            this.$wechat.showToast(res.message)
          }
          return true
        } catch (e) {
          e && this.$wechat.showToast(e.message)
          console.warn(e)
        }
      },
      // 关闭
      handleHideAddNumber() {
        setTimeout(() => {
          this.joinGroupId = undefined
        }, 1000)
        this.autoplay = true
      },
      async jumpToCollage(item) {
        if (this.tipTop) {
          this.$wechat.showToast(this.tipTop)
          return
        }
        let flag = await this._checkAbleCreateGroup(item.grouon_id)
        if (flag) {
          this.instantlyBuy()
          this.joinGroupId = item.grouon_id
          this.autoplay = false
        }
      },
      _getUnGroupList() {
        if (this.activityType !== ACTIVE_TYPE.GROUP_ON) return
        let data = {
          activity_id: this.goodsMsg.activity_id,
          goods_id: this.goodsMsg.goods_id,
          page: 1,
          limit: 10
        }
        API.Global.getUnGroupList(data).then(res => {
          this.collageList = res.data
          this.collageTotal = res.meta.total
          this._groupRunTime()
        })
      },
      _groupRunTime(arr) {
        this.collageList.forEach(item => {
          item.diff = countDownHandle(item.surplus_seconds)
        })
        clearInterval(this._groupTimer)
        this._groupTimer = setInterval(() => {
          if (this.collageList.length <= 0) {
            clearInterval(this._groupTimer)
            return
          }
          this.collageList.forEach(item => {
            if (item.surplus_seconds <= 0) {
              item.surplus_seconds = 0
              this._getUnGroupList()
              return
            }
            item.surplus_seconds--
            item.diff = countDownHandle(item.surplus_seconds)
          })
        }, 1000)
      },
      bannerChange(e) {
        if (e.mp.detail.source !== 'touch') return
        let curNum = e.target.current * 1 + !this.hasVideo
        this.changeCurrentNum(curNum)
      },
      changeCurrentNum(curNum) {
        this.autoplayTimer && clearTimeout(this.autoplayTimer)
        if (curNum !== this.currentNum) {
          this.currentNum = curNum
          if (this.hasVideo && this.videoContext) {
            this.swiperIdx = curNum
            if (curNum === 0) {
              if (!this.playBefore) {
                this.arrowUrl = ARROW_URL[0]
              }
            } else {
              this.arrowUrl = ARROW_URL[1]
              this.videoContext.pause()
              this.videoPlaying = false
            }
          }
        }
      },
      playVideo(play) {
        this.videoPlaying = play
        this.playBefore = false
        !this.videoContext && (this.videoContext = wx.createVideoContext('goodsVideo'))
        if (play) {
          this.videoContext && this.videoContext.play()
          this.arrowUrl = ARROW_URL[0]
        } else {
          this.videoContext && this.videoContext.pause()
          this.arrowUrl = ARROW_URL[1]
        }
      },
      videoWaiting() {
        this.videoLoading = true
      },
      videoLoaded() {
        this.videoLoading = false
      },
      videoEnd() {
        this.videoPlaying = false
        this.videoContext.exitFullScreen()
      },
      // 画商品海报
      _actionDrawPoster() {
        if (!this.shareImg) {
          this.$wechat.showToast('图片生成失败，请重新尝试！')
          this.getQrCode()
          return
        }
        this.action()
        this.handleHideSharePanel()
        this.$sendMsg({ event_no: 1005, goods_id: this.goodsId, title: this.goodsMsg.name })
      },
      // 添加购物车
      async addShoppingCart() {
        let isLogin = await this.$isLogin()
        if (!isLogin) {
          return
        }
        let goodsId = this.goodsMsg.goods_skus[0].goods_sku_id
        let params = { goods_sku_id: goodsId, activity_id: this.activityId }
        // 文章进入详情 加购 埋点
        if (this.articleId) {
          params = { ...params, scenes: 'article', scenes_data: this.articleId }
        }
        API.Choiceness.addShopCart(params).then((res) => {
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
            wx.switchTab({ url: `${this.$routes.main.CHOICENESS}` })
            break
          case 1:
            // this.$refs.groupList.showLink()
            break
          case 2:
            if (this.$isLogin()) {
              wx.switchTab({ url: `${this.$routes.main.SHOPPING_CART}` })
            }
            break
        }
      },
      // 购买记录导航
      buyRecordNavTo() {
        const url = `${this.$routes.main.GOODS_RECORD}?goodsId=${this.goodsId}&shopId=${this.shopId}&activityId=${this.activityId}&activityType=${this.activityType}`
        wx.navigateTo({ url })
      },
      // 设置群数据事件号
      _setEventNo() {
        let entryAppType = wx.getStorageSync('entryAppType')
        this.eventNo = EVENT_NO_CONFIG[entryAppType]
      },
      _checkIsNewClient() {
        if (this.activityType !== ACTIVE_TYPE.NEW_CLIENT) {
          return
        }
        API.Global.checkIsNewCustomer().then(res => {
          this.isShowOldCustomerButton = res.data.is_new_client === 0 // 老人0 新人1
        })
      },
      // addNumber控件确定按钮
      async comfirmNumer(number, type) {
        let goodsList = this.goodsMsg.goods_skus[0]
        goodsList.sku_id = goodsList.goods_sku_id
        goodsList.num = number
        goodsList.goods_units = this.goodsMsg.goods_units
        let price = goodsList.trade_price
        if (this.activityType === ACTIVE_TYPE.NEW_CLIENT) {
          try {
            let res = await API.Global.checkIsNewCustomer()
            if (res.data.is_new_client === 0) {
              price = this.goodsMsg.goods_sale_price
              goodsList.trade_price = price
            }
          } catch (e) {
            console.warn(e)
          }
        }
        if (this.activityType === ACTIVE_TYPE.GROUP_ON) {
          if (type) {
            price = this.goodsMsg.goods_sale_price
            goodsList.trade_price = price
            goodsList.activity_id = 0
          } else {
            let flag = await this._checkAbleCreateGroup(this.joinGroupId || 0, number)
            if (!flag) return
            goodsList.url = `${this.$routes.main.COLLAGE_DETAIL}`
            goodsList.source = 'c_groupon'
            goodsList.groupon_id = this.joinGroupId || 0
            goodsList.latitude = this.latitude
            goodsList.longitude = this.longitude
          }
        }
        goodsList.day_of_week = this.goodsMsg.day_of_week
        goodsList.delivery_at = this.goodsMsg.delivery_at
        goodsList.delivery_timestamp = this.goodsMsg.delivery_timestamp
        const total = (price * number).toFixed(2)
        goodsList.activity = this.goodsMsg.activity
        let orderInfo = {
          goodsList: new Array(goodsList),
          total: total,
          deliverAt: this.deliverAt
        }
        this.setOrderInfo(orderInfo)
        let url = `${this.$routes.main.SUBMIT_ORDER}`
        // 通过文章进来直接购买
        if (this.articleId) {
          this.setArticleId(this.articleId)
        }
        wx.navigateTo({ url })
      },
      // 获取用户的购买信息
      getGoodsOtherInfo() {
        API.Choiceness.getGoodsBuyInfo(this.goodsId, { activity_id: this.activityId }).then((res) => {
          if (res.error === this.$ERR_OK) {
            this.buyGoodsInfo = res.data
          } else {
            this.$wechat.showToast(res.message)
          }
        })
      },
      // 执行购买
      async instantlyBuy(type) {
        let isLogin = await this.$isLogin()
        if (!isLogin) {
          return
        }
        // ald && ald.aldstat.sendEvent('立即购买')
        Ald.sendEvent('立即购买')
        // 团购单买
        if (type === 'goods_sale_price') {
          this._showAddNumber(type)
          return
        }
        // 显示抢购限购数量
        if (this.buyGoodsInfo.person_all_buy_limit * 1 !== -1 && this.buyGoodsInfo.person_all_buy_count >= this.buyGoodsInfo.person_all_buy_limit) {
          this.$wechat.showToast(`该商品限购${this.buyGoodsInfo.person_all_buy_limit}件，您不能再购买了`)
          return
        }
        if (this.buyGoodsInfo.person_day_buy_limit * 1 === -1) {
          this._showAddNumber(type)
          return
        }
        if (this.buyGoodsInfo.person_day_buy_count >= this.buyGoodsInfo.person_day_buy_limit) {
          this.$wechat.showToast(`该商品限购${this.buyGoodsInfo.person_day_buy_limit}件，您不能再购买了`)
        } else {
          this._showAddNumber(type)
        }
      },
      // 显示添加数量控件
      _showAddNumber(type) {
        this.$refs.addNumber && this.$refs.addNumber.showLink(type)
      },
      // 显示分享控件
      handleShowShare() {
        // if (this.activityType !== ACTIVE_TYPE.DEFAULT) {
        //   return
        // }
        // this.$refs.shareList && this.$refs.shareList.showLink()
        this.showSharePanel = true
      },
      handleHideSharePanel() {
        this.showSharePanel = false
      },
      // 获取站点购买的用户
      getUserImgList() {
        API.GoodsRecord.getList({ goods_id: this.goodsId, limit: 5, page: 1, is_remove_duplicate: 1 }, false).then((res) => {
          this.userImgList = res.data
          this.userTotal = res.not_duplicate_total || 0
        })
      },
      // 获取二维码
      getQrCode(loading) {
        let shopId = wx.getStorageSync('shopId')
        // 修改创建二维码的参数
        let path = `pages/${PAGE_ROUTE_NAME}?g=${this.goodsId}&s=${shopId}&a=${this.activityId}`
        API.Choiceness.createQrCodeApi({ path }, loading).then((res) => {
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
      _initPageParams() {
        let options = this._$$initOptions()
        this.goodsId = +options.id || +options.goodsId || 0
        this.activityId = +options.activityId || 0
        this.shopId = +options.shopId || 0
        // 文章进入详情 带参数
        this.articleId = options.articleId || 0
        if (options.scene) {
          let { shopId, activityId, goodsId } = resolveQueryScene(options.scene)
          this.goodsId = goodsId
          this.activityId = activityId
          this.shopId = shopId
        }
        try {
          this.shopId && wx.setStorageSync('shopId', this.shopId)
        } catch (e) {
        }
        this._initPageType(options.activityType)
      },
      _initPageType(type = 'DEFAULT') {
        if (type === ACTIVE_TYPE.GUESS) {
          type = ACTIVE_TYPE.DEFAULT
        } else if ((this.activityId > 0 && type === ACTIVE_TYPE.DEFAULT) || type === ACTIVE_TYPE.FLASH) {
          type = ACTIVE_TYPE.FLASH
        }
        this.activityType = type || ACTIVE_TYPE.DEFAULT
      },
      // 获取购买者的用户信息
      _getBuyUsers() {
        if (this.activityType === ACTIVE_TYPE.GROUP_ON) return
        API.Choiceness.getUserImg({ limit: 20 }).then((res) => {
          if (res.error !== this.$ERR_OK) {
            this.$wechat.showToast(res.message)
            return
          }
          this.buyUsers = res.data.map(item => {
            return {
              avatar: item.head_image_url,
              text: `买了${item.goods_name}`
            }
          })
        })
      },
      // TODO
      // _initActiveType() {
      //   if (this.activityId > 0) {
      //     this.activityType = this.goodsMsg.activity.activityType
      //   } else {
      //     this.activityType = 'DEFAULT'
      //   }
      // },
      // 获取商品详情
      _getGoodsDetailData() {
        let data = {
          activity_id: this.activityId
        }
        API.Choiceness.getGoodsDetail(this.goodsId, data, this.isFirstLoad).then((res) => {
          this.$wechat.hideLoading()
          if (res.error === this.$ERR_OK) {
            this.goodsMsg = res.data
            console.log(this.goodsMsg)
            if (this.goodsMsg.activity_theme) {
              this.activityType = this.goodsMsg.activity_theme
            }
            this.msgTitle = this.goodsMsg.name
            if (this.goodsMsg.goods_videos && this.goodsMsg.goods_videos.length) {
              this.hasVideo = true
              this.currentNum = 0// 默认为1，如果有视频设为0
              this.videoContext = wx.createVideoContext('goodsVideo')
              let that = this
              this.autoplayTimer = setTimeout(() => {
                if (!that.videoPlaying && that.playBefore && that.swiperIdx === 0) {
                  that.playVideo && that.playVideo(true)
                }
              }, 2000)
              if (!this.isIos) {
                this.videoPoster = this.goodsMsg.goods_videos[0].full_cover_url
              }
            }
            // this.$refs.navigationBar && this.$refs.navigationBar.setTranslucentTitle(this.goodsMsg.name)
            this._sendGoodsMsg()
            this._flashAction()
            this._getUnGroupList()
            this._getFinishGroupList()
            // this._initActiveType()
          } else {
            this.$wechat.showToast(res.message)
          }
        }).catch(e => {
          console.warn(e)
        })
      },
      // 限时抢购倒计时开始
      _flashAction() {
        if (this.activityType === ACTIVE_TYPE.DEFAULT) return
        if (this.activeStatus === BTN_STATUS.DOWN) {
          return
        }
        let diff = this.goodsMsg.at_diff || 0
        clearInterval(this._allActiveTimer)
        this.activityTime = countDownHandle(diff)
        this._allActiveTimer = setInterval(() => {
          diff--
          if (diff < 0) {
            diff = 0
          }
          this.activityTime = countDownHandle(diff)
          if (this.activityTime.differ <= 0) {
            clearInterval(this._allActiveTimer)
            this.kanTimeEnd()
          }
        }, 1000)
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
      },
      async action() {
        let name = this.goodsMsg.name.length >= 12 ? this.goodsMsg.name.slice(0, 12) + '...' : this.goodsMsg.name
        let subName = this.goodsMsg.describe.length >= 12 ? this.goodsMsg.describe.slice(0, 12) + '...' : this.goodsMsg.describe
        let qrCodeIsBase64 = /base64/i.test(this.shareImg)
        try {
          if (qrCodeIsBase64) {
            this.shareImg = await base64src(this.shareImg)
          }
        } catch (e) {
          console.error(e)
        }
        let backGroundImg
        let moneyColor
        switch (this.corpName) {
          case 'platform':
            backGroundImg = this.imageUrl + '/yx-image/choiceness/pic-sharegoods@2x.png'
            moneyColor = '#FF8300'
            break
          case 'retuan':
            backGroundImg = this.imageUrl + '/yx-image/retuan/pic-sharegoods@2x.png'
            moneyColor = '#FC4D1A'
            break
          default:
            break
        }
        let options = {
          canvasId: 'we-paint',
          multiple: 1,
          panel: {
            el: '#share-goods'
          },
          els: [
            {
              el: '#share-goods',
              drawType: 'rect',
              color: '#fff'
            },
            {
              el: '#share-goods > .share-bg', // 背景图
              drawType: 'img',
              mode: 'aspectFill',
              source: backGroundImg
            },
            {
              el: '.share-box',
              drawType: 'rect-shadow',
              color: '#fff',
              shadow: [0, 2, 22, 'rgba(0,0,0,0.10)', '#fff', 0]
            },
            {
              el: '.share-box > .share-img', // 图片
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
              source: this.iconText,
              fontSize: 14,
              color: moneyColor
            },
            {
              el: '.share-price-number',
              drawType: 'text',
              source: this.goodsMsg.trade_price,
              fontSize: 30,
              color: moneyColor
            },
            {
              el: '.share-price-icon',
              drawType: 'text',
              source: '元',
              fontSize: 17,
              color: moneyColor
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
              el: '.share-bottom > .wem-img',
              drawType: 'img',
              source: this.shareImg,
              unLoad: /tmp/i.test(this.shareImg)
              // source: qrCode
            }
          ]
        }
        this.$refs.wePaint && this.$refs.wePaint.action(options, false)
      },
      _drawPosterDone(pic) {
        this.pic = pic
        // 保存到本地，并预览
        this.$wx.saveImageToPhotosAlbum({
          filePath: pic,
          success: () => {
          },
          fail: () => {
            // 拒绝授权重新调起授权
            this.$wx.openSetting()
          }
        })
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@designCommon"

  button
    reset-button()

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
        bottom: 0
        transition: opacity 0.3s
  // 分享模块
  .share-panel-wrapper
    .share-mask
      position: fixed
      left: 0
      top: 0
      bottom: 0
      right: 0
      z-index: 999
      background: rgba(17, 17, 17, 0.7)
    .share-panel
      position: fixed
      bottom: -130%
      left: 0
      background: #fff
      width: 100%
      z-index:9999
      transition: all .5s
      &.show
        bottom :0
      .header
        padding :0 12px
        height :45px
        background: #F7F7F7
        font-family: $font-family-regular
        font-size: 15px;
        color: #1D2023;
        letter-spacing: 1.36px
        display :flex
        justify-content :space-between
        align-items :center
        .close-icon
          width :13px
          height :@width
      .container
        background :$color-white
        display :flex
        padding :29px 0 70px
        .container-item-wrapper
          flex: 1
          position :relative
          .tip-wrapper
            position absolute
            top:83px
            left: 50%
            transform :translateX(-20%)
            width :234.5px
            height :24px
            opacity: 0.7;
            font-size: 12px
            color: $color-text-sub
            text-align: center
            line-height: @height
            background: #F5F5F5;
            border-radius: @height
            .triangle
              position :absolute
              top:-13px
              left:40px
              width :0
              height :0
              border:7px solid #F5F5F5;
              border-top-color: transparent
              border-left-color :transparent
              border-right-color: transparent
          .line
            position :absolute
            width :1px
            height :40px
            left :0
            top:4px
            transform :scaleX(0.5)
            background: #E6E6E6
          .item-icon
            width :40px
            height :@width
            display :block
            margin :0 auto 10px
          .text
            font-family: $font-family-regular
            font-size: 14px
            color: $color-text-sub
            text-align: center
            &.button
              position :relative
              top:3px
  // 购买记录
  .buy-users
    width :35vw
    height: 24px
    padding: 0 9.5px 0 3px
    background: rgba(17,17,17,0.6)
    border-radius: 36px
    position :absolute
    left :8px
    z-index :80
    overflow :hidden
    .place-holder
      fill-box(absolute)
      z-index :3
    .carousel
      height :100%
      width :100%
      .content-wrapper
        layout(row)
        align-items: center
        .avatar-wrapper
          width: 20px
          height: 20px
          border-radius: 50%
          overflow: hidden
          margin :0 6px 0 0
          .img
            width: 100%
            height: 100%
        .text
          flex: 1
          font-family: $font-family-regular
          font-size: 12px
          color: #fff
          no-wrap()
  // 参团列表
  .collage-box
    padding: 0 10px
    background: $color-white
    border-radius: 8px
    box-sizing: border-box
    margin: 0 12px 10px
    box-shadow: 0 2px 15px 0 rgba(17, 17, 17, 0.06)
    .group-rule-wrapper
      height :45px
      layout(row,block,nowrap)
      overflow :hidden
      align-items :center
      font-family: $font-family-regular
      font-size: 3.5vw
      color: #1D2023;
      &.active
        border-top-1px(#ECEDF1)
      .number
        font-family :$font-family-din-bold
      .icon-arrow
        width :4.5px
        height :7.5px
        margin :0 4vw
    .title
      padding :17px 0 6px
      color: #1D2023
      font-size: $font-size-15
      font-family: $font-family-medium
    .collage-scroll
      height: 128px
      padding: 4px 0
      overflow: hidden
      &.single
        height :64px
      .nothing
        text-align: center
        padding-top: 40px
        font-family: $font-family-regular
        font-size: $font-size-16
    .collage-content
      display: flex
      align-items: center
      justify-content: space-between
      height :100%
      .left
        flex: 1
        overflow :hidden
        display: flex
        align-items: center
      .logo
        width: 40px
        height: @width
        border-radius: 50%
      .name
        flex: 1
        white-space: nowrap
        overflow :hidden
        text-overflow :ellipsis
        font-family: $font-family-regular
        font-size: $font-size-14
        color: #1D2023
        margin:0 10px
      .right
        display: flex
        align-itmes: center
      .context
        width :80px
        font-size: $font-size-12
        color: #1D2023
        font-family: $font-family-regular
        .text
          letter-spacing: 0
          .color
            padding :0 3px
            color: #FA7500
        .time
          margin-top: 5px
      .go-collage
        reset-button()
        width: 75px
        height: 30px
        font-family: $font-family-regular
        font-size: $font-size-14
        margin-left: 7px
        line-height: 30px
        text-align: center
        border-radius: 30px
        color: $color-white
        background: $color-main
  // header-detail
  .header-detail
    padding: 0 12px
    box-sizing: border-box
    position: relative
    margin-bottom :10px

    .share-wrapper
      position: absolute
      right: 30px
      top: 21px
      z-index: 99

      .share-img
        width: 36px
        height: @width
        display: block

      .share-text
        padding-top: 6px
        text-align: center
        font-family: $font-family-regular
        font-size: 11px;
        color: #342903;

    .info-box
      background: $color-white
      width: 100%
      padding: 10px 10px 15px
      box-sizing: border-box
      border-radius : 0 0 8px 8px

      .title-wrapper
        position: relative

        .share-wrapper
          col-center()
          right: 18px

          .share-img
            width: 36px
            height: @width
            display: block

          .share-text
            padding-top: 6px
            text-align: center
            font-family: $font-family-regular
            font-size: 11px;
            color: #342903;

        .title
          width: 71vw
          font-size: $font-size-17
          color: #1F1F1F
          min-height: 20px
          line-height: $font-size-20
          font-family: $font-family-medium
          no-wrap-plus()

        .has-title
          width: 71vw
          no-wrap-plus()

        .has-sub-title
          width: 71vw
          margin-top: 7px
          font-family: $font-family-regular
          font-size: $font-size-14
          color: #808080
          letter-spacing: 0.3px
          word-break: break-word

      .info-sub
        layout(row)
        align-items: center
        margin: 10px 0 10px

        .info-sub-img
          width: 14.5px
          height: 15.5px
          display: block
          margin-right: 5px

        .sub-text
          color: #9B9B9B
          font-size: $font-size-14
          font-family: $font-family-regular
        .sub-text-color
          color: #ff8311

    .info-stock
      font-size: $font-size-14
      color: #9e9e9e
      font-family: $font-family-regular

  // banner图
  .header-swiper
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
          position: absolute
          left: 0
          top: 0
        .video-img
          transition: all 0.3s
          &.hide
            opacity: 0
            z-index: -1
        .play-btn
          width: 100%
          height: 70%
          position: absolute
          left: 0
          top: 15%
          z-index: 9
          layout()
          justify-content: center
          align-items: center
          .play-btn-icon
            width: 50px
            height: @width
        .item-img-one
          z-index: 1
        .item-img-two
          z-index: 2
        .play
          all-center()
          height: 63px
          width: 63px
    .banner-number
      box-sizing: border-box
      width: 100%
      padding: 0 12px
      position: absolute
      bottom: px-change-vw(60.5)
      left: 0
      layout(row)
      align-items: center
      justify-content: space-between
      .banner-number-box
        display: inline-block
        font-size: $font-size-11
        background: rgba(17,17,17,0.2)
        color: $color-white
        box-sizing: border-box
        padding: 2px 8px
        border-radius: 20px
        opacity: .75
        transition: all 0.3s
        &.banner-btn
          min-width: 48px
          padding: 3px 8px
          margin: 0 5px
          background: $color-white
          font-size: $font-size-10
          color: $color-text-main
          font-family: $font-family-regular
          text-align: center
          opacity: .75
          &.active
            background: linear-gradient(90deg, #FD4C46 0%, #FB6C21 73%)
            color: $color-white
            opacity: 1
          .banner-btn-icon
            width: 7px
            height: 7.5px

  // 画图
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
  .title-label
    font-size: $font-size-12
    font-family: $font-family-medium
    display: inline-block
    border-radius: 9.5px
    width: 38px
    height: 19px
    text-align: center
    line-height: 20px
    color: #fff
    background-image: linear-gradient(131deg, #FF7900 0%, #FF4400 100%)
    margin-right: 5px
    position: relative
    top: -2px
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
      .icon-wrapper
        col-center()
        right:15px
        width :61px
        height :19px
        border :0.5px solid $color-white
        layout(row,block,nowrap)
        border-radius :2px
        overflow :hidden
        .right
          padding-left :4px
          font-family: $font-family-medium
          font-size: 13px;
          color: #FFFFFF;
        .left
          width :19px
          height :@width
          background :$color-white
          display :flex
          justify-content :center
          align-items :center
          .left-icon
            display :block
            width :11px
            height :10.5px
      &.active-common
        height: 13vw
        width: 100%
        border-top-left-radius: 8px
        border-top-right-radius: 8px
        overflow :hidden
      &.group
        position :relative
      .banner-title-main
        padding-bottom: 13vw
        width: 100%
        position: relative
        .group-icon-wrapper
          width :53px
          height :20px
          border :1px solid $color-white
          layout(row,block,nowrap)
          border-radius :2px
          overflow :hidden
          margin-right :7px
          position relative
          top :2px
          font-family: $font-family-medium
          font-size: 13px;
          color: #FFFFFF
          .right
            padding-left :4px
          .left
            width :20px
            height :@width
            background :$color-white
            display :flex
            justify-content :center
            align-items :center
            color:#FD4E44
            font-size :15px
        .banner-title-bg
          position: absolute
          left: 0
          bottom: 0
          width: 100%
          height: 100%
          border-top-left-radius: 8px
          border-top-right-radius: 8px
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
            flex: 1
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
              position :relative
              top:1px
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
                &.group
                  color: #FF4343
            .line-price-box
              font-size: $font-size-12
              font-family: $font-family-regular
              text-decoration: line-through
              line-height: 1
              color: #fff
              margin-top: 2px
              &.group
                position :relative
                top:-1px
                opacity :0.8
          .banner-main-right
            text-align: center
            position :relative
            left :5px
            .time-text
              font-size: $font-size-13
              color: $color-text-main
              font-family: $font-family-regular
              line-height:15px
            .time-all-box
              padding-top :1px
              font-size: $font-size-14
              color: $color-text-main
              font-family: $font-family-medium
              line-height:15px
              width :65px
</style>
