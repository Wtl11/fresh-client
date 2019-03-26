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
    <div class="modules-box" v-for="(bigItem, bigIndex) in modulesList" :key="bigIndex"
         v-if="locationStatus * 1 === 1 || locationStatus * 1 === 2">
      <!--轮播图-->
      <home-banner
        :bigItem="bigItem"
        :praiseIndex="praiseIndex"
        @bannerChange="bannerChangeHandle"
      ></home-banner>
      <!--导航-->
      <home-hot :bigItem="bigItem"></home-hot>
      <!--今日抢购-->
      <home-today-rush
        :bigItem="bigItem"
        :isShowActiveEnd="isShowActiveEnd"
        :activityTime="activityTime"
        :goodsList="goodsList"
        :goodsMore="goodsMore"
        @addShoppingCart="addShoppingCart"
      ></home-today-rush>
    </div>
    <custom-tab-bar currentType="index"></custom-tab-bar>
    <!--<link-group ref="groupComponents" :wechatInfo="groupInfo"></link-group>-->
    <!--<confirm-msg ref="refundModel" title="您的位置距该提货点超过1km" msg="建议您切换自提点" sureString="马上切换" @confirm="confirm" @cancel="cancel"></confirm-msg>-->
    <coupon-modal ref="couponModal"></coupon-modal>
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
  import HomeHot from './home-hot/home-hot'
  import HomeTodayRush from './home-today-rush/home-today-rush'
  import TodayRush from './home-today-rush/today-rush-mixins'

  const ald = getApp()
  const PAGE_NAME = 'CHOICENESS'
  export default {
    name: PAGE_NAME,
    mixins: [CouponModalMixins, Position, Banner, TodayRush],
    components: {
      // LinkGroup,
      NavigationBar,
      CustomTabBar,
      // ConfirmMsg,
      CouponModal,
      HomePosition,
      HomeBanner,
      HomeHot,
      HomeTodayRush
    },
    data() {
      return {
        title: '赞播优鲜',
        curShopId: '',
        modulesList: []
      }
    },
    onLoad(options) {
      this._initPageParams(options)
    },
    async onShow() {
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
          await this._getIndexModule(false)
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
      await this._getIndexModule(false)
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
      // 获取
      async _getIndexModule() {
        let res = await API.Choiceness.getModulesInfo({page_name: 'index'})
        if (res.error !== this.$ERR_OK) {
          this.$wechat.showToast(res.message)
          return
        }
        this.modulesList = res.data.modules
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
 @import "~@designCommon"

  .choiceness
    max-width: 100vw
    min-height: 100vh
    background: #fff
    overflow-x: hidden
</style>
