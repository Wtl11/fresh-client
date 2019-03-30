<template>
  <div class="choiceness" :style="homeStyles">
    <navigation-bar :title="shopName" :showArrow="false"></navigation-bar>
    <home-position
      :buyUsers="buyUsers"
      :showUserIndex="showUserIndex"
      :showBuyUser="showBuyUser"
      :locationStatus="locationStatus"
      :goodsListData="goodsListData"
      :groupInfo="groupInfo"
    ></home-position>
    <!--<div class="modules-box" v-for="(bigItem, bigIndex) in modulesList" :key="bigIndex"-->
         <!--v-if="locationStatus * 1 === 1 || locationStatus * 1 === 2">-->
      <!--&lt;!&ndash;轮播图&ndash;&gt;-->
      <!--<home-banner-->
        <!--:bigItem="bigItem"-->
        <!--:praiseIndex="praiseIndex"-->
        <!--@bannerChange="bannerChangeHandle"-->
      <!--&gt;</home-banner>-->
      <!--&lt;!&ndash;导航&ndash;&gt;-->
      <!--&lt;!&ndash;<home-hot :bigItem="bigItem"></home-hot>&ndash;&gt;-->
      <!--&lt;!&ndash;今日抢购&ndash;&gt;-->
      <!--&lt;!&ndash;<home-today-rush&ndash;&gt;-->
        <!--&lt;!&ndash;:bigItem="bigItem"&ndash;&gt;-->
        <!--&lt;!&ndash;:isShowActiveEnd="isShowActiveEnd"&ndash;&gt;-->
        <!--&lt;!&ndash;:activityTime="activityTime"&ndash;&gt;-->
        <!--&lt;!&ndash;:goodsList="goodsList"&ndash;&gt;-->
        <!--&lt;!&ndash;:goodsMore="goodsMore"&ndash;&gt;-->
        <!--&lt;!&ndash;@addShoppingCart="addShoppingCart"&ndash;&gt;-->
      <!--&lt;!&ndash;&gt;</home-today-rush>&ndash;&gt;-->
    <!--</div>-->
    <home-banner
      :bigItem="bannerInfo"
      :praiseIndex="praiseIndex"
      :isShow="bannerIsShow"
      @bannerChange="bannerChangeHandle"
    ></home-banner>
    <div class="empty"></div>
    <home-flash-sale
      :tabList="flashTabList"
      :tabIndex="flashTabIndex"
      :flashArray="flashArray"
      :countDownTimes="flashCountDownTimes"
      :isShow="flashIsShow"
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
      @changeTab="classifyChangeTab"
    ></home-classify>
    <custom-tab-bar currentType="index"></custom-tab-bar>
    <coupon-modal ref="couponModal"></coupon-modal>
    <!--<div v-show="classifyTabIsShow">-->
      <!--<classify-tab-->
        <!--:styles="classifyStyles"-->
        <!--id="scrollView-fixed"-->
        <!--:tabList="classifyTabList"-->
        <!--:viewToItem="classifyViewToItem"-->
        <!--:tabIndex="classifyTabIndex"-->
        <!--@changeTab="classifyChangeTab"-->
      <!--&gt;</classify-tab>-->
    <!--</div>-->
    <!--<home-hot-tab-->
      <!--:isShowTab="isShowTab"-->
      <!--:systemInfo="systemInfo"-->
      <!--:hotTabList="hotTabList"-->
    <!--&gt;</home-hot-tab>-->
  </div>
</template>

<script type="text/ecmascript-6">
  import NavigationBar from '@components/navigation-bar/navigation-bar'
  import CustomTabBar from '@components/custom-tab-bar/custom-tab-bar'
  // import LinkGroup from '@components/link-group/link-group'
  // import ConfirmMsg from '@components/confirm-msg/confirm-msg'
  import API from '@api'
  import {cartMethods} from '@state/helpers'
  import {getParams} from '@utils/common'
  import CouponModal from './coupon-modal/coupon-modal'
  import CouponModalMixins from './coupon-modal/coupon-modal-mixins'
  import HomePosition from './home-position/home-position'
  import Position from './home-position/position-mixins'
  import HomeBanner from './home-banner/home-banner'
  import Banner from './home-banner/banner-mixins'
  import HomeFlashSale from './home-flash-sale/home-flash-sale'
  import FlashSale from './home-flash-sale/flash-sale-mixins'
  import HomeClassify from './home-classify/home-classify'
  import Classify from './home-classify/classify-mixins'
  import ClassifyTab from './home-classify/home-classify-tab/home-classify-tab'
  // import HomeHot from './home-hot/home-hot'
  // import HomeHotTab from './home-hot-tab/home-hot-tab'
  // import HotTab from './home-hot-tab/hot-tab-mixins'
  // import HomeTodayRush from './home-today-rush/home-today-rush'
  // import TodayRush from './home-today-rush/today-rush-mixins'

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
      FlashSale
      // TodayRush,
      // HotTab
    ],
    components: {
      // LinkGroup,
      NavigationBar,
      CustomTabBar,
      // ConfirmMsg,
      CouponModal,
      HomePosition,
      HomeBanner,
      HomeFlashSale,
      HomeClassify,
      ClassifyTab
      // HomeHot,
      // HomeTodayRush,
      // HomeHotTab
    },
    data() {
      return {
        title: '赞播优鲜',
        curShopId: '',
        modulesList: [],
        systemInfo: {},
        homeStyles: 'overflow:hidden;height:100vh;min-height:100vh;max-height:100vh' // 为了获取商品分类的tab高度;获取后置空
      }
    },
    onLoad(options) {
      this._getSystemInfo()
      this._initPageParams(options)
    },
    async onShow() {
      if (!this.classifyScrollHeight) {
        this.$wechat.showLoading()
      }
      try {
        this.$sendMsg({
          event_no: 1000
        })
        ald.aldstat.sendEvent('首页')
        let shopId = wx.getStorageSync('shopId')
        if (!shopId) {
          let res = await API.Choiceness.getDefaultShopInfo()
          wx.setStorageSync('shopId', res.data.id)
          shopId = res.data.id
        }
        if (this.curShopId * 1 !== shopId * 1) {
          await this._getModuleInfo()
          this.curShopId = shopId
        }
        if (!wx.getStorageSync('token')) return
        this.setCartCount()
      } catch (e) {
        console.error(e)
      } finally {
        if (this.classifyScrollHeight) {
          this.$wechat.hideLoading()
        }
        // 3秒后强制关loading
        setTimeout(() => {
          this.$wechat.hideLoading()
        }, 3000)
      }
    },
    async onPullDownRefresh() {
      this._resetGetClassifyListParams()
      try {
        await this._getModuleInfo(false)
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
      return {
        title: `${this.groupInfo.social_name},次日达、直采直销，点击下单↓`,
        path: `/pages/choiceness?shopId=${this.curShopId}`,
        imageUrl: this.imageUrl + imgUrl,
        success: (res) => {
        },
        fail: (res) => {
        }
      }
    },
    methods: {
      ...cartMethods,
      // 初始化页面参数
      _initPageParams(options = {}) {
        if (options.scene) {
          let scene = decodeURIComponent(options.scene)
          let params = getParams(scene)
          this.shopId = params.shopId
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

  .empty
    height :15px
    background :#fff
</style>
