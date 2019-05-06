<template>
  <div class="choiceness">
    <navigation-bar ref="navigationBar" :headStyle="headStyle" :titleColor="titleColor" :title="title"
                    :showArrow="false" :titleMaxLen="12" :translucent="fasle"></navigation-bar>
    <section class="top-background" :style="{height: backgroundHeight+'px'}">
      <img class="img" :style="{backgroundColor: backgroundColor}" @load="handleLoadBackground" mode="aspectFill" v-if="imageUrl" :src="imageUrl + '/yx-image/2.3/bg-homepage@2x.png'">
    </section>
    <home-position
      :locationStatus="locationStatus"
      :groupInfo="groupInfo"
    ></home-position>
    <home-banner
      :bigItem="bannerInfo"
      :praiseIndex="praiseIndex"
      :isShow="bannerIsShow"
    ></home-banner>
    <notice
      v-if="isShowNotify"
      :notice="notifyDesc"
    ></notice>
    <div class="empty" id="homeEmpty"></div>
    <home-flash-sale
      :tabList="flashTabList"
      :tabIndex="flashTabIndex"
      :flashArray="flashArray"
      :countDownTimes="flashCountDownTimes"
      :isShow="flashIsShow"
      :systemInfo="systemInfo"
      @changeTab="flashChangeTab"
    ></home-flash-sale>
    <home-classify
      :tabList="classifyTabList"
      :tabIndex="classifyTabIndex"
      :classifyArray="classifyArray"
      :viewToItem="classifyViewToItem"
      :styles="classifyStyles"
      :isShow="classifyIsShow"
      :isShowTab="classifyTabIsShow"
      :hasMore="classifyMore"
      :isShowEmpty="classifyShowEmpty"
      :isShowLoadingMore="isLoading"
      @changeTab="classifyChangeTab"
    ></home-classify>
    <custom-tab-bar currentType="index"></custom-tab-bar>
    <coupon-modal ref="couponModal"></coupon-modal>
    <new-guidelines :navigationBar="navigationBar" :titleColor="titleColor"></new-guidelines>
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
  import HomeClassify from './home-classify/home-classify'
  import HomeFlashSale from './home-flash-sale/home-flash-sale'
  import ShareHandler, {EVENT_CODE} from '@mixins/share-handler'
  import ShareTrick from '@mixins/share-trick'
  import NewGuidelines from './new-guidelines/new-guidelines'
  import Notice from './notice/notice'

  const ald = getApp()
  const PAGE_NAME = 'CHOICENESS'
  const PAGE_CONFIG = {
    'bannar': {
      isShow: 'bannerIsShow',
      tabList: '',
      dataArray: 'bannerInfo'
    },
    'activity_fixed': {
      isShow: 'flashIsShow',
      tabList: 'flashTabList',
      dataArray: ''
    },
    'goods_cate': {
      isShow: 'classifyIsShow',
      tabList: 'classifyTabList',
      dataArray: ''
    }
  }

  let SYSTEM_INFO = {}
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
      HomeClassify,
      HomeFlashSale,
      NewGuidelines,
      Notice
    },
    data() {
      return {
        title: '赞播优鲜',
        curShopId: '',
        modulesList: [],
        systemInfo: {},
        pageScrollEvent: {},
        headStyle: `background:#73C200`,
        titleColor: `#ffffff`,
        backgroundHeight: 0,
        backgroundColor: '#73C200',
        locationStatus: null,
        groupInfo: {},
        praiseIndex: undefined,
        bannerInfo: undefined,
        bannerIsShow: undefined,
        flashTabList: undefined,
        flashTabIndex: 0,
        flashArray: undefined,
        flashCountDownTimes: undefined,
        flashIsShow: undefined,
        flashCountDownTimer: undefined,
        classifyTabList: [],
        classifyTabIndex: 0,
        classifyViewToItem: '',
        classifyPage: 1,
        classifyMore: true,
        classifyArray: [],
        classifyStyles: '',
        classifyTabIsShow: false,
        classifyTabPosition: 999999,
        classifyScrollHeight: 9999999,
        getScrollHeightTimer: undefined,
        classifyIsShow: undefined,
        classifyShowEmpty: undefined,
        navigationBar: 0,
        classifyTabScrolling: false,
        isLoading: false,
        notifyDesc: [],
        isShowNotify: false
      }
    },
    computed: {
      ...jwtComputed,
      socialName() {
        return (this.groupInfo || {}).social_name || ''
      }
    },
    watch: {
      userInfo(val = {}) {
        this._getCouponModalList(val.id)
      }
    },
    onLoad(options) {
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
          await this._getModuleInfo()
          this.curShopId = shopId
        } else {
          await this._getFlashTabList()
        }
        // await this._getNotify() // todo
        // 获取tab高度
        await this._getTabPosition()
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
      // await this._getNotify() // todo
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
      if (this.isLoading) return
      this.classifyPage++
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
          this.notifyDesc.push(res.data.desc)
          this.isShowNotify = res && res.data.has_notify && res.data.desc
        } catch (e) {
          this.isShowNotify = false
          console.warn(e)
        }
      },
      // 分类滚动
      _classifyScrollEvent(e) {
        if (this.classifyTabScrolling) return
        const currentScrollTop = e.scrollTop + this.navigationBar
        const t10 = this.classifyScrollHeight + this.classifyTabPosition
        const t15 = this.classifyScrollHeight + this.classifyTabPosition * 1.1
        const t20 = this.classifyScrollHeight + this.classifyTabPosition * 1.5
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
          this._setClassifyStyles(this.classifyTabPosition, 1)
        }
      },
      // 设置分类滚动时的样式
      _setClassifyStyles(y, opacity, time = 300) {
        this.classifyStyles = `
          opacity:${opacity};
          top:${this.navigationBar - this.classifyTabPosition}px;
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
                    item.id === 'navigationBar' && (this.navigationBar = item.height)
                    if (item.id === 'scrollView-relative') {
                      this.classifyTabPosition = item.height
                    } else {
                      height += item.height
                    }
                  }
                })
                if (this.classifyScrollHeight !== height + 10) {
                  this.classifyScrollHeight = height + 10
                }
                resolve()
              })
          }, 500)
        })
      },
      // 获取商品分类列表
      async _getClassifyList(loading) {
        if (!this.classifyMore) return
        let current = this.classifyTabList[this.classifyTabIndex] || {}
        try {
          const data = {
            goods_category_id: current.id || 0,
            page: this.classifyPage
          }
          this.isLoading = true
          let res = await API.FlashSale.getClassifyList(data, loading)
          if (res.meta.current_page === 1) {
            this.classifyArray = res.data
            this.classifyShowEmpty = res.meta.total === 0
          } else {
            res.data.forEach((item) => {
              this.classifyArray.push(item)
            })
            // const arr = this.classifyArray.concat(res.data)
            // this.classifyArray = arr
          }
          this.classifyMore = res.meta.current_page < res.meta.last_page
          wx.nextTick(() => {
            this.isLoading = false
          })
        } catch (e) {
          this.isLoading = false
          console.error(e)
        }
      },
      // 重置参数
      _resetGetClassifyListParams() {
        this.classifyPage = 1
        this.classifyMore = true
        this.isLoading = false // loading-more
      },
      // tab切换
      classifyChangeTab(index, id, e) {
        if (this.classifyTabIndex === index) return
        if (this.classifyStyles) {
          this.classifyStyles = ''
          this.classifyTabScrolling = true
          setTimeout(() => {
            this.classifyTabScrolling = false
          }, 100)
          wx.pageScrollTo({
            scrollTop: this.classifyScrollHeight - this.navigationBar,
            duration: 0
          })
        }
        let number = this._optimizeTabViewItem(index, this.classifyTabIndex)
        this.classifyViewToItem = `item${number}`
        setTimeout(() => {
          this.classifyViewToItem = ``
        }, 100)
        this.classifyTabIndex = index
        this._resetGetClassifyListParams()
        this._getClassifyList(false)
      },
      // 优化tab切换时的动画问题
      _optimizeTabViewItem(index, lastIndex) {
        let number = index
        if (index < lastIndex) {
          number = index - 2 >= 0 ? index - 2 : 0
        } else {
          number = index < 3 ? 0 : index - 2
        }
        return number
      },
      // tab切换
      flashChangeTab(item, index) {
        if (this.flashTabIndex === index) return
        this.flashTabIndex = index
        this._getFlashTabList(false)
      },
      // 获取限时活动列表
      async _getFlashList(loading) {
        if (this.flashTabList && this.flashTabList.length === 0) {
          this.flashIsShow = false
          return
        }
        if (!this.flashTabList || !this.flashTabList[this.flashTabIndex]) return
        let data = {
          activity_id: this.flashTabList[this.flashTabIndex].id || 0
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
          this.flashTabList = res.data
          await this._getFlashList()
        } catch (e) {
          console.error(e)
        }
      },
      // 检查是否显示banner控件
      _checkBannerIsEmpty() {
        const content = ((this.bannerInfo) || {}).content_data || {}
        const list = content.list || []
        if (list.length === 0) {
          this.bannerIsShow = false
        }
        if (!list.every(val => val.image_url)) {
          this.bannerIsShow = false
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
        API.Choiceness.getLocationDistance({longitude: data.longitude || 0, latitude: data.latitude || 0}).then((res) => {
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
        // console.log(res.data)
        // this.groupInfo = res.data
        this.groupInfo = {
          head_image_url: res.data.head_image_url,
          name: res.data.name,
          social_name: res.data.social_name
        }
      },
      // 顶部背景颜色还原
      handleLoadBackground(e) {
        this.backgroundColor = ''
      },
      // 改变navigation状态的样式
      _changeNavigation(e) {
        let flag = e.scrollTop < this.navigationBar
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
            const key = PAGE_CONFIG[item.module_name]
            if (key) {
              let list = (item.content_data && item.content_data.list) || []
              key.tabList && (this[key.tabList] = list)
              key.dataArray && (this[key.dataArray] = item)
              key.isShow && (this[key.isShow] = !item.is_close)
            }
          })
          this._checkBannerIsEmpty()
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

  .empty
    position :relative
    height: 11px
    background: #fff

</style>
