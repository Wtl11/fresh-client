<template>
  <div class="invitee">
    <navigation-bar title="邀请有礼"></navigation-bar>
    <div class="invitee-box">
      <div class="invitee-img-box">
        <img mode="aspectFill" v-if="imageUrl" :src="imageUrl + '/yx-image/invitation/pic-getcoupon_yqyl@2x.png'" class="invitee-img">
      </div>
      <div class="coupon">
        <coupon-item :dataInfo="coupon"></coupon-item>
        <div class="use-btn" @click="goIndex">立即使用</div>
      </div>
      <div class="disable" v-if="disable"></div>
    </div>

    <div class="recommend">
      <p class="title">
        <span class="line"></span>
        <span class="text">猜你喜欢</span>
        <span class="line"></span>
      </p>
      <article class="recommend-list">
        <div v-for="(item, index) in recommendList" :key="item.goods_id" class="list-item">
          <!--          <goods-item :item="item" @_getShopCart="_getShopCart"></goods-item>-->
          <div class="classify-item" @click="recommendJumpGoodsDetail(item)">
            <figure class="classify-box-top">
              <img v-if="imageUrl && corpName === 'platform'" :src="imageUrl + '/yx-image/choiceness/icon-label2@2x.png'" alt="" class="top-label" mode="aspectFill">
              <img v-if="imageUrl && corpName === 'retuan'" :src="imageUrl + '/yx-image/retuan/icon-label2@2x.png'" alt="" class="top-label" mode="aspectFill">
              <img v-if="item.goods_cover_image" :src="item.goods_cover_image" alt="" class="box-top-img" mode="aspectFill">
            </figure>
            <section class="classify-box-bottom">
              <div class="classify-title">{{item.name}}</div>
              <div class="classify-price-box">
                <div class="price-left">
                  <div class="price-number" :class="'corp-' + corpName + '-money'">{{item.trade_price}}</div>
                  <div class="price-money" :class="'corp-' + corpName + '-money'">元</div>
                  <div class="price-line">{{item.original_price}}元</div>
                </div>
                <form action="" report-submit @submit="$getFormId" @click.stop="addShoppingCart(item)">
                  <button class="price-right" formType="submit">
                    <img v-if="imageUrl && corpName === 'platform'" :src="imageUrl + '/yx-image/collage/icon-addgoods@2x.png'" alt="" class="price-right-img">
                    <!--            <img v-if="imageUrl && corpName === 'retuan'" :src="imageUrl + '/yx-image/retuan/icon-shopcart@2x.png'" alt="" class="price-right-img">-->
                  </button>
                </form>
              </div>
            </section>
          </div>
        </div>
      </article>
      <loading-more v-if="recommendListLoad"></loading-more>
      <div v-if="!hasMore" class="foot-ties">
        <div class="center">— 再拉也没有了 —</div>
      </div>
    </div>

  </div>
</template>

<script type="text/ecmascript-6">
  import NavigationBar from '@components/navigation-bar/navigation-bar'
  import CouponItem from './coupon-item/coupon-item'
  import API from '@api'
  import { cartMethods } from '@state/helpers'
  import LoadingMore from '@components/loading-more/loading-more'

  const PAGE_NAME = 'INVITEE'

  export default {
    name: PAGE_NAME,
    components: {
      NavigationBar,
      CouponItem,
      LoadingMore
    },
    data() {
      return {
        recommendList: [],
        recommendListLoad: false,
        page: 1,
        limit: 10,
        hasMore: true,
        invitationId: '',
        shopId: '',
        disable: false,
        coupon: {}
      }
    },
    async onLoad() {
      let token = wx.getStorageSync('token') || ''
      if (!token) {
        wx.reLaunch({ url: this.$routes.main.LOGIN })
      }
      //
      this.invitationId = this.$mp.query.invitationId || ''
      this.shopId = this.$mp.query.shopId || ''
      this.getReceiveInviteCoupon()
      await this.getCarRecommend()
    },
    onReachBottom() {
      if (!this.hasMore) return
      this.page++
      this.getCarRecommend()
    },
    methods: {
      ...cartMethods,
      goIndex() {
        wx.switchTab({ url: this.$routes.main.CHOICENESS })
      },
      getReceiveInviteCoupon() {
        API.Coupon.receiveInviteCoupon({ invite_id: this.invitationId, cond_type: 1 })
          .then((res) => {
            res.message && this.$wechat.showToast(res.message, 2500)
            if (res.error !== this.$ERR_OK) return
            this.coupon = res.data.length ? res.data[0].coupon : {}
            this.disable = !res.data || !res.data.length || this.coupon.status !== 1
          })
          .catch(() => {
            this.disable = true
          })
      },
      async getCarRecommend() {
        this.recommendListLoad = true
        let res = await API.Cart.getCarRecommend({ page: this.page, limit: this.limit })
        this.recommendListLoad = false
        if (res.error !== this.$ERR_OK) {
          this.$wechat.showToast(res.message)
          return
        }
        if (this.page === 1) {
          this.recommendList = res.data
        } else {
          let arr = this.recommendList.concat(res.data)
          this.recommendList = arr
        }
        if (this.page === 5 || res.data.length <= 0) {
          this.hasMore = false
        }
      },
      addShoppingCart(item) {
        if (!this.$isLogin()) {
          return
        }
        API.Choiceness.addShopCart({ goods_sku_id: item.goods_sku_id || 0, activity_id: item.activity_id || 0 }).then((res) => {
          if (res.error === this.$ERR_OK) {
            this.$sendMsg({
              event_no: 1007,
              goods_id: item.goods_id,
              title: item.name
            })
            // this.$emit('_getShopCart')
            this._getShopCart()
            this.$wechat.showToast('加入购物车成功', 1000, false)
            this.setCartCount()
          } else {
            this.$wechat.showToast(res.message, 1000, false)
          }
        })
      },
      async _getShopCart(loading = false) {
        let res = await API.Cart.shopCart(loading)
        this.$wechat.hideLoading()
        if (res.error !== this.$ERR_OK) {
          this.isShowCart = true
          this.$wechat.showToast(res.message)
          return
        }
        res.data.forEach((item) => {
          let usableStock = item.usable_stock * 1
          // item.checked = true
          item.num = item.num <= usableStock ? item.num : usableStock
          item.num > 0 ? item.checked = true : item.checked = false
        })
        this.goodsList = res.data
        this.goodsList.length > 0 ? this.isShowCart = false : this.isShowCart = true
        this.deliverAt = res.delivery_at
        this.setCartCount()
      },
      recommendJumpGoodsDetail(item) {
        wx.navigateTo({
          url: `${this.$routes.main.GOODS_DETAIL}?id=${item.goods_id || 0}&activityId=${item.activity_id || 0}`
        })
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@designCommon"
  .invitee-box
    position: relative
    .disable
      left: 0
      top: 0
      width: 100%
      height: 100%
      background: rgba(255, 255, 255, .5)
      position: absolute
      z-index: 100

  .invitee
    min-height: 100vh
    background: #f7f7f7
    box-sizing: border-box
    overflow-y: auto

  .invitee-img-box
    height: 55.47vw
    .invitee-img
      width: 100%
      height: 100%

  .coupon
    margin: -12.26667vw 4vw 0

  .use-btn
    background: #FF8506
    border-radius: 6px
    line-height: 45px
    text-align: center
    color: rgba(255, 255, 255, 0.8)
    font-size: $font-size-18
    font-family: $font-family-regular
    margin: 16px 4vw

  .recommend
    margin: 0
    .title
      height: 49px
      padding-top: 13.5px
      box-sizing: border-box
      display: flex
      align-items: center
      justify-content: center
      .line
        width: 27px
        height: 1px
        background: #3F454B
        margin: 0 5px
      .text
        font-family: $font-family-medium
        font-size: $font-size-16
        color: #1D2023
    .recommend-list
      width: 100vw
      layout(row)
      align-items: center
      padding: 0 6px
      box-sizing: border-box
      .list-item
        width: 50%
        box-sizing: border-box
        margin-bottom: 5px
        &:nth-of-type(odd)
          padding-right: 2.5px
        &:nth-of-type(even)
          padding-left: 2.5px

  .classify-item
    background: #fff
    overflow: hidden
    padding: 10px 7px 10px
    box-sizing: border-box
    width: 100%
    border-radius: 4px
    .classify-box-top
      padding-bottom: 100%
      height: 0
      width: 100%
      overflow: hidden
      position: relative
      .top-label
        position: absolute
        left: 0
        top: 0
        display: block
        width: 31.2px
        height: 31.4px
        z-index: 11
      .box-top-img
        position: absolute
        left: 0
        top: 0
        z-index: 2
        display: block
        width: 100%
        height: 100%

    .classify-box-bottom
      padding-top: 10px
      font-family: $font-family-regular
      .classify-title
        color: $color-text-main
        font-size: $font-size-14
        min-height: $font-size-16
        no-wrap()
        margin-bottom: 8.5px
      .classify-price-box
        layout(row)
        align-items: center
        justify-content: space-between
        .price-left
          layout(row)
          align-items: center
          font-size: $font-size-12
          font-family: $font-family-medium
          .price-number
            font-size: $font-size-18
            margin-right: 2px
          .price-money
            margin-right: 5px
            position: relative
            top: 2px
          .price-line
            color: $color-text-assist
            text-decoration: line-through
            position: relative
            top: 2px
        .price-right
          width: 23px
          height: 23px
          position: relative
          .price-right-img
            width: 23px
            height: 23px
            display: block

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
