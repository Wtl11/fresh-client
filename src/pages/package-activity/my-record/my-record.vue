<template>
  <div class="my-record">
    <navigation-bar title="我的战绩"></navigation-bar>
    <div class="people">
      <coupon-tab :tabList="tabList" :tabIndex="tabIndex" @change="changeTab"></coupon-tab>
      <div class="margin-line"></div>
      <article class="big-box">
        <div
          class="scroll-wrapper"
          :style="{'transform': ' translateX('+ -(tabIndex * 100) +'vw)', width:  (tabList.length * 100) +'vw'}"
        >
          <scroll-view
            scroll-y
            class="scroll-item-wrapper"
            :style="{height: height + 'px'}"
            @scrolltolower="bindScrollToLower"
            v-for="(item, index) in tabList" :key="index"
          >
            <ul class="coupon-wrapper" v-if="index === tabIndex">
              <!---->
              <block v-for="(child, idx) in item.dataArray" :key="idx">
                <li class="people-item">
                  <img :src="child.avatar" alt="" class="people-img">
                  <div class="people-msg">
                    <div class="people-name">{{child.nickname}}</div>
                    <div class="people-time">{{child.created_at}}</div>
                  </div>
                  <div class="tip" v-if="tabIndex === 0">下单成功</div>
                  <button class="guid" v-if="tabIndex === 1" open-type="share">去引导</button>
                </li>
              </block>
              <is-active-empty v-if="item.isShowEmpty"></is-active-empty>
              <!--<li v-if="item.isShowEmpty" class="empty-wrapper">-->
              <!--<img class="empty-img" mode="aspectFill" v-if="imageUrl" :src="imageUrl + '/yx-image/2.1/pic-kong@2x.png'">-->
              <!--<p class="empty-text">空空如也</p>-->
              <!--</li>-->
            </ul>
            <!--<loading-more v-if="recommendListLoad"></loading-more>-->
          </scroll-view>
        </div>
      </article>
    </div>

  </div>
</template>

<script type="text/ecmascript-6">
  import NavigationBar from '@components/navigation-bar/navigation-bar'
  import CouponTab from './coupon-tab/coupon-tab'
  import TabItem from './tab-item'
  import LoadingMore from '@components/loading-more/loading-more'
  import IsActiveEmpty from '@components/is-active-empty/is-active-empty'
  import API from '@api'

  const PAGE_NAME = 'MY_RECORD'

  export default {
    name: PAGE_NAME,
    components: {
      NavigationBar,
      CouponTab,
      LoadingMore,
      IsActiveEmpty
    },
    data() {
      return {
        recommendListLoad: false,
        lastPage: 2,
        page: 1,
        tabIndex: 0,
        height: 300,
        tabList: [
          new TabItem({ text: '邀请成功', status: '1', numberKey: 'can_used_count' }),
          new TabItem({ text: '邀请在路上', status: '0', numberKey: 'cannot_used_count' })
        ]
      }
    },
    onShareAppMessage() {
      let shopId = wx.getStorageSync('shopId') || 0
      let userInfo = wx.getStorageSync('userInfo') || {}
      let nickName = userInfo.nickname || ''
      let id = userInfo.id || ''
      return {
        title: `${nickName}邀请你参加新人专享活动`,
        path: `${this.$routes.activity.INVITEE}?shopId=${shopId}&invitationId=${id}`,
        imageUrl: `${this.imageUrl}/yx-image/invitation/pic-yqyl_wechat@2x.png`
      }
    },
    onShow() {
      this.tabIndex = +this.$mp.query.index || 0
      this.getInviteStatistic(true)
    },
    onLoad() {
      let res = this.$wx.getSystemInfoSync()
      this.height = res.screenHeight - 40 - 12 - 44 - res.statusBarHeight
    },
    methods: {
      bindScrollToLower() {
        if (this.tabList[this.tabIndex].page >= this.tabList[this.tabIndex].last) {
          return
        }
        this.tabList[this.tabIndex].page++
        this.getInviteStatistic(false)
      },
      getInviteStatistic(loading = false) {
        let page = this.tabList[this.tabIndex].page
        API.Coupon.getInviteStatistic({ status: this.tabList[this.tabIndex].status, page }, loading).then((res) => {
          if (res.error !== this.$ERR_OK) return
          if (page === 1) {
            this.tabList[this.tabIndex].dataArray = res.data
            this.tabList[this.tabIndex].isShowEmpty = !res.data.length
          } else {
            this.tabList[this.tabIndex].dataArray = this.tabList[this.tabIndex].dataArray.concat(res.data)
          }
          this.tabList = JSON.parse(JSON.stringify(this.tabList))
        })
      },
      changeTab(item, index) {
        this.tabIndex = index
        this.getInviteStatistic()
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@designCommon"

  .my-record
    height: 100vh
    overflow: hidden

  .people
    border-radius: 6px
    background: $color-white
    width: 100vw
    overflow: hidden
    margin: 0 auto
    .margin-line
      height: 12px
      background: #F7F7F7
    .big-box
      width: 100vw
      overflow: hidden
      display: flex
      transform: translateX(0)
      .scroll-wrapper
        width: 100vw
        transition: transform 0.3s
        layout(row, block, nowrap)
        .scroll-item-wrapper
          width: 100vw
          box-sizing: border-box
          .coupon-wrapper
            background: transparent
            position: relative
            min-height: (21.33333 * 3) vw
            .people-item
              display: flex
              padding: 6.666667vw 0 4vw
              margin: 0 4vw
              box-sizing: border-box
              height: 21.33333vw
              border-bottom-1px(#E6E6E6)
              .people-img
                width: 10.6667vw
                border-radius: 50%
                height: @width
                min-height: @width
                min-width: @width
                background: $color-background
              .people-msg
                margin-left: 2.66667vw
                width: 56.266667vw
                .people-name
                  font-size: $font-size-15
                  font-family: $font-family-regular
                  color: #1D2023
                  line-height: 1.3
                  margin-top: 0.7vw
                  no-wrap()
                .people-time
                  font-size: $font-size-13
                  font-family: $font-family-regular
                  color: #808080
                  line-height: 1
                  margin-top: 1.5vw

              .guid
                width: 20.5333333vw
                height: 8vw
                line-height: 8vw
                text-align: center
                border-radius: 15px
                background: $color-main
                font-size: $font-size-14
                font-family: $font-family-regular
                color: $color-white
                margin-top: 1.2vw
              .tip
                margin-top: 3.6vw
                color: #333333
                font-size: $font-size-13
                height: 13px
                line-height: 13px
                font-family: $font-family-regular

</style>
