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
    <article v-if="flashIsShow" class="home-flash-sale" id="homeFlashSale">
      <section class="top-wrapper">
        <div class="inner-wrapper">
          <div class="left-wrapper">
            <figure class="button" @click="flashNavHandle">
              <img class="img" mode="aspectFill" v-if="imageUrl" :src="imageUrl + '/yx-image/2.1/pic-title_xsqg@2x.png'">
            </figure>
            <p class="time">{{flashCountDownTimes.hour}}<span class="dot">:</span>{{flashCountDownTimes.minute}}<span class="dot">:</span>{{flashCountDownTimes.second}}</p>
          </div>
          <ul class="right-wrapper">
            <li v-for="(item, index) in flashTabList" :key="item.id" class="right-item" @click="flashChangeTab(item, index)">
              <p class="text" :class="{active: flashTabIndex === index}">{{item.at}}</p>
              <p class="explain" :class="{active: flashTabIndex === index}">{{item.at_str}}</p>
            </li>
          </ul>
        </div>
      </section>
      <scroll-view
        class="bottom-wrapper"
        scroll-x
      >
        <div
          v-for="(child, idx) in flashArray"
          :key="idx" class="bottom-item-wrapper"
          :class="flashArray.length> 4 && idx === flashArray.length -1?'item-r-0':''"
          :id="'child'+idx"
        >
          <home-flash-item :dataInfo="child"></home-flash-item>
          <section v-if="flashArray.length> 4 && idx === flashArray.length -1" class="look-more">
            <div class="look-wrapper" @click="flashNavHandle">
              <div class="text">查看更多</div>
              <figure class="more-icon">
                <img class="img" mode="aspectFill" v-if="imageUrl" :src="imageUrl + '/yx-image/2.1/icon-pressed_gd@2x.png'">
              </figure>
            </div>
          </section>
        </div>
      </scroll-view>
    </article>
    <!--<home-flash-sale-->
      <!--:tabList="flashTabList"-->
      <!--:tabIndex="flashTabIndex"-->
      <!--:flashArray="flashArray"-->
      <!--:countDownTimes="flashCountDownTimes"-->
      <!--:isShow="flashIsShow"-->
      <!--:systemInfo="systemInfo"-->
      <!--@changeTab="flashChangeTab"-->
    <!--&gt;</home-flash-sale>-->
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
  import {getParams, countDownHandle} from '@utils/common'
  import CouponModal from './coupon-modal/coupon-modal'
  import CouponModalMixins from './coupon-modal/coupon-modal-mixins'
  import HomePosition from './home-position/home-position'
  import Position from './home-position/position-mixins'
  import HomeBanner from './home-banner/home-banner'
  import Banner from './home-banner/banner-mixins'
  import HomeFlashItem from './home-flash-item/home-flash-item'
  import HomeClassify from './home-classify/home-classify'
  import Classify from './home-classify/classify-mixins'
  import ClassifyTab from './home-classify/home-classify-tab/home-classify-tab'

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
      Classify
    ],
    components: {
      NavigationBar,
      CustomTabBar,
      CouponModal,
      HomePosition,
      HomeBanner,
      HomeClassify,
      ClassifyTab,
      HomeFlashItem
    },
    data() {
      return {
        flashTabList: [],
        flashTabIndex: 0,
        flashArray: [],
        flashCountDownTimes: {
          hour: '00',
          minute: '00',
          second: '00'
        },
        flashIsShow: false,
        flashCountDownTimer: 0,
        title: '赞播优鲜',
        curShopId: '',
        modulesList: [],
        systemInfo: {}
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
        if (this.curShopId * 1 !== shopId * 1) {
          await this._getModuleInfo()
          this.curShopId = shopId
        }
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
      //
      flashNavHandle() {
        const id = this.flashTabList[this.flashTabIndex].id
        wx.navigateTo({url: `/pages/flash-sale-list?id=${id}`})
      },
      // tab切换
      flashChangeTab(item, index) {
        if (this.flashTabIndex === index) return
        this.flashTabIndex = index
        this._getTabList(false)
      },
      // 获取限时活动列表
      async _getFlashList(loading) {
        if (this.flashTabList && this.flashTabList.length === 0) {
          this.flashIsShow = false
          return
        }
        this._countDownAction()
        if (!this.flashTabList[this.flashTabIndex]) return
        let data = {
          activity_id: this.flashTabList[this.flashTabIndex].id || 0
        }
        try {
          let res = await API.FlashSale.getFlashList(data, loading)
          this.flashArray = res.data
        } catch (e) {
          console.error(e)
        }
      },
      // tab-list
      async _getTabList(loading = false) {
        try {
          let res = await API.FlashSale.getFlashTabList('', loading)
          this.flashTabList = res.data
          this._getFlashList()
        } catch (e) {
          console.error(e)
        }
      },
      // 倒计时
      _countDownAction() {
        if (!this.flashTabList || !this.flashTabList[this.flashTabIndex]) return
        let currentTime = this.flashTabList[this.flashTabIndex].at_diff || 0
        if (currentTime < 0) {
          currentTime = 0
        }
        this.flashCountDownTimes = countDownHandle(currentTime)
        this.flashCountDownTimer && clearInterval(this.flashCountDownTimer)
        this.flashCountDownTimer = setInterval(() => {
          currentTime--
          this.flashCountDownTimes = countDownHandle(currentTime)
          if (!this.flashCountDownTimes || !this.flashCountDownTimes.differ || this.flashCountDownTimes.differ <= 0) {
            clearInterval(this.flashCountDownTimer)
            this._getTabList()
          }
        }, 1000)
      },
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

 .img
   width :100%
   height :100%
   display :block

 .home-flash-sale
   width: 100%
   background: $color-background
   border-bottom :10px solid $color-background
   .bottom-wrapper
     height:47.733333333333334vw
     border-top-1px($color-line)
     display: block
     width: 100vw
     background: $color-white
     white-space: nowrap
     box-sizing: border-box
     transform: translate3d(0,0,0)
     position :relative
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
       padding-top :2.933333333333333vw
       padding-bottom :4vw
       padding-right :2.2133333333333334vw
       overflow :hidden
       &.item-r-2vw
         padding-right :2.2133333333333334vw
       &.item-r-0
         padding-right :0
       &:first-child
         padding-left :3.253333333333333vw
       .look-more
         padding-left :2.2133333333333334vw
         .look-wrapper
           width :55px
           height :100%
           layout()
           justify-content :center
           align-items :center
           border-left-1px($color-line)
           .text
             font-family :$font-family-regular
             color: $color-text-sub
             font-size :13px
             width :13px
             letter-spacing :2px
             white-space :normal
             word-wrap: break-word
             word-break :break-all
           .more-icon
             margin-top :3.5px
             width :13px
             height:@width

   .top-wrapper
     height :18.133333333333333vw
     padding :2.666666666666667vw 1.3333333333333335vw 0
     box-sizing :border-box
     .inner-wrapper
       height :15.466666666666667vw
       background :#fff
       border-radius :8px 8px 0 0
       box-sizing :border-box
       padding :2.933333333333333vw 0
       layout(row,block,nowrap)
       .left-wrapper
         flex: 1
         padding-left :1.6vw
         overflow :hidden
         .button
           width :25.066666666666666vw
           height :4.8vw
         .time
           padding-top :1.0666666666666667vw
           font-family: DINAlternate-Bold
           font-size: 3.4666666666666663vw
           color: $color-text-sub
           .dot
             position :relative
             bottom :0.26666666666666666vw
             padding :0 0.6666666666666667vw
       .right-wrapper
         layout(row,block,nowrap)
         padding-right :0.8vw
         .right-item
           text-align :center
           padding :0 1.3333333333333335vw
           .text
             width :16vw
             height :5.6000000000000005vw
             background: #fff
             border-radius: @height
             font-family: $font-family-medium
             font-size: 4.8vw
             color: $color-text-sub
             line-height :@height
             transition :all 0.3s
             &.active
               color: #FFFFFF;
               background: #FF8506
           .explain
             padding-top :0.6666666666666667vw
             font-family: $font-family-regular
             font-size: 3.2vw
             color: $color-text-sub
             transition :all 0.3s
             &.active
               color: #FF8506
</style>
