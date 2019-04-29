<template>
  <div class="goods-record">
    <navigation-bar title="购买记录"></navigation-bar>
    <section class="container">
      <article class="goods-wrapper">
        <figure class="left">
          <img v-if="goodsMsg.goods_cover_image" :src="goodsMsg.goods_cover_image" mode="aspectFill" class="goods-img">
        </figure>
        <div class="right">
          <h1 class="title">{{goodsMsg.name}}</h1>
          <h3 class="title-sub">{{goodsMsg.describe}}</h3>
          <p class="money"><span class="number">{{goodsMsg.trade_price}}</span><span class="unit">元</span></p>
        </div>
        <button class="share-button" open-type="share">
          <img v-if="imageUrl" :src="imageUrl + '/yx-image/2.3/icon-sharexq@2x.png'" mode="aspectFill" class="share-img">
        </button>
      </article>
      <ul class="list-wrapper panel">
        <li v-for="(item, index) in listArray" :key="index" class="item-wrapper">
          <figure class="left">
            <img v-if="item.head_image_url" :src="item.head_image_url" mode="aspectFill" class="avatar">
          </figure>
          <p class="right">
            <span class="common">{{item.userName + ' 购买了 '}}</span>
            <span class="number">{{item.goods_num}}</span>
            <span class="common">{{' 份'}}</span>
            <span class="date">{{item.pay_at}}</span>
          </p>
        </li>
      </ul>
      <is-end v-if="!hasMore"></is-end>
      <loading-more v-else></loading-more>
      <div style="height: 75px"></div>
    </section>
    <div class="fixed-btn">
      <div class="hlep-btn">
        <button formType="submit" class="hlep-btn-box" v-for="(item, index) in typeBtn" :key="index" @click.stop="switchItem(item)">
          <div class="hlep-top">
            <img v-if="imageUrl" :src="imageUrl + item.url" class="detail-img" mode="aspectFill">
            <div class="help-number" v-if="index * 1 === 1 && count * 1 >= 1">{{count * 1 > 99 ? 99 : count}}</div>
          </div>
          <div class="hlep-bottom">{{item.text}}</div>
        </button>
      </div>
      <form action="" report-submit @submit="$getFormId">
        <button v-if="isShowTwoButton" class="goods-btn goods-btn-active" formType="submit" @click="addShoppingCart">加入购物车</button>
      </form>
      <form action="" class="lost" report-submit @submit="$getFormId">
        <button v-if="isShowTwoButton" class="goods-btn" :class="'corp-' + corpName + '-bg'" formType="submit" @click="instantlyBuy">立即购买</button>
      </form>
      <div v-if="!isShowTwoButton" class="goods-btn goods-btn-assint">{{BTN_TEXT}}</div>
    </div>
    <add-number ref="addNumber" :msgDetail="goodsMsg" :msgDetailInfo="buyGoodsInfo" @comfirmNumer="comfirmNumer"></add-number>
  </div>
</template>

<script type="text/ecmascript-6">
  import NavigationBar from '@components/navigation-bar/navigation-bar'
  import API from '@api'
  import {resolveQueryScene} from '@utils/common'
  import ShareHandler, {EVENT_CODE} from '@mixins/share-handler'
  import IsEnd from '@components/is-end/is-end'
  import LoadingMore from '@components/loading-more/loading-more'
  import {orderMethods, cartMethods, cartComputed} from '@state/helpers'
  import AddNumber from '@components/add-number/add-number'

  const PAGE_NAME = 'GOODS_RECORD'
  const TYPEBTN = [{url: '/yx-image/goods/icon-homepage@2x.png', text: '首页', type: 0}, {url: '/yx-image/goods/icon-shopcart@2x.png', text: '购物车', type: 2}]
  // 按钮状态映射
  const BTN_STATUS = {
    WILL: 0,
    ACTION: 1,
    DOWN: 2
  }
  const BTN_TEXT_CONSTANT = {
    [BTN_STATUS.WILL]: '即将开抢',
    [BTN_STATUS.ACTION]: '',
    [BTN_STATUS.DOWN]: '已结束',
    'NO_INVENTORY': '已抢完'
  }
  export default {
    name: PAGE_NAME,
    mixins: [ShareHandler],
    components: {
      NavigationBar,
      IsEnd,
      LoadingMore,
      AddNumber
    },
    data() {
      return {
        thumb_image: '',
        isFirstLoad: true,
        goodsMsg: {},
        shopId: 0,
        activity_id: 0,
        goodsId: 0,
        listArray: [],
        hasMore: true,
        isLoading: false,
        page: 1,
        typeBtn: TYPEBTN,
        buyGoodsInfo: {},
        isSharing: false
      }
    },
    computed: {
      ...cartComputed,
      activeStatus() {
        let active = this.goodsMsg.activity || {}
        return +active.status
      },
      BTN_TEXT() {
        let key = this.activeStatus
        if (this.goodsMsg.usable_stock < 1) {
          key = 'NO_INVENTORY'
        }
        if (key == null) {
          key = BTN_STATUS.DOWN
        }
        return BTN_TEXT_CONSTANT[key]
      },
      isShowTwoButton() {
        let flag = null
        if (this.activityId) {
          flag = this.goodsMsg.usable_stock > 0 && this.activeStatus === 1
        } else {
          flag = this.goodsMsg.usable_stock > 0
        }
        return flag
      }
    },
    onLoad(options) {
      console.warn(options, '<-----参数---->')
      if (options.scene) {
        let {shopId, activityId, goodsId} = resolveQueryScene(options.scene)
        this.goodsId = goodsId
        this.activityId = activityId
        this.shopId = shopId
      } else {
        this.goodsId = +options.goodsId || 0
        this.activityId = +options.activityId || 0
        this.shopId = +options.shopId || 0
      }
      if (this.shopId > 0) {
        wx.setStorageSync('shopId', this.shopId)
      }
    },
    onShow() {
      if (this.isSharing) {
        this.isSharing = false
        return
      }
      this._resetReqListParams()
      this._getGoodsDetailData()
      this.getGoodsOtherInfo()
      this._getList()
      this.$$shareHandler({
        event: EVENT_CODE.GOODS_DETAIL,
        activityId: this.activityId,
        goodsId: this.goodsId
      })
    },
    onShareAppMessage() {
      this.$sendMsg({
        event_no: 1004,
        goods_id: this.goodsId,
        title: this.goodsMsg.name
      })
      this.isSharing = true
      let shopId = wx.getStorageSync('shopId')
      const flag = Date.now()
      return {
        title: this.goodsMsg.name,
        path: `/pages/goods-record?id=${this.goodsId}&shopId=${shopId}&activityId=${this.activityId}&flag=${flag}`, // 商品详情
        imageUrl: this.thumb_image || this.goodsMsg.goods_cover_image,
        success: (res) => {
          // 转发成功
        },
        fail: (res) => {
          // 转发失败
        }
      }
    },
    onReachBottom() {
      if (this.isLoading) return
      this.page++
      this._getList(false)
    },
    methods: {
      ...cartMethods,
      ...orderMethods,
      _resetReqListParams() {
        this.page = 1
        this.hasMore = true
        this.listArray = []
      },
      _getList(loading) {
        this.isLoading = true
        API.GoodsRecord.getList({page: this.page}, loading).then((res) => {
          res.data.forEach(item => {
            this.listArray.push({
              ...item,
              userName: this._formatName(item.nickname)
            })
          })
          this.hasMore = res.data.length
          this.isLoading = false
        }).catch(e => {
          console.warn(e)
          this.isLoading = false
        })
      },
      _formatName(name) {
        const dot = '***'
        if (name.length > 1) {
          name = name.substring(0, 1) + dot + name.substring(name.length - 2, name.length - 1)
        } else {
          name += dot
        }
        return name
      },
      _getGoodsDetailData() {
        API.Choiceness.getGoodsDetail(this.goodsId, {activity_id: this.activityId}, this.isFirstLoad).then((res) => {
          this.$wechat.hideLoading()
          this.isFirstLoad = false
          if (res.error === this.$ERR_OK) {
            let goodDetail = res.data
            this.goodsMsg = goodDetail
            this.thumb_image = goodDetail.thumb_image
          } else {
            this.$wechat.showToast(res.message)
          }
        })
      },
      getGoodsOtherInfo() {
        API.Choiceness.getGoodsBuyInfo(this.goodsId, {activity_id: this.activityId}).then((res) => {
          if (res.error === this.$ERR_OK) {
            this.buyGoodsInfo = res.data
          } else {
            this.$wechat.showToast(res.message)
          }
        })
      },
      async addShoppingCart() {
        let isLogin = await this.$isLogin()
        if (!isLogin) {
          return
        }
        API.Choiceness.addShopCart({goods_sku_id: this.goodsMsg.goods_skus[0].goods_sku_id, activity_id: this.activityId}).then((res) => {
          if (res.error === this.$ERR_OK) {
            this.$sendMsg({
              event_no: 1007,
              goods_id: this.goodsId,
              title: this.goodsMsg.name
            })
            this.$wechat.showToast('加入购物车成功')
            this.setCartCount()
          } else {
            this.$wechat.showToast(res.message)
          }
        })
      },
      switchItem(item) {
        switch (item.type) {
          case 0:
            wx.switchTab({url: '/pages/choiceness'})
            break
          case 1:
            this.$refs.groupList.showLink()
            break
          case 2:
            if (this.$isLogin()) {
              wx.switchTab({url: '/pages/shopping-cart'})
            }
            break
        }
      },
      async instantlyBuy() {
        let isLogin = await this.$isLogin()
        if (!isLogin) {
          return
        }
        // 显示抢购限购数量
        if (this.buyGoodsInfo.person_all_buy_limit * 1 !== -1 && this.buyGoodsInfo.person_all_buy_count >= this.buyGoodsInfo.person_all_buy_limit) {
          this.$wechat.showToast(`该商品限购${this.buyGoodsInfo.person_all_buy_limit}件，您不能再购买了`)
          return
        }
        if (this.buyGoodsInfo.person_day_buy_limit * 1 === -1) {
          this.$refs.addNumber.showLink()
          return
        }
        if (this.buyGoodsInfo.person_day_buy_count >= this.buyGoodsInfo.person_day_buy_limit) {
          this.$wechat.showToast(`该商品限购${this.buyGoodsInfo.person_day_buy_limit}件，您不能再购买了`)
        } else {
          this.$refs.addNumber.showLink()
        }
      },
      comfirmNumer(number) {
        let goodsList = this.goodsMsg.goods_skus[0]
        goodsList.sku_id = goodsList.goods_sku_id
        goodsList.num = number
        goodsList.goods_units = this.goodsMsg.goods_units
        const total = (goodsList.trade_price * number).toFixed(2)
        let orderInfo = {
          goodsList: new Array(goodsList),
          total: total,
          deliverAt: this.deliverAt
        }
        this.setOrderInfo(orderInfo)
        wx.navigateTo({url: `/pages/submit-order`})
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@designCommon"

  .fixed-btn
    position: fixed
    left: 0
    bottom: 0
    height: 55px
    width: 100%
    background: #fff
    layout(row)
    z-index: 111
    .hlep-btn
      width: 30vw
      height: 55px
      layout(row)
      border-top-1px(#E6E6E6)
      .hlep-btn-box
        width: 50%
        layout()
        justify-content: center
        align-items: center
        .hlep-top
          width: 20px
          height: 20px
          margin-bottom: 8px
          position: relative
          .detail-img
            width: 100%
            height: 100%
            display: block
          .help-number
            position: absolute
            top: -5px
            right: -7px
            min-width: 16px
            text-align: center
            height: 16px
            line-height: 14px
            padding: 0 3px
            box-sizing: border-box
            font-family: $font-family-medium
            color: $color-white
            font-size: $font-size-10
            border: 1px solid $color-white
            background: #FF3B39
            border-radius: 50%
        .hlep-bottom
          font-size: $font-size-10
          font-family: $font-family-regular
          color: $color-text-main
          line-height: 1
    .goods-btn
      width: 35vw
      line-height: 55px
      height: 55px
      text-align: center
      font-size: $font-size-14
      font-family: $font-family-regular
      color: #fff
      &:after
        border: none
    .goods-btn-active
      color: $color-text-main
      background: $color-tag
    .goods-btn-assint
      color: #fff
      background: $color-text-assist
      width: 70vw

  .panel
    background: #FFFFFF;
    box-shadow: 0 6px 30px 0 rgba(17,17,17,0.08);
    border-radius: 8px

  .goods-record
    width: 100%
    .container
      padding :0 12px
      .list-wrapper
        margin-top :10px
        padding : 0 15px
        .item-wrapper
          layout(row,block,nowrap)
          padding-bottom :25px
          &:first-child
            padding-top :25px
          .left
            width :36px
            height :@width
            border-radius :50%
            background :#ccc
            margin-right :9px
            overflow :hidden
            .avatar
              width :36px
              height :@width
              display :block
          .right
            font-family: $font-family-regular
            font-size: 14px;
            color: $color-text-main
            letter-spacing: 0.3px
            white-space: nowrap
            overflow :hidden
            line-height :36px
            .number
              padding :0 2px
              color: #FA7500;
            .date
              display :inline-block
              padding-left :13px
              font-size: 13px;
              color: $color-text-sub
              text-overflow: ellipsis

      .goods-wrapper
        margin-top :10px
        background: #FFFFFF;
        box-shadow: 0 6px 30px 0 rgba(17,17,17,0.08);
        border-radius: 8px
        padding :10px
        layout(row,block,nowrap)
        position :relative
        .share-button
          position :absolute
          width :40px
          height :@width
          right :13px
          bottom :-4px
          border-radius :50%
          background :#fff
          display: flex
          align-items :center
          justify-content :center
          z-index :50
          .share-img
            width :30px
            height :@width
            display :block
        .left
          background: #F7F5F5;
          border-radius: 2px;
          width :95px
          height :@width
          margin-right :10px
          overflow :hidden
          .goods-img
            width :95px
            height :@width
            display :block
        .right
          flex: 1
          overflow :hidden
          font-family: $font-family-regular
          .title
            font-family: $font-family-medium
            font-size: 14px;
            color: $color-text-main
            letter-spacing: 0.6px;
            line-height: 1
            no-wrap()
          .title-sub
            padding-top :6px
            font-size: 13px;
            color: $color-text-sub
            line-height:1.24
            no-wrap-plus()
          .money
            padding-top :21px
            display :flex
            font-family: $font-family-medium
            color: #FA7500;
            align-items :flex-end
            .number
              font-size: 20px;
              line-height: 16px;
            .unit
              position :relative
              top:2px
              left :1px
              font-size :12px

</style>
