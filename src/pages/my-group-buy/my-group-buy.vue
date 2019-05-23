<template>
  <div class="my-group-buy">
    <navigation-bar ref="navigationBar" title="我的拼团" showArrow="true"></navigation-bar>
    <ul v-if="groupBuyList.length" class="goods-list">
      <li class="goods-item-box" v-for="(item, index) in groupBuyList" :key="index" @click="listHandle">
        <div class="top-bar">
          <p>{{item.created_at}}</p>
          <p>{{item.status_text}}</p>
        </div>
        <img v-if="imageUrl" :src="imageUrl+'/yx-image/2.4/pic-pinzhu@2x.png'" alt="" class="leader-tips">
        <div class="goods-info">
          <img class="img" mode="aspectFill" :src="item.goods[0].image_url">
          <div class="info-con">
            <div class="goods-name">{{item.goods[0].goods_name}}</div>
            <div :class="'corp-' + corpName + '-money'">
              <div class="group-num">2人团</div>
            </div>
            <div :class="'corp-' + corpName + '-money'" class="goods-price"><span class="price-num">18.8</span>元</div>
          </div>
        </div>
        <div class="goods-btn" :class="item.status === 1?'btn-share':''">{{btnArr[0]}}</div>
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
    <coupon-modal ref="couponModal"></coupon-modal>
  </div>
</template>

<script type="text/ecmascript-6">
  import API from '@api'
  import NavigationBar from '@components/navigation-bar/navigation-bar'
  import CouponModal from './coupon-modal/coupon-modal'

  const PAGE_NAME = 'MY_GROUP_BUY'
  const BTN_ARR = ['拼团详情', '邀请邻居']

  export default {
    name: PAGE_NAME,
    components: {
      NavigationBar,
      CouponModal
    },
    data() {
      return {
        groupBuyList: [],
        hasMore: true,
        isShowEmpty: false,
        page: 1,
        limit: 10,
        btnArr: BTN_ARR
      }
    },
    computed: {},
    onLoad() {
      this._getGroupBuyList()
    },
    onShow() {
      this.page = 1
      this._getGroupBuyList()
    },
    onReachBottom() {
      if (!this.hasMore) return
      this.page++
      this._getGroupBuyList()
    },
    methods: {
      async _getGroupBuyList() {
        API.Order.getOrderListData('', this.page).then((res) => {
          if (res.error === this.$ERR_OK) {
            this.groupBuyList = this.groupBuyList.concat(res.data)
          } else {
            this.$wechat.showToast(res.message)
          }
          this._getCouponList()
        })
      },
      async _getCouponList() {
        let couponArr = [
          {
            coupon: {
              preferential_type: 2,
              range_type_str: '通用',
              coupon_name: '满200元减50元',
              end_at: '2019-5-30',
              denomination: 50
            }
          },
          {
            coupon: {
              preferential_type: 1,
              range_type_str: '通用',
              coupon_name: '满100元减10元',
              end_at: '2019-5-31',
              denomination: 7
            }
          },
          {
            coupon: {
              preferential_type: 2,
              range_type_str: '通用',
              coupon_name: '满10元减9元',
              end_at: '2019-5-31',
              denomination: 7
            }
          }
        ]
        couponArr && this._ref('couponModal', 'show', couponArr)
      },
      // 工具-->调用子节点的方法
      _ref(key, fn, params) {
        this.$refs[key] && this.$refs[key][fn] && this.$refs[key][fn](params)
      },
      listHandle() {
        // wx.navigateTo({url: `/pages/`})
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@designCommon"
  $padding-left = 12px

  .my-group-buy
    min-height: 100vh
    background: $color-background
  .goods-item-box
    position: relative
    margin-top: 12px
    background: $color-white
    .top-bar
      padding: 0 $padding-left
      height: 44px
      font-size: $font-size-14
      font-family: $font-family-regular
      color: $color-text-sub
      layout(row)
      justify-content: space-between
      align-items: center
    .leader-tips
      position: absolute
      top: 43.5px
      left: $padding-left
      width: 26px
      height: 19px
      z-index: 9
    .goods-info
      padding: 15px $padding-left
      layout(row)
      align-items: center
      border-top-1px(#e6e6e6)
      .img
        width: 80px
        height: @width
        margin-right: 10px
      .info-con
        height: 80px
        flex:1
        layout(column)
        justify-content: space-between
        .goods-name
          font-family: $font-family-medium
          font-size: $font-size-16
          color: $color-text-main
          no-wrap-plus(1)
        .group-num
          float: left
          width: auto
          height: 18px
          padding: 0 7px
          layout()
          align-items: center
          text-align: center
          border-1px(rgba(250,117,0,0.3),2px)
          font-size: $font-size-12
          font-family: $font-family-regular
        .goods-price
          font-size: $font-size-11
          .price-num
            margin-right: 1px
            font-size: $font-size-20
            font-family: $font-family-medium
    .goods-btn
      position: absolute
      bottom: 17px
      right: 15px
      width: 80px
      height: 30px
      line-height: 30px
      text-align: center
      color: $color-text-sub
      font-size: $font-size-14
      border: 1px solid $color-line
      border-radius: 15px
      &.btn-share
        color: $color-main
        border: 1px solid $color-main
  .foot-ties
    flex: 1
    layout(row)
    justify-content: center
    align-items: center
    height: 60px
    box-sizing: border-box
    padding: 20px 0

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
