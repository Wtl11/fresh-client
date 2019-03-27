<template>
  <div class="flash-sale-list">
    <navigation-bar title="限时抢购"></navigation-bar>
    <dl class="tab-wrapper">
      <dt class="top-wrapper">
        <nav class="top-item-wrapper" :class="{active: tabIndex === index}" v-for="(item, index) in tabList" :key="index" @click="changeTabHandle(item, index)">
          <p class="text">{{item.text}}</p>
          <p class="explain">{{item.explain}}</p>
        </nav>
      </dt>
      <dd class="bottom-wrapper">
        <div class="left-wrapper">正在抢购，先下单先得哦！</div>
        <div class="right-wrapper">
          <p class="title">距开始</p>
          <div class="time-wrapper">
            <p class="time">01</p>
            <p class="dot">:</p>
            <p class="time">59</p>
            <p class="dot">:</p>
            <p class="time">16</p>
          </div>
        </div>
      </dd>
    </dl>
    <ul v-if="goodsList.length" class="goods-list">
      <li class="goods-item-box" v-for="(item, index) in goodsList" :key="index">
        <classify-item :item="item"></classify-item>
      </li>
      <li class="foot-ties" v-if="!hasMore">
        <div class="left lines"></div>
        <div class="center">再拉也没有了</div>
        <div class="bot lines"></div>
      </li>
    </ul>
    <section class="noting" v-else-if="isShowEmpty">
      <div class="noting-img">
        <img class="img" v-if="imageUrl" :src="imageUrl + '/yx-image/group/pic-kong@2x.png'" alt="">
      </div>
      <div class="txt">空空如也</div>
    </section>
    <button class="share-button" open-type="share">
      <img class="img" mode="aspectFill" v-if="imageUrl" :src="imageUrl + '/yx-image/2.1/icon-share2@2x.png'" alt="">
    </button>
  </div>
</template>

<script type="text/ecmascript-6">
  import NavigationBar from '@components/navigation-bar/navigation-bar'
  import ClassifyItem from './classify-item/classify-item'
  import API from '@api'

  const PAGE_NAME = 'FLASH_SALE_LIST'

  export default {
    name: PAGE_NAME,
    components: {
      NavigationBar,
      ClassifyItem
    },
    data() {
      return {
        tabList: [
          {
            text: '10:00',
            explain: '正在抢购'
          },
          {
            text: '16:00',
            explain: '即将开抢'
          },
          {
            text: '24:59',
            explain: '3月19日'
          }
        ],
        tabIndex: 0,
        goodsList: [],
        hasMore: true,
        isShowEmpty: false,
        isFirstLoad: true,
        page: 1,
        limit: 10
      }
    },
    onLoad() {
      this._getList()
    },
    onReachBottom() {
      this.page++
      this._getList()
    },
    onPullDownRefresh() {
      this.page = 1
      this.hasMore = true
      this._getList(() => {
        wx.stopPullDownRefresh()
      })
    },
    onShareAppMessage() {
      return {}
    },
    methods: {
      changeTabHandle(item, index) {
        this.tabIndex = index
      },
      _getList(callback) {
        if (!this.hasMore) return
        let data = {customer_coupon_id: this.$mp.query.id || 30, limit: this.limit, page: this.page}
        API.Coupon.getGoodsList(data, this.isFirstLoad).then((res) => {
          callback && callback()
          this.$wechat.hideLoading()
          let meta = res.meta
          if (meta.current_page === 1) {
            this.goodsList = res.data
            this.isShowEmpty = meta.total === 0
            this.isFirstLoad = false
          } else {
            let arr = this.goodsList.concat(res.data)
            this.goodsList = arr
          }
          this.hasMore = meta.current_page < meta.last_page
        }).catch(() => {
          callback && callback()
        })
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@designCommon"

  .img
    width :100%
    height :100%
    display :block

  .share-button
    width:52.5px
    height :50px
    position :fixed
    bottom :70px
    right :0
    z-index :50

  .flash-sale-list
    width: 100%
    background :$color-background
    min-height :100vh
    .tab-wrapper
      color: #111111
      .bottom-wrapper
        height :40px
        layout(row,block,nowrap)
        align-items :center
        padding 0 6px
        font-family: $font-family-regular
        .left-wrapper
          font-size: 15px
        .right-wrapper
          flex:1
          color: $color-text-sub
          display :flex
          align-items :center
          justify-content :flex-end
          .title
            font-size :12px
            padding-right :6px
          .time-wrapper
            display :flex
            font-size: 12px;
            padding-right :4px
            .time
              color: #FFFFFF;
              font-family: DINAlternate-Bold;
              background :rgba(17,17,17,0.8)
              border-radius: 3px
              height :15px
              line-height :@height
              padding :0 2px
            .dot
              padding :0 2px
      .top-wrapper
        height :55px
        background: #FFE500
        display:flex
        justify-content :space-around
        align-items :flex-end
        .top-item-wrapper
          width :95px
          height :50px
          background: #FFE500
          border-radius: 8px 8px 0 0
          display :flex
          flex-direction :column
          justify-content :center
          align-items :center
          font-family :$font-family-medium
          transition :background 0.3s
          &.active
            background :$color-background
          .text
            font-size :18px
          .explain
            padding-top :3px
            font-size :12px

  .goods-list
    width: 100vw
    layout(row)
    align-items: center
    padding: 0 6px
    box-sizing: border-box
    .goods-item-box
      width: 50%
      box-sizing: border-box
      margin-bottom: 3px
      &:nth-of-type(odd)
        padding-right: 1.5px
      &:nth-of-type(even)
        padding-left: 1.5px
    .foot-ties
      width :100vw
      box-sizing :border-box
      layout(row)
      justify-content: center
      align-items: center
      height: 60px
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
