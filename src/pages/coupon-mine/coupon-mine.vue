<template>
  <div class="mine-coupon">
    <navigation-bar title="我的优惠券"></navigation-bar>
    <coupon-tab :tabList="tabList" :tabIndex="tabIndex" @change="changeHandle"></coupon-tab>
    <article class="big-box">
      <div class="scroll-wrapper"
           :style="{'transform': ' translateX('+ -(tabIndex * 100) +'vw)', width:  (tabList.length * 100) +'vw'}"
      >
        <nav class="scroll-item-wrapper"
             v-for="(item, index) in tabList" :key="index"
        >
          <ul class="coupon-wrapper" v-if="index === tabIndex">
            <block v-for="(child, idx) in item.dataArray" :key="idx">
              <li class="coupon-item-wrapper">
                <div class="coupon-item">
                  <section class="top-wrapper">
                    <img class="top-bg-img" v-if="imageUrl" :src="imageUrl + '/yx-image/2.3/pic-couponbg_myzk1.png'">
                    <div class="top-container">
                      <artilce class="left" :style="{color: child.color}">
                        <p class="number">{{child.money.int}}</p>
                        <p class="unit">{{child.money.dec}}{{child.unit}}</p>
                      </artilce>
                      <article class="right">
                        <div class="title">
                          <p class="use-type" :style="{color: child.color, borderColor: child.color}">{{child.range_type_str}}</p>
                          <p class="txt" :style="{color: child.color}">{{child.coupon_name}}</p>
                        </div>
                        <p class="condition" :style="{color: child.color}">有效期至 {{child.end_at}}</p>
                        <div v-if="child.status === 1" class="button" @click="useHandle(child)">去使用</div>
                        <img class="lab-img" v-if="imageUrl && child.status === 2" :src="imageUrl + '/yx-image/2.3/pic-coupon_ygq.png'">
                        <img class="lab-img" v-if="imageUrl && child.status === 0" :src="imageUrl + '/yx-image/2.3/pic-coupon_ysy.png'">
                      </article>
                    </div>
                  </section>
                  <section class="middle-wrapper">
                    <img class="middle-bg-img" v-if="imageUrl" :src="imageUrl + '/yx-image/2.3/pic-couponbg_myzk2.png'">
                    <div class="middle-container">
                      <aritlce class="title" :style="{color: child.color}" @click="handleShowTip(child)">
                        <p>使用说明</p>
                        <img class="down-img" :class="{'rotate': child.showTip}" mode="widthFix" v-if="imageUrl" :src="imageUrl + '/yx-image/2.3/icon-pressed_down@2x.png'">
                      </aritlce>
                      <p v-if="child.showTip" class="explain">{{child.description}}</p>
                    </div>
                  </section>
                  <section class="bottom-wrapper">
                    <img class="bottom-bg-img" v-if="imageUrl" :src="imageUrl + '/yx-image/2.3/pic-couponbg_myzk3.png'">
                  </section>
                </div>
              </li>
            </block>
            <li v-if="item.isShowEmpty" class="empty-wrapper">
              <img class="empty-img" mode="aspectFill" v-if="imageUrl" :src="imageUrl + '/yx-image/2.1/pic-kong@2x.png'">
              <p class="empty-text">空空如也</p>
            </li>
          </ul>
        </nav>
      </div>
    </article>
  </div>
</template>

<script type="text/ecmascript-6">
  import NavigationBar from '@components/navigation-bar/navigation-bar'
  import CouponTab from './coupon-tab/coupon-tab'
  import TabItem from './tab-item'
  import API from '@api'
  import CouponNavigator from '@mixins/coupon-navigator'
  import {formatCouponMoney} from '@utils/common'

  import Coupon from './coupon'

  const PAGE_NAME = 'MINE_COUPON'

  export default {
    name: PAGE_NAME,
    mixins: [CouponNavigator],
    components: {
      NavigationBar,
      CouponTab
    },
    data() {
      return {
        tabList: [
          new TabItem({text: '可用', status: '1', numberKey: 'can_used_count'}),
          new TabItem({text: '不可用', status: '0', numberKey: 'cannot_used_count'})
        ],
        tabIndex: 0,
        couponWrapperHeight: 0,
        couponHeight: 0,
        showTip: false
      }
    },
    computed: {
      currentObj() {
        return this.tabList[this.tabIndex]
      }
    },
    onLoad() {
      let systemInfo = wx.getSystemInfoSync() || {}
      let screenWidth = systemInfo.screenWidth
      this.couponHeight = screenWidth * 0.24
      this._getListNumber()
      this._getList()
    },
    onReachBottom() {
      this.currentObj.page++
      this._getList()
    },
    onPullDownRefresh() {
      this._refresh(() => {
        wx.stopPullDownRefresh()
      })
    },
    onShow() {
    },
    methods: {
      useHandle(item) {
        this.navHandle(item.range_type, item.customer_coupon_id)
      },
      handleShowTip(item) {
        item.showTip = !item.showTip
        // this.showTip = !this.showTip
      },
      // 切换tab
      changeHandle(item, index) {
        if (this.tabIndex === index) return
        this.tabIndex = index
        // wx.pageScrollTo({
        //   scrollTop: 0,
        //   duration: 0
        // })
        this._refresh()
      },
      // 刷新当前tab
      _refresh(callback) {
        this.currentObj.page = 1
        this.currentObj.hasMore = true
        this._getList(() => {
          callback && callback()
        })
      },
      // 获取头部数量
      _getListNumber(index = 0) {
        API.Coupon.getClientListNumber().then(res => {
          this.tabList.forEach(item => {
            item.number = res.data[item.numberKey]
          })
        })
      },
      // 获取列表
      _getList(callbcak) {
        let {hasMore, page, status, dataArray, isFirstLoad} = this.currentObj
        if (!hasMore) return
        API.Coupon.getClientList({status, page}, isFirstLoad).then((res) => {
          callbcak && callbcak()
          let arr = this._formatListData(res.data)
          if (res.meta.current_page === 1) {
            this.currentObj.dataArray = arr
            this.currentObj.isShowEmpty = !res.meta.total
            this.currentObj.isFirstLoad = false
            this.currentObj.number = res.meta.total
          } else {
            this.currentObj.dataArray = dataArray.concat(arr)
          }
          this.currentObj.hasMore = res.meta.current_page < res.meta.last_page
          // this._setScrollHeight()
        }).catch(e => {
          callbcak && callbcak()
          console.error(e)
        })
      },
      _formatListData(arr) {
        return arr.map(item => {
          return {
            ...item,
            showTip: false,
            color: Coupon.COLOR[item.status],
            unit: Coupon.COUPON_UNIT[item.preferential_type] || '',
            money: formatCouponMoney(item.denomination)
          }
        })
      },
      _setScrollHeight() {
        let len = this.currentObj.dataArray.length
        this.couponWrapperHeight = len * this.couponHeight + len * 12
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@designCommon"


  .mine-coupon
    background :$color-background
    min-height :100vh
    position :relative
    .big-box
      width: 100vw
      overflow: hidden
      display: flex
      transform: translateX(0)
      .scroll-wrapper
        width :100vw
        transition :transform 0.3s
        layout(row,block,nowrap)
        .scroll-item-wrapper
          width :100vw
          padding-bottom :10px
          .coupon-wrapper
            position :relative
            .empty-wrapper
              padding-top :106px
              .empty-img
                display :block
                margin :0 auto
                width :116px
                height :110px
              .empty-text
                padding-top :15px
                font-family: $font-family-regular
                font-size: 14px
                color: $color-text-sub
                text-align: center
            .coupon-item-wrapper
              position :relative
              padding-bottom :15px
              &:last-child
                padding-bottom :40px

  .bottom-wrapper
    width :100%
    position :relative
    .bottom-bg-img
      position :absolute
      display :block
      width :100%
      height :6.133333333333333vw

  .middle-wrapper
    width :100vw
    position :relative
    min-height :4vw
    overflow :hidden
    .middle-bg-img
      position :absolute
      display :block
      width :100vw
    .middle-container
      position :relative
      padding-left :6.4vw
      padding-right :@padding-left
      font-family: $font-family-regular
      font-size: 3.4666666666666663vw
      color: #1D2023;
      .title
        display :flex
        align-items :center
        justify-content :space-between
        .down-img
          width:3.3333333333333335vw
          height :2vw
          display :block
          transition :transform 0.3s
          transform :rotate(0deg)
          &.rotate
            transform :rotate(180deg)
      .explain
        padding-top :2.4vw
        font-size :3.2vw
        line-height :1.42

  .top-wrapper
    width: 100%
    height :26.68463611859838vw
    position :relative
    .top-bg-img
      position :absolute
      display :block
      width :100%
      height :100%
    .top-container
      position :relative
      padding-top :1.866666666666667vw
      padding-left :3.2vw
      padding-right :@padding-left
      height :83%
      layout(block,block,nowrap)
      .left
        flex: 1
        display :flex
        font-family: $font-family-medium
        layout(row,block,nowrap)
        align-items :center
        justify-content :center
        color: #FF8506
        .number
          font-size: 9.066666666666666vw
          line-height: 7.733333333333333vw
        .unit
          position :relative
          top:1.65vw
          font-size: 4.010695187165775vw
          line-height: @font-size
      .right
        flex: 2.548582995951417
        position :relative
        layout(column,block,nowrap)
        justify-content :center
        box-sizing :border-box
        padding-left :3.4133333333333336vw
        .lab-img
          position :absolute
          right :0
          top:0
          width :16.666666666666664vw
          height :18vw
          z-index :50
        .button
          col-center()
          right :4vw
          width:17.333333333333336vw
          height :6.4vw
          border-radius: @width
          font-family: $font-family-regular
          font-size: 3.2vw
          background: #73C200
          color: #FFFFFF;
          text-align: center;
          line-height: @height
        .title
          layout(row,block,nowrap)
          align-items :center
          color: #1D2023;
          .use-type
            height:12px;
            border:1px solid rgba(29,32,35,0.8);
            border-radius:2px;
            color:#1d2023;
            font-size:11px;
            line-height:12.5px;
            padding:0 2px;
          .txt
            padding-left :0.8vw
            font-family: $font-family-medium
            font-size :3.733333333333334vw
            max-width :28vw
            no-wrap()
            line-height :1.2
        .condition
          font-family: $font-family-regular
          padding-top :2.933333333333333vw
          opacity :0.8
          color:$color-text-sub
          font-size :3.2vw
          line-height :1
          no-wrap()

  .img
    position :absolute
    top:0
    left :0
    display :block
    width :100%
    height :100%
    font-size :0
    line-height :0

  .coupon-item
    width :100vw
    position :relative
    margin :0 auto

</style>
