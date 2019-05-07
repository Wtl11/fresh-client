<template>
  <form report-submit @submit="$getFormId">
  <div class="flash-sale-list" :style="{background: isShowEmpty? '#fff': ''}">
    <navigation-bar title="限时抢购"></navigation-bar>
    <section class="tab-container">
      <dl class="tab-wrapper">
        <dt class="top-wrapper">
          <nav class="top-item-wrapper" :class="{active: tabIndex === index}" v-for="(item, index) in tabList" :key="index" @click="changeTabHandle(item, index)">
            <p class="text">{{item.at}}</p>
            <p class="explain">{{item.at_str}}</p>
          </nav>
        </dt>
        <dd class="bottom-wrapper">
          <button class="share-button" open-type="share" formType="submit">
            <img class="share-img" mode="aspectFill" v-if="imageUrl" :src="imageUrl + '/yx-image/2.3/icon-sharexsqg@2x.png'" alt="">
            <p class="share-text">分享</p>
          </button>
<!--          <div class="left-wrapper">{{currentObj.at_desc}}</div>-->
          <div class="right-wrapper">
            <p class="title">{{currentObj.at_diff_str}}</p>
            <div class="time-wrapper">
              <p class="time start">{{countDownTimes.hour}}</p>
              <p class="dot">:</p>
              <p class="time">{{countDownTimes.minute}}</p>
              <p class="dot">:</p>
              <p class="time">{{countDownTimes.second}}</p>
            </div>
          </div>
        </dd>
      </dl>
    </section>
    <ul v-if="goodsList.length" class="goods-list">
      <li class="goods-item-box" v-for="(item, index) in goodsList" :key="index">
        <classify-item :item="item" @goToChildPage="handleGoToChildPage"></classify-item>
      </li>
      <li class="foot-ties" v-if="!hasMore && !isShowEmpty">
        <div class="lines left"></div>
        <div class="lines right"></div>
        <div class="center">再拉也没有了</div>
      </li>
    </ul>
    <section class="noting" v-else-if="isShowEmpty">
      <div class="noting-img">
        <img class="img" v-if="imageUrl" :src="imageUrl + '/yx-image/group/pic-kong@2x.png'" alt="">
      </div>
      <div class="txt">空空如也</div>
    </section>
    <button class="shop-car" formType="submit" @click="handleNav">
      <img class="car-img" mode="aspectFill" v-if="imageUrl" :src="imageUrl + '/yx-image/2.3/icon-shopcart@2x.png'" alt="">
      <p v-if="count" class="red-wrapper">{{count * 1 > 99 ? 99 : count}}</p>
    </button>
  </div>
  </form>
</template>

<script type="text/ecmascript-6">
  import NavigationBar from '@components/navigation-bar/navigation-bar'
  import ClassifyItem from './classify-item/classify-item'
  import {countDownHandle} from '@utils/common'
  import API from '@api'
  import ShareHandler, {EVENT_CODE} from '@mixins/share-handler'
  import ShareTrick from '@mixins/share-trick'
  import {cartComputed} from '@state/helpers'
  import ClearWatch from '@mixins/clear-watch'

  const PAGE_NAME = 'FLASH_SALE_LIST'
  const SHARE_IMG = {
    '0': {
      img: '/yx-image/2.1/pic-xsqg_jjkq.png',
      title: '即将开抢，敬请期待！'
    },
    '1': {
      img: '/yx-image/2.1/pic-xsqg_ljqg.png',
      title: '正在抢购，先下单先得哦！'
    }
  }

  export default {
    name: PAGE_NAME,
    mixins: [ShareHandler, ShareTrick, ClearWatch],
    components: {
      NavigationBar,
      ClassifyItem
    },
    data() {
      return {
        tabList: [],
        tabIndex: 0,
        goodsList: [],
        hasMore: true,
        isShowEmpty: false,
        // isFirstLoad: true,
        page: 1,
        limit: 10,
        countDownTimes: {
          hour: '00',
          minute: '00',
          second: '00'
        },
        id: undefined, // 活动id
        sharing: false, // 分享中
        goChildPage: false
      }
    },
    computed: {
      ...cartComputed,
      currentObj() {
        return this.tabList[this.tabIndex] || {}
      }
    },
    async onShow() {
      // 分享不执行
      // if (this.sharing) {
      //   this.sharing = false
      //   this._getTabList(0, false)
      //   return
      // }
      // 分享,跳转不执行
      if (this.goChildPage || this.sharing) {
        this.goChildPage = false
        this.sharing = false
        this._resetListParams()
        this._getTabList(0, false)
        return
      }
      wx.pageScrollTo({
        scrollTop: 0,
        duration: 0
      })
      await this._getPageParams()
      this._resetListParams()
      this._getTabList(this.id)
      this.$$shareHandler({
        event: EVENT_CODE.FLASH_SALE_LIST,
        activityId: this.id
      })
    },
    onReachBottom() {
      this.page++
      this._getList()
    },
    onPullDownRefresh() {
      this._resetListParams()
      this._getList(() => {
        wx.stopPullDownRefresh()
      })
    },
    onShareAppMessage() {
      this.sharing = true
      const status = this.currentObj.status
      const shopId = wx.getStorageSync('shopId')
      const flag = Date.now()
      console.warn(`/pages/flash-sale-list?id=${this.currentObj.id}&shopId=${shopId}`)
      return {
        title: SHARE_IMG[status].title,
        path: `/pages/flash-sale-list?id=${this.currentObj.id}&shopId=${shopId}&flag=${flag}`,
        imageUrl: this.imageUrl + SHARE_IMG[status].img
      }
    },
    onUnload() {
      this.timer && clearInterval(this.timer)
    },
    onHide() {
      this.timer && clearInterval(this.timer)
    },
    methods: {
      handleGoToChildPage() {
        this.goChildPage = true
      },
      handleNav() {
        wx.switchTab({url: '/pages/shopping-cart'})
      },
      // 更新页面的参数
      async _getPageParams() {
        try {
          let el = await getCurrentPages()[getCurrentPages().length - 1]  // eslint-disable-line
          if (!el) return
          let id = +el.options.id
          let shopId = +el.options.shopId
          shopId && wx.setStorageSync('shopId', shopId)
          id && (this.id = id)
          console.warn(id, '页面id')
        } catch (e) {
          console.error(e, '获取参数异常')
        }
      },
      // tab-change
      changeTabHandle(item, index) {
        if (this.tabIndex === index) {
          return
        }
        this.timer && clearInterval(this.timer)
        this.tabIndex = index
        wx.pageScrollTo({
          scrollTop: 0,
          duration: 0
        })
        this._resetListParams()
        this._getTabList(0, false)
      },
      // 重置
      _resetListParams() {
        this.page = 1
        this.hasMore = true
      },
      // tab-list
      async _getTabList(id, loading) {
        try {
          let res = await API.FlashSale.getFlashTabList('', loading)
          this.tabList = res.data
          if (this.tabList && this.tabList.length === 0) {
            wx.redirectTo({url: '/pages/goods-end'})
            return
          }
          if (id) {
            let index = this.tabList.findIndex(val => val.id === id)
            index > -1 && (this.tabIndex = index)
          }
          this._countDownAction()
          this._getList()
        } catch (e) {
          console.error(e)
        }
      },
      // 倒计时
      _countDownAction() {
        if (!this.currentObj) return
        let currentTime = this.currentObj.at_diff || 0
        if (currentTime < 0) {
          currentTime = 0
        }
        // if (!currentTime) return
        this.countDownTimes = countDownHandle(currentTime)
        this.timer && clearInterval(this.timer)
        this.timer = setInterval(() => {
          currentTime--
          this.countDownTimes = countDownHandle(currentTime)
          if (this.countDownTimes.differ <= 0) {
            clearInterval(this.timer)
            this._getTabList(0, false)
          }
        }, 1000)
      },
      // 列表
      _getList(callback) {
        if (!this.hasMore) return
        let data = {activity_id: this.currentObj.id || 0, page: this.page}
        API.FlashSale.getFlashList(data).then((res) => {
          callback && callback()
          this.$wechat.hideLoading()
          let meta = res.meta
          if (meta.current_page === 1) {
            this.goodsList = res.data
            this.isShowEmpty = meta.total === 0
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

  .shop-car
    position :fixed
    right :15px
    bottom :65px
    width :52px
    height :@width
    background: #FFFFFF;
    box-shadow: 0 4px 15px 0 rgba(17,17,17,0.20);
    border-radius :50%
    z-index :101
    display :flex
    align-items :center
    justify-content :center
    .car-img
      position :relative
      top:2px
      width :25px
      height :20.2px
    .red-wrapper
      position :absolute
      top:9px
      right :8px
      width :17px
      height :@width
      box-sizing :border-box
      background: #FE3B39;
      border: 1px solid #FFFFFF;
      border-radius :50%
      font-family: $font-family-regular
      font-size: 10px;
      color: #FFFFFF;
      text-align :center
      line-height :14px


  .img
    width :100%
    height :100%
    display :block

  .share-button
    width:67px
    height :29px
    col-center()
    right :0
    z-index :50
    display :flex
    align-items :center
    justify-content :center
    border-radius :29px 0 0 29px
    background :rgba(255,255,255,0.6)
    font-family: $font-family-regular
    font-size: 14px;
    color: #1D2023;
    .share-img
      width :15px
      height: @width
      display :block
    .share-text
      padding-left :5px

  .flash-sale-list
    width: 100%
    background :#FFE359
    min-height :100vh
    .tab-container
      position relative
      width :100vw
      height :110px
      z-index :50
      .tab-wrapper
        color: #111111
        position :fixed
        left :0
        right :0
        .bottom-wrapper
          height :55px
          layout(row,block,nowrap)
          align-items :center
          padding 0 6px
          font-family: $font-family-regular
          background :#FFE359
          position :relative
          .left-wrapper
            font-size: 14px
          .right-wrapper
            flex:1
            color: $color-text-sub
            display :flex
            align-items :center
            justify-content :flex-start
            .title
              color: #111
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
                width :@height
                text-align :center
                box-sizing :border-box
                &.start
                  padding :0 2px
                  width: auto
                  box-sizing: content-box
              .dot
                padding :0 2px
                position :relative
                bottom :1px
        .top-wrapper
          height :55px
          background: #F7F7F7
          display:flex
          align-items :flex-end
          .top-item-wrapper
            width :33.33333333333333vw
            height :55px
            background: #F7F7F7
            display :flex
            flex-direction :column
            justify-content :center
            align-items :center
            font-family :$font-family-medium
            transition :background 0.3s
            &.active
              background :#FFE359
            .text
              font-size :18px
              line-height :21px
            .explain
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
      layout(row,block,nowrap)
      justify-content: center
      align-items: center
      padding-top: 25px
      padding-bottom: 20px
      position :relative
      .lines
        position absolute
        col-center()
        margin-top :2.5px
        width: 10px
        height: 1px
        background: rgba(124, 132, 156, 0.20)
        &.left
          left :34%
        &.right
          right: 34%
      .center
        position :relative
        font-family: $font-family-regular
        font-size: $font-size-14
        color: rgba(152, 152, 159, 0.30)

  .noting
    text-align: center
    margin-top: 100px
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
