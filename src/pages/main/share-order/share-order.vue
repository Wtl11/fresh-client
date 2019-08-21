<template>
  <div class="wrap">
    <navigation-bar title="订单详情"></navigation-bar>
    <div class="order-banner">
      <div class="backdrop"><img v-if="imageUrl" :src="imageUrl+'/yx-image/cart/bg-ddxq@2x.png'" alt="" class="backdrop-img"></div>
      <div class="content">
        <div class="status">
          <div class="icon"><img v-if="imageUrl" class="icon-img" :src="imageUrl+'/yx-image/cart/icon_refund_xq@2x.png'" alt=""></div>
          <div class="statu-txt">已下单</div>
        </div>
      </div>
    </div>
    <div class="order-share-box">
      <div class="order-share-title">还有这些小伙伴也购买了下面的商品</div>
      <div class="share-list-box">
        <img class="share-img-box" v-for="(item, index) in shareImgList" v-bind:key="index" :src="item.head_image_url" alt="">
        <div class="image-item" v-if="userImgList.length >= 15 && showMoreImg && shareImgList.length === 13" @click="showMoreBtn">
          <div class="image-item-text">更多</div>
        </div>
      </div>
    </div>
    <div class="address-info">
      <div class="top">
        <div class="warp">
          <div class="design">团长</div>
          <div class="icon-number"><span class="name">{{address.shop_name}}</span>
            <span class="text">{{address.social_name}}</span></div>
        </div>
        <div class="address-text">提货地址：{{address.shop_address}}</div>
      </div>
      <div class="bot">提货人：{{address.nickname}}</div>
    </div>
    <img v-if="imageUrl" :src="imageUrl + '/yx-image/choiceness/pic-colour@2x.png'" class="order-line">
    <div class="gary-box"></div>
    <div class="order-list">
      <div class="order-item">
        <!--<div class="goods-item"-->
             <!--v-for="(item, index) in orderMsg.goods"-->
             <!--:key="index"-->
             <!--:class="{isGift: orderMsg.goods[index+1] && orderMsg.goods[index+1].is_gift}"-->
             <!--@click="jumpGoodsDetail(item)"-->
        <!--&gt;-->
        <div class="goods-item"
             v-for="(item, index) in orderMsg.goods"
             :key="index"
             @click="jumpGoodsDetail(item)"
        >
          <div class="goods-info-box">
            <img class="goods-img" mode="aspectFill" :src="item.image_url" alt="">
            <div class="goods-info">
              <div class="tit share-tit">
                <p class="name"><span v-if="item.is_gift" class="icon-tag">赠品</span><span class="text">{{item.goods_name}}</span></p>
                <div class="share-tit-btn">立即抢购</div>
              </div>
              <div class="guige">规格：{{item.goods_units}}</div>
              <div class="price">
                <div class="amout"><span class="num">{{item.price}}</span>元</div>
                <div class="quantity">x<span class="num">{{item.num}}</span></div>
              </div>
            </div>
          </div>
        </div>
        <div class="actual-amount">
          <div class="sub">实付金额</div>
          <div class="price"><span class="num">{{orderMsg.total}}</span>元</div>
        </div>
      </div>
    </div>
    <div class="gary-box"></div>
    <div class="oinfo">
      <div class="order-iden">
        <div class="txt">订单编号：{{orderMsg.order_sn}}</div>
      </div>
      <div class="order-time">下单时间：{{orderMsg.created_at}}</div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import NavigationBar from '@components/navigation-bar/navigation-bar'
  import ShareHandler, {EVENT_CODE} from '@mixins/share-handler'
  import GetOptions from '@mixins/get-options'
  import API from '@api'
  import clearWatch from '@mixins/clear-watch'

  export default {
    mixins: [ShareHandler, GetOptions, clearWatch],
    data() {
      return {
        orderId: '',
        orderMsg: {},
        address: {},
        shareImgList: [],
        showMoreImg: true,
        shopId: '',
        userImgList: []
      }
    },
    onLoad(options = {}) {
      this.orderId = options.id || 0
      this.shopId = options.shopId || 0
    },
    onShow() {
      let options = this._$$initOptions()
      this.orderId = options.id || 0
      this.shopId = options.shopId || 0
      this.shopId && wx.setStorageSync('shopId', +this.shopId)
      this.getShareOrderDate()
      this.$$shareHandler({
        event: EVENT_CODE.SHARE_ORDER,
        orderId: this.orderId
      })
    },
    onReady() {
      if (wx.getStorageSync('token')) {
        this.$$sendEvent()
      }
    },
    methods: {
      jumpGoodsDetail(item) {
        let activityType = ''
        if (item.activity) {
          activityType = item.activity.activity_theme || ''
        }
        wx.navigateTo({
          url: `${this.$routes.main.GOODS_DETAIL}?id=${item.goods_id}&activityId=${item.activity_id}&shopId=${this.shopId}&activityType=${activityType}`
        })
      },
      showImgMore() {
        this.showMoreImg = true
      },
      getShareOrderDate() {
        console.warn('share-order-orderId:' + this.orderId)
        API.Order.getOrderDetailData(this.orderId, {get_avatar: true}).then((res) => {
          if (res.error === this.$ERR_OK) {
            this.orderMsg = res.data
            this.address = res.data.address
            this.userImgList = res.data.avatar_images
            if (this.shareImgList.length === 0) {
              if (this.userImgList.length === 14) {
                this.shareImgList = this.userImgList.slice(0, 14)
              } else {
                this.shareImgList = this.userImgList.slice(0, 13)
              }
            }
          } else {
            this.$wechat.showToast(res.message)
          }
        })
      },
      showMoreBtn() {
        this.shareImgList = this.userImgList
        this.showMoreImg = false
      }
    },
    components: {
      NavigationBar
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
 @import "~@designCommon"
  .wrap
    width: 100vw
    background: $color-background
    min-height: 100vh
    .order-banner
      width: 100vw
      height: 70px
      box-sizing: border-box
      layout(row)
      justify-content: space-between
      align-items: center
      margin: 0
      position: relative
      background-image: radial-gradient(95% -74%, #73C200 0%, #ABE300 100%)
      .backdrop
        position: absolute
        left: 0
        top: 0
        width: 100vw
        height: 70px
        z-index:2
        .backdrop-img
          width: 100%
          height: 100%
      .content
        position: absolute
        left: 0
        top: 0
        padding: 0 3.2vw
        width: 100vw
        height: 70px
        z-index: 9
        box-sizing: border-box
        layout(row)
        justify-content: space-between
        align-items: center
        .status
          layout(row)
          align-items: center
          .statu-txt
            font-family: $font-family-medium
            font-size: $font-size-18
            color: $color-white
          .icon
            width: 31px
            height: 31px
          .icon-img
            width: 100%
            display: block
            height: 100%
        .extract
          font-family: $font-family-medium
          font-size: $font-size-16
          color: $color-white
  .address-info
    padding-left: 3.2vw
    background: #fff
    .bot
      font-family: $font-family-regular
      font-size: $font-size-15
      color: #000000
      height: 50px
      line-height: 50px
      border-top-1px($color-line)
    .top
      box-sizing: border-box
      padding:3.2vw 0
    .address-text
      font-family: $font-family-regular
      font-size: $font-size-15
      color: #000000
      line-height: 1.3
      word-break:break-all
      padding-right: 3.2vw
    .warp
      layout(row)
      align-items: center
      color: $color-text-sub
      padding-bottom: 10px
      .design
        font-size: $font-size-12
        background: $color-main
        color: $color-white
        text-align: center
        font-family: $font-family-regular
        width: 30px
        position: relative
        padding: 2px 0
        box-sizing: border-box
        margin-right: 10px
        border-radius: 2px
      .icon-number
        line-height: 25px
        layout(row)
        align-items: center
        .name
          font-size: $font-size-15
          color: $color-text-main
          font-family: $font-family-medium
          margin-right: 10px
        .text
          font-family: $font-family-regular
          font-size: $font-size-15
          color: $color-text-sub
          no-wrap()
          width: 55vw
  .goods-item
    height: 105px
    width: 100vw
    box-sizing: border-box
    padding: 0 3.2vw
    position: relative
    layout(row)
    justify-content: space-between
    align-items: center
    border-bottom-1px($color-line)
    &.isGift
      position: relative
      &:after
        content: ""
        position: absolute
        bottom: 0
        right: 0
        left : 3.2vw
        transform: scaleY(.5) translateZ(0)
        border-bottom: 1px solid $color-line
    .goods-info-box
      layout(row)
      flex: 1
      align-items: center
    .goods-img
      width: 75px
      border-radius: 2px
      height: 75px
    .arrlow
      width: 5.5px
      height: 10.5px
      .arr
        width: 100%
        height: 100%
        display: block
    .goods-info
      box-sizing: border-box
      padding-left: 2.67vw
      flex: 1
      .tit
        layout(row)
        align-items: center
        height: 16px
        justify-content: space-between
        .name
          display :flex
          align-items :center
          flex : 1
          overflow :hidden
          padding-right :5px
          font-family: $font-family-medium
          font-size: $font-size-14
          color: $color-sub
          min-height: 16px
          letter-spacing: 0.3px
          width: 30vw
          .text
            flex: 1
            no-wrap()
          .icon-tag
            display :inline-block
            background: rgba(255,104,3,0.10);
            border-1px(#FF6803, 14px)
            border-radius: 14px;
            height: 14px
            line-height :@height
            padding :0 4px
            font-family: $font-family-regular
            font-size: 11px
            color: #FF6803;
            margin-right: 4px
        .quantity
          font-family: $font-family-regular
          font-size: $font-size-12
          color: #1F1F1F
          .num
            font-family: $font-family-regular
            font-size: $font-size-16
            color: $color-sub
      .share-tit
        .name
          flex: 1
        .share-tit-btn
          font-size: $font-size-12
          color: $color-white
          background: $color-main
          border-radius: 30px
          font-family: $font-family-regular
          height: 22px
          line-height: 22px
          width: 68px
          text-align: center
      .guige
        font-family: $font-family-regular
        font-size: $font-size-14
        color: $color-text-sub
        margin-top: 7px
        margin-bottom: 20px
      .price
        layout(row)
        align-items: center
        justify-content: space-between
        .refund
          width: 65px
          height: 25px
          line-height: 25px
          font-family: $font-family-regular
          font-size: $font-size-12
          color: #000000
          text-align: center
          background: $color-white
          border-1px($color-text-assist, 15px)
        .refund-text
          height: 25px
          line-height: 25px
          font-family: $font-family-regular
          font-size: $font-size-14
          color: $color-money
        .amout
          font-family: $font-family-regular
          font-size: $font-size-11
          color: #1F1F1F
          .num
            font-family: $font-family-regular
            color: $color-sub
            font-size: $font-size-16
        .quantity
          font-family: $font-family-regular
          font-size: $font-size-12
          color: #1F1F1F
          .num
            font-family: $font-family-regular
            font-size: $font-size-16
            color: $color-sub
  .order-share-box
    padding: 15px 3.2vw
    background: #fff
    margin-bottom: 11px
    box-sizing: border-box
    .order-share-title
      font-family: $font-family-regular
      font-size: $font-size-14
      color: $color-text-main
    .share-list-box
      layout(row)
      align-items: center
      .share-img-box
        margin-top: 3.2vw
        margin-right: 3.2vw
        width: 10.6vw
        height: 10.6vw
        border-radius: 50%
        background: $color-main
      .image-item-text
        width: 10.66vw
        height: 10.66vw
        border-radius: 50%
        display: block
        margin-top: 3.2vw
        font-size: $font-size-10
        color: #9b9b9b
        font-family: $font-family-regular
        text-align: center
        line-height: 10.66vw
        background: #F4F4F4
      .share-img-box:nth-of-type(7n)
        margin-right: 0
    .share-list-more
      overflow: auto
      height: auto
      padding-bottom: 5px
    .share-show
      layout(row)
      align-items: center
      justify-content: center
      margin-top: 16px
      .share-text
        font-family: $font-family-medium
        font-size: $font-size-10
        color: #CBD1CD
        margin-right: 3px
      .share-img
        width: 11px
        height: 11px
        display: block
  .order-list
    background: $color-white
  .actual-amount
    layout(row)
    padding:0 3.2vw
    width: 100vw
    height: 45px
    align-items: center
    justify-content: space-between
    box-sizing: border-box
    .sub
      font-family: $font-family-regular
      font-size: $font-size-14
      color: #000000
    .price
      font-family: $font-family-medium
      font-size: $font-size-14
      color: $color-money
      .num
        font-family: $font-family-medium
        font-size: $font-size-16
        color: $color-money
  .oinfo
    box-sizing: border-box
    min-height: 80px
    background: $color-white
    padding: 16px 3.2vw
    .o-item
      padding-bottom: 16px
      font-family: $font-family-regular
      font-size: $font-size-14
      color: #000000
      line-height: 14px
      .price
        font-family: $font-family-medium
        font-size: $font-size-14
        color: $color-money
        .num
          font-family: $font-family-medium
          font-size: $font-size-16
          color: $color-money
    .order-iden
      layout(row)
      align-items: center
      justify-content: space-between
      .txt
        font-family: $font-family-regular
        font-size: $font-size-14
        color: #000000
        line-height: 14px
      .copy-btn
        width: 54px
        margin-left: 15px
        height: 20px
        border-1px(#b7b7b7, 10px)
        text-align: center
        line-height: 20px
        box-sizing: border-box
        font-family: $font-family-regular
        font-size: $font-size-12
        color: $color-text-main
        letter-spacing: 0.3px
    .order-time
      padding-top: 16px
      font-family: $font-family-regular
      font-size: $font-size-14
      color: #000000
      line-height: 14px
  .order-fixed
    z-index: 99
    layout(row)
    align-items: center
    background: #fff
    border-top-1px(#E6E6E6)
    position: fixed
    left: 0
    bottom: 0
    height: 50px
    right :0
    justify-content: space-between
    padding: 0 3.2vw
    .order-bottom-left
      font-size: $font-size-14
      color: #000
      font-family: $font-family-regular
      layout(row)
      align-items: center
      .color-time
        color: #ff8300
        width: 42px
        text-align: center
    .order-bottom-right
      layout(row)
      align-items: center
      .refund
        width: 77px
        height: 28px
        line-height: 28px
        font-family: $font-family-regular
        font-size: $font-size-14
        text-align: center
        color: $color-white
        background: $color-main
        border: 0.5px solid $color-main
        border-radius: 15px
        margin-left: 10px
      .close
        width: 77px
        height: 28px
        line-height: 28px
        font-family: $font-family-regular
        font-size: $font-size-14
        text-align: center
        color: $color-text-main
        background: $color-white
        border: 0.5px solid $color-text-assist
        box-sizing: border-box
  .service
    width: 100vw
    padding-top: 15px
    padding-bottom: 65px
    layout(row)
    justify-content: center
    align-items: center
    background-color: $color-background
    .service-btn
      width: 106px
      height: 34px
      text-align: center
      line-height: 34px
      border-1px($color-text-assist, 17px)
      font-family: $font-family-regular
      font-size: $font-size-15
      color: #000000
  .gary-box
    width: 100vw
    height: 10px
    background: $color-background
  .order-line
    display: block
    height: 3px
    width: 100%
</style>
