<template>
  <div class="choiceness">
    <navigation-bar :title="title" :showArrow="false"></navigation-bar>
    <div class="community-box">
      <div class="community-main" @click="jumpSelfPoint">
        <div class="community-img">
          <img v-if="locationStatus * 1 === 1 || locationStatus * 1 === 2" :src="groupInfo.head_image_url">
        </div>
        <div class="community-text" v-if="locationStatus * 1 === 1 || locationStatus * 1 === 2">
          {{groupInfo.social_name}}
        </div>
        <div class="community-text" v-else>定位中...</div>
        <img v-if="imageUrl && locationStatus * 1 === 1 || locationStatus * 1 === 2"
             :src="imageUrl + '/yx-image/choiceness/icon-pitch@2x.png'" class="community-down">
      </div>
      <div class="carousel-wrapper" v-if="buyUsers.length > 0 && (locationStatus * 1 === 1 || locationStatus * 1 === 2)"
           :class="{'show': showBuyUser}">
        <div class="avatar-wrapper">
          <img :src="buyUsers[showUserIndex].head_image_url" alt="">
        </div>
        <div class="content">刚购买了{{buyUsers[showUserIndex].goods_name}}</div>
      </div>
    </div>
    <div class="modules-box" v-for="(bigItem, bigIndex) in modulesList" :key="bigIndex"
         v-if="locationStatus * 1 === 1 || locationStatus * 1 === 2">
      <!--轮播图-->
      <div class="banner-box" v-if="bigItem.module_name === 'bannar' && bigItem.content_data.length !== 0">
        <swiper class="banner" :current="praiseIndex" autoplay interval="5000" display-multiple-items="1" previous-margin="7.5px"
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
            <img v-if="imageUrl" :src="imageUrl + '/yx-image/choiceness/icon-clock@2x.png'" class="goods-title-img">
            <div class="goods-title-text">今日抢购</div>
            <div class="goods-title-icon"></div>
            <div class="goods-title-sub">今日下单 次日提货</div>
          </div>
        </div>
        <div class="goods-box">
          <div class="goods-list" v-for="(item, index) in goodsList" :key="index" @click="jumpGoodsDetail(item)">
            <div class="goods-left">
              <img class="goods-left-img" mode="aspectFill" v-if="item.goods_cover_image" :src="item.goods_cover_image">
              <img class="goods-left-icon" mode="aspectFill" v-if="imageUrl"
                   :src="imageUrl + '/yx-image/choiceness/icon-label@2x.png'">
            </div>
            <div class="goods-right">
              <div class="goods-right-top">
                <div class="title">{{item.name}}</div>
                <div class="text-sub" v-if="item.describe">{{item.describe}}</div>
                <div class="text-sales-box">
                  <div class="text-sales">已售{{item.sale_count}}件</div>
                </div>
              </div>
              <div class="add-box">
                <div class="add-box-left">
                  <section class="left">
                    <div class="text-group">团购价</div>
                  </section>
                  <div class="price-box">
                    <div class="money">{{item.shop_price}}</div>
                    <div class="unit">元</div>
                    <div class="lineation">{{item.original_price}}元</div>
                  </div>
                </div>
                <form action="" report-submit @submit="$getFormId" @click.stop="addShoppingCart(item)">
                  <button class="add-box-right" v-if="item.usable_stock * 1 > 0" formType="submit">
                    <div class="add-goods-btn">
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
    <link-group ref="groupComponents" :wechatInfo="groupInfo"></link-group>
    <confirm-msg ref="refundModel" title="您的位置距该提货点超过1km" msg="建议您切换自提点" sureString="马上切换" @confirm="confirm"
                 @cancel="cancel"></confirm-msg>
  </div>
</template>

<script type="text/ecmascript-6">
  import NavigationBar from '@components/navigation-bar/navigation-bar'
  import LinkGroup from '@components/link-group/link-group'
  import ScrollTab from '@components/scroll-tab/scroll-tab'
  import ConfirmMsg from '@components/confirm-msg/confirm-msg'
  import API from '@api'
  import {cartMethods} from '@state/helpers'

  const ald = getApp()
  const PAGE_NAME = 'CHOICENESS'
  export default {
    name: PAGE_NAME,
    data() {
      return {
        praiseIndex: 0,
        selectTab: [],
        tabIdx: 0,
        menuFixed: false,
        menuTop: 0,
        groupInfo: {},
        plantingList: [],
        tabList: [],
        shelfId: 0,
        goodsList: [],
        goodsMore: false,
        goodsPage: 2,
        title: '赞播优鲜',
        arrWidth: [],
        width: 0,
        move: 0,
        tabIndex: 0,
        viewToItem: 'item0',
        curShopId: 1,
        showBuyUser: false,
        buyUsers: [],
        showUserIndex: 0,
        modulesList: [],
        locationStatus: 2,
        goodsListData: null
      }
    },
    async onLoad() {
      await this._groupInfo(false)
      await this._getIndexModule(false)
      this.curShopId = wx.getStorageSync('shopId')
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
    onPageScroll(scroll) {
      if (scroll.scrollTop >= this.menuTop - 84) {
        this.menuFixed = true
      } else {
        this.menuFixed = false
      }
    },
    onReachBottom() {
      this.getMoreGoodsList()
    },
    async onPullDownRefresh() {
      await this._groupInfo(true)
      await this._getIndexModule(false)
      if (!wx.getStorageSync('token')) return
      this.setCartCount()
      wx.stopPullDownRefresh()
    },
    onShareAppMessage(res) {
      return {
        title: `${this.groupInfo.social_name}次日达、直采直销，点击下单↓`,
        path: `/pages/choiceness?shopId=${this.curShopId}`,
        imageUrl: this.imageUrl + '/yx-image/choiceness/pic-zbyx@2x.png',
        success: (res) => {
        },
        fail: (res) => {
        }
      }
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
        API.Choiceness.getLocationDistance({longitude: data.longitude, latitude: data.latitude}).then((res) => {
          if (res.error !== this.$ERR_OK) {
            return
          }
          let msgStatus = wx.getStorageSync('msgStatus')
          if (msgStatus !== 4 && res.data.distance > 1000) {
            this.$refs.refundModel.show()
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
            url: `/pages/goods-detail?id=${item.other_id}`
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
      getMoreGoodsList() {
        if (this.goodsMore) {
          return
        }
        let data = {
          shelf_id: this.goodsListData.content_data.other_id,
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
      jumpGoodsDetail(item) {
        wx.navigateTo({
          url: `/pages/goods-detail?id=${item.id}`
        })
      },
      addShoppingCart(item) {
        if (!this.$isLogin()) {
          return
        }
        API.Choiceness.addShopCart({sku_id: item.shop_sku_id}).then((res) => {
          if (res.error === this.$ERR_OK) {
            this.$wechat.showToast('加入购物车成功', 1000, false)
            this.setCartCount()
          } else {
            this.$wechat.showToast(res.message, 1000, false)
          }
        })
      },
      toTap(id) {
        if (id * 1 === this.sheTag_id) return
        this.sheTag_id = id
        this.getGoodsList()
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
            this.goodsListData = item
            this.goodsPage = 2
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
      jumpNavType(item) {
        if (item.type === 'mini_goods') {
          wx.navigateTo({
            url: `/pages/goods-detail?id=${item.other_id}`
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
      jumpSelfPoint() {
        wx.navigateTo({
          url: `/pages/self-point`
        })
      }
    },
    components: {
      LinkGroup,
      NavigationBar,
      ConfirmMsg,
      ScrollTab
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"

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
      font-size: $font-size-12
      color: $color-white
      max-width: 22vw
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
    padding-left: 12px
    box-sizing: border-box
    .goods-title-main
      layout(row)
      border-bottom-1px($color-line)
      align-items: center
      height: 45px
      .goods-title-img
        width: 16px
        height: 16px
        display: block
        margin-right: 5px
      .goods-title-text
        font-size: $font-size-16
        color: $color-text-main
        font-family: $font-family-medium
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
        min-height: 32vw
        .title
          padding-top: 3px
          font-size: $font-size-16
          font-family: $font-family-medium
          color: $color-text-main
          line-height: 1
          min-height: $font-size-18
          margin-bottom: 4px
          no-wrap()
        .text-sub
          font-size: $font-size-14
          font-family: $font-family-regular
          color: $color-text-sub
          line-height: 1
          min-height: $font-size-16
          margin-bottom: 5px
          no-wrap()
          padding-right: 10px
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
              color: $color-money
              height: 13px
              line-height: 13px
              margin-bottom: 3px
              border-radius: 10px
              padding: 0 5px
          .price-box
            layout(row)
            align-items: flex-end
            .money
              font-family: $font-family-medium
              color: $color-money
              font-size: $font-size-20
              line-height: 1
            .unit
              font-family: $font-family-medium
              color: $color-money
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
            background: $color-main
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

  .add-box-right
    &:after
      border: none
</style>
