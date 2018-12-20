<template>
  <div class="choiceness">
    <navigation-bar :title="title" :showArrow="false" :translucent="true"></navigation-bar>
    <div class="choiceness-top" :class="statusBarHeight * 1 === 20 ? '' : 'choiceness-top-x'">
      <div class="choiceness-bgimg" v-if="statusBarHeight * 1 === 20">
        <img class="bgimg-url" mode="aspectFill" v-if="imageUrl" :src="imageUrl + '/yx-image/choiceness/pic-bg@2x.png'">
      </div>
      <div class="choiceness-top-bgimg choiceness-bgimg" v-else>
        <img class="bgimg-url" mode="aspectFill" v-if="imageUrl" :src="imageUrl + '/yx-image/choiceness/pic-top-bg@2x.png'">
      </div>
      <div class="group-info">
        <div class="info-box">
          <div class="info-shop-name">赞播优鲜</div>
          <div class="info-box-top">
            <div class="left-info">
              <div class="left-info-user">
                <img mode="aspectFill" v-if="imageUrl" :src="groupInfo.head_image_url">
              </div>
              <div class="name-box">
                <div class="name-text">{{groupInfo.name}}</div>
                <div class="address-box">
                  <div class="address-icon">
                    <img v-if="imageUrl" :src="imageUrl + '/yx-image/choiceness/icon-address_small@2x.png'">
                  </div>
                  <div class="address-text">{{groupInfo.social_name}}</div>
                </div>
              </div>
            </div>
            <div class="right-info" @click="linkGroup">联系团长</div>
          </div>
          <div class="info-box-bottom">公告：{{groupInfo.notice}}</div>
        </div>
      </div>
    </div>
    <div class="banner-box" v-if="plantingList.length !== 0">
      <swiper class="banner" :current="praiseIndex" autoplay interval="5000" circular @change="_setPraiseIndex">
        <block v-for="(item,index) in plantingList" :key="index">
          <swiper-item class="banner-item">
            <img class="item-img" mode="aspectFill" v-if="item.image_url" :src="item.image_url" @click="jumpDetail(item)">
          </swiper-item>
        </block>
      </swiper>
      <div class="dots">
        <div class="dots-item" :class="{'dots-item-active': praiseIndex === idx}" v-for="(item,idx) in plantingList" :key="idx" v-if="plantingList.length > 1"></div>
      </div>
    </div>
    <scroll-view class="scroll-view2" v-if="tabList1.length" id="scrollView" :scroll-into-view="viewToItem" scroll-x scroll-with-animation>
      <div class="under-line" :style="{left: move + 'px', width: arrWidth[tabIndex] + 'px' }"></div>
      <div v-for="(item, index) in tabList1" :class="tabIndex === index ? 'item-active'  : ''" :key="index" class="item" :id="'item'+index" @click="_changeTab(index, item.id, $event)">
        {{item.name}}
      </div>
    </scroll-view>
    <div class="goods-box">
      <div class="goods-list" v-for="(item, index) in goodsList" :key="index" @click="jumpGoodsDetail(item)">
        <div class="goods-left">
          <div class="goods-left-img">
            <img class="item-img" mode="aspectFill" v-if="item.goods_cover_image" :src="item.goods_cover_image">
          </div>
          <div class="goods-left-icon">
            <img class="item-img" mode="aspectFill" v-if="imageUrl" :src="imageUrl + '/yx-image/choiceness/icon-label@2x.png'">
          </div>
        </div>
        <div class="goods-right">
          <div class="goods-right-top">
            <div class="title">{{item.name}}</div>
            <div class="text-sub" v-if="item.describe">{{item.describe}}</div>
            <div class="text-sales-box">
              <div class="text-sales">已售{{item.sale_count}}{{item.goods_units}}</div>
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
            <div class="add-box-right" v-if="item.usable_stock > 0">
              <div class="add-goods-btn" @click.stop="addShoppingCart(item)">
                <div class="add-icon">
                  <div class="add1"></div>
                  <div class="add2"></div>
                </div>
                <div class="add-text">购物车</div>
              </div>
            </div>
            <div class="add-box-right" v-else>
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
      <div class="txt">空空如也</div>
    </div>
    <link-group ref="groupComponents" :wechatInfo="groupInfo"></link-group>
  </div>
</template>

<script type="text/ecmascript-6">
  import NavigationBar from '@components/navigation-bar/navigation-bar'
  import LinkGroup from '@components/link-group/link-group'
  import ScrollTab from '@components/scroll-tab/scroll-tab'
  import API from '@api'
  import {cartMethods} from '@state/helpers'

  const PAGE_NAME = 'CHOICENESS'
  export default {
    name: PAGE_NAME,
    watch: {
      tabList(news) {
        this.tabList1 = news
        setTimeout(() => {
          this.getWidth('', '', '', false)
        }, 100)
      },
      infoTabIndex(newVal) {
        this.tabIndex = newVal
      }
    },
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
        tabList1: [],
        shelfId: 0,
        goodsList: [],
        goodsMore: false,
        goodsPage: 1,
        title: '赞播优鲜',
        statusBarHeight: 20,
        arrWidth: [],
        width: 0,
        move: 0,
        tabIndex: 0,
        viewToItem: 'item0',
        curShopId: 1
      }
    },
    async onLoad() {
      let syncRes = wx.getSystemInfoSync()
      this.statusBarHeight = syncRes.statusBarHeight || 20
      this.curShopId = wx.getStorageSync('shopId')
      console.log(this.curShopId)
      console.log(this.statusBarHeight)
      this.getPlantList()
      this.getTabList()
      this.setCartCount()
      await this._groupInfo(true)
    },
    async onShow() {
      let shopId = wx.getStorageSync('shopId')
      if (this.curShopId * 1 === shopId) {
        return
      }
      this.curShopId = shopId
      console.log(this.curShopId)
      this.tabIndex = 0
      this.move = 0
      this.getPlantList()
      this.getTabList()
      this.setCartCount()
      await this._groupInfo(false)
    },
    onPageScroll(scroll) {
      if (scroll.scrollTop >= this.menuTop - 84) {
        this.menuFixed = true
      } else {
        this.menuFixed = false
      }
      // if (this.menuFixed === (scroll.scrollTop > this.menuTop)) return
      // this.menuFixed = scroll.scrollTop > this.menuTop
    },
    onReachBottom() {
      this.getMoreGoodsList()
    },
    async onPullDownRefresh() {
      this.getPlantList()
      this.getGoodsList()
      await this._groupInfo(true)
      wx.stopPullDownRefresh()
    },
    onShareAppMessage(res) {
      return {
        path: `/pages/choiceness?shopId=${this.curShopId}`, // 商品详情
        success: (res) => {
        },
        fail: (res) => {
        }
      }
    },
    methods: {
      ...cartMethods,
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
      getPlantList() {
        API.Choiceness.getPlanting().then((res) => {
          if (res.error === this.$ERR_OK) {
            this.plantingList = res.data
          } else {
            this.$wechat.showToast(res.message)
          }
        })
      },
      jumpDetail(item) {
        if (item.type === 'mini_goods') {
          wx.navigateTo({
            url: `/pages/goods-detail?id=${item.content.id}`
          })
        } else {
          wx.navigateTo({
            url: `/pages/out-html?url=${item.content.url}`
          })
        }
      },
      getTabList() {
        API.Choiceness.getGoodsTag().then((res) => {
          if (res.error === this.$ERR_OK) {
            if (res.data.length === 0) {
              this.goodsMore = true
            } else {
              this.tabList = res.data
              this.shelfId = res.shelf_id
              this.sheTag_id = res.data[0].id
              this.getGoodsList()
            }
          } else {
            // this.$wechat.showToast(res.message)
            this.goodsMore = true
          }
        })
      },
      getGoodsList() {
        this.goodsPage = 1
        this.goodsMore = false
        let data = {
          shelf_tag_id: this.sheTag_id,
          shelf_id: this.shelfId,
          page: this.goodsPage,
          limit: 10
        }
        API.Choiceness.getGoodsShelfList(data).then((res) => {
          if (res.error === this.$ERR_OK) {
            this.goodsList = res.data
            this._isUpList(res)
          } else {
            this.goodsMore = true
            this.$wechat.showToast(res.message)
          }
        })
      },
      getMoreGoodsList() {
        if (this.goodsMore) {
          return
        }
        let data = {
          shelf_tag_id: this.sheTag_id,
          shelf_id: this.shelfId,
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
      getWidth(index, id, e) {
        this.allWidth = 0
        let query = wx.createSelectorQuery()
        query.selectAll('.item').boundingClientRect()
        query.exec((res) => {
          this.arrWidth = res[0].map((item, index) => {
            this.allWidth += item.width
            return item.width
          })
        })
      },
      async _changeTab(index, id, e) {
        console.log(this.tabIndex, index)
        let number = index * 1 === 0 ? 1 : index
        if (this.tabIndex > index) {
          number--
        } else if (this.tabIndex < index && (index - this.tabIndex) >= 3) {
          number++
        } else if (this.tabIndex < index && (index - this.tabIndex) <= 3) {
          number = index
        }
        console.log(id)
        this.viewToItem = `item${number}`
        console.log(this.viewToItem)
        this.tabIndex = index
        this.move = e.target.offsetLeft
        this.sheTag_id = id
        this.getGoodsList()
      },
      addShoppingCart(item) {
        API.Choiceness.addShopCart({sku_id: item.shop_sku_id}).then((res) => {
          if (res.error === this.$ERR_OK) {
            this.$wechat.showToast('加入购物车成功')
            this.setCartCount()
          } else {
            this.$wechat.showToast(res.message)
          }
        })
      },
      toTap(id) {
        if (id * 1 === this.sheTag_id) return
        this.sheTag_id = id
        this.getGoodsList()
      }
    },
    components: {
      LinkGroup,
      NavigationBar,
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

  .choiceness-top
    position: relative
    padding-top: 17vw
    margin-bottom: 11px
    .group-info
      padding: 0 3.2vw
      box-sizing: border-box
      position: relative
      z-index: 11
      .info-box
        layout()
        justify-content: center
        height: 100px
        background: #fff
        border-radius: 6px
        box-shadow: 0 3px 10px 0 rgba(17, 17, 17, 0.06)
        padding: 0 2.7vw
        box-sizing: border-box
        position: relative
        .info-shop-name
          position: absolute
          left: 0
          color: #fff
          font-family: 'PingFang-SC-Heavy'
          font-size: $font-size-22
          top: -9.3vw
          z-index: 11
        .info-box-top
          layout(row)
          align-items: center
          width: 100%
          justify-content: space-between
          padding-bottom: 8px
          border-bottom-1px(#E6E6E6)
          .left-info
            layout(row)
            flex: 1
            overflow: hidden
            align-items: center
            .left-info-user
              width: 13.3vw
              height: 13.3vw
              margin-right: 9px
              border-radius: 50%
              img
                width: 100%
                height: 100%
                display: block
                border-radius: 50%
                background: #ff
            .name-box
              flex: 1
              overflow: hidden
            .name-text
              height: $font-size-16
              font-size: $font-size-16
              font-family: $font-family-medium
              color: $color-text-main
              margin-bottom: 8.5px
              flex: 1
              no-wrap()
            .address-box
              layout(row)
              align-items: center
              width: 100%
              overflow: hidden
              .address-icon
                width: 11px
                height: 11px
                margin-right: 3px
                img
                  display: block
                  width: 100%
                  height: 100%
              .address-text
                font-size: $font-size-13
                font-family: $font-family-regular
                color: $color-text-sub
                flex: 1
                no-wrap()
          .right-info
            width: 20vw
            height: 28px
            line-height: 28px
            font-size: $font-size-14
            font-family: $font-family-regular
            color: $color-main
            border-1px($color-main, 15px)
            text-align: center
        .info-box-bottom
          text-align: left
          width: 100%
          margin-top: 9px
          max-height: 25px
          overflow: hidden
          font-size: $font-size-12
          font-family: $font-family-regular
          color: $color-text-sub

    .choiceness-bgimg
      width: 100%
      height: 23.5vw
      position: absolute
      left: 0
      top: 0
      .bgimg-url
        width: 100%
        height: 100%
        display: block
    .choiceness-bgimg
      height: 35.2vw
  .choiceness-top-x
    padding-top: 29.6vw
  .banner-box
    margin: 0 3.2vw
    box-sizing: border-box
    position: relative
    height: 40vw
    border-radius: 6px !important
    overflow: hidden !important
    /*margin-bottom: 13px*/
    .banner
      width: 100%
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
        .item-img
          width: 100%
          height: 100%
          display: block
          border-radius: 6px !important
          transform: translateY(0)
          overflow: hidden !important
    .dots
      position: absolute
      bottom: 12px
      row-center()
      display: flex
      .dots-item
        width: 3px
        height: 3px
        border-radius: 3px
        margin: 0 2.5px
        background: #fff
        transition: all .0 .3s
      .dots-item-active
        width: 10px
        background: #fff

  .topnav
    position: fixed
    width: 100vw
    padding: 0 3.2vw
    top: 64px
    left: 0
    box-sizing: border-box
    z-index: 99

  .goods-box
    padding: 0 3.2vw
    box-sizing: border-box
    .goods-list
      height: 40.5vw
      layout(row)
      border-bottom-1px(#e6e6e6)
      align-items: center
      .goods-left
        margin-left: 5px
        position: relative
        width: 32vw
        height: 32vw
        margin-right: 12px
        .goods-left-img
          width: 100%
          height: 100%
          border-radius: 3px
          img
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
          img
            display: block
            width: 100%
            height: 100%
      .goods-right
        flex: 1
        overflow: hidden
        layout()
        justify-content: space-between
        min-height: 32vw
        .title
          font-size: $font-size-16
          font-family: $font-family-medium
          color: $color-text-main
          line-height: 1
          min-height: $font-size-18
          margin-bottom: 6px
          no-wrap()
        .text-sub
          font-size: $font-size-14
          font-family: $font-family-regular
          color: $color-text-sub
          line-height: 1
          min-height: $font-size-16
          margin-bottom: 7px
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
              margin-bottom: 4px
              border-radius: 10px
              background: rgba(255, 131, 0, 0.10)
              border-1px(#FF8300, 10px)
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

  .scroll-view2
    display: block
    margin: 23px auto 10px
    height: 33px
    width: 93.6vw
    background: $color-white
    box-shadow: 0 1px 8px 0 rgba(55, 75, 99, 0.04)
    white-space: nowrap
    box-sizing: border-box
    transform: translateX(0)
    position: relative
    transition: all 0.3s
    border-bottom: 2px solid $color-main
    ::-webkit-scrollbar
      width: 0
      height: 0
      color: transparent
    .item
      height: 100%
      line-height: 33px
      white-space: nowrap
      padding: 0 7px
      font-family: $font-family-medium
      font-size: $font-size-14
      color: $color-text-main
      text-align: center
      display: inline-block
      position: relative
      transition: all 0.3s
      min-width: 70px
      box-sizing: border-box
      transform-origin: 50%
    .item-active
      color: $color-white

  .under-line
    position: absolute
    bootom: 0
    left: 0
    width: 30px
    background: $color-main
    transition: all 0.3s
    height: 33px
    border-radius: 8px 8px 0px 0px

</style>
