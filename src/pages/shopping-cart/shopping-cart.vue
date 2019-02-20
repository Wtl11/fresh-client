<template>
  <div class="wrap">
    <navigation-bar title="购物车" :showArrow="false" :translucent="false"></navigation-bar>
    <div class="shop-list">
      <div class="shop-item" :class="{'shop-item-opcta' : item.num <= 0}" v-for="(item, index) in goodsList" :key="index">
        <img class="sel-box" @click.stop="toggelCheck(index)" v-if="imageUrl && !item.checked && item.num > 0" :src="imageUrl+'/yx-image/cart/icon-pick@2x.png'" alt=""/>
        <!--<img class="sel-box" v-if="imageUrl && item.num <= 0" :src="imageUrl+'/yx-image/cart/icon-pick@2x.png'" alt="" />-->
        <div class="sel-box sel-clr-box" v-if="imageUrl && item.num <= 0"></div>
        <img class="sel-box" @click.stop="toggelCheck(index)" v-if="imageUrl && item.checked && item.num > 0" :src="imageUrl+'/yx-image/cart/icon-pick1@2x.png'" alt=""/>
        <div class="goods-image" @click.stop="jumpGoodsDetail(item)">
          <img class="goods-img" mode="aspectFill" :src="item.goods_cover_image" alt="">
          <div class="robbed" v-if="item.num <= 0">已抢完</div>
        </div>
        <div class="good-info">
          <div class="top" @click.stop="jumpGoodsDetail(item)">
            <div class="title">{{item.name}}</div>
            <div class="del" @click.stop="delGoodsInfo(index, item.id)">
              <img class="del-img" v-if="imageUrl" :src="imageUrl + '/yx-image/cart/icon_delete@2x.png'" alt="">
            </div>
          </div>
          <div class="bot">
            <div class="left" @click.stop="jumpGoodsDetail(item)">
              <div class="spec" v-if="item.goods_units">规格：{{item.goods_units}}</div>
              <div class="remain">
                <div class="txt" v-if="item.is_urgency">仅剩{{item.usable_stock}}件</div>
              </div>
              <div class="price" v-if="item.shop_price"><span class="num">{{item.shop_price}}</span>元</div>
            </div>
            <div class="right">
              <div class="number-box">
                <div class="minus" @click.stop="subNum(index, item.num, item.id)">-</div>
                <div class="num">{{item.num}}</div>
                <div class="add" @click.stop="addNum(index, item.num, item.buy_limit, item.id)">+</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!--结算-->
    <div class="payment" v-if="goodsList.length > 0">
      <div class="check-all" @click.stop="toggleCheckAll">
        <img class="sel-box" v-if="imageUrl && allChecked" :src="imageUrl+'/yx-image/cart/icon-pick1@2x.png'" alt=""/>
        <img class="sel-box" v-if="imageUrl && !allChecked" :src="imageUrl+'/yx-image/cart/icon-pick@2x.png'" alt=""/>
        <div class="txt">全选</div>
      </div>
      <div class="payment-content">
        <div class="price">合计 {{totalPrice}}元</div>
        <div class="pay-btn" @click.stop="submitOrder">去结算</div>
      </div>
    </div>
    <!--没有商品-->
    <div class="without" v-if="isShowCart">
      <div class="without-img"><img class="img" v-if="imageUrl" :src="imageUrl+'/yx-image/cart/pic-gwc@2x.png'" alt=""></div>
      <div class="txt">购物车没有商品哦!</div>
      <div class="txt">赶快去挑选吧</div>
      <div class="btn" @click.stop="toChoicenessPage">去逛逛</div>
    </div>
    <confirm-msg ref="msg" :msg="msg" useType="double" @confirm="deleteCartGood"></confirm-msg>
  </div>

</template>

<script type="text/ecmascript-6">
  import WePaint from '@components/we-paint/we-paint'
  import NavigationBar from '@components/navigation-bar/navigation-bar'
  import ConfirmMsg from '@components/confirm-msg/confirm-msg'
  import API from '@api'
  import {orderMethods, cartMethods} from '@state/helpers'

  export default {
    beforeCreate() {
    },
    data() {
      return {
        msg: '确定删除该商品吗?',
        delIndex: 0,
        goodsList: [],
        isShowCart: false,
        deleteInfo: {
          delIndex: null,
          cartId: null
        },
        isShowNum: true,
        deliverAt: ''
      }
    },
    onTabItemTap() {
      this.$isLogin()
    },
    async onShow() {
      if (!wx.getStorageSync('token')) return
      await this._getShopCart()
    },
    computed: {
      checkedGoods() {
        return this.goodsList.filter((item) => item.checked)
      },
      totalPrice() {
        return this.checkedGoods.reduce((total, current) => {
          let money = (total * 1) + (current.shop_price * current.num)
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
      async _getShopCart() {
        let loading = false
        if (this.goodsList.length === 0) {
          loading = true
        } else {
          loading = false
        }
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
        this.deliverAt = res.shelf_delivery_at
        this.setCartCount()
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
        wx.navigateTo({
          url: `/pages/goods-detail?id=${item.sku_id}`
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
        let orderInfo = {
          goodsList: this.checkedGoods,
          total: this.totalPrice,
          deliverAt: this.deliverAt
        }
        this.setOrderInfo(orderInfo)
        wx.navigateTo({url: '/pages/submit-order'})
      },
      toChoicenessPage() {
        wx.switchTab({url: '/pages/choiceness'})
      }
    },
    components: {
      WePaint,
      ConfirmMsg,
      NavigationBar
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
    padding-bottom: 60px

  .payment
    position: fixed
    width: 100%
    height: 50px
    background: $color-white
    left: 0
    padding: 0 3.2vw
    box-sizing: border-box
    bottom: 0
    layout(row)
    justify-content: space-between
    align-items: center
    border-bottom: .5px solid #EEEEEE
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
        font-size: $font-size-18
        color: $color-money
      .pay-btn
        margin-left: 8px
        background: #73C200
        border-radius: 17px
        width: 100px
        height: 34px
        text-align: center
        font-size: $font-size-16
        font-family: $font-family-medium
        line-height: 34px
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
            width: 26.67vw
            .spec
              font-family: $font-family-regular
              font-size: $font-size-14
              color: #808080
              padding-bottom: 6px
            .remain
              layout(row)
              color: $color-money
              lin-height: 13px
              height: 13px
              padding-bottom: 7.5px
              .txt
                padding: 0 1.34vw
                font-family: $font-family-regular
                font-size: $font-size-10
                color: $color-money
                height: 13px
                line-height: 13px
                box-sizing: border-box
                border-1px($color-money, 10px)
                border-radius: 10px
            .price
              font-family: $font-family-regular
              font-size: $font-size-12
              color: $color-money
              line-height: 19px
              .num
                font-family: $font-family-regular
                font-size: $font-size-18
                color: $color-money
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
    margin-top: 146px
    text-align: center
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
      background: #73C200
      border-1px(#73C200, 16px)
      border-radius: 16px

  .test
    background: #fff

</style>
