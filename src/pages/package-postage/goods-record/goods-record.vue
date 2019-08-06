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
        <img v-if="imageUrl" :src="imageUrl + '/yx-image/2.3/pic-line.png'" mode="aspectFill" class="line">
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
      <loading-more v-if="hasMore"></loading-more>
      <div style="height: 75px"></div>
    </section>
    <button-group
      :buttonInfo="buttonInfo"
      :activityType="activityType"
      @instantlyBuy="instantlyBuy"
      @buttonGroupNav="buttonGroupNav"
      @addShoppingCart="addShoppingCart"
    ></button-group>
    <add-number ref="addNumber" :msgDetail="goodsMsg" :msgDetailInfo="buyGoodsInfo" @comfirmNumer="comfirmNumer"></add-number>
  </div>
</template>

<script type="text/ecmascript-6">
  import NavigationBar from '@components/navigation-bar/navigation-bar'
  import API from '@api'
  import {ACTIVE_TYPE} from '@utils/contants'
  import ShareHandler, {EVENT_CODE} from '@mixins/share-handler'
  import IsEnd from '@components/is-end/is-end'
  import LoadingMore from '@components/loading-more/loading-more'
  import {orderMethods, cartMethods, cartComputed} from '@state/helpers'
  import AddNumber from '@components/add-number/add-number'
  import GoodsDetailMixins from '@mixins/goods-detail'
  import ButtonGroup from '@components/goods-detail-element/button-group/button-group'
  import {resolveQueryScene} from '@utils/common'
  import GetOptions from '@mixins/get-options'

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
    mixins: [ShareHandler, GoodsDetailMixins, GetOptions],
    components: {
      NavigationBar,
      IsEnd,
      LoadingMore,
      AddNumber,
      ButtonGroup
    },
    data() {
      return {
        isFirstLoad: true,
        goodsMsg: {},
        shopId: 0,
        activityId: 0,
        goodsId: 0,
        listArray: [],
        hasMore: true,
        isLoading: false,
        page: 1,
        typeBtn: TYPEBTN,
        buyGoodsInfo: {},
        isSharing: false,
        countDownTimes: {
          hour: '00',
          minute: '00',
          second: '00'
        },
        activityType: '',
        ACTIVE_TYPE,
        isShowOldCustomerButton: false
      }
    },
    computed: {
      ...cartComputed,
      activeStatus() {
        let active = this.goodsMsg.activity || {}
        return +active.status || 0
      },
      // 按钮文案
      btnText() {
        let key = this.activeStatus
        if (this.goodsMsg.usable_stock < 1) {
          key = 'NO_INVENTORY'
        }
        if (key == null) {
          key = BTN_STATUS.DOWN
        }
        return BTN_TEXT_CONSTANT[key] || ''
      },
      isShowTwoButton() {
        let flag = false
        if (this.activityId) {
          flag = this.goodsMsg.usable_stock > 0 && this.activeStatus === 1
        } else {
          flag = this.goodsMsg.usable_stock > 0
        }
        return flag
      },
      // buttonInfo信息
      buttonInfo() {
        return {
          activeStatus: this.activeStatus || 0,
          btnText: this.btnText || '',
          isShowTwoButton: this.isShowTwoButton || false,
          tradePrice: this.goodsMsg.trade_price || 0,
          salePrice: this.goodsMsg.goods_sale_price || 0,
          base_usable_stock: this.goodsMsg.base_usable_stock || 0, // 非活动库存
          usable_stock: this.goodsMsg.usable_stock || 0, // 库存
          tipTop: this.tipTop || '',
          isShowOldCustomerButton: this.isShowOldCustomerButton
        }
      },
      // 二维码
      thumb_image() {
        return this.goodsMsg.thumb_image || ''
      },
      // 提货时间
      deliverAt() {
        return this.goodsMsg.delivery_at || ''
      }
    },
    onLoad(options) {
      console.warn(options, '<-----参数---->')
      this._initPageParams(options)
      console.warn(this._options, '<--_options---参数---->')
      this._getList(false)
    },
    onShow() {
      if (this.isSharing) {
        this.isSharing = false
        this._getGoodsDetailData()
        return
      }
      this._getGoodsDetailData()
      this.getGoodsOtherInfo()
      this.$$shareHandler({
        event: EVENT_CODE.GOODS_RECORD,
        activityId: this.activityId,
        goodsId: this.goodsId
      })
      // const _track = this.activityType === ACTIVE_TYPE.DEFAULT ? 'product' : 'activity'
      this.$$sendEvent({goodsId: this.goodsId, activityId: this.activityId})
    },
    onShareAppMessage() {
      this.isSharing = true
      let shopId = wx.getStorageSync('shopId')
      return {
        title: this.goodsMsg.name,
        path: `${this.$routes.postage.GOODS_RECORD}?goodsId=${this.goodsId}&shopId=${shopId}`, // 商品详情
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
      // 初始化页面参数
      _initPageParams() {
        let options = this._$$initOptions()
        this.goodsId = +options.id || +options.goodsId || 0
        this.shopId = +options.shopId || 0
        if (options.scene) {
          let {shopId, goodsId} = resolveQueryScene(options.scene)
          this.goodsId = goodsId
          this.shopId = shopId
        }
        this.shopId && wx.setStorageSync('shopId', this.shopId)
      },
      // 获得商品购买限制详情
      getGoodsOtherInfo() {
        API.Choiceness.getGoodsBuyInfo(this.goodsId, {activity_id: ''}).then((res) => {
          if (res.error === this.$ERR_OK) {
            this.buyGoodsInfo = res.data
          } else {
            this.$wechat.showToast(res.message)
          }
        })
      },
      // 重置数据
      _resetReqListParams() {
        this.page = 1
        this.hasMore = true
        this.listArray = []
      },
      // 获取购买记录列表
      _getList(loading) {
        this.isLoading = true
        API.GoodsRecord.getList({page: this.page, goods_id: this.goodsId, source_type: 2}, loading).then((res) => {
          res.data.forEach(item => {
            this.listArray.push({
              ...item,
              userName: this._formatName(item.nickname)
            })
          })
          this.hasMore = res.meta.current_page < res.meta.last_page
          this.isLoading = false
        }).catch(e => {
          console.warn(e)
          this.isLoading = false
        })
      },
      _formatName(name) {
        const dot = '***'
        if (name.length > 1) {
          name = name.substr(0, 1) + dot + name.substr(-1)
        } else {
          name += dot
        }
        return name
      },
      // 获得商品详情
      _getGoodsDetailData() {
        API.Postage.getGoodsDetail(this.goodsId).then((res) => {
          this.$wechat.hideLoading()
          if (res.error === this.$ERR_OK) {
            this.goodsMsg = res.data
          } else {
            this.$wechat.showToast(res.message)
          }
        }).catch(e => {
          console.warn(e)
        })
      },
      // 添加购物车
      async addShoppingCart() {
        let isLogin = await this.$isLogin()
        if (!isLogin) {
          return
        }
        let goodsId = this.goodsMsg.goods_skus[0].goods_sku_id
        API.Choiceness.addShopCart({goods_sku_id: goodsId, activity_id: '', source_type: 2}).then((res) => {
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
      // 按钮导航
      buttonGroupNav(item) {
        switch (item.type) {
          case 0:
            wx.switchTab({url: `${this.$routes.main.CHOICENESS}`})
            break
          case 1:
            // this.$refs.groupList.showLink()
            break
          case 2:
            if (this.$isLogin()) {
              wx.switchTab({url: `${this.$routes.main.SHOPPING_CART}`})
            }
            break
        }
      },
      // 执行购买
      async instantlyBuy(type) {
        let isLogin = await this.$isLogin()
        if (!isLogin) {
          return
        }
        // 团购单买
        if (type === 'goods_sale_price') {
          this._showAddNumber(type)
          return
        }
        // 显示抢购限购数量
        if (this.buyGoodsInfo.person_all_buy_limit * 1 !== -1 && this.buyGoodsInfo.person_all_buy_count >= this.buyGoodsInfo.person_all_buy_limit) {
          this.$wechat.showToast(`该商品限购${this.buyGoodsInfo.person_all_buy_limit}件，您不能再购买了`)
          return
        }
        if (this.buyGoodsInfo.person_day_buy_limit * 1 === -1) {
          this._showAddNumber(type)
          return
        }
        if (this.buyGoodsInfo.person_day_buy_count >= this.buyGoodsInfo.person_day_buy_limit) {
          this.$wechat.showToast(`该商品限购${this.buyGoodsInfo.person_day_buy_limit}件，您不能再购买了`)
        } else {
          this._showAddNumber(type)
        }
      },
      // 显示添加数量控件
      _showAddNumber(type) {
        this.$refs.addNumber && this.$refs.addNumber.showLink(type)
      },
      // addNumber控件确定按钮
      async comfirmNumer(number) {
        let goodsList = this.goodsMsg.goods_skus[0]
        goodsList.sku_id = goodsList.goods_sku_id
        goodsList.num = number
        goodsList.goods_units = this.goodsMsg.goods_units
        let price = goodsList.trade_price
        const total = (price * number).toFixed(2)
        goodsList.activity = this.goodsMsg.activity
        let orderInfo = {
          goodsList: new Array(goodsList),
          total: total,
          deliverAt: ''
        }
        this.setOrderInfo(orderInfo)
        wx.navigateTo({url: `${this.$routes.postage.SUBMIT_ORDER}`})
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@designCommon"

  .right-wrapper
    position absolute
    right :10px
    bottom :12px
    flex:1
    color: $color-text-sub
    display :flex
    align-items :center
    justify-content :flex-start
    .title
      color: #111
      font-size :12px
      padding-right :6px
    .time-wrapper
      display :flex
      font-size: 12px;
      padding-right :4px
      .time
        color: #FFFFFF;
        font-family: DINAlternate-Bold;
        background :rgba(17,17,17,0.8)
        border-radius: 3px
        height :15px
        line-height :@height
        width :@height
        text-align :center
        box-sizing :border-box
        &.start
          padding :0 2px
          width: auto
          box-sizing: content-box
      .dot
        padding :0 2px
        position :relative
        bottom :1px

  .panel
    background: #FFFFFF;
    box-shadow: 0 6px 30px 0 rgba(17,17,17,0.08);
    border-radius: 8px

  .goods-record
    width: 100%
    .container
      padding :0 12px
      min-height :100vh
      layout(column, block, nowrap)
      box-sizing :border-box
      .list-wrapper
        flex: 1
        margin-top :10px
        padding : 0 15px
        .item-wrapper
          layout(row,block,nowrap)
          padding-bottom :25px
          &:first-child
            padding-top :25px
          .left
            width :9.6vw
            height :@width
            border-radius :50%
            background :#ccc
            margin-right :9px
            overflow :hidden
            .avatar
              width :9.6vw
              height :@width
              display :block
          .right
            font-family: $font-family-regular
            font-size: 3.7vw
            color: $color-text-main
            letter-spacing: 0.3px
            white-space: nowrap
            overflow :hidden
            line-height :9.6vw
            .number
              padding :0 2px
              color: #FA7500;
            .date
              display :inline-block
              padding-left :3.4vw
              font-size: 3.4vw
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
        .line
          position absolute
          width :1px
          height :57px
          top:13px
          right :62px
        .share-button
          position :absolute
          width :36px
          height :@width
          right :15px
          top :26px
          border-radius :50%
          background :#fff
          display: flex
          align-items :center
          justify-content :center
          z-index :50
          .share-img
            width :36px
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
          max-width :48%
          overflow :hidden
          font-family: $font-family-regular
          position :relative
          .title
            padding-top :4px
            font-family: $font-family-medium
            font-size: 15px;
            color: $color-text-main
            letter-spacing: 0.6px;
            line-height: 1.3
            no-wrap()
          .title-sub
            padding-top :4px
            font-size: 14px;
            color: $color-text-sub
            line-height:1.24
            no-wrap-plus()
          .money
            position :absolute
            bottom :5px
            left :0
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
