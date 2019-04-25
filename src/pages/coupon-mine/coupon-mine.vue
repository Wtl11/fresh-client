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
                <coupon-item :dataInfo="child"></coupon-item>
              </li>
            </block>
            <li v-if="item.isShowEmpty" class="empty-wrapper">
              <img class="img" mode="aspectFill" v-if="imageUrl" :src="imageUrl + '/yx-image/2.1/pic-kong@2x.png'">
              <p class="text">空空如也</p>
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
  import CouponItem from './coupon-item/coupon-item'
  import TabItem from './tab-item'
  import API from '@api'

  const PAGE_NAME = 'MINE_COUPON'

  export default {
    name: PAGE_NAME,
    components: {
      NavigationBar,
      CouponTab,
      CouponItem
    },
    data() {
      return {
        tabList: [
          new TabItem({text: '可用', status: '1', numberKey: 'can_used_count'}),
          new TabItem({text: '不可用', status: '0', numberKey: 'cannot_used_count'})
        ],
        tabIndex: 0,
        couponWrapperHeight: 0,
        couponHeight: 0
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
      // if (!this.currentObj.isFirstLoad) {
      //   this._refresh()
      // }
    },
    methods: {
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
          if (res.meta.current_page === 1) {
            this.currentObj.dataArray = res.data
            this.currentObj.isShowEmpty = !res.meta.total
            this.currentObj.isFirstLoad = false
            this.currentObj.number = res.meta.total
          } else {
            this.currentObj.dataArray = dataArray.concat(res.data)
          }
          this.currentObj.hasMore = res.meta.current_page < res.meta.last_page
          // this._setScrollHeight()
        }).catch(e => {
          callbcak && callbcak()
          console.error(e)
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

  .empty-wrapper
    padding-top :106px
    .img
      display :block
      margin :0 auto
      width :116px
      height :110px
    .text
      padding-top :15px
      font-family: $font-family-regular
      font-size: 14px
      color: $color-text-sub
      text-align: center

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
            .coupon-item-wrapper
              position :relative
              padding-bottom :15px
              &:last-child
                padding-bottom :40px

</style>
