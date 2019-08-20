<template>
  <div class="coupon-classify">
    <navigation-bar title="商品"></navigation-bar>
    <div class="line"></div>
    <ul v-if="goodsList.length" class="goods-list">
      <li class="goods-item-box" v-for="(item, index) in goodsList" :key="index">
<!--        <classify-item :item="item"></classify-item>-->
        <div class="classify-item" @click="jumpGoodsDetail(item)">
          <figure class="classify-box-top">
            <img v-if="imageUrl && corpName === 'platform'" :src="imageUrl + '/yx-image/choiceness/icon-label2@2x.png'" alt="" class="top-label" mode="aspectFill">
            <img v-if="imageUrl && corpName === 'retuan'" :src="imageUrl + '/yx-image/retuan/icon-label2@2x.png'" alt="" class="top-label" mode="aspectFill">
            <img v-if="item.goods_cover_image" :src="item.goods_cover_image" alt="" class="box-top-img" mode="aspectFill">
          </figure>
          <section class="classify-box-bottom">
            <div class="title">{{item.name}}</div>
            <div class="classify-price-box">
              <div class="price-left">
                <div class="price-number" :class="'corp-' + corpName + '-money'">{{item.trade_price}}</div>
                <div class="price-money" :class="'corp-' + corpName + '-money'">元</div>
                <div class="price-line">{{item.original_price}}元</div>
              </div>
              <form action="" report-submit @submit="$getFormId" @click.stop="addShoppingCart(item)">
                <button class="price-right" formType="submit">
                  <img v-if="imageUrl && corpName === 'platform'" :src="imageUrl + '/yx-image/goods/icon-shopcart2@2x.png'" alt="" class="price-right-img">
                  <img v-if="imageUrl && corpName === 'retuan'" :src="imageUrl + '/yx-image/retuan/icon-shopcart@2x.png'" alt="" class="price-right-img">
                </button>
              </form>
            </div>
          </section>
        </div>
      </li>
      <li class="foot-ties" v-if="!hasMore">
        <div class="left lines"></div>
        <div class="center">再拉也没有了</div>
        <div class="bot lines"></div>
      </li>
    </ul>
    <section class="noting" v-else-if="isShowEmpty">
      <div class="noting-img">
        <img class="img" :src="imageUrl + '/yx-image/group/pic-kong@2x.png'" alt="">
      </div>
      <div class="txt">空空如也</div>
    </section>
  </div>
</template>

<script type="text/ecmascript-6">
  import NavigationBar from '@components/navigation-bar/navigation-bar'
  // import ClassifyItem from './classify-item/classify-item'
  import API from '@api'
  import {cartMethods} from '@state/helpers'

  const PAGE_NAME = 'COUPON_CLASSIFY'

  export default {
    name: PAGE_NAME,
    components: {
      NavigationBar
      // ClassifyItem
    },
    data() {
      return {
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
    methods: {
      ...cartMethods,
      jumpGoodsDetail(item) {
        wx.navigateTo({
          url: `${this.$routes.main.GOODS_DETAIL}?id=${item.goods_id}&activityId=${item.activity_id}`
        })
      },
      addShoppingCart(item) {
        if (!this.$isLogin()) {
          return
        }
        API.Choiceness.addShopCart({goods_sku_id: item.goods_sku_id, activity_id: item.activity_id}).then((res) => {
          if (res.error === this.$ERR_OK) {
            this.$sendMsg({
              event_no: 1007,
              goods_id: item.goods_id,
              title: item.name
            })
            this.$wechat.showToast('加入购物车成功', 1000, false)
            this.setCartCount()
          } else {
            this.$wechat.showToast(res.message, 1000, false)
          }
        })
      },
      _getList(callback) {
        if (!this.hasMore) return
        let data = {customer_coupon_id: this.$mp.query.id, limit: this.limit, page: this.page}
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

  .classify-item
    background: #fff
    overflow: hidden
    padding: 10px 10px 15px
    box-sizing: border-box
    width: 100%
    border-radius: 4px
    box-shadow: 0 6px 20px 0 rgba(17,17,17,0.06)
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
      .title
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
            position :relative
            top:2px
          .price-line
            color: $color-text-assist
            text-decoration: line-through
            position :relative
            top:2px
        .price-right
          width: 23px
          height: 23px
          position: relative
          .price-right-img
            width: 23px
            height: 23px
            display: block


  .coupon-classify
    min-height :100vh
    background: $color-background
  .line
    height :5px
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
