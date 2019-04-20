<template>
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
          <div class="left-wrapper">{{currentObj.at_desc}}</div>
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
        <classify-item :item="item"></classify-item>
      </li>
      <li class="foot-ties" v-if="!hasMore && !isShowEmpty">
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
  import {countDownHandle} from '@utils/common'
  import API from '@api'
  import ShareHandler, {EVENT_CODE} from '@mixins/share-handler'
  import ShareTrick from '@mixins/share-trick'

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
    mixins: [ShareHandler, ShareTrick],
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
        sharing: false // 分享中
      }
    },
    computed: {
      currentObj() {
        return this.tabList[this.tabIndex] || {}
      }
    },
    async onShow() {
      // 分享不执行
      if (this.sharing) {
        this.sharing = false
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
      // 更新页面的参数
      async _getPageParams() {
        try {
          let el = await getCurrentPages()[getCurrentPages().length - 1]  // eslint-disable-line
          if (!el) return
          let id = +el.options.id
          let shopId = +el.options.shopId
          shopId && wx.setStorageSync('shopId', shopId)
          id && (this.id = id)
          console.warn(id)
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
    .tab-container
      position relative
      width :100vw
      height :100px
      z-index :50
      .tab-wrapper
        color: #111111
        position :fixed
        left :0
        right :0
        .bottom-wrapper
          height :45px
          layout(row,block,nowrap)
          align-items :center
          padding 0 6px
          font-family: $font-family-regular
          background :$color-background
          .left-wrapper
            font-size: 14px
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
          background: #FFE500
          display:flex
          align-items :flex-end
          padding :0 4vw
          .top-item-wrapper
            width :25.333333333333336vw
            height :50px
            background: #FFE500
            border-radius: 8px 8px 0 0
            display :flex
            flex-direction :column
            justify-content :center
            align-items :center
            font-family :$font-family-medium
            transition :background 0.3s
            &:nth-child(2n)
              margin :0 8vw
            &.active
              background :$color-background
            .text
              font-size :18px
              line-height :21px
            .explain
              font-family :$font-family-regular;
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
