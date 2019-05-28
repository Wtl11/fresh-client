<template>
  <div class="my-group-buy">
    <navigation-bar ref="navigationBar" title="我的拼团" showArrow="true"></navigation-bar>
    <ul v-if="groupBuyList.length > 0" class="goods-list">
      <li class="goods-item-box" v-for="(item, index) in groupBuyList" :key="index" @click="listHandle(item)">
        <div class="top-bar">
          <p>{{item.created_at}}</p>
          <p :class="item.groupon_status === 0 ? 'corp-' + corpName + '-money' : ''">{{item.groupon_status_str}}</p>
        </div>
        <img v-if="imageUrl && item.is_main === 1" :src="imageUrl+'/yx-image/2.4/pic-pinzhu@2x.png'" alt="" class="leader-tips">
        <div class="goods-info">
          <img class="img" mode="aspectFill" :src="item.goods.goods_cover_image">
          <div class="info-con">
            <div class="goods-name">{{item.goods.name}}</div>
            <div :class="'corp-' + corpName + '-money'">
              <div class="group-num">{{item.groupon_person_limit}}人团</div>
            </div>
            <div :class="'corp-' + corpName + '-money'" class="goods-price"><span class="price-num">{{item.goods.trade_price}}</span>元</div>
          </div>
        </div>
        <button v-if="item.groupon_status === 0" class="goods-btn share-button" :id="index" @click.stop="shareGroup(item)">邀请邻居</button>
        <button v-else class="goods-btn">拼团详情</button>
      </li>
    </ul>
    <section v-else-if="isShowEmpty" class="noting">
      <div class="noting-img">
        <img class="img" v-if="imageUrl" :src="imageUrl + '/yx-image/group/pic-kong@2x.png'" alt="">
      </div>
      <div class="txt">空空如也</div>
    </section>
    <coupon-modal ref="couponModal"></coupon-modal>
    <share-pop ref="sharePop"></share-pop>
  </div>
</template>

<script type="text/ecmascript-6">
  import API from '@api'
  import NavigationBar from '@components/navigation-bar/navigation-bar'
  import CouponModal from './coupon-modal/coupon-modal'
  import SharePop from '../collage-detail/share-pop/share-pop'

  const PAGE_NAME = 'MY_GROUP_BUY'

  export default {
    name: PAGE_NAME,
    components: {
      NavigationBar,
      CouponModal,
      SharePop
    },
    data() {
      return {
        groupBuyList: [],
        hasMore: true,
        isShowEmpty: false,
        page: 1,
        limit: 10,
        shareData: {}
      }
    },
    onLoad() {
      this._getGroupBuyList()
    },
    onShow() {
      // onShow只拿优惠券
      this._getGroupBuyList(true)
    },
    onReachBottom() {
      if (!this.hasMore) return
      this.page++
      this._getGroupBuyList()
    },
    onShareAppMessage(e) {
      let shopId = wx.getStorageSync('shopId')
      const flag = Date.now()
      return {
        title: `【${this.shareData.name}】`,
        path: `/pages/collage-detail?id=${this.shareData.id}&shopId=${shopId}&flag=${flag}`,
        imageUrl: `${this.shareData.img}`,
        success: (res) => {},
        fail: (res) => {}
      }
    },
    methods: {
      async _getGroupBuyList(onlyCoupon = false) {
        API.Order.getGroupList({page: this.page}).then((res) => {
          if (res.error === this.$ERR_OK) {
            res.coupon && res.coupon.length > 0 && this._showCoupon(res.coupon)
            if (onlyCoupon) {
              return
            }
            if (this.page === 1) {
              this.groupBuyList = res.data
            } else {
              this.groupBuyList = this.groupBuyList.concat(res.data)
            }
            if (res.data.length <= 0 && res.meta.total <= 0) {
              this.isShowEmpty = true
            }
            if (this.groupBuyList.length >= res.meta.total) {
              this.hasMore = false
            }
          } else {
            this.$wechat.showToast(res.message)
          }
        })
      },
      async _showCoupon(couponArr) {
        couponArr && this._ref('couponModal', 'show', couponArr)
      },
      // 工具-->调用子节点的方法
      _ref(key, fn, params) {
        this.$refs[key] && this.$refs[key][fn] && this.$refs[key][fn](params)
      },
      listHandle(item) {
        item.id && wx.navigateTo({url: `/pages/collage-detail?id=${item.id}`})
      },
      shareGroup(item) {
        this.shareData = {
          img: item.goods.goods_cover_image,
          name: item.goods.name,
          id: item.id
        }
        this._getShareImg(item)
        this.$refs.sharePop.show(item.surplus_number, item.shop.social_name, item.groupon_person_limit)
      },
      _getShareImg(item) {
        API.Groupon.getShareImage({goods_id: item.goods.goods_id, activity_id: item.activity_id}).then((res) => {
          if (res.error === this.$ERR_OK && res.data.thumb_image) {
            this.shareData.img = res.data.thumb_image
          } else {
            this.shareData.img = item.goods.goods_cover_image
          }
        })
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
      top: 44px
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
          height: 16px
          line-height: 16px
          padding: 0 4px
          layout()
          align-items: center
          text-align: center
          border: 1px solid rgba(250,117,0,0.3)
          border-radius: 2px
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
      line-height: 28px
      padding: 0
      text-align: center
      color: $color-text-sub
      font-size: $font-size-14
      border: 1px solid $color-line
      border-radius: 15px
      &.share-button
        color: $color-main
        border: 1px solid $color-main
  .noting
    text-align: center
    margin-top: 106px
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
