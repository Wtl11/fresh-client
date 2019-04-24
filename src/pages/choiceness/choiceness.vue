<template>
  <div class="choiceness">
    <navigation-bar ref="navigationBar" :headStyle="headStyle" :titleColor="titleColor" :title="title" :showArrow="false" :titleMaxLen="12" :translucent="fasle"></navigation-bar>
    <section class="top-background">
      <img class="img" mode="aspectFill" v-if="imageUrl" :src="imageUrl + '/yx-image/2.3/bg-homepage@2x.png'">
    </section>
    <home-position
      :buyUsers="buyUsers"
      :showUserIndex="showUserIndex"
      :showBuyUser="showBuyUser"
      :locationStatus="locationStatus"
      :goodsListData="goodsListData"
      :groupInfo="groupInfo"
    ></home-position>
    <home-banner
      :bigItem="bannerInfo"
      :praiseIndex="praiseIndex"
      :isShow="bannerIsShow"
      @bannerChange="bannerChangeHandle"
    ></home-banner>
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
  import {cartMethods} from '@state/helpers'
  import {resolveQueryScene} from '@utils/common'
  import CouponModal from './coupon-modal/coupon-modal'
  import CouponModalMixins from './coupon-modal/coupon-modal-mixins'
  import HomePosition from './home-position/home-position'
  import Position from './home-position/position-mixins'
  import HomeBanner from './home-banner/home-banner'
  import Banner from './home-banner/banner-mixins'
  import HomeClassify from './home-classify/home-classify'
  import Classify from './home-classify/classify-mixins'
  import HomeFlashSale from './home-flash-sale/home-flash-sale'
  import FlashSale from './home-flash-sale/flash-sale-mixins'
  import ShareHandler, {EVENT_CODE} from '@mixins/share-handler'
  import ShareTrick from '@mixins/share-trick'
  import NewGuidelines from './new-guidelines/new-guidelines'

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
  export default {
    name: PAGE_NAME,
    mixins: [
      CouponModalMixins,
      Position,
      Banner,
      Classify,
      FlashSale,
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
      NewGuidelines
    },
    data() {
      return {
        title: '赞播优鲜',
        curShopId: '',
        modulesList: [],
        systemInfo: {},
        pageScrollEvent: {},
        headStyle: `background:#73C200`,
        titleColor: `#ffffff`
      }
    },
    onLoad(options) {
      this.$wechat.showLoading()
      this._getSystemInfo()
      this._initPageParams(options)
    },
    onPageScroll(e) {
      this.pageScrollEvent = e
    },
    computed: {
      socialName() {
        return (this.groupInfo || {}).social_name || ''
      }
    },
    watch: {
      pageScrollEvent(e) {
        this._changeNavigation(e)
      }
    },
    async onShow() {
      try {
        ald.aldstat.sendEvent('首页')
        let shopId = wx.getStorageSync('shopId')
        if (!shopId) {
          let res = await API.Choiceness.getDefaultShopInfo()
          wx.setStorageSync('shopId', res.data.id)
          shopId = res.data.id
        }
        this._getBuyUsers()
        // 获取团的信息
        this._groupInfo(false)
        if (this.curShopId * 1 !== shopId * 1) {
          await this._getModuleInfo()
          this.curShopId = shopId
        } else {
          await this._getFlashTabList()
        }
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
      this._getBuyUsers()
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
      _initPageParams(options = {}) {
        if (options.scene) {
          // let scene = decodeURIComponent(options.scene)
          // let params = getParams(scene)
          let {shopId} = resolveQueryScene(options.scene)
          this.shopId = shopId
        } else {
          this.shopId = options.shopId
        }
        this.shopId && wx.setStorageSync('shopId', this.shopId)
      },
      // 获取设备系统参数
      _getSystemInfo() {
        this.systemInfo = wx.getSystemInfoSync()
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
    position:relative
    .top-background
      position :absolute
      left :0
      right :0
      top:0
      height :54.2vw
      .img
        width :100vw
        height :100%
        display :block


  .empty
    height :11px
    background :#fff

</style>
