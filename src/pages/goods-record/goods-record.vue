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
        <article v-if="activityType === ACTIVE_TYPE.FLASH" class="right-wrapper">
          <p class="title">{{goodsMsg.at_diff_str}}</p>
          <div class="time-wrapper">
            <p class="time start">{{countDownTimes.hour}}</p>
            <p class="dot">:</p>
            <p class="time">{{countDownTimes.minute}}</p>
            <p class="dot">:</p>
            <p class="time">{{countDownTimes.second}}</p>
          </div>
        </article>
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
  import {resolveQueryScene, countDownHandle, isEmptyObject} from '@utils/common'

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
    mixins: [ShareHandler, GoodsDetailMixins],
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
        timer: null,
        activityType: '',
        ACTIVE_TYPE
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
          activeStatus: this.activeStatus,
          btnText: this.btnText,
          isShowTwoButton: this.isShowTwoButton,
          tradePrice: this.goodsMsg.trade_price,
          salePrice: this.goodsMsg.goods_sale_price,
          base_usable_stock: this.goodsMsg.base_usable_stock, // 非活动库存
          usable_stock: this.goodsMsg.usable_stock, // 库存
          tipTop: this.tipTop
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
      if (!isEmptyObject(options)) {
        this._options = options || {}
      }
      // console.warn(this._options, '<--_options---参数---->')
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
      this._getLocation()
      this._getGoodsDetailData()
      this.getGoodsOtherInfo()
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
        path: `/pages/goods-record?goodsId=${this.goodsId}&shopId=${shopId}&activityId=${this.activityId}&activityType=${this.activityType}&flag=${flag}`, // 商品详情
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
    onUnload() {
      this._clearTimer()
    },
    onHide() {
      this._clearTimer()
    },
    methods: {
      ...cartMethods,
      ...orderMethods,
      // 初始化页面参数
      _initPageParams(options) {
        if (!isEmptyObject(this._options)) {
          options = this._options
        } else if (!isEmptyObject(this.$mp.query)) {
          options = this.$mp.query
        } else if (!isEmptyObject(this.$mp.appOptions.query)) {
          options = this.$mp.appOptions.query
        }
        this.goodsId = +options.id || +options.goodsId || 0
        this.activityId = +options.activityId || 0
        this.shopId = +options.shopId || 0
        if (options.scene) {
          let {shopId, activityId, goodsId} = resolveQueryScene(options.scene)
          this.goodsId = goodsId
          this.activityId = activityId
          this.shopId = shopId
        }
        this.shopId && wx.setStorageSync('shopId', this.shopId)
        this._initPageType(options.activityType)
      },
      _initPageType(type = 'DEFAULT') {
        if (type === ACTIVE_TYPE.GUESS) {
          type = ACTIVE_TYPE.DEFAULT
        } else if ((this.activityId > 0 && type === ACTIVE_TYPE.DEFAULT) || type === ACTIVE_TYPE.FLASH) {
          type = ACTIVE_TYPE.FLASH
        }
        this.activityType = type || ACTIVE_TYPE.DEFAULT
      },
      _kanTimePlay(diff) {
        this._clearTimer()
        if (this.activeStatus === BTN_STATUS.DOWN) {
          return
        }
        this.countDownTimes = countDownHandle(diff)
        this.timer = setTimeout(() => {
          diff--
          if (diff < 0) {
            diff = 0
          }
          this.countDownTimes = countDownHandle(diff)
          if (this.countDownTimes.differ <= 0) {
            this._clearTimer()
            this._getGoodsDetailData()
          } else {
            return this._kanTimePlay(diff)
          }
        }, 1000)
      },
      _clearTimer() {
        clearInterval(this.timer)
        clearTimeout(this.timer)
      },
      _resetReqListParams() {
        this.page = 1
        this.hasMore = true
        this.listArray = []
      },
      _getList(loading) {
        this.isLoading = true
        API.GoodsRecord.getList({page: this.page, goods_id: this.goodsId}, loading).then((res) => {
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
        // name = name.replace(/\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F]/g, '?')
        if (name.length > 1) {
          name = name.substr(0, 1) + dot + name.substr(-1)
        } else {
          name += dot
        }
        return name
      },
      _getGoodsDetailData() {
        let data = {
          activity_id: this.activityId,
          is_hot: this.activityType === ACTIVE_TYPE.GOODS_HOT_TAG ? 1 : 0
        }
        API.Choiceness.getGoodsDetail(this.goodsId, data, this.isFirstLoad).then((res) => {
          this.$wechat.hideLoading()
          if (res.error === this.$ERR_OK) {
            this.goodsMsg = res.data
            this._flashAction()
            // this._getUnGroupList()
            // this._getFinishGroupList()
          } else {
            this.$wechat.showToast(res.message)
          }
        }).catch(e => {
          console.warn(e)
        })
        // API.Choiceness.getGoodsDetail(this.goodsId, {activity_id: this.activityId}, this.isFirstLoad).then((res) => {
        //   this.$wechat.hideLoading()
        //   this.isFirstLoad = false
        //   if (res.error === this.$ERR_OK) {
        //     let goodDetail = res.data
        //     this.goodsMsg = goodDetail
        //     this.thumb_image = goodDetail.thumb_image
        //     let diff = this.goodsMsg.at_diff || 0
        //     this._kanTimePlay(diff)
        //   } else {
        //     this.$wechat.showToast(res.message)
        //   }
        // })
      },
      // 限时抢购倒计时开始
      _flashAction() {
        if (this.activityType !== ACTIVE_TYPE.FLASH) return
        if (this.activeStatus === BTN_STATUS.DOWN) {
          return
        }
        let diff = this.goodsMsg.at_diff || 0
        this._kanTimePlay(diff)
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
      // async addShoppingCart() {
      //   let isLogin = await this.$isLogin()
      //   if (!isLogin) {
      //     return
      //   }
      //   API.Choiceness.addShopCart({goods_sku_id: this.goodsMsg.goods_skus[0].goods_sku_id, activity_id: this.activityId}).then((res) => {
      //     if (res.error === this.$ERR_OK) {
      //       this.$sendMsg({
      //         event_no: 1007,
      //         goods_id: this.goodsId,
      //         title: this.goodsMsg.name
      //       })
      //       this.$wechat.showToast('加入购物车成功')
      //       this.setCartCount()
      //     } else {
      //       this.$wechat.showToast(res.message)
      //     }
      //   })
      // },
      // 添加购物车
      async addShoppingCart() {
        let isLogin = await this.$isLogin()
        if (!isLogin) {
          return
        }
        let goodsId = this.goodsMsg.goods_skus[0].goods_sku_id
        API.Choiceness.addShopCart({goods_sku_id: goodsId, activity_id: this.activityId}).then((res) => {
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
            wx.switchTab({url: '/pages/choiceness'})
            break
          case 1:
            // this.$refs.groupList.showLink()
            break
          case 2:
            if (this.$isLogin()) {
              wx.switchTab({url: '/pages/shopping-cart'})
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
      async comfirmNumer(number, type) {
        let goodsList = this.goodsMsg.goods_skus[0]
        goodsList.sku_id = goodsList.goods_sku_id
        goodsList.num = number
        goodsList.goods_units = this.goodsMsg.goods_units
        let price = goodsList.trade_price
        if (this.activityType === ACTIVE_TYPE.NEW_CLIENT) {
          try {
            let res = await API.Global.checkIsNewCustomer()
            if (res.data.is_new_client === 0) {
              price = this.goodsMsg.goods_sale_price
              goodsList.trade_price = price
            }
          } catch (e) {
            console.warn(e)
          }
        }
        if (this.activityType === ACTIVE_TYPE.GROUP_ON) {
          let flag = await this._checkAbleCreateGroup(0, number)
          if (!flag) return
          if (type) {
            price = this.goodsMsg.goods_sale_price
            goodsList.trade_price = price
          } else {
            goodsList.url = `/pages/collage-detail`
            goodsList.source = 'c_groupon'
            goodsList.groupon_id = 0
            goodsList.latitude = this.latitude
            goodsList.longitude = this.longitude
          }
        }
        const total = (price * number).toFixed(2)
        goodsList.activity = this.goodsMsg.activity
        let orderInfo = {
          goodsList: new Array(goodsList),
          total: total,
          deliverAt: this.deliverAt
        }
        this.setOrderInfo(orderInfo)
        wx.navigateTo({url: `/pages/submit-order`})
      },
      async _checkAbleCreateGroup(groupId = 0, num = 1) {
        try {
          let data = {
            activity_id: this.goodsMsg.activity_id,
            goods_sku_id: this.goodsMsg.goods_skus[0].goods_sku_id,
            groupon_id: groupId,
            num,
            longitude: this.longitude,
            latitude: this.latitude
          }
          const res = await API.Global.checkAbleCreateGroup(data)
          if (res.error === this.$ERR_OK) {
            return true
          } else {
            this.$wechat.showToast(res.message)
          }
          return true
        } catch (e) {
          e && this.$wechat.showToast(e.message)
          console.warn(e)
        }
      }
      // comfirmNumer(number) {
      //   let goodsList = this.goodsMsg.goods_skus[0]
      //   goodsList.sku_id = goodsList.goods_sku_id
      //   goodsList.num = number
      //   goodsList.goods_units = this.goodsMsg.goods_units
      //   const total = (goodsList.trade_price * number).toFixed(2)
      //   let orderInfo = {
      //     goodsList: new Array(goodsList),
      //     total: total,
      //     deliverAt: this.deliverAt
      //   }
      //   this.setOrderInfo(orderInfo)
      //   wx.navigateTo({url: `/pages/submit-order`})
      // }
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
