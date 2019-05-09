<template>
  <div class="choiceness">
    <navigation-bar ref="navigationBar" :headStyle="headStyle" :titleColor="titleColor" :title="title"
                    :showArrow="false" :titleMaxLen="12" :translucent="fasle"></navigation-bar>
    <section class="top-background" :style="{height: backgroundHeight+'px'}">
      <img class="img" :style="{backgroundColor: backgroundColor}" @load="handleLoadBackground" mode="aspectFill"
           v-if="imageUrl" :src="imageUrl + '/yx-image/2.3/bg-homepage@2x.png'">
    </section>
    <home-position
      :locationStatus="locationStatus"
      :groupInfo="groupInfo"
    ></home-position>
    <home-banner
      ref="homeBanner"
      v-if="bannerIsShow"
      :bannerArray="bannerArray"
    ></home-banner>
    <notice
      v-if="isShowNotify"
      :notice="notifyDesc"
    ></notice>
    <div class="empty" id="homeEmpty"></div>
    <home-flash-sale
      v-if="flashIsShow"
      :tabList="flashTabArray"
      :flashArray="flashArray"
      @changeTab="flashChangeTab"
    ></home-flash-sale>
    <section class="home-classify">
      <section class="tab-wrapper">
        <div v-if="classifyTabArray.length" class="place-holder"></div>
        <home-classify-tab
          id="scrollView-relative"
          :isShow="classifyIsShow"
          :styles="classifyStyles"
          :tabList="classifyTabArray"
          @changeTab="classifyChangeTab"
        ></home-classify-tab>
      </section>
      <div class="classify-wrapper">
        <block v-for="(item, index) in classifyArray" :key="index">
          <!--          <home-classify-item :item="item"></home-classify-item>-->
          <div class="home-classify-item" @click="jumpGoodsDetail(item)">
            <div class="goods-left">
              <img
                class="goods-left-img"
                lazy-load mode="aspectFill"
                v-if="item.goods_cover_image"
                :src="item.goods_cover_image"
              >
              <img
                class="goods-left-icon"
                lazy-load
                mode="aspectFill"
                v-if="imageUrl && corpName === 'platform'"
                :src="imageUrl + '/yx-image/choiceness/icon-label@2x.png'"
              >
            </div>
            <div class="goods-right">
              <div class="goods-right-top">
                <div class="title">{{item.name}}</div>
                <div
                  class="text-sub"
                  v-if="item.describe"
                  :class="item.describe ? 'has-title' : ''"
                >{{item.describe}}
                </div>
              </div>
              <div class="add-box">
                <div class="add-box-left">
                  <section class="left">
                    <img
                      class="text-group-img"
                      mode="aspectFill"
                      lazy-load
                      v-if="imageUrl"
                      :src="imageUrl + '/yx-image/choiceness/pic-price_bg@2x.png'"
                    >
                  </section>
                  <div class="price-box">
                    <div class="money" :class="'corp-' + corpName + '-money'">{{item.trade_price}}</div>
                    <div class="unit" :class="'corp-' + corpName + '-money'">元</div>
                    <div class="lineation">{{item.original_price}}元</div>
                  </div>
                </div>
                <div class="right">
                  <form action="" report-submit @submit="$getFormId" @click.stop="addShoppingCart(item)">
                    <button class="add-box-right" v-if="item.usable_stock * 1 > 0" formType="submit">
                      <div class="add-goods-btn" :class="'corp-' + corpName + '-bg'">
                        <div class="add-icon">
                          <div class="add1"></div>
                          <div class="add2"></div>
                        </div>
                        <div class="add-text">购物车</div>
                      </div>
                    </button>
                  </form>
                  <div class="add-box-right" v-if="item.usable_stock * 1 <= 0" @click.stop>
                    <div class="add-goods-btn add-goods-btn-active">
                      <div class="add-text">已抢完</div>
                    </div>
                  </div>
                  <div class="add-text-sales">已售{{item.sale_count}}{{item.goods_units}}</div>
                </div>
              </div>
            </div>
          </div>
        </block>
      </div>
      <is-end v-if="!classifyMore && !classifyShowEmpty"></is-end>
      <loading-more v-else-if="!classifyShowEmpty"></loading-more>
      <is-active-empty v-if="classifyShowEmpty"></is-active-empty>
    </section>
    <custom-tab-bar currentType="index"></custom-tab-bar>
    <coupon-modal ref="couponModal"></coupon-modal>
    <new-guidelines ref="guidelines"></new-guidelines>
  </div>
</template>

<script type="text/ecmascript-6">
  import NavigationBar from '@components/navigation-bar/navigation-bar'
  import CustomTabBar from '@components/custom-tab-bar/custom-tab-bar'
  import API from '@api'
  import {cartMethods, jwtComputed} from '@state/helpers'
  import {resolveQueryScene} from '@utils/common'
  import CouponModal from './coupon-modal/coupon-modal'
  import HomePosition from './home-position/home-position'
  import HomeBanner from './home-banner/home-banner'
  import HomeFlashSale from './home-flash-sale/home-flash-sale'
  import ShareHandler, {EVENT_CODE} from '@mixins/share-handler'
  import ShareTrick from '@mixins/share-trick'
  import NewGuidelines from './new-guidelines/new-guidelines'
  import Notice from './notice/notice'
  import HomeClassifyTab from './home-classify-tab/home-classify-tab'
  import IsEnd from '@components/is-end/is-end'
  import isActiveEmpty from '@components/is-active-empty/is-active-empty'
  import LoadingMore from '@components/loading-more/loading-more'

  const ald = getApp()
  const PAGE_NAME = 'CHOICENESS'

  const MODULE_CONFIG = {
    bannar: 'bannerInfo',
    activity_fixed: 'flashInfo',
    goods_cate: 'classifyInfo'
  }

  let SYSTEM_INFO = {}
  // let curShopId = ''
  let flashTabIndex = 0
  let classifyTabIndex = 0
  let classifyPage = 1
  let isLoading = false
  let classifyTabPosition = 999999
  let classifyScrollHeight = 9999999
  let navigationBarHeight = 64
  let classifyTabScrolling = false
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
      HomePosition,
      HomeBanner,
      HomeFlashSale,
      NewGuidelines,
      Notice,
      HomeClassifyTab,
      IsEnd,
      isActiveEmpty,
      LoadingMore
    },
    data() {
      return {
        title: '赞播优鲜',
        headStyle: `background:#73C200`,
        titleColor: `#ffffff`,
        backgroundHeight: 0,
        backgroundColor: '#73C200',
        locationStatus: null,
        groupInfo: {},
        bannerInfo: {},
        flashInfo: {},
        classifyInfo: {},
        flashArray: [],
        classifyMore: true,
        classifyArray: [],
        classifyStyles: '',
        classifyShowEmpty: false,
        notifyDesc: [],
        isShowNotify: false,
        curShopId: ''
      }
    },
    computed: {
      ...jwtComputed,
      socialName() {
        return (this.groupInfo || {}).social_name || ''
      },
      // banner
      bannerArray() {
        return (this.bannerInfo.content_data && this.bannerInfo.content_data.list) || []
      },
      // 是否显示banner
      bannerIsShow() {
        return this.bannerArray.length && !this.bannerInfo.is_close
      },
      // 限时抢购tab
      flashTabArray() {
        return (this.flashInfo.content_data && this.flashInfo.content_data.list) || []
      },
      // 是否显示限时抢购
      flashIsShow() {
        return this.flashTabArray.length && !this.flashInfo.is_close && this.flashArray.length
      },
      // 商品分类tab数组
      classifyTabArray() {
        return (this.classifyInfo.content_data && this.classifyInfo.content_data.list) || []
      },
      // 是否显示商品分类
      classifyIsShow() {
        return this.classifyTabArray.length && !this.classifyInfo.is_close
      }
    },
    watch: {
      userInfo(val = {}) {
        this._getCouponModalList(val.id)
      }
    },
    onLoad(options) {
      SYSTEM_INFO = {}
      flashTabIndex = 0
      classifyTabIndex = 0
      classifyPage = 1
      isLoading = false
      classifyTabPosition = 999999
      classifyScrollHeight = 9999999
      navigationBarHeight = 64
      classifyTabScrolling = false
      this.$wechat.showLoading()
      SYSTEM_INFO = wx.getSystemInfoSync()
      this._initPageParams(options)
      this._initLocation()
      this._initTopStyles()
    },
    onPageScroll(e) {
      this._changeNavigation(e)
      this._classifyScrollEvent(e)
    },
    async onShow() {
      this._refreshLocation()
      try {
        ald.aldstat.sendEvent('首页')
        let shopId = wx.getStorageSync('shopId')
        if (!shopId) {
          let res = await API.Choiceness.getDefaultShopInfo()
          wx.setStorageSync('shopId', res.data.id)
          shopId = res.data.id
        }
        this._getCouponModalList() // 首页弹窗
        // 获取团的信息
        this._groupInfo(false)
        if (this.curShopId * 1 !== shopId * 1) {
          this._resetGetClassifyListParams()
          this.bannerInfo = {} // 切换站点重置swiper
          await this._getModuleInfo()
          this.curShopId = shopId
        } else {
          // await this._getModuleInfo()
          await this._getFlashTabList()
        }
        await this._getNotify()
        // 获取tab高度
        await this._getTabPosition()
        this.$refs.guidelines && this.$refs.guidelines.setTop(navigationBarHeight)
        if (!wx.getStorageSync('token')) return
        this.setCartCount()
      } catch (e) {
        console.error(e)
      } finally {
        this.$wechat.hideLoading()
        this.$sendMsg({
          event_no: 1000
        })
        this.$$shareHandler({event: EVENT_CODE.HOME})
      }
    },
    async onPullDownRefresh() {
      this._resetGetClassifyListParams()
      this._refreshLocation()
      this._getCouponModalList()
      this._groupInfo(false)
      await this._getNotify()
      try {
        await this._getModuleInfo(false)
        // 获取tab高度
        await this._getTabPosition()
      } catch (e) {
        console.error(e)
      }
      wx.stopPullDownRefresh()
      if (!wx.getStorageSync('token')) return
      this.setCartCount()
    },
    onReachBottom() {
      if (isLoading) return
      classifyPage++
      this._getClassifyList()
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
        path: `/pages/choiceness?shopId=${this.curShopId}&flag=${flag}`,
        imageUrl: this.imageUrl + imgUrl,
        success: (res) => {
        },
        fail: (res) => {
        }
      }
    },
    methods: {
      ...cartMethods,
      jumpGoodsDetail(item) {
        wx.navigateTo({
          url: `/pages/goods-detail?id=${item.goods_id}&activityId=${item.activity_id}`
        })
      },
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
      // 通知
      async _getNotify() {
        try {
          const res = await API.AfterNotice.getNotify()
          this.isShowNotify = res.data.has_notify
          if ('' + this.notifyDesc === '' + res.data.desc) {
            return
          }
          this.notifyDesc = res.data.desc || this.isShowNotify.length
        } catch (e) {
          console.warn(e)
        }
      },
      // 分类滚动
      _classifyScrollEvent(e) {
        if (classifyTabScrolling) return
        const currentScrollTop = e.scrollTop + navigationBarHeight
        const t10 = classifyScrollHeight + classifyTabPosition
        const t15 = classifyScrollHeight + classifyTabPosition * 1.1
        const t20 = classifyScrollHeight + classifyTabPosition * 1.5
        if (currentScrollTop < t10) {
          this.classifyStyles = ''
        }
        if (currentScrollTop > t10 && currentScrollTop < t15) {
          this._setClassifyStyles(0, 1, 0)
        }
        if (currentScrollTop >= t15 && currentScrollTop <= t20) {
          this._setClassifyStyles(0, 1)
        }
        if (currentScrollTop > t20) {
          this._setClassifyStyles(classifyTabPosition, 1)
        }
      },
      // 设置分类滚动时的样式
      _setClassifyStyles(y, opacity, time = 300) {
        this.classifyStyles = `
          opacity:${opacity};
          top:${navigationBarHeight - classifyTabPosition}px;
          position:fixed;
          left:0;
          z-index:90;
          transform:translate3d(0,${y}px,0);
          transition: transform ${time}ms ease-out
        `
      },
      // 获取tab位置信息
      _getTabPosition() {
        const query = wx.createSelectorQuery()
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            query.select('#navigationBar').boundingClientRect()
              .select('#homePosition').boundingClientRect()
              .select('#homeBanner').boundingClientRect()
              .select('#homeFlashSale').boundingClientRect()
              .select('#homeEmpty').boundingClientRect()
              .select('#scrollView-relative').boundingClientRect()
              .select('#notice').boundingClientRect()
              .exec(res => {
                let height = 0
                res.forEach(item => {
                  if (item && item.height) {
                    item.id === 'navigationBar' && (navigationBarHeight = item.height)
                    if (item.id === 'scrollView-relative') {
                      classifyTabPosition = item.height
                    } else {
                      height += item.height
                    }
                  }
                })
                if (classifyScrollHeight !== height + 10) {
                  classifyScrollHeight = height + 10
                }
                resolve()
              })
          }, 500)
        })
      },
      // 获取商品分类列表
      async _getClassifyList(loading) {
        if (!this.classifyMore) return
        let current = this.classifyTabArray[classifyTabIndex] || {}
        // current.id = 0 // todo
        try {
          const data = {
            goods_category_id: current.id || 0,
            page: classifyPage
          }
          isLoading = true
          let res = await API.FlashSale.getClassifyList(data, loading)
          if (res.meta.current_page === 1) {
            this.classifyArray = res.data
            this.classifyShowEmpty = res.meta.total === 0
          } else {
            const arr = this.classifyArray
            res.data.forEach((item) => {
              arr.push(item)
            })
            this.classifyArray = arr
          }
          this.classifyMore = res.meta.current_page < res.meta.last_page
          wx.nextTick(() => {
            isLoading = false
          })
        } catch (e) {
          isLoading = false
          console.error(e)
        }
      },
      // 重置参数
      _resetGetClassifyListParams() {
        classifyPage = 1
        this.classifyMore = true
        isLoading = false // loading-more
        this.$refs.homeBanner && this.$refs.homeBanner._resetIndex()
      },
      // tab切换
      classifyChangeTab(index, id, e) {
        if (this.classifyStyles) {
          this.classifyStyles = ''
          classifyTabScrolling = true
          setTimeout(() => {
            classifyTabScrolling = false
          }, 100)
          wx.pageScrollTo({
            scrollTop: classifyScrollHeight - navigationBarHeight,
            duration: 0
          })
        }
        classifyTabIndex = index
        this._resetGetClassifyListParams()
        this._getClassifyList(false)
      },
      // tab切换
      flashChangeTab(item, index) {
        flashTabIndex = index
        this._getFlashTabList(false)
      },
      // 获取限时活动列表
      async _getFlashList(loading) {
        let data = {
          activity_id: (this.flashTabArray[flashTabIndex] && this.flashTabArray[flashTabIndex].id) || 0
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
          let content = Object.assign({}, this.flashInfo.content_data, {list: res.data})
          this.$set(this.flashInfo, 'content_data', content)
          await this._getFlashList()
        } catch (e) {
          console.error(e)
        }
      },
      // 初始化地理位置
      _initLocation() {
        if (wx.getStorageSync('locationShow') * 1 === 3 || wx.getStorageSync('locationShow') * 1 === 2) {
        } else {
          let that = this
          wx.getLocation({
            async success(res) {
              wx.setStorageSync('locationData', res)
              wx.setStorageSync('locationShow', 1)
              that.locationStatus = 1
              // that.getLocationData()
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
      getLocationData() {
        let data = wx.getStorageSync('locationData')
        API.Choiceness.getLocationDistance({
          longitude: data.longitude || 0,
          latitude: data.latitude || 0
        }).then((res) => {
          if (res.error !== this.$ERR_OK) {
            return
          }
          let msgStatus = wx.getStorageSync('msgStatus')
          if (msgStatus !== 4 && res.data.distance > 1000) {
          }
        })
      },
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
      handleLoadBackground(e) {
        this.backgroundColor = ''
      },
      // 改变navigation状态的样式
      _changeNavigation(e) {
        let flag = e.scrollTop < navigationBarHeight
        let title = flag ? '赞播优鲜' : '赞播优鲜·' + this.socialName
        let styles = flag ? `background:#73C200;transition:none` : `background:#fff;transition:none`
        this.$refs.navigationBar && this.$refs.navigationBar.setTranslucentTitle(title)
        this.$refs.navigationBar && this.$refs.navigationBar.setNavigationBarBackground(styles)
        this.titleColor = flag ? `#ffffff` : `#000000`
        wx.setNavigationBarColor({
          frontColor: this.titleColor,
          backgroundColor: '#ffffff',
          animation: {
            duration: 0,
            timingFunc: 'easeIn'
          }
        })
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
      // 初始化头部样式
      _initTopStyles() {
        this.backgroundHeight = 0.453 * SYSTEM_INFO.screenWidth + SYSTEM_INFO.statusBarHeight || 20
        this.$refs.navigationBar && this.$refs.navigationBar.setNavigationBarBackground(`background:#73C200;transition:none`)
        this.$refs.navigationBar && this.$refs.navigationBar.setTranslucentTitle('赞播优鲜')
        this.titleColor = `#ffffff`
      },
      // 获取模块信息
      async _getModuleInfo(loading) {
        try {
          let res = await API.FlashSale.getModuleInfo({page_name: 'index'}, loading)
          let modules = res.data.modules || []
          modules.forEach((item) => {
            this[MODULE_CONFIG[item.module_name]] = item
          })
          await this._getFlashList()
          await this._getClassifyList()
        } catch (e) {
          console.error(e)
        }
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@designCommon"

  .choiceness
    max-width: 100vw
    min-height: 180vh
    background: #fff
    overflow-x: hidden
    position: relative
    .top-background
      position: absolute
      left: 0
      right: 0
      top: 0
      .img
        width: 100vw
        height: 100%
        display: block

  .home-classify
    width: 100%
    background: #fff
    position: relative
    .tab-wrapper
      position: relative
      .place-holder
        height: 86px

  .has-title
    no-wrap-plus()

  .add-text-sales
    font-size: $font-size-10
    font-family: $font-family-regular
    color: $color-text-sub
    margin-top: 1.5px
    text-align: center

  .add-box-right
    &:after
      border: none

  .home-classify-item
    height: 37.733333333333334vw
    layout(row)
    border-bottom-1px(#e6e6e6)
    align-items: center
    margin: 0 12px
    .goods-left
      position: relative
      width: 29.33vw
      height: 29.33vw
      margin-right: 12px
      .goods-left-img
        width: 100%
        height: 100%
        border-radius: 3px
        display: block
      .goods-left-icon
        width: 32px
        height: 32px
        position: absolute
        left: -2.5px
        top: -2.5px
        display: block
    .goods-right
      flex: 1
      overflow: hidden
      layout()
      justify-content: space-between
      min-height: 29.33vw
      .title
        padding-top: 3px
        font-size: $font-size-16
        font-family: $font-family-medium
        color: $color-text-main
        line-height: 1
        min-height: $font-size-18
        margin-bottom: 2px
        no-wrap()
      .text-sub
        font-size: $font-size-13
        font-family: $font-family-regular
        color: $color-text-sub
        min-height: $font-size-15
        margin-bottom: 5px
        line-height: $font-size-16
        box-sizing: border-box
      .text-sales-box
        layout(row)
        .text-sales
          font-size: $font-size-10
          font-family: $font-family-regular
          color: $color-text-sub
          margin-bottom: 11px
          border-radius: 10px
          height: 13px
          line-height: 13px
          border-1px($color-text-sub, 10px)
          padding: 0 5px
      .add-box
        layout(row)
        justify-content: space-between
        align-items: center
        .left
          layout(row)
          .text-group
            font-size: $font-size-10
            font-family: $font-family-regular
            height: 13px
            line-height: 13px
            margin-bottom: 3px
            border-radius: 10px
          .text-group-img
            width: 37px
            height: 17px
            display: block
        .price-box
          layout(row)
          align-items: flex-end
          .money
            font-family: $font-family-medium
            font-size: $font-size-20
            line-height: 1
          .unit
            font-family: $font-family-medium
            font-size: $font-size-12
            line-height: 1
            margin-right: 2px
            padding-bottom: 2.5px
          .lineation
            font-family: $font-family-regular
            color: $color-text-assist
            font-size: $font-size-12
            text-decoration line-through
            padding-bottom: 1px
            line-height: 1
            position: relative
            bottom: 1px
        .add-goods-btn
          layout(row)
          width: 75px
          height: 28px
          justify-content: center
          align-items: center
          border-radius: 14px
          .add-text
            font-size: $font-size-14
            font-family: $font-family-regular
            color: #fff
          .add-icon
            width: 11px
            height: 11px
            position: relative
            margin-right: 2px
            .add1
              width: 11px
              height: 1.5px
              background-color: #fff
              position: absolute
              left: 0
              top: 4.5px
              border-radius: 30px
            .add2
              width: 1.5px
              height: 11px
              background-color: #fff
              border-radius: 30px
              position: absolute
              left: 4.5px
              top: 0

        .add-goods-btn-active
          background: #b7b7b7

  .empty
    position: relative
    height: 11px
    background: #fff

</style>
