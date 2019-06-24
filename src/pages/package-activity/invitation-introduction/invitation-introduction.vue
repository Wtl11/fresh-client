<template>
  <div>
    <navigation-bar title="邀请有礼"></navigation-bar>
    <div class="invitation-introduction">
      <div class="invitee-img-box">
        <img v-if="imageUrl" :src="imageUrl + '/yx-image/invitation/pic-yqyl@2x.png'" class="invitee-img">
        <div class="rules" @click="goRules"></div>
      </div>
      <img v-if="imageUrl" :src="imageUrl + '/yx-image/invitation/pic-title1@2x.png'" class="title-img">
      <div class="coupon">
        <div v-for="(item, index) in couponList" :key="index" class="coupon-item">
          <img v-if="imageUrl" :src="imageUrl + '/yx-image/invitation/pic-yqcoupon@2x.png'" class="coupon-img">
          <div class="coupon-right-title">
            <span class="coupon-title">福利{{index + 1}}</span>
          </div>
          <div class="coupon-content">
            <div class="coupon-intro">邀请<span class="coupon-num">{{item.cond_num}}</span>位新用户下单</div>
            <div class="coupon-tip">可获得</div>
            <div class="coupon-name" v-if="item.other_info">{{item.other_info.goods_name}}</div>
          </div>
          <div class="goods-img-box">
            <img v-if="item.other_info" :src="item.other_info.goods_cover_image" mode="aspectFill" class="goods-img">
          </div>
        </div>
      </div>
      <img v-if="imageUrl" :src="imageUrl + '/yx-image/invitation/pic-title2@2x.png'" class="title-img">
      <div class="people">
        <coupon-tab :tabList="tabList" :tabIndex="tabIndex" @change="changeTab"></coupon-tab>
        <article class="big-box">
          <div
            class="scroll-wrapper"
            :style="{'transform': ' translateX('+ -(tabIndex * 91.4667) +'vw)', width:  (tabList.length * 91.4667) +'vw'}"
          >
            <nav class="scroll-item-wrapper"
                 v-for="(item, index) in tabList" :key="index"
            >
              <ul class="coupon-wrapper" v-if="index === tabIndex">
                <!---->
                <block v-for="(child, idx) in item.dataArray" :key="idx">
                  <li v-if="idx < 3" class="people-item">
                    <img :src="child.avatar" alt="" class="people-img">
                    <div class="people-msg">
                      <div class="people-name">{{child.nickname}}</div>
                      <div class="people-time">{{child.created_at}}</div>
                    </div>
                    <div class="tip" v-if="tabIndex === 0">下单成功</div>
                    <button class="guid" v-if="tabIndex === 1" open-type="share">去引导</button>
                  </li>
                </block>
                <li v-if="item.dataArray.length > 3" class="more-item" @click="goMore">
                  <span class="more-text">查看更多</span>
                  <img v-if="imageUrl" :src="imageUrl + '/yx-image/invitation/icon-pressed_yq@2x.png'" class="way">
                </li>
                <is-active-empty v-if="item.isShowEmpty"></is-active-empty>
                <!--<li v-if="item.isShowEmpty" class="empty-wrapper">-->
                <!--<img class="empty-img" mode="aspectFill" v-if="imageUrl" :src="imageUrl + '/yx-image/2.1/pic-kong@2x.png'">-->
                <!--<p class="empty-text">空空如也</p>-->
                <!--</li>-->
              </ul>
            </nav>
          </div>
        </article>
      </div>
      <button class="btn" open-type="share" data-type="default">立即邀请好友领好礼</button>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import NavigationBar from '@components/navigation-bar/navigation-bar'
  import IsActiveEmpty from '@components/is-active-empty/is-active-empty'
  import CouponTab from './coupon-tab/coupon-tab'
  import TabItem from './tab-item'
  import API from '@api'

  const PAGE_NAME = 'INVITATION_INTRODUCTION'

  export default {
    // 邀请有礼介绍页面
    name: PAGE_NAME,
    components: {
      NavigationBar,
      CouponTab,
      IsActiveEmpty
    },
    data() {
      return {
        tabIndex: 0,
        tabList: [
          new TabItem({ text: '邀请成功', status: '3', numberKey: 'can_used_count' }),
          new TabItem({ text: '邀请在路上', status: '1', numberKey: 'cannot_used_count' })
        ],
        couponList: [],
        thumbImage: ''
      }
    },
    onShareAppMessage(e) {
      let shopId = wx.getStorageSync('shopId') || 0
      let userInfo = wx.getStorageSync('userInfo') || {}
      let nickName = userInfo.nickname || ''
      let id = userInfo.id || ''
      let socialName = wx.getStorageSync('social_name')
      // 引导
      let imageUrl = this.imageUrl + '/yx-image/choiceness/pic-zbyx@2x.png'
      let title = `${socialName},次日达、直采直销，点击下单↓`
      let path = `${this.$routes.main.CHOICENESS}?shopId=${shopId}`
      if (e.target.dataset.type === 'default') {
        // 邀请用户
        title = `${nickName}邀请你参加新人专享活动`
        imageUrl = this.thumbImage
        path = `${this.$routes.activity.INVITEE}?shopId=${shopId}&invitationId=${id}`
      }
      return {
        title,
        path,
        imageUrl
      }
    },
    onShow() {
      this.invitationDetail()
      this.getInviteStatistic()
    },
    methods: {
      invitationDetail() {
        API.Coupon.invitationDetail().then((res) => {
          if (res.error !== this.$ERR_OK) return
          this.couponList = res.data.coupons
          let arr = []
          this.couponList.forEach((item) => {
            if (item.cond_type === 5) {
              arr.push(item)
            }
          })
          this.couponList = arr
          this.thumbImage = res.data.thumb_image
        })
      },
      getInviteStatistic(loading = false) {
        API.Coupon.getInviteStatistic({ status: this.tabList[this.tabIndex].status }, loading).then((res) => {
          if (res.error !== this.$ERR_OK) return
          this.tabList[this.tabIndex].dataArray = res.data
          this.tabList[this.tabIndex].isShowEmpty = !res.data.length
          this.tabList = JSON.parse(JSON.stringify(this.tabList))
        })
      },
      // 活动规则
      goRules() {
        wx.navigateTo({ url: this.$routes.activity.INVITATION_RULES })
      },
      changeTab(item, index) {
        this.tabIndex = index
        this.getInviteStatistic()
      },
      goMore() {
        wx.navigateTo({ url: `${this.$routes.activity.MY_RECORD}?index=${this.tabIndex}` })
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@designCommon"

  .invitation-introduction
    background: #FDE676
    padding-bottom: 84px

  .people
    border-radius: 6px
    background: $color-white
    width: 91.4667vw
    overflow: hidden
    margin: 0 auto
    .big-box
      width: 91.4667vw
      overflow: hidden
      display: flex
      transform: translateX(0)
      .scroll-wrapper
        width: 91.4667vw
        transition: transform 0.3s
        layout(row, block, nowrap)
        .scroll-item-wrapper
          width: 91.4667vw
          .coupon-wrapper
            background: transparent
            position: relative
            min-height: (19.46667 * 3) vw
            margin-top: 2.6667vw
            .people-item
              display: flex
              padding: 4vw 0 4vw
              margin: 0 4vw
              box-sizing: border-box
              height: 19.46667vw
              border-bottom-1px(#D8D8D8)
              &:nth-child(3)
                border-none()
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

            .more-item
              display: flex
              align-items: center
              justify-content: center
              height: 38px
              border-top-1px(#D8D8D8)
              .more-text
                color: #868686
                font-family: $font-family-regular
                font-size: $font-size-14
                margin-right: 4.5px
              .way
                height: 12.5px
                width: 6.5px

  .invitee-img-box
    height: 88.4vw
    position: relative
    .invitee-img
      width: 100%
      height: 100%
    .rules
      position: absolute
      right: 0
      top: (23 / 750 * 100) vw
      width: (153 / 750 * 100) vw
      height: (54 / 750 * 100) vw

  .title-img
    height: 5.86667vw
    width: 66.9333vw
    display: block
    margin: 28px auto 20px

  .coupon
    min-height: 61.86667vw
    margin-bottom: 4px
    .coupon-item
      height: 30.93333vw
      margin: 0 auto
      width: 95.2vw
      position: relative
      display: flex
    .coupon-img
      position: absolute
      top: 0
      left: 0
      width: 100%
      height: 100%
    .coupon-right-title
      width: 6.8vw
      padding: 0 1.6vw
      box-sizing: border-box
      text-align: center
      position: relative
      z-index: 1
      display: flex
      align-items: center
      margin-left: 1.6vw
      .coupon-title
        font-family: $font-family-regular
        color: $color-white
        letter-spacing: 1.11px
        font-size: 3.7333vw
    .coupon-content
      position: relative
      z-index: 1
      margin-top: 1.5vw
      width: (402 / 750 * 100) vw
      padding-left: 3.467vw
      box-sizing: border-box
      .coupon-intro
        margin-top: 4vw
        font-size: $font-size-14
        color: #333333
        display: flex
        align-items: center
        line-height: 1
        .coupon-num
          font-size: $font-size-17
          color: #F27F2E
          font-family: $font-family-medium
      .coupon-tip
        margin-top: 6.1333vw
        font-size: $font-size-13
        color: #666666
        font-family: $font-family-regular
        line-height: 1
      .coupon-name
        line-height: 1
        font-size: $font-size-16
        font-family: $font-family-medium
        color: #333333
        margin-top: 1.6vw
        no-wrap()
    .goods-img-box
      position: relative
      z-index: 1
      margin: 1.5vw 0 0 3.73333vw
      .goods-img
        border-radius: 4px
        margin-top: 1.86667vw
        display: block
        width: 23.33334vw
        height: @width

  .btn
    position: fixed
    bottom: 0
    left: 0
    height: 50px
    line-height: 50px
    text-align: center
    font-family: $font-family-medium
    color: $color-white
    background: #F27F2E
    font-size: $font-size-18
    width: 100vw
    z-index: 10

</style>

