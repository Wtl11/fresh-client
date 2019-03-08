<template>
  <div class="regimental-commander">
    <navigation-bar :translucent="true" title="我的小区"></navigation-bar>
    <!--头部信息-->
    <div class="reg-img-box" :style="{'padding-top': adaptation.marginTop + 'px', height: adaptation.height + 'px'}">
      <img class="reg-img" :src="imageUrl + '/yx-image/group/group-bg@2x.png'" v-if="imageUrl && corpName === 'platform'">
      <img class="reg-img" :src="imageUrl + '/yx-image/retuan/pic-mycell@2x.png'" v-if="imageUrl && corpName === 'retuan'">
      <div class="reg-info">
        <img :src="leaderDetail.head_image_url" class="reg-header">
        <div class="reg-msg">
          <div class="reg-name">{{leaderDetail.nickname}}</div>
          <div class="reg-address">{{leaderDetail.social_name}}</div>
        </div>
      </div>
      <navigator url="/pages/regimental-info" hover-class="none" class="reg-tip">
        <span class="reg-text">团长信息</span>
        <img :src="imageUrl + '/yx-image/group/icon-samllarrow@2x.png'" v-if="imageUrl" class="way">
      </navigator>
    </div>
    <!--收入信息-->
    <div class="reg-home" :style="{'margin-top': adaptation.hoseMarginTop + 'px'}">
      <img :src="imageUrl + '/yx-image/group/pic-shop@2x.png'" v-if="imageUrl && corpName === 'platform'" class="reg-shop-icon">
      <img :src="imageUrl + '/yx-image/retuan/pic-shop@2x.png'" v-if="imageUrl && corpName === 'retuan'" class="reg-shop-icon">
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
    <!--ai消息-->
    <notification-regimental :customerCount="customerCount"></notification-regimental>
    <!--功能模块-->
    <div class="reg-manager">
      <div class="reg-manager-box">
        <navigator url="/pages/yesterday-sale-manager" hover-class="none" class="reg-manager-item">
          <img :src="imageUrl + '/yx-image/group/icon-order@2x.png'" v-if="imageUrl && corpName === 'platform'" class="reg-manager-icon">
          <img :src="imageUrl + '/yx-image/retuan/icon-order@2x.png'" v-if="imageUrl && corpName === 'retuan'" class="reg-manager-icon">
          <p class="reg-manager-text">消费者订单</p>
        </navigator>
        <navigator url="/pages/after-sale-management" hover-class="none" class="reg-manager-item">
          <img :src="imageUrl + '/yx-image/group/icon-sale@2x.png'" v-if="imageUrl && corpName === 'platform'" class="reg-manager-icon">
          <img :src="imageUrl + '/yx-image/retuan/icon-sale@2x.png'" v-if="imageUrl && corpName === 'retuan'" class="reg-manager-icon">
          <p class="reg-manager-text">售后管理</p>
        </navigator>
        <navigator url="/pages/delivery-order" hover-class="none" class="reg-manager-item">
          <img :src="imageUrl + '/yx-image/group/icon-delivery@2x.png'" v-if="imageUrl && corpName === 'platform'" class="reg-manager-icon">
          <img :src="imageUrl + '/yx-image/retuan/icon-delivery2@2x.png'" v-if="imageUrl && corpName === 'retuan'" class="reg-manager-icon">
          <p class="reg-manager-text">配送收货</p>
        </navigator>
      </div>
      <div class="reg-manager-box">
        <div class="reg-manager-item" @click="_scanCode">
          <img :src="imageUrl + '/yx-image/group/icon-scan@2x.png'" v-if="imageUrl && corpName === 'platform'" class="reg-manager-icon">
          <img :src="imageUrl + '/yx-image/retuan/icon-scan@2x.png'" v-if="imageUrl && corpName === 'retuan'" class="reg-manager-icon">
          <p class="reg-manager-text">扫一扫</p>
        </div>
        <navigator url="/pages/group-wallet" hover-class="none" class="reg-manager-item">
          <img :src="imageUrl + '/yx-image/group/icon-moeny_box@2x.png'" v-if="imageUrl && corpName === 'platform'" class="reg-manager-icon">
          <img :src="imageUrl + '/yx-image/retuan/icon-moeny_box@2x.png'" v-if="imageUrl && corpName === 'retuan'" class="reg-manager-icon">
          <p class="reg-manager-text">团长钱包</p>
        </navigator>
        <navigator url="/pages/data-overview" hover-class="none" class="reg-manager-item">
          <img :src="imageUrl + '/yx-image/group/iocn-report_forms@2x.png'" v-if="imageUrl && corpName === 'platform'" class="reg-manager-icon">
          <img :src="imageUrl + '/yx-image/retuan/iocn-report_forms@2x.png'" v-if="imageUrl && corpName === 'retuan'" class="reg-manager-icon">
          <p class="reg-manager-text">数据统计</p>
        </navigator>
      </div>
    </div>
    <!--商品模块-->
    <div class="reg-goods">
      <div class="rag-goods-tab">
        <span :class="[navIndex === index ? 'rag-goods-tab-item-active' : '',navIndex === index ? 'corp-' + corpName + '-bg' : '', 'corp-' + corpName + '-tab']" class="rag-goods-tab-item" v-for="(item, index) in nav" :key="index" @click="_setNav(index)">
          {{item.title}}
        </span>
      </div>
      <!--TODO-->
      <div class="order-big-box" :style="{height: detailedHeight + 'px'}">
        <div class="presell-wrapper order-box" :style="{'transform': ' translateX('+ -(navIndex * width) +'px)'}">
          <div class="title-wrapper border-bottom-1px" v-if="preSell.activity_title">
            <p class="title">{{preSell.activity_title}}</p>
            <div class="copy-btn" :class="'corp-' + corpName + '-goods-btn'" @click="copyPreSell">一键复制</div>
          </div>
          <div class="content-wrapper" v-if="preSell.activity_content_list">
            <div v-for="(item, index) in preSell.activity_content_list" :key="index" class="content">{{item}}</div>
          </div>
          <div class="noting" v-if="!preSell.title">
            <div class="noting-img">
              <img class="img" :src="imageUrl + '/yx-image/group/pic-kong@2x.png'" v-if="imageUrl">
            </div>
            <div class="txt">空空如也</div>
          </div>
        </div>
        <div class="reg-goods-box order-box" :style="{'transform': ' translateX('+ -(navIndex * width) +'px)'}">
          <navigator :url="'/pages/copy-detail?id=' + item.goods_id + '&activityId=' + item.activity_id" hover-class="none" class="reg-goods-item" v-for="(item,index) in goodsList" :key="index">
            <img :src="item.goods_cover_image" class="reg-goods-img" mode="aspectFill">
            <div class="reg-goods-content">
              <div class="reg-goods-title">{{item.name}}</div>
              <div class="reg-goods-tip" :class="'corp-' + corpName + '-wallet-label'">团购价</div>
              <span class="reg-goods-money" :class="'corp-' + corpName + '-money'">{{item.trade_price}}<span class="reg-goods-small">元</span></span>
              <span class="reg-goods-del-money">{{item.original_price}}元</span>
            </div>
          </navigator>
          <div class="noting" v-if="isNoGoods">
            <div class="noting-img">
              <img class="img" v-if="imageUrl" :src="imageUrl + '/yx-image/group/pic-kong@2x.png'">
            </div>
            <div class="txt">空空如也</div>
          </div>
        </div>
      </div>
    </div>
    <div class="end" v-if="!isNoGoods">— 到底了—</div>
    <link-group ref="shareList" :linkType="2" :isSharePoster="false"></link-group>
  </div>
</template>

<script type="text/ecmascript-6">
  import NavigationBar from '@components/navigation-bar/navigation-bar'
  import API from '@api'
  import LinkGroup from '@components/link-group/link-group'
  import NotificationRegimental from './notification-regimental/notification-regimental'
  import Notification from './notification'

  const PAGE_NAME = 'REGIMENTAL_COMMANDER'
  const Nav = [{title: '预售清单', status: 2}, {title: '商品资料', status: 3}]
  export default {
    name: PAGE_NAME,
    components: {
      LinkGroup,
      NavigationBar,
      NotificationRegimental
    },
    data() {
      return {
        nav: Nav,
        width: 0,
        navIndex: 0,
        isLoading: true,
        leaderDetail: {},
        orderTotal: {},
        goodsList: [],
        adaptation: {height: 195, marginTop: 64.5, hoseMarginTop: 164},
        isNoGoods: false,
        preSell: {},
        goodsItem: {},
        page: 1,
        length: 1,
        detailedHeight: 280,
        customerCount: 0
      }
    },
    async onReachBottom() {
      if (this.navIndex === 0) {
        return
      }
      this.page++
      await this._getRecommendGoods()
    },
    async onShow() {
      this._getCustomerCount()
      Notification.getInstance().connect() // todo 连接
      this.$wx.getSystemInfo({
        success: (res) => {
          this.width = res.screenWidth * 0.936
        }
      })
      this.adaptation = {height: 195, marginTop: 64.5, hoseMarginTop: 164}
      this.page = 1
      let res = this.$wx.getSystemInfoSync()
      let statusBarHeight = res.statusBarHeight - 20 || 0
      for (let key in this.adaptation) {
        this.adaptation[key] += statusBarHeight
      }
      await Promise.all([
        this._getLeaderDetail(),
        this._leaderOrderTotal(),
        this._getPresellGoods()
      ])
      if (this.navIndex === 1) {
        this._getRecommendGoods()
      }
      this.$wechat.hideLoading()
      this.isLoading = false
    },
    computed: {
      address() {
        return this.leaderDetail.province ? this.leaderDetail.province + this.leaderDetail.city + this.leaderDetail.district + this.leaderDetail.address : ''
      }
    },
    methods: {
      _getCustomerCount() {
        API.Notification.getCustomerCount().then((res) => {
          if (res.error !== this.$ERR_OK) {
            return
          }
          this.customerCount = res.data.customer_count
        })
      },
      async _shareGoods(item) {
        this.goodsItem = item
        let res = await API.Leader.goodsThumb({id: item.id})
        this.$refs.shareList.showLink()
        this.goodsItem.thumb_image = res.error === this.$ERR_OK ? res.data.thumb_image : {}
      },
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
      async _setNav(index) {
        if (index === 1 && !this.goodsList.length) {
          await this._getRecommendGoods()
        }
        const query = wx.createSelectorQuery()
        switch (index) {
          case 0:
            query.select('.content-wrapper').boundingClientRect()
            query.exec((res) => {
              this.detailedHeight = res[0] ? res[0].height + 40 : 280
            })
            break
          case 1:
            this.detailedHeight = 99.5 * this.goodsList.length || 280
            break
        }
        this.navIndex = index
      },
      copyPreSell() {
        this.$wechat.setClipboardData(this.preSell.activity_content)
      },
      async _getPresellGoods() {
        let res = await API.Leader.getPresellGoods()
        if (res.error !== this.$ERR_OK) {
          this.$wechat.showToast(res.message)
          return
        }
        this.preSell = res.data
        this.isNoGoods = !this.preSell.activity_content
        setTimeout(() => {
          this._setNav(this.navIndex)
        }, 500)
      },
      async _getLeaderDetail() {
        let res = await API.Leader.leaderDetail()
        if (res.error !== this.$ERR_OK) {
          this.$wechat.showToast(res.message)
          return
        }
        this.leaderDetail = res.data
        wx.setStorageSync('leaderId', res.data.id) // 存储团长id
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
        if (this.page > this.length) {
          return
        }
        let res = await API.Leader.recommendGoods({page: this.page})
        if (res.error !== this.$ERR_OK) {
          this.$wechat.showToast(res.message)
          this.isNoGoods = true
          return
        }
        this.length = res.meta.last_page
        if (this.page === 1) {
          this.goodsList = res.data
        } else {
          this.goodsList = this.goodsList.concat(res.data)
        }
        this.isNoGoods = !this.goodsList.length
        this.detailedHeight = 99.5 * this.goodsList.length || 280
        console.log(this.goodsList)
      }
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

  .order-big-box
    width: 187.2vw
    display: flex
    transform: translateX(0)
    .order-box
      transition: transform 0.3s
      padding: 0 10px
      box-sizing: border-box
      width: 93.6vw

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
    padding: 64.5px 12.5px 0
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
      margin-top: 16px
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
    margin: 164px auto 0
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
    padding: 25px 0 0px
    overflow: hidden
    .rag-goods-tab
      width: 176px
      margin: 0 auto
      display: flex
      overflow: hidden
      margin-bottom: 20px
      .rag-goods-tab-item
        box-sizing: border-box
        width: 88px
        font-size: $font-size-14
        font-family: $font-family-medium
        text-align: center
        line-height: 31px
        height: 33px
        transition: all 0.4s
        &:first-child
          border-right: none
          border-radius: 50px 0 0 50px
        &:last-child
          border-left: none
          border-radius: 0 50px 50px 0
      .rag-goods-tab-item-active
        transform-origin: 50%
        color: $color-white

    .presell-wrapper
      .title-wrapper
        display: flex
        align-items: center
        justify-content: space-between
        height: 40px
        margin-bottom: 4px
        .title
          font-family: $font-family-medium
          font-size: $font-size-14
          color: $color-text-main
          text-indent: 15px
        .copy-btn
          border-radius: 23px
          padding: 5px 8px
          font-size: $font-size-14
      .content-wrapper
        padding-top: 11.5px
        padding-left: 15px
        padding-bottom: 20px
        background: url("./pic-line_bg@2x.png")
        background-size: 100%
        .content
          margin-bottom: 25px
          font-size: $font-size-14
          color: #616161
          line-height: 18px
          &:first-child
            margin-bottom: 10px
          &:nth-child(2)
            margin-bottom: 20px

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
        height: $font-size-18
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
      top: 0px
      bottom: 10px
      right: 0
      position: absolute
      display: flex
      flex-direction: column
      align-items: flex-end
      justify-content: space-between
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
      .copy-btn
        border-radius: 23px
        padding: 5px 8px
        border-1px($color-main, 23px)
        font-size: $font-size-14
        color: $color-main

  .end
    line-height: 1
    padding: 20px 0 26px
    text-align: center
    font-family: $font-family-regular
    font-size: $font-size-13
    color: $color-text-assist

  .noting
    text-align: center
    padding: 40px 0
    .noting-img
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
</style>
