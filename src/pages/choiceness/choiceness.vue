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
          class="item-wrapper module-item">
          <article class="home-banner">
            <swiper
              v-if="moduleItem.content_data && moduleItem.content_data.list && moduleItem.content_data.list.length"
              class="banner"
              autoplay
              interval="5000"
              display-multiple-items="1"
              previous-margin="0px"
              next-margin="0px"
              circular
              @change="handleSetBannerIndex">
              <block
                v-for="(item,index) in moduleItem.content_data.list"
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
              <li class="dot right">{{moduleItem.content_data.list.length || 0}}</li>
            </ul>
          </article>
        </section>
<!--        限时抢购-->
        <section
          v-if="moduleItem.module_name === 'activity_fixed'&& moduleItem.content_data && moduleItem.content_data.list && moduleItem.content_data.list.length"
          class="item-wrapper module-item"
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
                  v-for="(item, index) in moduleItem.content_data.list"
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
                  <article class="home-flash-item" @click="handleJumpToGoodsDetail(child)">
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
                        <p class="number">{{child.trade_price}}</p>
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
<!--        分类列表-->
        <ul v-if="moduleIndex === 0"
                 class="classify-wrapper"
        >
          <li v-for="(item, index) in classifyArray" :key="item.id"
              class="classify-item-wrapper"
              :class="{'m-top': index > 4}"
          >
            <img  class="logo" :src="item.image_url" alt="">
            <p class="title">{{item.name}}</p>
          </li>
        </ul>
<!--        活动模块-->
        <article v-if="moduleIndex === 2"
                 class="active-container"
        >
<!--          活动tab-->
          <section class="active-tab-wrapper"
                   v-if="true"
          >
            <ul class="active-tab-container"
                :class="{active: goodsSearchStyles}"
                :style="{top:navigationBarHeight + 'px'}"
                id="activeTab"
            >
              <li v-for="(item, index) in 4"
                  :key="index"
                  class="active-item-wrapper"
                  :class="{active: index === 0}"
              >
                <p class="title">拼团返现</p>
                <p class="sub-title">专属特权</p>
              </li>
            </ul>
          </section>
<!--          平团返现等各个活动-->
          <block v-for="(item, index) in 4" :key="index">
            <section class="panel">
              <img
                lazy-load
                mode="widthFix"
                v-if="imageUrl"
                :src="imageUrl + '/yx-image/2.4/pic-ptfx@2x.png'"
                class="banner-image">
              <button class="share-button" open-type="share"></button>
              <block v-for="(child, idx) in 10" :key="idx">
                <div class="goods-wrapper">
                  <div class="goods-item">
                    <figure class="left">
                      <img mode="aspectFill"
                           lazy-load
                           v-if="imageUrl"
                           :src="imageUrl + '/yx-image/wallet/5@1x.png'" alt="" class="good-image">
                      <img
                        lazy-load
                        v-if="imageUrl"
                        :src="imageUrl + '/yx-image/2.4/icon-label@2x.png'"
                        class="label-icon">
                    </figure>
                    <article class="right">
                      <p class="title">超值特惠4斤新鲜柠檬超值特惠4斤新鲜柠檬</p>
                      <p class="sub-title">味道香甜可做各式味道香甜可做各式味道香甜可做各式</p>
                      <span class="active-icon">拼团价</span>
                      <div class="money-wrapper">
                        <p class="m-int">10</p>
                        <p class="m-float">.8</p>
                        <p class="m-unit">元</p>
                        <p class="m-origin">12元</p>
                      </div>
                      <button formType="submit"
                              class="button-wrapper">
                        <div class="button">
                          <p class="text">去拼团</p>
                        </div>
                        <p class="sub-text">已售3303斤</p>
                      </button>
                    </article>
                  </div>
                </div>
              </block>
            </section>
          </block>
        </article>
      </block>

    </article>
<!--    自定义tab-->
    <custom-tab-bar currentType="index"></custom-tab-bar>
<!--    优惠券弹窗-->
    <coupon-modal ref="couponModal"></coupon-modal>
<!--    添加至我的小程序-->
    <new-guidelines ref="guidelines"></new-guidelines>
<!--    <div class="goods-search-wrapper" :style="goodsSearchStyles"></div>-->
  </div>
  </form>
</template>

<script type="text/ecmascript-6">
  import NavigationBar from '@components/navigation-bar/navigation-bar'
  import CustomTabBar from '@components/custom-tab-bar/custom-tab-bar'
  import API from '@api'
  import {cartMethods, jwtComputed} from '@state/helpers'
  import {resolveQueryScene} from '@utils/common'
  import CouponModal from './coupon-modal/coupon-modal'
  import ShareHandler, {EVENT_CODE} from '@mixins/share-handler'
  import ShareTrick from '@mixins/share-trick'
  import NewGuidelines from './new-guidelines/new-guidelines'

  const ald = getApp()
  const PAGE_NAME = 'CHOICENESS'

  // const MODULE_CONFIG = {
  //   bannar: 'bannerInfo',
  //   activity_fixed: 'flashInfo',
  //   goods_cate: 'classifyInfo'
  // }

  // const MODULE_ARR_METHODS = {
  //   activity_fixed: '_getFlashList'
  // }

  // let SYSTEM_INFO = {}
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
      NewGuidelines
    },
    data() {
      return {
        // 头部变色
        title: '赞播优鲜',
        // 商品搜索样式
        goodsSearchStyles: '',
        navigationBarHeight: 0,
        // 头部地理位置等
        locationStatus: null,
        // 团长信息
        groupInfo: {},
        // 模块数组
        moduleArray: [],
        // 轮播图
        bannerIndex: 1,
        // 通知
        notifyInfo: {},
        // 限时抢购
        flashTabIndex: 0,
        flashArray: [],
        flashViewToChild: undefined,
        // 商品分类
        classifyArray: []
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
        let name = (this.locationStatus * 1 === 1 || this.locationStatus * 1 === 2) ? this.socialName : '定位中...'
        return name.substring(0, 6) + (name.length > 6 ? '...' : '')
      }
    },
    watch: {
      // 监听用户静默登录后调用
      userInfo(val = {}) {
        this._getCouponModalList(val.id)
      }
    },
    onLoad(options) {
      // SYSTEM_INFO = wx.getSystemInfoSync()
      this.$wechat.showLoading()
      this._initPageParams(options)
      this._initLocation()
      this._groupInfo(false)
      // this._getNotify()
    },
    async onReady() {
      await this._initNavigationStatus()
      this.$refs.guidelines && this.$refs.guidelines.setTop(this._navigationBarHeight)
    },
    onUnload() {
      this._navigationIO && this._navigationIO.disconnect()
    },
    onPageScroll(e) {
      // const flag = this._changeNavigation(e)
      // this._goodsSearchScrollEvent(flag)
      // this._classifyScrollEvent(e)
    },
    async onShow() {
      this._refreshLocation()
      try {
        this.shopId = wx.getStorageSync('shopId')
        if (!this.shopId) {
          let res = await API.Choiceness.getDefaultShopInfo()
          wx.setStorageSync('shopId', res.data.id)
          this.shopId = res.data.id
        }
        // 获取团的信息
        if (this.curShopId * 1 !== this.shopId * 1) {
          this.curShopId = this.shopId
          this._resetBanner()
          this._resetFlash()
          this._groupInfo(false)
        }
        this._getNotify()
        await this._getModuleInfo()
        this._getFlashList()
        this._addMonitor()
        // this._getAllActiveList()
        // setTimeout(() => {
        //   wx.createIntersectionObserver(undefined, {observeAll: true}).relativeToViewport().observe('.module-item', res => {
        //     console.log(res, '123')
        //   })
        // }, 100)
        // this._getNotify()
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
      this._refreshLocation()
      this._getCouponModalList()
      this._groupInfo(false)
      this._getNotify()
      try {
        await this._getModuleInfo(false)
        this._getFlashList()
      } catch (e) {
        console.error(e)
      }
      wx.stopPullDownRefresh()
      if (!wx.getStorageSync('token')) return
      this.setCartCount()
    },
    onReachBottom() {
      // if (isLoading) return
      // classifyPage++
      // this._getClassifyList()
    },
    onShareAppMessage(res) {
      let imgUrl = ''
      switch (this.corpName) {
        case 'platform':
          imgUrl = '/yx-image/choiceness/pic-zbyx@2x.png'
          break
        case 'retuan':
          imgUrl = '/yx-image/retuan/pic-zbyx@2x.png'
          break
        default:
          imgUrl = '/yx-image/choiceness/pic-zbyx@2x.png'
          break
      }
      const flag = Date.now()
      return {
        title: `${this.groupInfo.social_name},次日达、直采直销，点击下单↓`,
        path: `/pages/choiceness?shopId=${this.shopId}&flag=${flag}`,
        imageUrl: this.imageUrl + imgUrl,
        success: (res) => {
        },
        fail: (res) => {
        }
      }
    },
    methods: {
      ...cartMethods,
      // 添加监听
      _addMonitor() {
        this._activeTab = wx.createIntersectionObserver()
        this._activeTab.relativeToViewport({top: this._navigationBarHeight})
        // setTimeout(() => {
        //   this._activeTab.observe('#activeTab', res => {
        //     console.log(res.intersectionRatio > 0)
        //     let flag = res.intersectionRatio > 0
        //     // this._setGoodsSearchStyles(this._navigationBarHeight, 1)
        //     // if (!flag) {
        //     //   this._setGoodsSearchStyles(this._navigationBarHeight, 1)
        //     // } else {
        //     //   this._setGoodsSearchStyles(0, 1)
        //     // }
        //     if (!flag) {
        //       this.goodsSearchStyles = `
        //         position:fixed;
        //         top:${this._navigationBarHeight}px;
        //         left:0;
        //         right:0;
        //         background: #fff
        //       `
        //     } else {
        //       this.goodsSearchStyles = ''
        //     }
        //   })
        // }, 200)
      },
      // 商品搜索页
      handleSearchGoods() {
        wx.navigateTo({url: `/pages/goods-search`})
      },
      // 切换社群
      handleChangeCommunity() {
        getApp().globalData.$groupInfo = this.groupInfo
        wx.navigateTo({url: `/pages/choose-pickup`})
      },
      // 初识话navigation状态
      _initNavigationStatus() {
        return new Promise((resolve, reject) => {
          this._navigationIO = wx.createIntersectionObserver(undefined, {})
          this._navigationIO.relativeToViewport().observe('#navigationBar', res => {
            this._navigationBarHeight = res.intersectionRect.height
            this.navigationBarHeight = res.intersectionRect.height
            let flag = res.intersectionRatio > 0
            let title = flag ? '赞播优鲜' : '赞播优鲜·' + this.socialName
            this.$refs.navigationBar && this.$refs.navigationBar.setTranslucentTitle(title)
            resolve()
          })
        })
      },
      // 页面滚动商品搜索是否显示
      // _goodsSearchScrollEvent(flag) {
      //   if (!flag) {
      //     this._setGoodsSearchStyles(this.navigationBarHeight, 1)
      //   } else {
      //     this._setGoodsSearchStyles(0, 1)
      //   }
      // },
      // 设置分类滚动时的样式
      _setGoodsSearchStyles(y, opacity, time = 300) {
        this.goodsSearchStyles = `
          opacity:${opacity};
          transform:translate3d(0,${y}px,0);
          transition: transform ${time}ms ease-out;
          position:fixed;
          z-index:200;
          top:0;
          left:0;
          right:0;
          opacity: 0;
          background: #fff
        `
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
          item.module_name === 'bannar' && (item.content_data.list = [])
        })
        this.bannerIndex = 1
      },
      // 跳转至商品详情页
      handleJumpToGoodsDetail(item) {
        wx.navigateTo({
          url: `/pages/goods-detail?id=${item.goods_id}&activityId=${item.activity_id}`
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
        if (!module) {
          let index = this.moduleArray.findIndex(val => val.module_name === 'activity_fixed')
          index > 0 && (module = this.moduleArray[index])
        }
        if (!module && !module.content_data) return
        let data = {
          activity_id: module.content_data.list[this.flashTabIndex].id || 0
        }
        try {
          let res = await API.FlashSale.getFlashList(data, loading)
          this.flashArray = res.data
        } catch (e) {
          console.warn(e)
        }
      },
      // 获取flashTab切换
      async _getFlashTabList(loading = false) {
        try {
          let res = await API.FlashSale.getFlashTabList('', loading)
          let index = this.moduleArray.findIndex(val => val.module_name === 'activity_fixed')
          this.moduleArray[index].content_data.list = res.data
          await this._getFlashList(this.moduleArray[index])
        } catch (e) {
          console.error(e)
        }
      },
      // 获取所有活动的列表
      // _getAllActiveList() {
      //   this.moduleArray.forEach((item) => {
      //     const key = MODULE_ARR_METHODS[item.module_name]
      //     key && this[key](item)
      //   })
      // },
      // 跳转-商品详情
      jumpGoodsDetail(item) {
        wx.navigateTo({
          url: `/pages/goods-detail?id=${item.goods_id}&activityId=${item.activity_id}`
        })
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
      // 分类滚动
      _classifyScrollEvent(e) {
        // if (classifyTabScrolling) return
        // const currentScrollTop = e.scrollTop + navigationBarHeight
        // const t10 = classifyScrollHeight + classifyTabPosition
        // const t15 = classifyScrollHeight + classifyTabPosition * 1.1
        // const t20 = classifyScrollHeight + classifyTabPosition * 1.5
        // if (currentScrollTop < t10) {
        //   this.classifyStyles = ''
        // }
        // if (currentScrollTop > t10 && currentScrollTop < t15) {
        //   this._setClassifyStyles(0, 1, 0)
        // }
        // if (currentScrollTop >= t15 && currentScrollTop <= t20) {
        //   this._setClassifyStyles(0, 1)
        // }
        // if (currentScrollTop > t20) {
        //   this._setClassifyStyles(classifyTabPosition, 1)
        // }
      },
      // // 设置分类滚动时的样式
      // _setClassifyStyles(y, opacity, time = 300) {
      //   this.classifyStyles = `
      //     opacity:${opacity};
      //     top:${navigationBarHeight - classifyTabPosition}px;
      //     position:fixed;
      //     left:0;
      //     z-index:90;
      //     transform:translate3d(0,${y}px,0);
      //     transition: transform ${time}ms ease-out
      //   `
      // },
      // 获取tab位置信息
      // _getTabPosition() {
      //   const query = wx.createSelectorQuery()
      //   return new Promise((resolve, reject) => {
      //     setTimeout(() => {
      //       query.select('#navigationBar').boundingClientRect()
      //         // .select('#homePosition').boundingClientRect()
      //         // .select('#homeBanner').boundingClientRect()
      //         // .select('#homeFlashSale').boundingClientRect()
      //         // .select('#homeEmpty').boundingClientRect()
      //         // .select('#scrollView-relative').boundingClientRect()
      //         // .select('#notice').boundingClientRect()
      //         .exec(res => {
      //           // let height = 0
      //           res.forEach(item => {
      //             if (item && item.height) {
      //               item.id === 'navigationBar' && (this.navigationBarHeight = item.height)
      //               // if (item.id === 'scrollView-relative') {
      //               //   classifyTabPosition = item.height
      //               // } else {
      //               //   height += item.height
      //               // }
      //             }
      //           })
      //           // if (classifyScrollHeight !== height + 10) {
      //           //   classifyScrollHeight = height + 10
      //           // }
      //           resolve()
      //         })
      //     }, 500)
      //   })
      // },
      // 获取商品分类列表
      // async _getClassifyList(loading) {
      //   if (!this.classifyMore) return
      //   let current = this.classifyTabArray[classifyTabIndex] || {}
      //   // current.id = 0 // todo
      //   try {
      //     const data = {
      //       goods_category_id: current.id || 0,
      //       page: classifyPage
      //     }
      //     isLoading = true
      //     let res = await API.FlashSale.getClassifyList(data, loading)
      //     if (res.meta.current_page === 1) {
      //       this.classifyArray = res.data
      //       this.classifyShowEmpty = res.meta.total === 0
      //     } else {
      //       const arr = this.classifyArray
      //       res.data.forEach((item) => {
      //         arr.push(item)
      //       })
      //       this.classifyArray = arr
      //     }
      //     this.classifyMore = res.meta.current_page < res.meta.last_page
      //     wx.nextTick(() => {
      //       isLoading = false
      //     })
      //   } catch (e) {
      //     isLoading = false
      //     console.error(e)
      //   }
      // },
      // // 重置参数
      // _resetGetClassifyListParams() {
      //   classifyPage = 1
      //   this.classifyMore = true
      //   isLoading = false // loading-more
      //   this.$refs.homeBanner && this.$refs.homeBanner._resetIndex()
      // },
      // // tab切换
      // classifyChangeTab(index, id, e) {
      //   if (this.classifyStyles) {
      //     this.classifyStyles = ''
      //     classifyTabScrolling = true
      //     setTimeout(() => {
      //       classifyTabScrolling = false
      //     }, 100)
      //     wx.pageScrollTo({
      //       scrollTop: classifyScrollHeight - navigationBarHeight,
      //       duration: 0
      //     })
      //   }
      //   classifyTabIndex = index
      //   this._resetGetClassifyListParams()
      //   this._getClassifyList(false)
      // },
      // // tab切换
      // flashChangeTab(item, index) {
      //   flashTabIndex = index
      //   this._getFlashTabList(false)
      // },
      // 初始化地理位置
      _initLocation() {
        const locationShow = wx.getStorageSync('locationShow') * 1
        if (locationShow !== 3 || locationShow !== 2) {
          let that = this
          wx.getLocation({
            async success(res) {
              wx.setStorageSync('locationData', res)
              wx.setStorageSync('locationShow', 1)
              that.locationStatus = 1
            },
            fail(res) {
              wx.setStorageSync('locationShow', 3)
              wx.navigateTo({
                url: `/pages/open-location`
              })
            }
          })
        }
      },
      // 更新地理位置
      _refreshLocation() {
        this.locationStatus = wx.getStorageSync('locationShow')
        if (this.locationStatus * 1 === 3) {
          wx.navigateTo({
            url: `/pages/open-location`
          })
        }
      },
      // 获取地理位置
      // getLocationData() {
      //   let data = wx.getStorageSync('locationData')
      //   API.Choiceness.getLocationDistance({
      //     longitude: data.longitude || 0,
      //     latitude: data.latitude || 0
      //   }).then((res) => {
      //     if (res.error !== this.$ERR_OK) {
      //       return
      //     }
      //     let msgStatus = wx.getStorageSync('msgStatus')
      //     if (msgStatus !== 4 && res.data.distance > 1000) {
      //     }
      //   })
      // },
      // 获取团长的信息
      async _groupInfo(loading) {
        let res = await API.Choiceness.getGroupInfo(loading)
        if (loading) {
          this.$wechat.hideLoading()
        }
        if (res.error !== this.$ERR_OK) {
          this.$wechat.showToast(res.message)
        }
        this.groupInfo = res.data
      },
      // 顶部背景颜色还原
      // handleLoadBackground(e) {
      //   this.backgroundColor = ''
      // },
      // 改变navigation状态的样式
      // _changeNavigation(e) {
      //   let flag = e.scrollTop < this.navigationBarHeight
      //   let title = flag ? '赞播优鲜' : '赞播优鲜·' + this.socialName
      //   let styles = flag ? `background:#73C200;transition:none` : `background:#fff;transition:none`
      //   this.$refs.navigationBar && this.$refs.navigationBar.setTranslucentTitle(title)
      //   this.$refs.navigationBar && this.$refs.navigationBar.setNavigationBarBackground(styles)
      //   this.titleColor = flag ? `#ffffff` : `#000000`
      //   wx.setNavigationBarColor({
      //     frontColor: this.titleColor,
      //     backgroundColor: '#ffffff',
      //     animation: {
      //       duration: 0,
      //       timingFunc: 'easeIn'
      //     }
      //   })
      //   return flag
      // },
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
      // 初始化头部样式
      _initTopStyles() {
        // this.backgroundHeight = 0.453 * SYSTEM_INFO.screenWidth + SYSTEM_INFO.statusBarHeight || 20
        // this.$refs.navigationBar && this.$refs.navigationBar.setNavigationBarBackground(`background:#73C200;transition:none`)
        // this.$refs.navigationBar && this.$refs.navigationBar.setTranslucentTitle('赞播优鲜')
        // this.titleColor = `#ffffff`
      },
      // 获取模块信息
      async _getModuleInfo(loading) {
        try {
          let res = await API.FlashSale.getModuleInfo({page_name: 'index'}, loading)
          this.moduleArray = res.data.modules || []
          this.classifyArray = this.moduleArray.find(val => val.module_name === 'goods_cate').content_data.list // todo
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
  // 各个活动的总容器
  .active-container
    background: linear-gradient(-180deg, #FFFFFF 0%, #F7F7F7 5%);
    // 各个活动面板
    .panel
      padding :60px 12px 0
      position :relative
      border-bottom :0px solid transparent
      .share-button
        position:absolute;
        right:4vw
        top:5vw
        width:16.6vw
        height:6.7vw
        background:#f00;
    .banner-image
        position :absolute
        top:0
        left :0
        width :100vw
      .goods-wrapper
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
            padding : 6px 11px 9px
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
              margin-top :17px
              align-self :flex-start
              height :14px
              background: rgba(250,117,0,0.10);
              border: 1px solid #FA7500
              border-radius: @height
              line-height :@height
              padding :0 5px
              font-size: 11px;
              color: #FA7500;
            .button-wrapper
              position absolute
              right :10px
              bottom :14px
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
                font-size :20px
              .m-float
                position :relative
                bottom :1px
                font-size :14px
              .m-unit
                margin-left :1px
                position :relative
                bottom :3px
                font-size: 11px
              .m-origin
                margin-left :6px
                position :relative
                bottom :2.5px
                font-family: $font-family-regular
                font-size: 11px;
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
        &.active
          position :fixed
          left:0;
          right:0;
          background: #FFFFFF
        .active-item-wrapper
          flex: 1
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
    padding :23px 12px 10px
    display :flex
    flex-wrap: wrap
    .classify-item-wrapper
      width :20%
      font-family: $font-family-regular
      font-size: 12px;
      color: #333333;
      text-align: center;
      &.m-top
        margin-top :13px
      .logo
        width :50px
        height :@width
      .title
        width :100%
        no-wrap()
        padding-top :6px
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
      .top-background
        position: absolute
        left: 0
        top: 0
        width :100vw
        display: block


</style>
