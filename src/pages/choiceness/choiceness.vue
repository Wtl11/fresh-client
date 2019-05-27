<template>
  <form report-submit
        @submit="$getFormId"
  >
  <div class="choiceness">
    <navigation-bar
      ref="navigationBar"
      :title="title"
      :showArrow="false"
      :titleMaxLen="12"
      :translucent="fasle"
    ></navigation-bar>
    <article class="container">
      <div class="home-position" id="homePosition">
        <div class="community-main" @click="handleChangeCommunity">
          <img v-if="imageUrl" :src="imageUrl+'/yx-image/2.1/icon-address_sy@2x.png'" alt="" class="community-img">
          <p class="community-text">{{communityName}}</p>
          <img class="more-img" mode="aspectFit" v-if="imageUrl" :src="imageUrl+'/yx-image/2.1/icon-pressed_qhztd@2x.png'">
        </div>
        <section class="search-wrapper" @click="handleSearchGoods">
          <img class="s-img" mode="aspectFit" v-if="imageUrl" :src="imageUrl+'/yx-image/2.3/icon-search@2x.png'">
          <p>搜索商品</p>
        </section>
      </div>
      <block
        v-for="(moduleItem, moduleIndex) in moduleArray"
        :key="moduleIndex"
      >
<!--        轮播图-->
        <section
          v-if="moduleItem.module_name === 'bannar' && moduleItem.is_close === 0"
          id="banner"
          class="item-wrapper banner module-item">
          <article v-if="moduleItem.list && moduleItem.list.length" class="home-banner">
            <swiper
              class="banner"
              autoplay
              interval="5000"
              display-multiple-items="1"
              previous-margin="0px"
              next-margin="0px"
              circular
              @change="handleSetBannerIndex">
              <block
                v-for="(item,index) in moduleItem.list"
                :key="item.id"
              >
                <swiper-item
                  class="banner-item"
                >
                  <img
                    class="item-img"
                    lazy-load
                    mode="aspectFill"
                    v-if="item.image_url"
                    :src="item.image_url"
                    @click="handleBannerJump(item)"
                  >
                </swiper-item>
              </block>
            </swiper>
            <ul class="dot-wrapper">
              <li class="background">
                <img
                  lazy-load
                  class="img"
                  mode="aspectFill"
                  v-if="imageUrl"
                  :src="imageUrl + '/yx-image/2.3/pic-switch@2x.png'"
                >
              </li>
              <li class="dot">{{bannerIndex}}</li>
              <li class="dot-line">/</li>
              <li class="dot right">{{moduleItem.list.length || 0}}</li>
            </ul>
          </article>
        </section>
<!--        限时抢购-->
        <section
          v-if="moduleItem.module_name === 'activity' && isShowFlash"
          class="item-wrapper module-item"
          id="flashSale"
        >
          <div class="home-flash-sale">
            <section class="top-wrapper">
              <img lazy-load
                   class="title-img"
                   mode="aspectFill"
                   v-if="imageUrl"
                   :src="imageUrl + '/yx-image/2.3/pic-qgtitle@2x.png'"
              >
              <ul class="tab-wrapper">
                <li v-if="index < 2"
                  v-for="(item, index) in flashTabInfo"
                  :key="index"
                  class="tab-item-wrapper"
                  :class="{active: flashTabIndex === index}"
                  @click="handleFlashTabChange(item, index)"
                >
                  <p class="time">{{item.at}}</p>
                  <p class="explain">{{item.at_str}}</p>
                </li>
              </ul>
              <div class="more-wrapper"
                @click="handleJumpToFlashList(moduleItem.id)"
              >
                <p class="more-text">更多</p>
                <img lazy-load
                  class="more-img"
                  mode="aspectFill"
                  v-if="imageUrl"
                  :src="imageUrl + '/yx-image/2.3/icon-pressed@2x.png'"
                >
              </div>
            </section>
            <section class="scroll-wrapper">
              <scroll-view class="bottom-wrapper"
                scroll-x
                :scroll-into-view="flashViewToChild"
                scroll-with-animation
              >
                <div v-for="(child, idx) in flashArray"
                  class="bottom-item-wrapper"
                  :class="flashArray.length <= 4 && idx === flashArray.length -1?'pad-right-place':''"
                  :key="child.goods_sku_id"
                  :id="'child'+idx"
                >
<!--                  flash-item-->
                  <article class="home-flash-item" @click="handleJumpToGoodsDetail(child, ACTIVE_TYPE.FLASH)">
                    <figure class="goods-wrapper">
                      <img
                        class="img-goods"
                        lazy-load
                        mode="aspectFill"
                        v-if="child.goods_cover_image"
                        :src="child.goods_cover_image"
                      >
                      <img class="img-label"
                           lazy-load
                           mode="aspectFit"
                           v-if="imageUrl"
                           :src="imageUrl + '/yx-image/2.3/pic-label_qg@2x.png'"
                      >
                    </figure>
                    <section class="bottom-wrapper">
                      <p class="title">{{child.name}}</p>
                      <div class="price-wrapper">
                        <p class="number">{{child.tradePrice && child.tradePrice.int}}</p>
                        <p class="dec">{{child.tradePrice && child.tradePrice.dec}}</p>
                        <p class="unit">元</p>
                        <p class="origin-price">{{child.original_price}}元</p>
                      </div>
                    </section>
                  </article>
                  <section v-if="flashArray.length > 4 && idx === flashArray.length -1"
                           class="look-more-wrapper"
                           @click="handleJumpToFlashList(moduleItem.id)"
                  >
                    <div class="text">查看更多</div>
                    <img class="more-icon"
                         lazy-load
                         mode="aspectFill"
                         v-if="imageUrl"
                         :src="imageUrl + '/yx-image/2.1/icon-pressed_gd@2x.png'"
                    >
                  </section>
                </div>
              </scroll-view>
            </section>
          </div>
        </section>
<!--        通知-->
        <article v-if="moduleIndex === 0 && notifyInfo.has_notify && notifyInfo.desc"
                 class="notice"
                 id="notice"
        >
          <img
            v-if="imageUrl"
            :src="imageUrl + '/yx-image/notice/pic-notice@2x.png'"
            class="notice-img">
          <div class="notice-msg">
            <div class="notice-content">
              <block v-for="(child, idx) in 2" :key="idx">
                <div
                  v-for="(item, index) in notifyInfo.desc"
                  :key="index"
                  class="notice-msg-item"
                >{{item}}</div>
              </block>
            </div>
          </div>
          <span class="notice-line">|</span>
          <navigator
            url="/pages/notice"
            class="notice-look"
            hover-class="none"
          >查看</navigator>
        </article>
<!--        icon 分类-->
        <ul v-if="moduleIndex === 0"
            class="server-icon-wrapper"
            id="server-icon-wrapper"
        >
          <li v-for="(item, index) in serverList" :key="index" class="server-item-wrapper">
            <img v-if="imageUrl" :src="imageUrl + item.icon" alt="" class="icon-server">
            <p class="title">{{item.text}}</p>
          </li>
        </ul>
        <!--        分类列表-->
        <ul v-if="moduleItem.module_name === 'goods_cate'"
            class="classify-wrapper"
            id="classify-wrapper"
        >
          <li v-if="index < 10" v-for="(item, index) in moduleItem.list" :key="item.id"
              class="classify-item-wrapper"
              :class="{'m-top': index > 4}"
              @click="handleJumpToClassify(item)"
          >
            <img  class="logo" :src="item.image_url" alt="">
            <p class="title">{{item.name}}</p>
          </li>
        </ul>
<!--        活动模块-->
        <article v-if="moduleItem.module_name === 'activity'"
                 class="active-container"
        >
<!--          活动tab-->
          <section class="active-tab-wrapper"
                   id="activeTab"
                   v-if="activeTabInfo && activeTabInfo.length > 1"
          >
            <ul class="active-tab-container"
                :style="activeTabStyles"
                :class="{active: activeTabStyles}"
            >
              <li v-for="(item, index) in activeTabInfo"
                  :key="index"
                  class="active-item-wrapper"
                  :class="{active: index === activeTabIndex}"
                  @click="handleActiveTabChange(index)"
              >
                <p class="title">{{item.title}}</p>
                <p class="sub-title">{{item.subTitle}}</p>
              </li>
            </ul>
          </section>
          <div v-else style="height: 8px"></div>
<!--          平团返现等各个活动-->
          <block v-for="(item, index) in otherActiveList" :key="index">
            <section v-if="activeTabInfo[index].is_close === 0 || index === activeTabInfo.length - 1"
                     class="panel"
                     :class="{guess: index === activeTabInfo.length - 1}"
                     :id="'panel' + index"
            >
              <img
                lazy-load
                mode="widthFix"
                v-if="imageUrl && item.module_name === ACTIVE_TYPE.GROUP_ON"
                :src="imageUrl + '/yx-image/2.4/pic-ptfx@2x.png'"
                class="banner-image">
              <img
                lazy-load
                mode="widthFix"
                v-if="imageUrl && item.module_name === ACTIVE_TYPE.NEW_CLIENT"
                :src="imageUrl + '/yx-image/2.4/pic-xrth@2x.png'"
                class="banner-image">
              <img
                lazy-load
                mode="widthFix"
                v-if="imageUrl && item.module_name === ACTIVE_TYPE.GOODS_HOT_TAG"
                :src="imageUrl + '/yx-image/2.4/pic-jrbk@2x.png'"
                class="banner-image">
              <img
                lazy-load
                mode="widthFix"
                v-if="imageUrl && item.module_name === ACTIVE_TYPE.GUESS"
                :src="imageUrl + '/yx-image/2.4/pic-cnxh@2x.png'"
                class="banner-image">
              <button v-if="item.module_name !== ACTIVE_TYPE.GUESS" class="share-button" open-type="share" :id="'share-' + item.module_name"></button>
              <block v-for="(child, idx) in item.list" :key="idx">
                <div class="panel-goods-wrapper"
                     @click="handleJumpToGoodsDetail(child, item.module_name)"
                >
                  <div class="goods-item">
                    <figure class="left">
                      <img mode="aspectFill"
                           lazy-load
                           v-if="child.goods_cover_image"
                           :src="child.goods_cover_image" alt="" class="good-image">
                      <img
                        lazy-load
                        v-if="imageUrl"
                        :src="imageUrl + '/yx-image/2.4/icon-label@2x.png'"
                        class="label-icon">
                    </figure>
                    <article class="right">
                      <p class="title">{{child.name}}</p>
                      <p class="sub-title">{{child.describe}}</p>
                      <span class="active-icon">{{item.iconText}}</span>
                      <div class="money-wrapper">
                        <p class="m-int">{{child.tradePrice && child.tradePrice.int}}</p>
                        <p class="m-float">{{child.tradePrice && child.tradePrice.dec}}</p>
                        <p class="m-unit">元</p>
                        <p class="m-origin">{{child.original_price}}元</p>
                      </div>
                      <button formType="submit"
                              class="button-wrapper"
                              @click.stop="handleGoodsButton(child, item)"
                      >
                        <div class="button" :class="{guess: item.module_name === ACTIVE_TYPE.GUESS}">
                          <p class="text">{{item.buttonText}}</p>
                        </div>
                        <p class="sub-text">已售{{child.sale_count}}{{child.goods_units}}</p>
                      </button>
                    </article>
                  </div>
                </div>
              </block>
              <article v-if="item.list.length < 1 && item.module_name !== ACTIVE_TYPE.GUESS " class="goods-empty">
                <div class="empty-wrapper">本活动暂未开始，可浏览其他活动哦！</div>
              </article>
            </section>
          </block>
          <loading-more v-if="guessHasMore"></loading-more>
          <is-end v-if="!guessHasMore"></is-end>
        </article>
      </block>

    </article>
<!--    自定义tab-->
    <custom-tab-bar currentType="index"></custom-tab-bar>
<!--    优惠券弹窗-->
    <coupon-modal ref="couponModal"></coupon-modal>
<!--    添加至我的小程序-->
    <new-guidelines ref="guidelines"></new-guidelines>
    <distance-check ref="distance"></distance-check>
  </div>
  </form>
</template>

<script type="text/ecmascript-6">
  import NavigationBar from '@components/navigation-bar/navigation-bar'
  import CustomTabBar from '@components/custom-tab-bar/custom-tab-bar'
  import API from '@api'
  import {cartMethods, jwtComputed} from '@state/helpers'
  import {resolveQueryScene, formatCouponMoney} from '@utils/common'
  import CouponModal from './coupon-modal/coupon-modal'
  import ShareHandler, {EVENT_CODE} from '@mixins/share-handler'
  import ShareTrick from '@mixins/share-trick'
  import NewGuidelines from './new-guidelines/new-guidelines'
  import DistanceCheck from './distance-check/distance-check'
  import {TAB_ARR_CONFIG} from './config'
  import {ACTIVE_TYPE} from '@utils/contants'
  import IsEnd from '@components/is-end/is-end'
  import LoadingMore from '@components/loading-more/loading-more'

  const ald = getApp()
  const PAGE_NAME = 'CHOICENESS'

  export default {
    name: PAGE_NAME,
    mixins: [
      ShareHandler,
      ShareTrick
    ],
    components: {
      NavigationBar,
      CustomTabBar,
      CouponModal,
      NewGuidelines,
      IsEnd,
      LoadingMore,
      DistanceCheck
    },
    data() {
      this._isLoading = false
      this._isHelpScroll = false
      this._sharing = false
      return {
        ACTIVE_TYPE,
        // 头部变色
        title: '赞播优鲜',
        // 团长信息
        groupInfo: {},
        // 模块数组
        moduleArray: [],
        // 轮播图
        bannerIndex: 1,
        // 通知
        notifyInfo: {},
        // 限时抢购
        // flashTabInfo: [],
        flashTabIndex: 0,
        flashArray: [],
        flashViewToChild: undefined,
        // 商品分类
        classifyArray: [],
        // 活动tab
        activeTabIndex: 0,
        activeTabInfo: [],
        activeTabStyles: '',
        // 新人列表
        newClientList: [],
        // 今日爆款列表
        todayHotList: [],
        // 团购列表
        groupList: [],
        // 猜你喜欢列表
        guessList: [],
        guessPage: 1,
        guessHasMore: true,
        // 服务icon
        serverList: [
          {
            text: '次日送达',
            icon: '/yx-image/2.4/icon-lightning@2x.png'
          },
          {
            text: '品控质检',
            icon: '/yx-image/2.4/icon-ok@2x.png'
          },
          {
            text: '100%售后服务',
            icon: '/yx-image/2.4/icon-ok@2x.png'
          },
          {
            text: '原产地直采',
            icon: '/yx-image/2.4/icon-ok@2x.png'
          }
        ],
        latitude: 0,
        longitude: 0
      }
    },
    computed: {
      ...jwtComputed,
      // 社区名称
      socialName() {
        return (this.groupInfo || {}).social_name || ''
      },
      // 社区名称-定位
      communityName() {
        let name = (!this.latitude || !this.longitude) ? '定位中...' : this.socialName
        return name.substring(0, 6) + (name.length > 6 ? '...' : '')
      },
      // 其他活动
      otherActiveList() {
        const arr = []
        this.activeTabInfo.forEach(item => {
          arr.push({
            ...item,
            list: this[item.dataArray]
          })
        })
        return arr
      },
      flashModule() {
        let flash = {}
        let module = this.moduleArray.find(val => val.module_name === 'activity') || {}
        if (module.list) {
          flash = module.list.find(val => val.module_name === 'activity_fixed') || {}
        }
        return flash
      },
      flashTabInfo() {
        return this.flashModule.list || []
      },
      isShowFlash() {
        return this.flashModule.is_close === 0 && this.flashTabInfo.length
      }
    },
    watch: {
      // 监听用户静默登录后调用
      userInfo(val = {}) {
        this._getCouponModalList(val.id)
      }
    },
    onLoad(options) {
      console.warn(options, '<==home==>')
      this.$wechat.showLoading()
      let data = wx.getStorageSync('homeData')
      if (data) {
        Object.assign(this, data)
      }
      this._initPageParams(options)
    },
    async onReady() {
      await this._initNavigationStatus()
      this.$refs.guidelines && this.$refs.guidelines.setTop(this._navigationBarHeight)
    },
    onUnload() {
      this._navigationIO && this._navigationIO.disconnect()
      this.bannerIndex = 0
      this.activeTabStyles = ''
      this.flashTabIndex = 0
      this.activeTabIndex = 0
      this.flashViewToChild = undefined
      this.guessPage = 1
      this.guessHasMore = true
      this.latitude = 0
      this.longitude = 0
      wx.setStorageSync('homeData', this.$data, {curShopId: ''})
    },
    onHide() {
    },
    onPageScroll(e) {
      // console.log(e)
      // this._helpObserver(e)
    },
    async onShow() {
      if (this._sharing) {
        this._sharing = false
        return
      }
      try {
        this.shopId = wx.getStorageSync('shopId')
        if (!this.shopId) {
          let res = await API.Choiceness.getDefaultShopInfo()
          wx.setStorageSync('shopId', res.data.id)
          this.shopId = res.data.id
        }
        // 获取团的信息
        if (this.curShopId * 1 !== this.shopId * 1) {
          this.$wechat.showLoading()
          wx.pageScrollTo({
            scrollTop: 0,
            duration: 0
          })
          this.curShopId = this.shopId
          this._resetLocation()
          this._resetBanner()
          this._resetFlash()
          this._resetGuessParams()
        }
        this._getLocation()
        this._getNotify()
        await this._getModuleInfo()
        this._initTabInfo()
        this._addMonitor()
        this._getFlashList()
        this._getTodayHostList()
        this._getNewClientList()
        this._getGroupList()
        if (!wx.getStorageSync('token')) return
        this.setCartCount()
      } catch (e) {
        console.warn(e)
      } finally {
        this._getCouponModalList() // 首页弹窗
        this.$sendMsg({event_no: 1000})
        this.$$shareHandler({event: EVENT_CODE.HOME})
        ald.aldstat.sendEvent('首页')
        this.$wechat.hideLoading()
      }
    },
    async onPullDownRefresh() {
      this._resetGuessParams()
      this._getCouponModalList()
      this._getLocation()
      this._getNotify()
      try {
        await this._getModuleInfo(false)
        this._initTabInfo()
        this._addMonitor()
        this._getFlashList()
        this._getTodayHostList()
        this._getNewClientList()
        this._getGroupList()
      } catch (e) {
        console.error(e)
      }
      wx.stopPullDownRefresh()
      if (!wx.getStorageSync('token')) return
      this.setCartCount()
    },
    onReachBottom() {
      if (this.guessHasMore) {
        this.guessPage++
        if (this.guessList.length === 0) {
          this.guessPage = 1
        }
        this._getGuessList()
      }
    },
    onShareAppMessage(res) {
      this._sharing = true
      let imgUrl = ''
      let moduleName = ''
      let title = ``
      if (res.target.id) {
        moduleName = res.target.id.replace('share-', '')
      }
      switch (moduleName) {
        case [ACTIVE_TYPE.NEW_CLIENT]:
          imgUrl = '/yx-image/2.4/pic-xrth_share@2x.png'
          title = `${this.socialName}-赞播优鲜社区团购`
          break
        case [ACTIVE_TYPE.GOODS_HOT_TAG]:
          imgUrl = '/yx-image/2.4/pic-jrbp_share@2x.png'
          title = `${this.socialName}-赞播优鲜社区团购`
          break
        case [ACTIVE_TYPE.GROUP_ON] :
          imgUrl = '/yx-image/2.4/pic-ptfx_share@2x.png'
          title = `${this.socialName}-赞播优鲜社区团购`
          break
        default:
          imgUrl = '/yx-image/choiceness/pic-zbyx@2x.png'
          title = `${this.socialName},次日达、直采直销，点击下单↓`
          break
      }
      const flag = Date.now()
      return {
        title,
        path: `/pages/choiceness?shopId=${this.shopId}&moduleName=${moduleName}&flag=${flag}`,
        imageUrl: this.imageUrl + imgUrl,
        success: (res) => {
        },
        fail: (res) => {
        }
      }
    },
    methods: {
      ...cartMethods,
      _resetLocation() {
        this.latitude = 0
        this.longitude = 0
      },
      handleJumpToClassify(item) {
        wx.navigateTo({url: `/pages/classify?id=${item.id}`})
      },
      handleGoodsButton(child = {}, item = {}) {
        if (item.module_name === ACTIVE_TYPE.GROUP_ON) {
          this.handleJumpToGoodsDetail(child, item.module_name)
        } else {
          this.addShoppingCart(child)
        }
      },
      _resetGuessParams() {
        this.guessPage = 1
        this.guessHasMore = true
        this.guessList = []
      },
      _getGuessList() {
        if (this._isLoading) return
        this._isLoading = true
        const page = this.guessPage
        API.Home.getGuessList({page, limit: 10}).then(res => {
          let arr = this._formatListPriceData(res.data)
          if (this.guessPage === 1) {
            this.guessList = arr
          } else {
            this.guessList = this.guessList.concat(arr)
          }
          this.guessHasMore = arr.length
        }).finally(() => {
          this._isLoading = false
        })
      },
      async _getGroupList() {
        try {
          let res = await API.Home.getGroupList({limit: 20})
          this.groupList = this._formatListPriceData(res.data)
        } catch (e) {
          console.warn(e)
        }
      },
      async _getTodayHostList() {
        try {
          // let res = await API.Home.getTodayHotList({limit: 20})
          // this.todayHotList = this._formatListPriceData(res.data)
        } catch (e) {
          console.warn(e)
        }
      },
      async _getNewClientList() {
        try {
          // let res = await API.Home.getNewClientList({limit: 20})
          // this.newClientList = this._formatListPriceData(res.data)
        } catch (e) {
          console.error(e)
        }
      },
      _formatListPriceData(arr = []) {
        return arr.map(item => {
          return {
            ...item,
            tradePrice: formatCouponMoney(item.trade_price)
          }
        })
      },
      // 初始化活动tab
      _initTabInfo() {
        let arr = []
        let module = this.moduleArray.find(val => val.module_name === 'activity') || {}
        if (module.list) {
          module.list.forEach(item => {
            if (item.module_name !== 'activity_fixed' && item.is_close < 1) {
              arr.push({
                ...item,
                ...TAB_ARR_CONFIG[item.module_name]
              })
            }
          })
        }
        arr.push({
          ...TAB_ARR_CONFIG[ACTIVE_TYPE.GUESS],
          module_name: ACTIVE_TYPE.GUESS
        })
        this.activeTabInfo = arr
      },
      // 添加监听
      _addMonitor() {
        setTimeout(() => {
          if (!(this.activeTabInfo && this.activeTabInfo.length > 1)) return
          if (!this._navigationBarHeight) return
          const navigationBarHeight = this._navigationBarHeight
          const top = navigationBarHeight + 59
          this._activeTab = wx.createIntersectionObserver()
          this._activeTab.relativeToViewport({top: -top})
          this._activeTab.observe('#activeTab', res => {
            let flag = res.boundingClientRect.top <= top && res.intersectionRect.top <= 0
            this.activeTabStyles = flag ? `
                position:fixed;
                top:${navigationBarHeight}px;
                left:0;
                right:0;
                background: #fff;
              ` : ''
          })
          wx.createIntersectionObserver(undefined, {observeAll: true})
            .relativeTo('.active-tab-container')
            .observe('.panel', res => {
              if (res.intersectionRatio > 0 && !this._isScrolling) {
                this._isHelpScroll = false
                this.activeTabIndex = res.id.replace('panel', '') * 1
              }
            })
          // this._initDomPosition()
        }, 500)
      },
      _helpObserver(e) {
        if (!this._isHelpScroll) return
        if (this._isScrolling) return
        const scrollTop = e.scrollTop - this._navigationBarHeight
        // if (this._isScrolling) return
        let index = this.activeTabInfo.findIndex(val => {
          if (scrollTop >= val.top && scrollTop <= val.bottom) {
            return true
          }
        })
        if (this.activeTabIndex !== index && index > -1) {
          this._isScrolling = true
          this.activeTabIndex = index
          setTimeout(() => {
            this._isScrolling = false
          }, 80)
        }
      },
      async handleActiveTabChange(index) {
        this._isHelpScroll = true
        this._isScrolling = true
        this.activeTabIndex = index
        let viewport = await new Promise((resolve, reject) => {
          wx.createSelectorQuery()
            .selectViewport()
            .scrollOffset(res => {
              resolve(res)
            }).exec()
        })
        let panel = await new Promise((resolve, reject) => {
          wx.createSelectorQuery()
            .select(`#panel${index}`)
            .boundingClientRect(res => {
              resolve(res)
            })
            .exec()
        })
        let scrollTop = viewport.scrollTop + panel.top - (this._navigationBarHeight + 59 - 5)
        wx.pageScrollTo({
          scrollTop,
          duration: Math.abs(viewport.scrollTop - scrollTop) < 600 ? 0 : 300
        })
        setTimeout(() => {
          this._isScrolling = false
        }, 400)
      },
      // 商品搜索页
      handleSearchGoods() {
        wx.navigateTo({url: `/pages/goods-search`})
      },
      // 切换社群
      handleChangeCommunity() {
        wx.navigateTo({url: `/pages/choose-pickup`})
      },
      // 初识话navigation状态
      _initNavigationStatus() {
        return new Promise((resolve, reject) => {
          this._navigationIO = wx.createIntersectionObserver()
          this._navigationIO.relativeToViewport().observe('#navigationBar', res => {
            if (!this._navigationBarHeight) {
              this._navigationBarHeight = res.intersectionRect.height || 0
            }
            let flag = res.intersectionRatio > 0
            let title = flag ? '赞播优鲜' : '赞播优鲜·' + this.socialName
            this.$refs.navigationBar && this.$refs.navigationBar.setTranslucentTitle(title)
            this.$refs.distance && this.$refs.distance.hide()
            resolve()
          })
        })
      },
      // banner页面跳转
      handleBannerJump(item) {
        let url = ''
        switch (item.type) {
          case 'mini_goods':
            url = `/pages/goods-detail?id=${item.other_id}&activityId=${item.activity_id}`
            break
          case 'goods_cate':
            url = `/pages/classify?id=${item.other_id}`
            break
          case 'mini_link':
            url = `${item.url}`
            break
          default:
            url = `/pages/out-html?url=${item.url}`
            break
        }
        wx.navigateTo({url})
      },
      // 设置banner下标
      handleSetBannerIndex(e) {
        this.bannerIndex = e.target.current + 1
      },
      // 重置banner轮播图
      _resetBanner() {
        this.moduleArray.forEach(item => {
          item.module_name === 'bannar' && (item.list = [])
        })
        this.bannerIndex = 1
      },
      // 跳转至商品详情页
      handleJumpToGoodsDetail(item, type) {
        console.log(item)
        wx.navigateTo({
          url: `/pages/goods-detail?id=${item.goods_id}&activityId=${item.activity_id}&activityType=${type}`
        })
      },
      // 跳转至限时抢购列表
      handleJumpToFlashList(id) {
        wx.navigateTo({url: `/pages/flash-sale-list?id=${id}`})
      },
      // 限时抢购tab切换
      handleFlashTabChange(item, index) {
        if (index === this.flashTabIndex) return
        this.flashTabIndex = index
        this.flashViewToChild = 'child0'
        setTimeout(() => {
          this.flashViewToChild = undefined
        }, 100)
        this._getFlashTabList()
      },
      // 重置限时活动
      _resetFlash() {
        this.flashArray = []
        this.flashTabIndex = 0
        this.flashViewToChild = undefined
      },
      // 获取限时活动列表
      async _getFlashList(module, loading) {
        if (!this.flashTabInfo[this.flashTabIndex]) return
        let data = {
          activity_id: this.flashTabInfo[this.flashTabIndex].id || 0
        }
        try {
          let res = await API.FlashSale.getFlashList(data, loading)
          this.flashArray = this._formatListPriceData(res.data)
        } catch (e) {
          console.warn(e)
        }
      },
      // 获取flashTab切换
      async _getFlashTabList(loading = false) {
        try {
          let res = await API.FlashSale.getFlashTabList('', loading)
          this.flashTabInfo = res.data || []
          await this._getFlashList()
        } catch (e) {
          console.error(e)
        }
      },
      // 添加购物车
      async addShoppingCart(item) {
        let isLogin = await this.$isLogin()
        if (!isLogin) {
          return
        }
        API.Choiceness.addShopCart({goods_sku_id: item.goods_sku_id, activity_id: item.activity_id}).then((res) => {
          if (res.error === this.$ERR_OK) {
            this.$sendMsg({
              event_no: 1007,
              goods_id: item.goods_id,
              title: item.name
            })
            this.$wechat.showToast('加入购物车成功', 1000, false)
            this.setCartCount()
          } else {
            this.$wechat.showToast(res.message, 1000, false)
          }
        })
      },
      // 获取优惠券列表
      _getCouponModalList(id) {
        if (!wx.getStorageSync('token')) return
        let customerId = id || (wx.getStorageSync('userInfo') || {}).id || 0
        API.Coupon.getModalList({customer_id: customerId}).then(res => {
          this._ref('couponModal', 'show', res.data)
        }).catch(e => {
          console.error(e)
        })
      },
      // 工具-->调用子节点的方法
      _ref(key, fn, params) {
        this.$refs[key] && this.$refs[key][fn] && this.$refs[key][fn](params)
      },
      // 获取通知
      async _getNotify() {
        try {
          const res = await API.AfterNotice.getNotify()
          // res.data.desc = '啊实打实的看撒谎大江大河的阿萨大' // todo
          // res.data.has_notify = 1 // todo
          this.notifyInfo = res.data
        } catch (e) {
          console.warn(e)
        }
      },
      // 获取地理位置
      async _getLocation() {
        // if (this.latitude && this.longitude) return
        try {
          let res = await this.$wechat.getLocation()
          this.longitude = res.longitude
          this.latitude = res.latitude
          if (!this.latitude || !this.longitude) {
            wx.navigateTo({url: `/pages/open-location`})
          } else {
            res = await API.Global.checkShopDistance({longitude: this.longitude, latitude: this.latitude})
            this.groupInfo = res.data.shop
            if (res.data.distance_judge !== 0) {
              this.$refs.distance && this.$refs.distance.setTop(this._navigationBarHeight + 30)
            }
          }
        } catch (e) {
          wx.navigateTo({url: `/pages/open-location`})
        }
      },
      // 初始化页面配置
      _initPageParams(options = {}) {
        if (options.scene) {
          let {shopId} = resolveQueryScene(options.scene)
          this.shopId = shopId
        } else {
          this.shopId = options.shopId
        }
        this.shopId && wx.setStorageSync('shopId', this.shopId)
      },
      // 获取模块信息
      async _getModuleInfo(loading) {
        try {
          let res = await API.FlashSale.getModuleInfo({page_name: 'index'}, loading)
          this.moduleArray = res.data.modules || []
        } catch (e) {
          console.error(e)
        }
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  $color-flash-background=#FFE359
  $box-radius=4px
  $flash-width=24vw
  @import "~@designCommon"

  // 图片公共样式
  .img
    width :100%
    height :100%
    display :block
    overflow :auto
  // 服务图标
  .server-icon-wrapper
    height :27px
    padding :0 20px
    display: flex
    flex-wrap :nowrap
    justify-content :space-between
    .server-item-wrapper
      display :flex
      align-self :center
      justify-content :center
      .icon-server
        width :11px
        height :@width
      .title
        margin-left :3px
        font-family:$font-family-regular
        font-size: 11px
        color: #54990F
        line-height :11px
  // 各个活动的总容器
  .active-container
    background: linear-gradient(-180deg, #FFFFFF 0%, #F7F7F7 5%);
    // 各个活动面板
    .panel
      padding :16vw 12px 0
      position :relative
      border-bottom :0px solid transparent
      min-height :45px
      &.guess
        min-height :100vw
      .share-button
        position:absolute;
        right:4vw
        top:5vw
        width:16.6vw
        height:6.7vw
      .banner-image
        position :absolute
        top:0
        left :0
        width :100vw
      .goods-empty
        position :relative
        padding-bottom :10px
        .empty-wrapper
          height :130px
          padding :0 10px
          background :$color-white
          border-radius: 4px
          display :flex
          align-items :center
          justify-content :center
          font-family :$font-family-regular
          font-size :14px
          color:$color-text-sub
      .panel-goods-wrapper
        position :relative
        padding-bottom :8px
        &:last-child
          padding-bottom :10px
        .goods-item
          height :130px
          padding :0 10px
          background :$color-white
          border-radius: 4px
          display :flex
          align-items :center
          .right
            flex: 1
            overflow :hidden
            height :100%
            box-sizing :border-box
            padding : 6px 11px 6px
            display :flex
            flex-direction :column
            font-family: $font-family-regular
            .title
              no-wrap()
              font-family: $font-family-medium
              font-size: 16px;
              color: $color-text-main
              line-height: 32px;
            .sub-title
              no-wrap()
              font-size: 14px
              color: $color-text-sub
              position :relative
              top:-2px
            .active-icon
              margin-top :15px
              align-self :flex-start
              height :16px
              background: rgba(250,117,0,0.10);
              border: 0.5px solid #FA7500
              border-radius: @height
              line-height :@height
              padding :0 6px
              font-size: 11px;
              color: #FA7500;
            .button-wrapper
              position absolute
              right :10px
              bottom :22px
              font-family: $font-family-regular
              text-align: center;
              .button
                width :75px
                height :28px
                border-radius :@height
                line-height :@height
                font-size: 14px;
                color: #FFFFFF;
                background #FA7500
                &.guess
                  background : #73C200
              .sub-text
                padding-top :4px
                font-size: 11px;
                color: $color-text-sub
            .money-wrapper
              flex: 1
              display :flex
              align-items :flex-end
              font-family: $font-family-medium
              color: #FA7500
              .m-int
                font-size :25px
              .m-float
                position :relative
                bottom :3px
                font-size :16px
              .m-unit
                margin-left :1px
                position :relative
                bottom :5px
                font-size: 12px
              .m-origin
                margin-left :6px
                position :relative
                bottom :4px
                font-family: $font-family-regular
                font-size: 12px;
                color: #B7B7B7;
                text-decoration :line-through

          .left
            position relative
            width :110px
            height :@width
            .good-image
              width :100%
              height :@width
              background :#f5f5f5
              border-radius :2px
            .label-icon
              position :absolute
              top:-1px
              left :@top
              width :29px
              height :31px


    // tab选项卡
    .active-tab-wrapper
      height :59px
      .active-tab-container
        height :59px
        width :100vw
        display :flex
        z-index :99
        position :absolute
        &.active:after
          content: ""
          position: absolute
          bottom: 0
          right: 0
          width: 100%
          background: $color-background
          transform: scaleY(.5) translateZ(0)
          border-bottom: 1px solid $color-line
        .active-item-wrapper
          width :25vw
          font-family: $font-family-regular
          display :flex
          flex-direction :column
          justify-content :center
          align-items :center
          &.active
            .title
              color: #73C200
            .sub-title
              color: $color-white
              background: #73C200;
          .title
            font-family: $font-family-medium
            font-size: 16px;
            color: #1D2023;
          .sub-title
            margin-top :2px
            padding :0 8px
            height :18px
            line-height :@height
            border-radius :@height
            font-size: 12px;
            color: $color-text-sub

  // 分类
  .classify-wrapper
    padding :5px 12px 10px
    display :flex
    flex-wrap: wrap
    .classify-item-wrapper
      width :20%
      font-family: $font-family-regular
      font-size: 3.2vw
      color: #333333;
      text-align: center;
      &.m-top
        margin-top :13px
      .logo
        width :13.333333333333334vw
        height :@width
      .title
        width :100%
        no-wrap()
        padding-top :5px
        padding-right :2px
        padding-left :@padding-right
  // top-搜索-定位
  .home-position
    layout(row,block,nowrap)
    justify-content: space-between
    align-items: center
    padding: 0 12px
    box-sizing: border-box
    margin-bottom: 10px
    height :27px
    position :relative
    .search-wrapper
      width :40vw
      height :27px
      background: #F0F0F0;
      border-radius: @height
      display :flex
      align-items :center
      font-family: $font-family-regular
      font-size: 13px;
      color: #B7B7B7;
      .s-img
        padding-left :13px
        padding-right :4px
        width :14px
        height :13.5px
    .community-main
      layout(row,block,nowrap)
      align-items: center
      .community-img
        width: 15.5px
        height: 17.5px
        margin-right: 8px
      .community-text
        color: #1D2023
        font-size: $font-size-16
        font-family: $font-family-medium
        min-height: $font-size-18
        margin-right: 5px
        overflow :hidden
        white-space: nowrap
      .more-img
        width :8.5px
        height :5.5px
  // 商品搜索
  .goods-search-wrapper
    height:50px
    background: red
    position:fixed
    left:0;
    right :0
    top: 0
    z-index:90
    opacity :0
  // 限时抢购-item
  .home-flash-item
    width :$flash-width
    height :100%
    .goods-wrapper
      width :$flash-width
      height :$flash-width
      position :relative
      -webkit-overflow-scrolling: touch
      .img-goods
        width :100%
        height :@width
        display :block
        overflow :auto
        border-radius :3px
      .img-label
        position :absolute
        left :0
        bottom:-1px
        width: 25.5px
        height:15.5px
    .bottom-wrapper
      position :relative
      .title
        padding-top :2px
        font-family: $font-family-regular
        font-size: 13px
        color: #111111
        no-wrap()
      .button-group-wrapper
        position :relative
        z-index :10
      .price-wrapper
        margin-top: -3px
        display :flex
        color: #FF8300
        font-family: $font-family-medium
        position :relative
        flex:1
        overflow :hidden
        .number
          font-size: 4.533333333333333vw
        .dec
          position: relative
          top: 1.1vw
          font-size : 3.733333333333334vw
        .unit
          position :relative
          top:1.8vw
          margin-left :1px
          font-size :2.666666666666667vw
        .origin-price
          padding-left :1.0666666666666667vw
          font-family: $font-family-regular
          font-size: 2.666666666666667vw
          color: $color-text-assist
          line-height: @font-size
          text-decoration :line-through
          position :relative
          top:2.666666666666667vw
  // 限时抢购
  .home-flash-sale
    padding :0 12px
    background: #fff
    border-top: 13px solid @background
    border-bottom :@border-top
    position :relative
    .scroll-wrapper
      padding :9px
      background :$color-flash-background
      border-radius :0 0 $box-radius $box-radius
      .bottom-wrapper
        display: block
        width: 100%
        background: $color-white
        white-space: nowrap
        box-sizing: border-box
        transform: translate3d(0,0,0)
        position :relative
        border-radius :$box-radius $box-radius
        &.active
          display :none
        ::-webkit-scrollbar
          width: 0
          height: 0
          color: transparent
        .bottom-item-wrapper
          height :100%
          display: inline-flex
          position: relative
          box-sizing :border-box
          padding-top :8px
          padding-bottom :5px
          padding-left :7px
          &.pad-right-place
            padding-right :7px
          .look-more-wrapper
            width :14vw
            flex: 1
            display :flex
            flex-direction :column
            justify-content :center
            align-items :center
            .text
              font-family :$font-family-regular
              color: $color-text-sub
              font-size :13px
              width :@font-size
              letter-spacing :2px
              white-space :normal
              word-wrap: break-word
              word-break :break-all
            .more-icon
              margin-top :0.9333333333333335vw
              width :13px
              height:@width

    .top-wrapper
      height :45px
      background: #F7F9FA
      border-radius :$box-radius $box-radius 0 0
      padding :0 11.5px 0 10px
      layout(row,block,nowrap)
      align-items :center
      .title-img
        padding-right :3.733333333333334vw
        width :20vw
        height :4.933333333333334vw
      .more-wrapper
        flex: 1
        layout(row,block,nowrap)
        align-items :center
        justify-content :flex-end
        font-family: $font-family-regular
        font-size: 14px;
        color: #111111;
        .more-text
          padding-right :5px
        .more-img
          width:5.5px
          height :10.5px
      .tab-wrapper
        height :100%
        layout(row,block,nowrap)
        .tab-item-wrapper
          width :21.866666666666667vw
          height :100%
          layout(column,block,nowrap)
          justify-content :center
          align-items :center
          font-family: $font-family-medium
          color: #1D2023;
          border-radius :2px 2px 0 0
          transition :all 0.3s
          background :#F7F9FA
          &.active
            background :$color-flash-background
          .time
            font-size:16px
          .explain
            margin-top :-2px
            font-size :10px

  // 通知
  .notice
    height: 44px
    margin: 12px
    border-1px($color-line, 4px)
    display: flex
    padding: 0 10px
    box-sizing: border-box
    align-items: center

  .notice-img
    width: 27px
    height: 14px
    margin-right: 8px

  .notice-msg
    line-height: 1
    overflow: hidden
    white-space: nowrap
    width: 66.7vw
    position: relative
    display: flex
    .notice-content
      display: flex
      animation: move 13s linear infinite normal
    .notice-msg-item
      font-family: $font-family-regular
      color: $color-text-main
      font-size: $font-size-14

  .notice-line
    color: #ccc
    margin-left: 6px
    line-height: 1
    font-size: 12px
    transform: translateY(-1px)

  .notice-look
    color: #FA7502
    font-family: $font-family-regular
    font-size: 14px
    white-space: nowrap
    line-height: 1
    margin-left: 3.6vw

  @keyframes move {
    0% {
      transform: translateX(0px)
    }
    100% {
      transform: translateX(-50%)
    }
  }

  // banner轮播图
  .home-banner
    height: 40vw
    box-sizing: border-box
    position: relative
    .dot-wrapper
      position :absolute
      right :22px
      bottom :8px
      width :35px
      height :17.5px
      layout(row,block,nowrap)
      font-family: $font-family-regular
      font-size: 10px;
      color: #F1F5EB;
      .background
        fill-box(absolute)
        .img
          width :100%
          height:@width
          display :block
      .dot-line
        position :relative
        transform :scale(0.8)
        top:1px
      .dot
        position :relative
        width :17.5px
        height :@width
        text-align :center
        line-height :@height
    .banner
      width: 100vw
      height: 100%
      .banner-item
        width: 100%
        height: 100%
        position: relative
        align-items: center
        .item-img
          width: 100%
          height: 100%
          display: block

  // 页面结构
  .choiceness
    overflow-x: hidden
    position: relative
    .container
      position :relative
      .item-wrapper
        position :relative
        &.banner
          height :40vw
      .top-background
        position: absolute
        left: 0
        top: 0
        width :100vw
        display: block


</style>
