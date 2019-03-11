<template>
  <div class="choiceness">
    <navigation-bar :title="shopName" :showArrow="false"></navigation-bar>
    <div class="community-box">
      <div class="community-main">
      <!--<div class="community-main" @click="jumpSelfPoint">-->
        <div class="community-img">
          <img v-if="(locationStatus * 1 === 1 || locationStatus * 1 === 2) && imageUrl" :src="groupInfo.head_image_url || imageUrl+'/yx-image/order/icon-colonel_head@2x.png'">
        </div>
        <div class="community-text" v-if="locationStatus * 1 === 1 || locationStatus * 1 === 2">
          {{groupInfo.social_name}}
        </div>
        <div class="community-text" v-else>定位中...</div>
        <!--<img v-if="imageUrl && (locationStatus * 1 === 1 || locationStatus * 1 === 2) && groupInfo.social_name"-->
             <!--:src="imageUrl + '/yx-image/choiceness/icon-pitch@2x.png'" class="community-down">-->
      </div>
      <div class="carousel-wrapper" v-if="buyUsers.length > 0 && (locationStatus * 1 === 1 || locationStatus * 1 === 2)"
           :class="{'show': showBuyUser}">
        <div class="avatar-wrapper">
          <img :src="buyUsers[showUserIndex].head_image_url" alt="">
        </div>
        <div class="content">买了{{buyUsers[showUserIndex].goods_name}}</div>
      </div>
    </div>
    <div class="modules-box" v-for="(bigItem, bigIndex) in modulesList" :key="bigIndex"
         v-if="locationStatus * 1 === 1 || locationStatus * 1 === 2">
      <!--轮播图-->
      <div class="banner-box" v-if="bigItem.module_name === 'bannar' && bigItem.content_data.length !== 0">
        <swiper class="banner" autoplay interval="5000" display-multiple-items="1" previous-margin="7.5px"
                next-margin="17.5px" circular @change="_setPraiseIndex">
          <block v-for="(item,index) in bigItem.content_data.list" :key="index">
            <swiper-item class="banner-item" :class="{'current-banner-active': praiseIndex === index}">
              <img class="item-img" mode="aspectFill" v-if="item.image_url" :src="item.image_url"
                   @click="jumpDetail(item)">
            </swiper-item>
          </block>
        </swiper>
      </div>
      <!--导航-->
      <div class="nav-list" v-if="bigItem.module_name === 'navigation' && bigItem.content_data.length !== 0">
        <div class="nav-item" v-for="(navItem, navIndex) in bigItem.content_data.list" :key="navIndex"
             @click="jumpNavType(navItem)">
          <img v-if="navItem.image_url" :src="navItem.image_url" alt="" class="nav-top-box" mode="aspectFill">
          <div class="nav-top-text">{{navItem.title}}</div>
        </div>
      </div>
      <!--今日抢购-->
      <div class="goods-all-box" v-if="bigItem.module_name === 'activity'">
        <div class="nav-list-border"></div>
        <div class="goods-title-box">
          <div class="goods-title-main">
            <div class="goods-box-icon" :class="'corp-' + corpName + '-label'"></div>
            <div class="goods-title-text">今日抢购</div>
            <div class="goods-title-sub">今日下单 次日提货</div>
            <div class="goods-time-box">
              <img class="goods-time-box-img" mode="aspectFill" v-if="imageUrl && corpName === 'platform'"
                   :src="imageUrl + '/yx-image/choiceness/pic-today_bg@2x.png'">
              <img class="goods-time-box-img" mode="aspectFill" v-if="imageUrl && corpName === 'retuan'"
                   :src="imageUrl + '/yx-image/retuan/pic-today_bg@2x.png'">
              <div class="goods-text-box">
                <div class="top-text" :class="'corp-' + corpName + '-time'">距结束</div>
                <div class="top-text"  :class="'corp-' + corpName + '-time'">{{activityTime.hour}}:{{activityTime.minute}}:{{activityTime.second}}</div>
              </div>
            </div>
          </div>
        </div>
        <div class="goods-box">
          <div class="goods-list" v-for="(item, index) in goodsList" :key="index" @click="jumpGoodsDetail(item)">
            <div class="goods-left">
              <img class="goods-left-img" mode="aspectFill" v-if="item.goods_cover_image" :src="item.goods_cover_image">
              <img class="goods-left-icon" mode="aspectFill" v-if="imageUrl && corpName === 'platform'"
                   :src="imageUrl + '/yx-image/choiceness/icon-label@2x.png'">
              <img class="goods-left-icon" mode="aspectFill" v-if="imageUrl && corpName === 'retuan'"
                   :src="imageUrl + '/yx-image/retuan/icon-label@2x.png'">
            </div>
            <div class="goods-right">
              <div class="goods-right-top">
                <div class="title">{{item.name}}</div>
                <div class="text-sub" v-if="item.describe" :class="item.describe ? 'has-title' : ''">{{item.describe}}</div>
                <!--<div class="text-sales-box">-->
                  <!--<div class="text-sales">已售{{item.sale_count}}件</div>-->
                <!--</div>-->
              </div>
              <div class="add-box">
                <div class="add-box-left">
                  <section class="left">
                    <!--<div class="text-group" :class="'corp-' + corpName + '-money'">团购价</div>-->
                    <img class="text-group-img" mode="aspectFill" v-if="imageUrl && corpName === 'platform'"
                         :src="imageUrl + '/yx-image/choiceness/pic-price_bg@2x.png'">
                    <img class="text-group-img" mode="aspectFill" v-if="imageUrl && corpName === 'retuan'"
                         :src="imageUrl + '/yx-image/retuan/pic-price_rtbg@2x.png'">
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
        </div>
        <div class="foot-ties" v-if="goodsMore && goodsList.length !== 0">
          <div class="left lines"></div>
          <div class="center">已经到底了</div>
          <div class="bot lines"></div>
        </div>
        <div class="noting" v-if="goodsMore && goodsList.length === 0">
          <div class="notingimg"><img class="img" :src="imageUrl + '/yx-image/group/pic-kong@2x.png'" alt=""></div>
          <div class="txt">活动即将开始，敬请期待</div>
        </div>
      </div>
    </div>
    <custom-tab-bar currentType="index"></custom-tab-bar>
    <link-group ref="groupComponents" :wechatInfo="groupInfo"></link-group>
    <confirm-msg ref="refundModel" title="您的位置距该提货点超过1km" msg="建议您切换自提点" sureString="马上切换" @confirm="confirm" @cancel="cancel"></confirm-msg>
  </div>
</template>

<script type="text/ecmascript-6">
  import NavigationBar from '@components/navigation-bar/navigation-bar'
  import CustomTabBar from '@components/custom-tab-bar/custom-tab-bar'
  import LinkGroup from '@components/link-group/link-group'
  import ConfirmMsg from '@components/confirm-msg/confirm-msg'
  import API from '@api'
  import {cartMethods} from '@state/helpers'
  import {getParams} from '@utils/common'

  const ald = getApp()
  const PAGE_NAME = 'CHOICENESS'
  export default {
    name: PAGE_NAME,
    data() {
      return {
        praiseIndex: 0,
        tabIdx: 0,
        groupInfo: {},
        goodsList: [],
        goodsMore: false,
        goodsPage: 2,
        title: '赞播优鲜',
        curShopId: '',
        showBuyUser: false,
        buyUsers: [],
        showUserIndex: 0,
        modulesList: [],
        locationStatus: null,
        goodsListData: null,
        activityTime: {
          day: '00',
          hour: '00',
          minute: '00',
          second: '00'
        }
      }
    },
    async onLoad(options) {
      if (options.scene) {
        let scene = decodeURIComponent(options.scene)
        let params = getParams(scene)
        this.shopId = params.shopId
      } else {
        this.shopId = options.shopId
      }
      this.shopId && wx.setStorageSync('shopId', this.shopId)
      if (wx.getStorageSync('locationShow') * 1 === 3 || wx.getStorageSync('locationShow') * 1 === 2) {
      } else {
        let that = this
        wx.getLocation({
          async success(res) {
            wx.setStorageSync('locationData', res)
            wx.setStorageSync('locationShow', 1)
            that.locationStatus = 1
            that.getLocationData()
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
    async onShow() {
      this.$sendMsg({
        event_no: 1000
      })
      this.locationStatus = wx.getStorageSync('locationShow')
      if (this.locationStatus * 1 === 3) {
        wx.navigateTo({
          url: `/pages/open-location`
        })
      }
      if (this.locationStatus * 1 === 1) {
        this.getLocationData()
      }
      ald.aldstat.sendEvent('首页')
      this._getBuyUsers()
      let shopId = wx.getStorageSync('shopId')
      if (!shopId) {
        let res = await API.Choiceness.getDefaultShopInfo()
        wx.setStorageSync('shopId', res.data.id)
        shopId = res.data.id
      }
      if (this.curShopId * 1 !== shopId * 1) {
        await this._groupInfo(false)
        await this._getIndexModule(false)
        this.curShopId = shopId
      }
      if (!wx.getStorageSync('token')) return
      this.setCartCount()
    },
    onHide() {
      this.carouselTimer && clearTimeout(this.carouselTimer)
      this.showCarouselTimer && clearTimeout(this.showCarouselTimer)
      this.showUserIndex = 0
      this.showBuyUser = false
    },
    onReachBottom() {
      this.getMoreGoodsList()
    },
    async onPullDownRefresh() {
      await this._groupInfo(true)
      await this._getIndexModule(false)
      this.goodsPage = 2
      this.goodsMore = false
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
    onUnload() {
      clearInterval(this.timer)
    },
    methods: {
      ...cartMethods,
      _getBuyUsers() {
        API.Choiceness.getUserImg({limit: 20}).then((res) => {
          if (res.error !== this.$ERR_OK) {
            this.$wechat.showToast(res.message)
            return
          }
          this.buyUsers = res.data
          this._handleBuyUserCarousel()
        })
      },
      getLocationData() {
        let data = wx.getStorageSync('locationData')
        API.Choiceness.getLocationDistance({longitude: data.longitude || 0, latitude: data.latitude || 0}).then((res) => {
          if (res.error !== this.$ERR_OK) {
            return
          }
          let msgStatus = wx.getStorageSync('msgStatus')
          if (msgStatus !== 4 && res.data.distance > 1000) {
            // this.$refs.refundModel.show()
          }
        })
      },
      _handleBuyUserCarousel() {
        this.showCarouselTimer = setTimeout(() => {
          this.showBuyUser = true
        }, 1000)
        this.carouselTimer = setTimeout(() => {
          this.showBuyUser = false
          if (this.showUserIndex + 1 >= this.buyUsers.length) {
            clearTimeout(this.carouselTimer)
            return
          }
          setTimeout(() => {
            this.showUserIndex += 1
            this._handleBuyUserCarousel()
          }, 300)
        }, 5000)
      },
      _setPraiseIndex(e) {
        this.praiseIndex = e.target.current
      },
      linkGroup() {
        this.$refs.groupComponents.showLink()
      },
      async _groupInfo(loading) {
        let res = await API.Choiceness.getGroupInfo(loading)
        this.$wechat.hideLoading()
        if (res.error !== this.$ERR_OK) {
          this.$wechat.showToast(res.message)
        }
        this.groupInfo = res.data
      },
      jumpDetail(item) {
        if (item.type === 'mini_goods') {
          wx.navigateTo({
            url: `/pages/goods-detail?id=${item.other_id}&activityId=${item.activity_id}`
          })
        } else if (item.type === 'goods_cate') {
          wx.navigateTo({
            url: `/pages/classify?id=${item.other_id}`
          })
        } else if (item.type === 'mini_link') {
          wx.navigateTo({
            url: `${item.url}`
          })
        } else {
          wx.navigateTo({
            url: `/pages/out-html?url=${item.url}`
          })
        }
      },
      jumpNavType(item) {
        if (item.type === 'mini_goods') {
          wx.navigateTo({
            url: `/pages/goods-detail?id=${item.other_id}&activityId=${item.activity_id}`
          })
        } else if (item.type === 'goods_cate') {
          wx.navigateTo({
            url: `/pages/classify?id=${item.other_id}`
          })
        } else if (item.type === 'mini_link') {
          wx.navigateTo({
            url: `${item.url}`
          })
        } else {
          wx.navigateTo({
            url: `/pages/out-html?url=${item.url}`
          })
        }
      },
      jumpGoodsDetail(item) {
        wx.navigateTo({
          url: `/pages/goods-detail?id=${item.goods_id}&activityId=${item.activity_id}`
        })
      },
      getMoreGoodsList() {
        if (this.goodsMore) {
          return
        }
        let data = {
          activity_id: this.goodsListData.content_data.other_id,
          page: this.goodsPage,
          limit: 10
        }
        API.Choiceness.getGoodsShelfList(data, true).then((res) => {
          this.$wechat.hideLoading()
          if (res.error === this.$ERR_OK) {
            this.goodsList = this.goodsList.concat(res.data)
            this._isUpList(res)
          } else {
            this.$wechat.showToast(res.message)
          }
        })
      },
      _isUpList(res) {
        this.goodsPage++
        if (this.goodsList.length >= res.meta.total * 1) {
          this.goodsMore = true
        }
      },
      addShoppingCart(item) {
        if (!this.$isLogin()) {
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
      async _getIndexModule() {
        let res = await API.Choiceness.getModulesInfo({page_name: 'index'})
        if (res.error !== this.$ERR_OK) {
          this.$wechat.showToast(res.message)
          return
        }
        this.modulesList = res.data.modules
        this.modulesList.forEach((item) => {
          if (item.module_name === 'activity') {
            this.goodsList = item.content_data.list
            this._kanTimePlay(item.content_data.last_time)
            this.goodsListData = item
            this.goodsPage = 2
            this.goodsMore = false
            if (this.goodsList.length === 0) {
              this.goodsMore = true
            }
          }
        })
      },
      cancel() {
        wx.setStorageSync('msgStatus', 4)
      },
      confirm() {
        wx.setStorageSync('msgStatus', 4)
        wx.navigateTo({
          url: `/pages/self-point`
        })
      },
      jumpSelfPoint() {
        wx.navigateTo({
          url: `/pages/self-point`
        })
      },
      _kanTimePlay(time) {
        clearInterval(this.timer)
        this.end_time = time
        this.timer = setInterval(() => {
          if (this.end_time > 0) {
            this.end_time--
          }
          this.activityTime = this._groupTimeCheckout(this.end_time)
          if (this.timeEnd) {
            clearInterval(this.timer)
          }
        }, 1000)
      },
      _groupTimeCheckout(time) {
        let differ = time * 1
        let day = Math.floor(differ / (60 * 60 * 24))
        day = day >= 10 ? day : '0' + day
        let hour = Math.floor(differ / (60 * 60)) - (day * 24)
        hour = hour >= 10 ? hour : '0' + hour
        let minute = Math.floor(differ / 60) - (day * 24 * 60) - (hour * 60)
        minute = minute >= 10 ? minute : '0' + minute
        let second = Math.floor(differ) - (day * 24 * 60 * 60) - (hour * 60 * 60) - (minute * 60)
        second = second >= 10 ? second : '0' + second
        let times
        if (differ > 0) {
          times = {
            day,
            hour,
            minute,
            second
          }
          this.timeEnd = false
        } else {
          times = {
            day: '00',
            hour: '00',
            minute: '00',
            second: '00'
          }
          this.timeEnd = true
        }
        return times
      }
    },
    components: {
      LinkGroup,
      NavigationBar,
      CustomTabBar,
      ConfirmMsg
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

  .community-box
    layout(row)
    justify-content: space-between
    align-items: center
    padding: 0 12px
    box-sizing: border-box
    margin-bottom: 8px
    .community-main
      layout(row)
      align-items: center
      .community-img
        width: 28px
        height: 28px
        margin-right: 8px
        img
          width: 100%
          height: 100%
          display: block
          border-radius: 50%
      .community-text
        color: $color-text-main
        font-size: $font-size-16
        font-family: $font-family-medium
        min-height: $font-size-18
        max-width: 40vw
        no-wrap()
        margin-right: 5px
      .community-down
        width: 9px
        height: 6px
        display: block

  .carousel-wrapper
    layout(row)
    max-width: 100%
    align-items: center
    height: 24px
    padding: 0 9.5px 0 3px
    background: rgba(0, 0, 0, .5)
    border-radius: 36px
    transition: opacity .3s
    opacity: 0
    &.show
      opacity: 1
    .avatar-wrapper
      width: 20px
      height: 20px
      margin-right: 3px
      border-radius: 50%
      overflow: hidden
      img
        width: 100%
        height: 100%
    .content
      flex: 1
      overflow: hidden
      font-size: $font-size-10
      line-height: 24px
      color: $color-white
      max-width: 24vw
      no-wrap()

  .banner-box
    height: 40vw
    box-sizing: border-box
    position: relative
    border-radius: 6px !important
    overflow: hidden !important
    .banner
      width: 100vw
      height: 100%
      border-radius: 6px !important
      transform: translateY(0)
      overflow: hidden !important
      .banner-item
        width: 100%
        height: 100%
        position: relative
        border-radius: 6px !important
        transform: translateY(0)
        overflow: hidden !important
        layout(row)
        align-items: center
        .item-img
          width: 100%
          height: 95%
          display: block
          border-radius: 6px !important
          transform: translateY(0)
          overflow: hidden !important
          margin-left: 10px
      .current-banner-active
        .item-img
          width: 100%
          height: 100%
          transition: all .5s
  .nav-list
    layout(row)
    align-items: center
    padding-bottom: 23px
    .nav-item
      width: 20%
      margin-top: 15px
      .nav-top-box
        width: 52px
        height: 52px
        margin: 0 auto 5px
        display: block
        border-radius: 50%
      .nav-top-text
        font-size: $font-size-12
        font-family: $font-family-regular
        color: #333
        text-align: center

  .nav-list-border
    height: 10px
    background: $color-background

  .goods-title-box
    padding: 0 5px
    box-sizing: border-box
    border-bottom-1px($color-line)
    background: $color-background
    .goods-title-main
      layout(row)
      align-items: center
      height: 45px
      background: $color-white
      border-top-left-radius: 8px
      border-top-right-radius: 8px
      box-sizing: border-box
      padding-left: 6px
      overflow: hidden
      position: relative
      .goods-box-icon
        width: 4px
        height: 14px
        margin-right: 6px
      .goods-title-text
        font-size: $font-size-16
        color: $color-text-main
        font-family: $font-family-medium
        margin-right: 6px
      .goods-title-icon
        width: 4px
        height: 4px
        background: $color-money
        margin: 0 5px
        border-radius: 50%
      .goods-title-sub
        font-size: $font-size-13
        color: $color-text-sub
        font-family: $font-family-regular
      .goods-time-box
        position: absolute
        right: 0
        top: 0
        height: 45px
        width: 90px
        overflow: hidden
        z-index: 98
        .goods-time-box-img
          position: absolute
          right: 0
          top: 0
          display: block
          height: 45px
          width: 90px
        .goods-text-box
          position: absolute
          right: 0
          top: 0
          height: 45px
          width: 75px
          layout()
          align-items: center
          justify-content: center
          .top-text
            font-size: $font-size-12
            line-height: $font-size-14
            font-family: $font-family-regular
          .top-text-bottom
            margin-bottom: 3px

  .goods-box
    padding: 0 3.2vw
    box-sizing: border-box
    .goods-list
      height: 40.5vw
      layout(row)
      border-bottom-1px(#e6e6e6)
      align-items: center
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
          left: -5px
          top: -5px
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

  .foot-ties
    layout(row)
    justify-content: center
    align-items: center
    height: 60px
    box-sizing: border-box
    padding-top: 25px
    padding-bottom: 20px
    .lines
      width: 10px
      height: 1px
      background: rgba(124, 132, 156, 0.20)
      margin: 0 5px
    .center
      font-family: $font-family-regular
      font-size: $font-size-14
      color: rgba(152, 152, 159, 0.30)
      text-align: justify
      line-height: 1

  .noting
    text-align: center
    margin-top: 50px
    .notingimg
      width: 116px
      height: 110px
      margin: 0 auto 15px
      .img
        display: block
        width: 100%
        height: 100%
    .txt
      font-family: $font-family-regular
      font-size: $font-size-14
      color: $color-text-sub

  .txt
    height: 100px

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
</style>
