<template>
  <div class="choiceness">
    <navigation-bar :title="shopName" :showArrow="false"></navigation-bar>
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
    <!--<article v-if="flashIsShow" class="home-flash-sale" id="homeFlashSale">-->
      <!--<section class="top-wrapper">-->
        <!--<div class="inner-wrapper">-->
          <!--<div class="left-wrapper">-->
            <!--<figure class="button" @click="flashNavHandle">-->
              <!--<img class="img" mode="aspectFill" v-if="imageUrl" :src="imageUrl + '/yx-image/2.1/pic-title_xsqg@2x.png'">-->
            <!--</figure>-->
            <!--<p class="time">{{flashCountDownTimes.hour}}<span class="dot">:</span>{{flashCountDownTimes.minute}}<span class="dot">:</span>{{flashCountDownTimes.second}}</p>-->
          <!--</div>-->
          <!--<ul class="right-wrapper">-->
            <!--<li v-for="(item, index) in flashTabList" :key="item.id" class="right-item" @click="flashChangeTab(item, index)">-->
              <!--<p class="text" :class="{active: flashTabIndex === index}">{{item.at}}</p>-->
              <!--<p class="explain" :class="{active: flashTabIndex === index}">{{item.at_str}}</p>-->
            <!--</li>-->
          <!--</ul>-->
        <!--</div>-->
      <!--</section>-->
      <!--<scroll-view-->
        <!--class="bottom-wrapper"-->
        <!--scroll-x-->
      <!--&gt;-->
        <!--<div-->
          <!--v-for="(child, idx) in flashArray"-->
          <!--:key="idx" class="bottom-item-wrapper"-->
          <!--:class="flashArray.length> 4 && idx === flashArray.length -1?'item-r-0':''"-->
          <!--:id="'child'+idx"-->
        <!--&gt;-->
          <!--<home-flash-item :dataInfo="child"></home-flash-item>-->
          <!--<section v-if="flashArray.length> 4 && idx === flashArray.length -1" class="look-more">-->
            <!--<div class="look-wrapper" @click="flashNavHandle">-->
              <!--<div class="text">查看更多</div>-->
              <!--<figure class="more-icon">-->
                <!--<img class="img" mode="aspectFill" v-if="imageUrl" :src="imageUrl + '/yx-image/2.1/icon-pressed_gd@2x.png'">-->
              <!--</figure>-->
            <!--</div>-->
          <!--</section>-->
        <!--</div>-->
      <!--</scroll-view>-->
    <!--</article>-->
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
      @changeTab="classifyChangeTab"
    ></home-classify>
    <custom-tab-bar currentType="index"></custom-tab-bar>
    <coupon-modal ref="couponModal"></coupon-modal>
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
  import ClassifyTab from './home-classify/home-classify-tab/home-classify-tab'
  import HomeFlashSale from './home-flash-sale/home-flash-sale'
  import FlashSale from './home-flash-sale/flash-sale-mixins'

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
    ],
    components: {
      NavigationBar,
      CustomTabBar,
      CouponModal,
      HomePosition,
      HomeBanner,
      HomeClassify,
      ClassifyTab,
      HomeFlashSale
    },
    data() {
      return {
        // flashTabList: [],
        // flashTabIndex: 0,
        // flashArray: [],
        // flashCountDownTimes: {
        //   hour: '00',
        //   minute: '00',
        //   second: '00'
        // },
        // flashIsShow: false,
        // flashCountDownTimer: 0,
        title: '赞播优鲜',
        curShopId: '',
        modulesList: [],
        systemInfo: {}
        // isFirstLoad: true
        // homeStyles: 'overflow:hidden;height:100vh;min-height:100vh;max-height:100vh' // 为了获取商品分类的tab高度;获取后置空
      }
    },
    onLoad(options) {
      this._getSystemInfo()
      this._initPageParams(options)
    },
    async onShow() {
      this.$wechat.showLoading()
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
        // 获取团的信息
        this._groupInfo(false)
        if (this.curShopId * 1 !== shopId * 1) {
          await this._getModuleInfo()
          this.curShopId = shopId
        } else {
          await this._getFlashTabList()
        }
        // 获取tab高度
        this._getTabPosition()
        if (!wx.getStorageSync('token')) return
        this.setCartCount()
      } catch (e) {
        console.error(e)
      } finally {
        this.$wechat.hideLoading()
      }
    },
    async onPullDownRefresh() {
      this._resetGetClassifyListParams()
      try {
        await this._getModuleInfo(false)
        // 获取tab高度
        this._getTabPosition()
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
      // //
      // flashNavHandle() {
      //   const id = this.flashTabList[this.flashTabIndex].id
      //   wx.navigateTo({url: `/pages/flash-sale-list?id=${id}`})
      // },
      // // tab切换
      // flashChangeTab(item, index) {
      //   if (this.flashTabIndex === index) return
      //   this.flashTabIndex = index
      //   this._getTabList(false)
      // },
      // // 获取限时活动列表
      // async _getFlashList(loading) {
      //   if (this.flashTabList && this.flashTabList.length === 0) {
      //     this.flashIsShow = false
      //     return
      //   }
      //   this._countDownAction()
      //   if (!this.flashTabList[this.flashTabIndex]) return
      //   let data = {
      //     activity_id: this.flashTabList[this.flashTabIndex].id || 0
      //   }
      //   try {
      //     let res = await API.FlashSale.getFlashList(data, loading)
      //     this.flashArray = res.data
      //   } catch (e) {
      //     console.error(e)
      //   }
      // },
      // // tab-list
      // async _getTabList(loading = false) {
      //   try {
      //     let res = await API.FlashSale.getFlashTabList('', loading)
      //     this.flashTabList = res.data
      //     this._getFlashList()
      //   } catch (e) {
      //     console.error(e)
      //   }
      // },
      // // 倒计时
      // _countDownAction() {
      //   if (!this.flashTabList || !this.flashTabList[this.flashTabIndex]) return
      //   let currentTime = this.flashTabList[this.flashTabIndex].at_diff
      //   if (currentTime == null || !this.flashIsShow) {
      //     return
      //   }
      //   if (currentTime < 0) {
      //     currentTime = 0
      //   }
      //   this.flashCountDownTimes = countDownHandle(currentTime)
      //   this._clearFlashTimer()
      //   this._countDownTimeout(currentTime)
      //   // this.flashCountDownTimer && clearInterval(this.flashCountDownTimer)
      //   // this.flashCountDownTimer = setInterval(() => {
      //   //   currentTime--
      //   //   this.flashCountDownTimes = countDownHandle(currentTime)
      //   //   if (!this.flashCountDownTimes || !this.flashCountDownTimes.differ || this.flashCountDownTimes.differ <= 0) {
      //   //     clearInterval(this.flashCountDownTimer)
      //   //     this._getTabList()
      //   //   }
      //   // }, 1000)
      // },
      // _countDownTimeout(currentTime) {
      //   ald.globalData.$flashCountDownTimer = setTimeout(() => {
      //     console.log(currentTime)
      //     currentTime--
      //     this.flashCountDownTimes = countDownHandle(currentTime)
      //     if (!this.flashCountDownTimes || !this.flashCountDownTimes.differ || this.flashCountDownTimes.differ <= 0) {
      //       this._clearFlashTimer()
      //       this._getTabList()
      //     } else {
      //       this._countDownTimeout(currentTime)
      //     }
      //   }, 1000)
      // },
      // _clearFlashTimer() {
      //   clearInterval(ald.globalData.$flashCountDownTimer)
      //   clearTimeout(ald.globalData.$flashCountDownTimer)
      // },
      // 初始化页面参数
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

  .empty
    height :15px
    background :#fff

</style>
