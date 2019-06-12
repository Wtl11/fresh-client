<template>
  <form action="" report-submit @submit="$getFormId">
  <div class="wrap" :class="{'padding-wrap': goodsList.length}">
    <navigation-bar title="购物车" :showArrow="false" :translucent="false"></navigation-bar>
    <div class="shop-list">
      <div class="shop-item" :class="{'shop-item-opcta' : item.num <= 0}" v-for="(item, index) in goodsList" :key="index">
        <img class="sel-box" @click.stop="toggelCheck(index)" v-if="imageUrl && !item.checked && item.num > 0" :src="imageUrl+'/yx-image/cart/icon-pick@2x.png'" alt=""/>
        <!--<img class="sel-box" v-if="imageUrl && item.num <= 0" :src="imageUrl+'/yx-image/cart/icon-pick@2x.png'" alt="" />-->
        <div class="sel-box sel-clr-box" v-if="imageUrl && item.num <= 0"></div>
        <img class="sel-box" @click.stop="toggelCheck(index)" v-if="imageUrl && item.checked && item.num > 0 && corpName === 'platform'" :src="imageUrl+'/yx-image/cart/icon-pick1@2x.png'" alt=""/>
        <img class="sel-box" @click.stop="toggelCheck(index)" v-if="imageUrl && item.checked && item.num > 0 && corpName === 'retuan'" :src="imageUrl+'/yx-image/retuan/icon-pick_gwc@2x.png'" alt=""/>
        <button formType="submit" class="goods-image" @click.stop="jumpGoodsDetail(item)">
          <img class="goods-img" mode="aspectFill" :src="item.goods_cover_image" alt="">
          <div class="robbed" v-if="item.num <= 0">已抢完</div>
        </button>
        <div class="good-info">
          <div formType="submit" class="top" @click.stop="jumpGoodsDetail(item)">
            <div class="title">{{item.name}}</div>
            <button formType="submit" class="del" @click.stop="delGoodsInfo(index, item.id)">
              <img class="del-img" v-if="imageUrl" :src="imageUrl + '/yx-image/cart/icon_delete@2x.png'" alt="">
            </button>
          </div>
          <div class="bot">
            <div formType="submit" class="left" @click.stop="jumpGoodsDetail(item)">
              <div class="spec" v-if="item.goods_units">规格：{{item.goods_units}}</div>
              <div class="remain">
                <div class="txt" :class="'corp-' + corpName + '-money-text'" v-if="item.is_urgency">仅剩{{item.usable_stock}}件</div>
              </div>
              <div class="price" :class="'corp-' + corpName + '-money'" v-if="item.trade_price">
                <span class="num">{{item.trade_price}}</span>
                <span class="unit">元</span>
                <img class="new-user-img" v-if="imageUrl && item.activity && item.activity.activity_theme === ACTIVE_TYPE.NEW_CLIENT" :src="imageUrl + '/yx-image/2.4/pic-newlabel@2x.png'" alt="">
              </div>
            </div>
            <div class="right">
              <div class="number-box">
                <button formType="submit" class="minus" @click.stop="subNum(index, item.num, item.id)">-</button>
                <div class="num">{{item.num}}</div>
                <button formType="submit" class="add" @click.stop="addNum(index, item.num, item.buy_limit, item.id)">+</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!--结算-->
    <div class="payment" :style="{bottom: (49 + height) + 'px'}" v-if="goodsList.length > 0">
      <button formType="submit" class="check-all" @click.stop="toggleCheckAll">
        <img class="sel-box" v-if="imageUrl && allChecked && corpName === 'platform'" :src="imageUrl+'/yx-image/cart/icon-pick1@2x.png'" alt=""/>
        <img class="sel-box" v-if="imageUrl && allChecked && corpName === 'retuan'" :src="imageUrl+'/yx-image/retuan/icon-pick_gwc@2x.png'" alt=""/>
        <img class="sel-box" v-if="imageUrl && !allChecked" :src="imageUrl+'/yx-image/cart/icon-pick@2x.png'" alt=""/>
        <div class="txt">全选</div>
      </button>
      <div class="payment-content">
        <div class="price" :class="'corp-' + corpName + '-money'">合计 {{totalPrice}}元</div>
        <button formType="submit" class="pay-btn" :class="'corp-' + corpName + '-bg'" @click.stop="submitOrder">去结算</button>
      </div>
    </div>
    <!--没有商品-->
    <div class="without" v-if="isShowCart">
      <div class="without-img"><img class="img" v-if="imageUrl" :src="imageUrl+'/yx-image/cart/pic-gwc@2x.png'" alt=""></div>
      <div class="txt">购物车没有商品哦!</div>
      <div class="txt">赶快去挑选吧</div>
      <!--<div class="btn" :class="'corp-' + corpName + '-bg'" @click.stop="toChoicenessPage">去逛逛</div>-->
    </div>
    <!--商品推荐-->
    <div class="recommend">
      <p class="title">
        <img v-if="imageUrl" :src="imageUrl + '/yx-image/2.3/icon-ulike@2x.png'" alt="" class="icon">
        <span class="text">猜你喜欢</span>
      </p>
      <div class="recommend-list">
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
        <loading-more v-if="recommendListLoad"></loading-more>
        <div v-if="!hasMore" class="foot-ties">
          <div class="center">— 再拉也没有了 —</div>
        </div>
      </div>
    </div>
    <confirm-msg ref="msg" :msg="msg" useType="double" @confirm="deleteCartGood"></confirm-msg>
    <custom-tab-bar currentType="cart"></custom-tab-bar>
  </div>
  </form>
</template>

<script type="text/ecmascript-6">
  import NavigationBar from '@components/navigation-bar/navigation-bar'
  import CustomTabBar from '@components/custom-tab-bar/custom-tab-bar'
  import ConfirmMsg from '@components/confirm-msg/confirm-msg'
  // import GoodsItem from './goods-item/goods-item'
  import API from '@api'
  import {orderMethods, cartMethods} from '@state/helpers'
  import ClearWatch from '@mixins/clear-watch'
  import LoadingMore from '@components/loading-more/loading-more'
  import {ACTIVE_TYPE} from '@utils/contants'
  import {objDeepCopy} from '@utils/common'

  export default {
    mixins: [ClearWatch],
    components: {
      ConfirmMsg,
      NavigationBar,
      CustomTabBar,
      // GoodsItem,
      LoadingMore
    },
    data() {
      return {
        ACTIVE_TYPE,
        msg: '确定删除该商品吗?',
        delIndex: 0,
        goodsList: [],
        recommendList: [],
        isShowCart: false,
        deleteInfo: {
          delIndex: null,
          cartId: null
        },
        isShowNum: true,
        deliverAt: '',
        height: 0,
        page: 1,
        limit: 10,
        hasMore: true,
        curShopId: '',
        recommendListLoad: false,
        firstLoad: false
      }
    },
    async onTabItemTap() {
      await this.$isLogin()
    },
    onLoad() {
      let res = this.$wx.getSystemInfoSync()
      this.height = res.statusBarHeight >= 44 ? 28 : 0
      this.firstLoad = true
    },
    async onShow() {
      if (!wx.getStorageSync('token')) return
      await this._getShopCart(this.firstLoad)
      this.firstLoad = false
      let shopId = wx.getStorageSync('shopId')
      if (!shopId) {
        let res = await API.Choiceness.getDefaultShopInfo()
        shopId = res.data.id
        wx.setStorageSync('shopId', shopId)
      }
      // 判断是否切店，如果切店了重新读猜你喜欢
      if (this.curShopId * 1 !== shopId * 1) {
        wx.pageScrollTo({
          scrollTop: 0,
          duration: 0
        })
        this.page = 1
        this.getCarRecommend()
      }
      this.curShopId = shopId
    },
    onReachBottom() {
      if (!this.hasMore) return
      this.page++
      this.getCarRecommend()
    },
    computed: {
      checkedGoods() {
        return this.goodsList.filter((item) => item.checked)
      },
      totalPrice() {
        return this.checkedGoods.reduce((total, current) => {
          let money = (total * 1) + (current.trade_price * current.num)
          money = money.toFixed(2)
          return money
        }, 0)
      },
      allChecked() {
        return this.goodsList.length && this.checkedGoods.length === this.goodsList.length
      }
    },
    methods: {
      ...orderMethods,
      ...cartMethods,
      recommendJumpGoodsDetail(item) {
        wx.navigateTo({
          url: `/pages/goods-detail?id=${item.goods_id || 0}&activityId=${item.activity_id || 0}`
        })
      },
      addShoppingCart(item) {
        if (!this.$isLogin()) {
          return
        }
        API.Choiceness.addShopCart({goods_sku_id: item.goods_sku_id || 0, activity_id: item.activity_id || 0}).then((res) => {
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
      async getCarRecommend() {
        this.recommendListLoad = true
        let res = await API.Cart.getCarRecommend({page: this.page, limit: this.limit})
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
      addNum(i, num, limit, id) {
        num++
        if (this.isShowNum) {
          this.editGoodsNum(i, id, num)
        }
      },
      subNum(i, num, id) {
        if (num > 1) {
          num--
          if (this.isShowNum) {
            this.editGoodsNum(i, id, num)
          }
        } else {
          this.delGoodsInfo(i, id)
        }
      },
      // 商品数量
      async editGoodsNum(i, id, num) {
        this.isShowNum = false
        let res = await API.Cart.editCartGoodsNum(id, num)
        this.isShowNum = true
        if (res.error !== this.$ERR_OK) {
          this.$wechat.showToast(res.message)
          return
        }
        this.goodsList[i].num = num
        this.setCartCount()
      },
      jumpGoodsDetail(item) {
        let type = ''
        if (item.activity) {
          type = item.activity.activity_theme || ''
        }
        wx.navigateTo({
          url: `/pages/goods-detail?id=${item.goods_id}&activityId=${item.activity_id}&activityType=${type}`
        })
      },
      // 点击删除按钮
      delGoodsInfo(delIndex, cartId) {
        this.$refs.msg.show()
        this.deleteInfo = {delIndex, cartId}
      },
      // 删除购物车商品
      async deleteCartGood() {
        let res = await API.Cart.delCartGoods(this.deleteInfo.cartId)
        if (res.error !== this.$ERR_OK) {
          this.$wechat.showToast(res.message)
        }
        this.$wechat.showToast(res.message)
        this.goodsList.splice(this.deleteInfo.delIndex, 1)
        this.setCartCount()
        if (!this.goodsList.length) {
          this.isShowCart = true
        }
      },
      toggelCheck(i) {
        this.goodsList[i].checked = !this.goodsList[i].checked
      },
      toggleCheckAll() {
        let goodsList = this.goodsList
        let currentAllChecked = this.allChecked
        goodsList.forEach((item) => {
          if (!currentAllChecked && item.num > 0) {
            item.checked = true
          } else {
            item.checked = false
          }
        })
        this.goodsList = goodsList
      },
      submitOrder() {
        if (!this.checkedGoods.length) {
          this.$wechat.showToast('请选择商品!')
          return
        }
        const goodsList = objDeepCopy(this.checkedGoods).map(item => {
          if (item.is_new_client === 0) {
            item.trade_price = item.goods_sale_price
          }
          return item
        })
        const total = goodsList.reduce((total, current) => {
          let money = (total * 1) + (current.trade_price * current.num)
          money = money.toFixed(2)
          return money
        }, 0)
        let orderInfo = {
          goodsList,
          total,
          deliverAt: this.deliverAt
        }
        this.setOrderInfo(orderInfo)
        wx.navigateTo({url: '/pages/submit-order'})
      },
      toChoicenessPage() {
        wx.switchTab({url: '/pages/choiceness'})
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
 @import "~@designCommon"

  .wrap
    width: 100vw
    min-height: 100vh
    background: $color-background
    position: relative
    padding-bottom: 10px
  .padding-wrap
    padding-bottom: 60px
  .payment
    border-top-1px(#EEEEEE)
    position: fixed
    width: 100%
    height: 50px
    background: $color-white
    left: 0
    padding-left: 3.2vw
    box-sizing: border-box
    bottom: 49px
    layout(row)
    justify-content: space-between
    align-items: center
    z-index: 20
    box-shadow: 0 -4px 20px 0 rgba(29,32,35,0.06)
    .check-all
      layout(row)
      .sel-box
        display: block
        margin-right: 5px
        width: 20px
        height: 20px
        background: $color-white
        box-sizing: border-box
        border-radius: 50%
      .txt
        font-family: $font-family-regular
        font-size: $font-size-14
        color: $color-sub
        height: 5.34vw
        line-height: 5.34vw
        letter-spacing: 0.3px
      .sel-clr-box
        width: 20px
        height: 20px
        background: $color-background
        border: 1.5px solid #B7B7B7
    .payment-content
      layout(row)
      align-items: center
      .price
        font-family: $font-family-medium
        font-size: $font-size-16
      .pay-btn
        margin-left: 10px
        width: 125px
        height: 50px
        text-align: center
        font-size: $font-size-16
        font-family: $font-family-medium
        line-height: 50px
        color: $color-white

  .shop-list
    background: $color-white
    .shop-item
      layout(row)
      align-items: center
      padding: 12.5px 12px 12.5px 0
      widht: 100vw
      height: 115px
      box-sizing: border-box
      .sel-box
        display: block
        width: 20px
        height: 20px
        padding: 12px
        background: $color-white
      .goods-image
        position: relative
        width: 85px
        height: 85px
        background: #F6F9F4
        .robbed
          opacity: 0.75
          background: rgba(0, 0, 0, 0.6)
          position: absolute
          left: 50%
          top: 50%
          width: 15.7vw
          color: #fff
          font-family: $font-family-medium
          font-size: $font-size-12
          text-align: center
          line-height: 15.7vw
          border-radius: 50%
          height: 15.7vw
          margin-left: -7.85vw
          margin-top: -7.85vw
        .goods-img
          display: block
          width: 85px
          height: 85px
          border-radius: 2px
      .good-info
        flex: 1
        overflow: hidden
        padding-left: 13px
        box-sizing: border-box
        layout()
        .top
          layout(row)
          justify-content: space-between
          align-items: center
          width: 100%
          height: 16px
          padding-bottom: 5px
          line-height: 16px
          .title
            flex: 1
            padding-right: 12px
            no-wrap()
            font-family: $font-family-medium
            font-size: $font-size-14
            color: #111111
            height: 16px
            letter-spacing: 0.3px
          .del
            width: 28px
            height: 31px
            layout(row)
            align-items: center
            justify-content: center
            .del-img
              width: 14px
              height: 15.5px
              line-height: 15.5px
        .bot
          width: 100%
          layout(row)
          position: relative
          justify-content: space-between
          .right
            height: 24px
            position: absolute
            right: 0
            bottom: 0
            .number-box
              layout(row)
              align-items: flex-end
              width: 84px
              height: 24px
              background: $color-white
              border-1px()
              box-sizing: border-box
              .add
                width: 24px
                height: 24px
                position: relative
                text-align: center
                line-height: 24px
              .minus
                width: 24px
                height: 24px
                position: relative
                text-align: center
                line-height: 24px
              .num
                font-family: $font-family-medium
                font-size: $font-size-14
                color: #111111
                width: 35px
                height: 24px
                text-align: center
                line-height: 24px
                border-1px()
          .left
            max-width: 34.67vw
            .spec
              font-family: $font-family-regular
              font-size: $font-size-14
              color: #808080
              padding-bottom: 6px
            .remain
              layout(row)
              lin-height: 13px
              height: 13px
              padding-bottom: 7.5px
              .txt
                padding: 0 1.34vw
                font-family: $font-family-regular
                font-size: $font-size-10
                height: 13px
                line-height: 13px
                box-sizing: border-box
                border-radius: 10px
            .price
              layout(row)
              align-items: flex-end
              font-family: $font-family-regular
              .num
                font-family: $font-family-regular
                font-size: $font-size-18
                line-height: $font-size-18
              .unit
                font-size: $font-size-12
                line-height: $font-size-12
                margin:0 2px
              .new-user-img
                width: 31.5px
                height: 15px
    .shop-item-opcta
      .sel-box
        opacity: .5
      .good-info
        .top
          .title
            opacity: .5
        .bot
          opacity: .6

  .without
    widht: 100vw
    padding: 35px 0
    text-align: center
    background: #FFF
    .without-img
      width: 119.5px
      height: 109px
      margin: 0 auto
      margin-bottom: 11px
      .img
        display: block
        width: 100%
        height: 100%
    .txt
      font-family: $font-family-regular
      font-size: $font-size-14
      color: #808080
      line-height: 19px
    .btn
      width: 100px
      height: 32px
      box-sizing: border-box
      margin: 11px auto 0
      font-family: $font-family-regular
      font-size: $font-size-14
      color: $color-white
      line-height: 32px
      text-align: center
      border-radius: 16px


  .recommend
    .title
      height: 60px
      padding-top: 12px
      box-sizing: border-box
      background: #F7F7F7
      display: flex
      align-items: center
      justify-content: center
      .icon
        width: 17px
        height: 17px
        margin-right: 4px
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
</style>
