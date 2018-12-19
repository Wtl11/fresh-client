<template>
  <div class="wrap">
    <navigation-bar title="售后订单" :showArrow="true" :translucent="false"></navigation-bar>
    <div class="order-list" v-if="orderLists.length > 0">
      <div class="order-item" v-for="(item, index) in orderLists" :key="index" @click.stop="toOrderDetail(item)">
        <div class="top">
          <div class="group-name">{{item.social_name}}</div>
          <div class="status" v-if="item.after_sale_status * 1 === 0">退款中</div>
          <div class="status" v-if="item.after_sale_status * 1 === 1">退款成功</div>
          <div class="status" v-if="item.after_sale_status * 1 === 2">退款失败</div>
          <div class="status" v-if="item.after_sale_status * 1 === 3">退款取消</div>
        </div>
        <div class="center">
          <div class="goods-item">
            <div class="goods-info-box">
              <img class="goods-img" mode="aspectFill" :src="item.image_url" alt="">
              <div class="goods-info">
                <div class="tit">{{item.goods_name}}</div>
                <div class="guige">规格：{{item.goods_units}}</div>
                <div class="price"><span class="price-text">{{item.price}}</span>元</div>
              </div>
            </div>
            <div class="arrlow"><img v-if="imageUrl" :src="imageUrl+'/yx-image/cart/icon-pressed@2x.png'" alt="" class="arr"></div>
          </div>
        </div>
        <div class="bot">
          <div class="time">{{item.created_at}}</div>
          <div class="payment"><span class="actual">退款金额：</span><span class="sum">{{item.total}}</span><span class="principal">元</span></div>
        </div>
      </div>
    </div>
    <div class="noting" v-if="orderLists.length === 0">
      <div class="notingimg"><img class="img" :src="imageUrl + '/yx-image/group/pic-kong@2x.png'" alt=""></div>
      <div class="txt">空空如也</div>
    </div>
  </div>

</template>

<script type="text/ecmascript-6">
  import WePaint from '@components/we-paint/we-paint'
  // import { mapGetters } from 'vuex'
  import NavigationBar from '@components/navigation-bar/navigation-bar'
  import API from '@api'
  import {oauthComputed} from '@state/helpers'

  export default {
    components: {
      WePaint,
      NavigationBar
    },
    data() {
      return {
        orderList: [],
        orderLists: [],
        orderPage: 1,
        orderMore: false,
        tabIdx: 0
      }
    },
    onLoad() {
      this.getGoodsDetailData()
    },
    onShow() {
    },
    onReachBottom() {
      this.getMoreGoodsDetailData()
    },
    computed: {
      ...oauthComputed
      // ...mapGetters(['role'])
    },
    methods: {
      getGoodsDetailData() {
        this.orderPage = 1
        this.orderMore = false
        API.Order.getSaleOrder(this.orderPage).then((res) => {
          if (res.error === this.$ERR_OK) {
            this.orderLists = res.data
            this._isUpList(res)
          } else {
            this.$wechat.showToast(res.message)
          }
        })
      },
      getMoreGoodsDetailData() {
        if (this.orderMore) {
          return
        }
        API.Order.getSaleOrder(this.orderPage = 1).then((res) => {
          if (res.error === this.$ERR_OK) {
            this.orderLists = this.orderLists.concat(res.data)
            this._isUpList(res)
          } else {
            this.$wechat.showToast(res.message)
          }
        })
      },
      _isUpList(res) {
        this.orderPage++
        if (this.orderLists.length >= res.meta.total * 1) {
          this.orderMore = true
        }
      },
      toOrderDetail(item) {
        wx.navigateTo({
          url: `/pages/order-detail?id=${item.id}&&type=1`
        })
        // this.$router.push('/pages/oeder-detail')
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"
  .wrap
    width: 100vw
    min-height: 100vh
    background: $color-background
    position: relative
  .nav-box
    width: 100vw
    height: 40px
    position: relative
    .line-box
      width: 100%
      height: 3px
      position: absolute
      bottom: 0
      .line
        box-sizing: border-box
        width: 25%
        transform: translate(0, 0)
        transition: all .3s
        height: 3px
        .lins
          width: 33%
          height: 3px
          margin: 0 auto
          background: $color-main
    .order-nav
      width: 100vw
      height: 40px
      border-bottom-1px($color-line)
      background: $color-white
      layout(row)
      position: relative
      justify-content: space-around
      align-items: center
      .nav-item
        width: 25%
        height: 40px
        transition: all .3s
        line-height: 40px
        text-align: center
        font-family: $font-family-regular
        font-size: $font-size-14
        color: $color-sub
      .nav-item-active
        font-family: $font-family-medium
        font-size: $font-size-16
  .order-list
    padding-bottom: 20px
    .order-item
      width: 100vw
      margin-top: 10px
      box-sizing: border-box
      background: $color-white
      .top
        height: 45px
        padding: 0 3.2vw
        layout(row)
        align-items: center
        justify-content: space-between
        border-bottom-1px($color-line)
        .group-name
          font-family: $font-family-regular
          font-size: $font-size-14
          color: $color-sub
        .status
          font-family: $font-family-regular
          font-size: $font-size-14
          color: $color-money
      .center
        .goods-item
          height: 104.5px
          padding: 0 3.2vw
          layout(row)
          justify-content: space-between
          align-items: center
          border-bottom-1px($color-line)
          .goods-info-box
            layout(row)
            align-items: center
          .goods-img
            width: 20vw
            height: 20vw
          .arrlow
            width: 6px
            height: 10px
            .arr
              width: 100%
              height: 100%
              display: block
          .goods-info
            padding-left: 2.67vw
            .tit
              font-family: $font-family-medium
              font-size: $font-size-14
              color: $color-sub
              letter-spacing: 0.3px
              line-height: 14px
            .guige
              font-family: $font-family-regular
              font-size: $font-size-14
              color: $color-text-sub
              line-height: 14px
              padding: 7px 0 16px 0
            .price
              font-family: $font-family-regular
              font-size: $font-size-11
              color: #1F1F1F
              .price-text
                font-family: $font-family-regular
                color: $color-sub
                font-size: $font-size-16
      .center
        border-bottom-1px($color-line)
        .goods-list
          layout(row)
          align-items: center
          justify-content: space-between
          padding: 15px 3.2vw
          .goods-img-list
            layout(row)
            align-items: center
            .goods-img
              width: 13.33vw
              height: 13.33vw
              margin-right: 2.67vw
            .img-item
              width: 13.33vw
              height: 13.33vw
              layout(row)
              justify-content: center
              align-items: center
              .circle
                width: 6px
                height: 6px
                background: #D8D8D8
                border-radius: 50%
                &:nth-child(2)
                  margin: 0 5px
        .arr-warp
          layout(row)
          align-items: center
          .all-number
            font-family: $font-family-regular
            font-size: $font-size-12
            color: $color-text-sub
          .arrlow
            width: 5.5px
            height: 10.5px
            margin-left: 6px
            .arr
              display: block
              width: 100%
              height: 100%

      .bot
        height: 45px
        padding: 0 3.2vw
        layout(row)
        align-items: center
        justify-content: space-between
        .time
          font-family: $font-family-regular
          font-size: $font-size-14
          color: #000000
        .payment
          .actual
            font-family: $font-family-medium
            font-size: $font-size-14
            color: #000000
          .sum
            font-family: $font-family-medium
            font-size: $font-size-18
            color: #000000
          .principal
            font-family: $font-family-medium
            font-size: $font-size-12
            color: #000000

  .noting
    text-align: center
    margin-top: 106px
    .notingimg
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
  .txt
    height: 100px

</style>
