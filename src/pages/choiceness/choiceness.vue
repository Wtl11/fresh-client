<template>
  <div class="choiceness">
    <navigation-bar :title="title" :showArrow="false" :translucent="true"></navigation-bar>
    <div class="choiceness-top">
      <div class="choiceness-bgimg">
        <img class="bgimg-url" mode="aspectFill" v-if="imageUrl" :src="imageUrl + '/yx-image/choiceness/pic-bg@2x.png'">
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
                  <div class="address-text">{{groupInfo.district}}{{groupInfo.address}}</div>
                </div>
              </div>
            </div>
            <div class="right-info" @click="linkGroup">联系团长</div>
          </div>
          <div class="info-box-bottom">公告：{{groupInfo.notice}}</div>
        </div>
      </div>
    </div>
    <div class="banner-box">
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
    <div class="select-scroll">
      <scroll-tab
        ref="scrollTab"
        @changeTab="toTap"
        :infoBorderWidth="68"
        :tabList="tabList"
        :showLine="true"
        :autoWidth="true"
        activeStyle=";color:#73C200;font-size:32rpx;font-family: PingFangSC-Medium"
        lineStyle="border-bottom-color: #ff3f54;height:2px"
        boxStyle="color: #c2c2c; height: 44px; line-height: 44px;font-size:28rpx;font-family: PingFangSC-Medium;padding: 0 13.75px"
      ></scroll-tab>
    </div>
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
          <div class="title">{{item.name}}</div>
          <div class="text-sub">{{item.describe}}</div>
          <div class="text-sales-box">
            <div class="text-sales">已售{{item.sale_count}}{{item.goods_units}}</div>
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
            <div class="add-box-right">
              <div class="add-goods-btn" @click.stop="addShoppingCart(item)">+购物车</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="foot-ties" v-if="goodsMore">
      <div class="left lines"></div>
      <div class="center">已经到底了</div>
      <div class="bot lines"></div>
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
  const SELECTTAB = [{text: '限时尝鲜'}, {text: '精选菜篮'}, {text: '水果'}, {text: '粮油'}, {text: '百货'}, {text: '粮油'}, {text: '百货'}, {text: '粮油'}, {text: '百货'}]
  export default {
    name: PAGE_NAME,
    data() {
      return {
        praiseIndex: 0,
        selectTab: SELECTTAB,
        tabIdx: 0,
        menuFixed: false,
        menuTop: 0,
        groupInfo: {},
        plantingList: [],
        tabList: [],
        shelfId: 0,
        goodsList: [],
        goodsMore: false,
        goodsPage: 1,
        title: '赞播优鲜'
      }
    },
    async onShow() {
      // this.initClientRect()
      this.getPlantList()
      this.getTabList()
      this.setCartCount()
      await this._groupInfo()
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
    methods: {
      ...cartMethods,
      _setPraiseIndex(e) {
        this.praiseIndex = e.target.current
      },
      selectIndex(index) {
        this.tabIdx = index
      },
      initClientRect() {
        let that = this
        let query = wx.createSelectorQuery()
        query.select('#selTab').boundingClientRect()
        query.exec(function (res) {
          that.menuTop = res[0].top
        })
      },
      linkGroup() {
        this.$refs.groupComponents.showLink()
      },
      async _groupInfo() {
        let res = await API.Choiceness.getGroupInfo()
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
            this.tabList = res.data
            this.shelfId = res.shelf_id
            this.sheTag_id = res.data[0].id
            this.getGoodsList()
          } else {
            this.$wechat.showToast(res.message)
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
                background: #fff
            .name-text
              height: $font-size-16
              font-size: $font-size-16
              font-family: $font-family-medium
              color: $color-text-main
              margin-bottom: 8.5px
            .address-box
              layout(row)
              align-items: center
              .address-icon
                width: 8.5px
                height: 10px
                margin-right: 3px
                img
                  display: block
                  width: 100%
                  height: 100%
              .address-text
                font-size: $font-size-13
                font-family: $font-family-regular
                color: $color-text-sub
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

  .banner-box
    padding: 0 3.2vw
    box-sizing: border-box
    position: relative
    height: 40vw
    /*margin-bottom: 13px*/
    .banner
      width: 100%
      height: 100%
      border-radius: 6px
      overflow: hidden
      .banner-item
        width: 100%
        height: 100%
        position: relative
        .item-img
          width: 100%
          height: 100%
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
        .title
          font-size: $font-size-16
          font-family: $font-family-medium
          color: $color-text-main
          line-height: 1
          min-height: $font-size-16
          margin-bottom: 7px
          no-wrap()
        .text-sub
          font-size: $font-size-14
          font-family: $font-family-regular
          color: $color-text-sub
          line-height: 1
          min-height: $font-size-16
          margin-bottom: 9px
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
            border-1px($color-text-sub, 10px)
            padding: 2px 5px 3px
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
              min-height: $font-size-16
              line-height: $font-size-16
              margin-bottom: 6px
              border-radius: 10px
              background: rgba(255, 131, 0, 0.10)
              border-1px(#FF8300, 10px)
              padding: 0px 8px 1px
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
            .lineation
              font-family: $font-family-regular
              color: $color-text-assist
              font-size: $font-size-12
              text-decoration line-through
              line-height: 1
          .add-goods-btn
            width: 20vw
            height: 26px
            line-height: 26px
            font-size: $font-size-14
            font-family: $font-family-regular
            color: #fff
            background: $color-main
            text-align: center
            border-radius: 14px

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

</style>
