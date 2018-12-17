<template>
  <div class="regimental-commander">
    <navigation-bar :translucent="true" title="我的小区"></navigation-bar>
    <!--头部信息-->
    <div class="reg-img-box">
      <img class="reg-img" :src="imageUrl + '/yx-image/group/group-bg@2x.png'" v-if="imageUrl">
      <div class="reg-info">
        <img :src="leaderDetail.head_image_url" class="reg-header">
        <div class="reg-msg">
          <div class="reg-name">{{leaderDetail.nickname}}</div>
          <div class="reg-address">{{address}}</div>
        </div>
      </div>
      <navigator url="/pages/regimental-info" hover-class="none" class="reg-tip">
        <span class="reg-text">团长信息</span>
        <img :src="imageUrl + '/yx-image/group/icon-samllarrow@2x.png'" v-if="imageUrl" class="way">
      </navigator>
    </div>
    <!--收入信息-->
    <div class="reg-home">
      <img :src="imageUrl + '/yx-image/group/pic-shop@2x.png'" v-if="imageUrl" class="reg-shop-icon">
      <div class="order-item">
        <div class="reg-order-title">今日收入(元)</div>
        <div class="reg-order-money">{{orderTotal.today_income}}</div>
      </div>
      <div class="order-item">
        <div class="reg-order-title">今日订单(笔)</div>
        <div class="reg-order-money">{{orderTotal.today_order}}</div>
      </div>
      <div class="order-item">
        <div class="reg-order-title">今日销售(元)</div>
        <div class="reg-order-money">{{orderTotal.today_sale}}</div>
      </div>
    </div>
    <!--功能模块-->
    <div class="reg-manager">
      <div class="reg-manager-box">
        <navigator url="/pages/yesterday-sale-manager" hover-class="none" class="reg-manager-item">
          <img :src="imageUrl + '/yx-image/group/icon-order@2x.png'" v-if="imageUrl" class="reg-manager-icon">
          <p class="reg-manager-text">消费者订单</p>
        </navigator>
        <navigator url="/pages/after-sale-management" hover-class="none" class="reg-manager-item">
          <img :src="imageUrl + '/yx-image/group/icon-sale@2x.png'" v-if="imageUrl" class="reg-manager-icon">
          <p class="reg-manager-text">售后管理</p>
        </navigator>
        <navigator url="/pages/delivery-order" hover-class="none" class="reg-manager-item">
          <img :src="imageUrl + '/yx-image/group/icon-delivery@2x.png'" v-if="imageUrl" class="reg-manager-icon">
          <p class="reg-manager-text">配送收货</p>
        </navigator>
      </div>
      <div class="reg-manager-box">
        <div class="reg-manager-item" @click="_scanCode">
          <img :src="imageUrl + '/yx-image/group/icon-scan@2x.png'" v-if="imageUrl" class="reg-manager-icon">
          <p class="reg-manager-text">扫一扫</p>
        </div>
        <div class="reg-manager-item" @click="_inDevelopment">
          <img :src="imageUrl + '/yx-image/group/icon-soon@2x.png'" v-if="imageUrl" class="reg-manager-icon">
          <p class="reg-manager-text">团长钱包</p>
        </div>
        <div class="reg-manager-item">
          <div class="reg-manager-icon"></div>
          <p class="reg-manager-text"></p>
        </div>
      </div>
    </div>
    <!--商品模块-->
    <div class="reg-goods">
      <div class="rag-goods-tab">
        <span :class="{'rag-goods-tab-item-active': navIndex === index}" class="rag-goods-tab-item" v-for="(item, index) in nav" :key="index" @click="_setNav(index, item)">
          {{item.title}}
        </span>
      </div>
      <div class="reg-goods-box">
        <div class="reg-goods-item" v-for="(item,index) in goodsList" :key="index">
          <img :src="item.goods_cover_image" class="reg-goods-img">
          <div class="reg-goods-content">
            <div class="reg-goods-title">{{item.name}}</div>
            <div class="reg-goods-tip">团购价</div>
            <span class="reg-goods-money">{{item.shop_price}}<span class="reg-goods-small">元</span></span>
            <span class="reg-goods-del-money">{{item.original_price}}元</span>
          </div>
          <div class="ability">
            <button class="share" open-type="share" :data-goodsItem="item">
              <img :src="imageUrl + '/yx-image/group/icon-share@2x.png'" v-if="imageUrl" class="share-icon">
            </button>
            <p class="scale-count">销量{{item.sale_count}}</p>
          </div>
        </div>
      </div>
    </div>
    <div class="end">— 到底了—</div>
  </div>
</template>

<script type="text/ecmascript-6">
  import NavigationBar from '@components/navigation-bar/navigation-bar'
  import API from '@api'

  const PAGE_NAME = 'REGIMENTAL_COMMANDER'
  const Nav = [{title: '商品推荐', status: 2}, {title: '素材推荐', status: 3}]
  export default {
    name: PAGE_NAME,
    data() {
      return {
        nav: Nav,
        navIndex: 0,
        isLoading: true,
        leaderDetail: {},
        orderTotal: {},
        goodsList: []
      }
    },
    onShareAppMessage(res) {
      let goodsItem = res.target.dataset.goodsitem
      let shopId = wx.getStorageSync('shopId')
      console.log(shopId)
      return {
        title: goodsItem.name,
        path: `/pages/goods-detail?id=${goodsItem.id}&shopId=${shopId}`, // 商品详情
        imageUrl: goodsItem.thumb_image || goodsItem.goods_cover_image,
        success: (res) => {
          // 转发成功
        },
        fail: (res) => {
          // 转发失败
        }
      }
    },
    async onLoad() {
      await Promise.all([
        this._getLeaderDetail(),
        this._leaderOrderTotal(),
        this._getRecommendGoods()
      ])
      this.isLoading = false
    },
    computed: {
      address() {
        return this.leaderDetail.province ? this.leaderDetail.province + this.leaderDetail.city + this.leaderDetail.district + this.leaderDetail.address : ''
      }
    },
    methods: {
      _scanCode() {
        wx.scanCode({
          success(res) {
            let id = JSON.parse(res.result).customer_id
            wx.navigateTo({url: `/pages/find-product?id=${id}`})
          }
        })
      },
      _inDevelopment() {
        this.$wechat.showToast('功能正在努力研发中')
      },
      _setNav(index, item) {
        this._inDevelopment()
      },
      async _getLeaderDetail() {
        let res = await API.Leader.leaderDetail()
        if (res.error !== this.$ERR_OK) {
          this.$wechat.showToast(res.message)
          return
        }
        this.leaderDetail = res.data
      },
      async _leaderOrderTotal() {
        let res = await API.Leader.leaderOrderTotal()
        if (res.error !== this.$ERR_OK) {
          this.$wechat.showToast(res.message)
          return
        }
        this.orderTotal = res.data
      },
      async _getRecommendGoods() {
        let res = await API.Leader.recommendGoods()
        if (res.error !== this.$ERR_OK) {
          this.$wechat.showToast(res.message)
          return
        }
        this.goodsList = res.data
      }
    },
    components: {
      NavigationBar
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"
  button
    margin: 0
    line-height: 1
    padding: 0
    &:after
      border: none

  .regimental-commander
    word-break: break-all
    min-height: 100vh
    width: 100vw
    overflow-x: hidden
    background: $color-background

  .reg-img-box
    width: 100vw
    height: 195px
    position: absolute
    top: 0
    left: 0
    display: flex
    padding: 0 12.5px
    box-sizing: border-box
    justify-content: space-between
    .reg-img
      position: absolute
      top: 0
      left: 0
      width: 100%
      height: 100%
    .reg-info
      width: 75%
      position: relative
      z-index: 1
      display: flex
      margin-top: 64.5px
      .reg-header
        border-radius: 50%
        background: $color-background
        height: 50px
        width: 50px
        min-width: 50px
        min-height: 50px
        border: 2.5px solid $color-white
      .reg-msg
        width: 78%
        margin-left: 12.5px
        line-height: 1
        .reg-name
          color: $color-white
          width: 100%
          margin-top: 4px
          font-size: $font-size-18
          font-family: $font-family-medium
          no-wrap()
        .reg-address
          width: 100%
          margin-top: 7px
          line-height: 14px
          font-size: $font-size-13
          font-family: $font-family-regular
          color: rgba(255, 255, 255, .9)
          no-wrap()
    .reg-tip
      position: relative
      z-index: 1
      width: 64.5px
      line-height: 1
      color: $color-white
      margin-top: 84.5px
      justify-content: space-between
      display: flex
      height: 14px
      align-items: center
      .reg-text
        font-size: $font-size-13
      .way
        display: block
        width: 7.5px
        height: 12.5px

  .reg-home
    padding: 0 6px
    box-sizing: border-box
    display: flex
    height: 29.3vw
    width: 93.6vw
    background: $color-white
    margin: 43.73vw auto 0
    box-shadow: 0 3px 10px 0 rgba(17, 17, 17, 0.06)
    border-radius: 10px
    position: relative
    z-index: 1
    padding-top: 11.5px
    .reg-shop-icon
      width: 100vw
      height: 16.4vw
      position: absolute
      top: -9vw
      left: -3.2vw

    .order-item
      text-align: center
      flex: 1
      display: flex
      flex-direction: column
      justify-content: center
      line-height: 1
      .reg-order-title
        white-space: nowrap
        font-size: $font-size-12
        font-family: $font-family-regular
        color: $color-text-sub
      .reg-order-money
        margin-top: 13px
        font-family: $font-family-medium
        color: $color-text-main
        font-size: $font-size-18

  .reg-manager
    box-shadow: 0 3px 10px 0 rgba(17, 17, 17, 0.06)
    border-radius: 10px
    width: 93.6vw
    box-sizing: border-box
    background: $color-white
    margin: 12px auto
    padding: 0 6.8vw 13px 8.4vw
    .reg-manager-box
      display: flex
      justify-content: space-between
      flex-wrap: wrap
      .reg-manager-item
        min-width: 60px
        height: 62px
        margin: 20px 0 7px
        display: flex
        flex-direction: column
        align-items: center
        .reg-manager-icon
          display: block
          min-width: 12vw
          min-height: 12vw
          height: 12vw
          width: 12vw
        .reg-manager-text
          margin-top: 5px
          line-height: 1
          color: #6B6B6B
          font-size: $font-size-12

  .reg-goods
    box-shadow: 0 3px 10px 0 rgba(17, 17, 17, 0.06)
    border-radius: 10px
    width: 93.6vw
    box-sizing: border-box
    background: $color-white
    margin: 12px auto
    padding: 25px 10px 30px
    .rag-goods-tab
      width: 176px
      margin: 0 auto
      display: flex
      overflow: hidden
      margin-bottom: 11.5px
      .rag-goods-tab-item
        box-sizing: border-box
        width: 88px
        font-size: $font-size-14
        font-family: $font-family-medium
        text-align: center
        line-height: 31px
        height: 33px
        color: $color-main
        border: 1px solid $color-main
        transition: all 0.4s
        &:first-child
          border-right: none
          border-radius: 50px 0px 0px 50px
        &:last-child
          border-left: none
          border-radius: 0px 50px 50px 0px
      .rag-goods-tab-item-active
        transform-origin: 50%
        background: $color-main
        color: $color-white

  .reg-goods-item
    margin-bottom: 9.5px
    display: flex
    position: relative
    .reg-goods-img
      background: $color-background
      border-radius: 3px
      width: 75px
      min-width: 75px
      height: @width
      min-height: @width
    .reg-goods-content
      line-height: 1
      border-bottom-1px($color-line)
      padding-bottom: 10px
      margin-left: 10px
      width: 75%
      .reg-goods-title
        width: 100%
        margin-top: 3px
        font-size: $font-size-16
        font-family: $font-family-medium
        color: $color-text-main
        no-wrap()
      .reg-goods-tip
        width: 40px
        height: 13px
        line-height: 13px
        margin-top: 20px
        background: rgba(255, 131, 0, 0.10)
        border-1px(#FF8300, 7.5px)
        border-radius: 7.5px
        text-align: center
        color: $color-money
        font-family: $font-family-regular
        font-size: $font-size-10
      .reg-goods-money
        display: inline-block
        font-family: $font-family-medium
        font-size: $font-size-20
        margin-top: 6px
        color: $color-money
        line-height: 1
        .reg-goods-small
          font-size: $font-size-12
          margin-left: 1px
      .reg-goods-del-money
        display: inline-block
        font-size: $font-size-12
        font-family: $font-family-regular
        margin-left: 5px
        line-height: 1
        text-decoration: line-through
        color: $color-text-assist
    &:last-child
      .reg-goods-content
        border-none()
    .ability
      bottom: 10px
      right: 0
      position: absolute
      display: flex
      flex-direction: column
      align-items: flex-end
      .share
        width: 30px
        background: transparent
        .share-icon
          display: block
          width: 30px
          height: 30px
      .scale-count
        margin-top: 11.5px
        color: #808080
        font-family: $font-family-regular
        font-size: $font-size-11

  .end
    line-height: 1
    padding: 20px 0 26px
    text-align: center
    font-family: $font-family-regular
    font-size: $font-size-13
    color: $color-text-assist
</style>
