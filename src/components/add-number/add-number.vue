<template>
  <form action="" report-submit @submit="$getFormId">
  <div class="link-group">
    <scroll-view scroll-y class="link-box" v-show="linkShow" @touchmove.prevent="" @click.stop="hideLink"></scroll-view>
    <div class="link-bottom" :class="linkShow ? 'show' : ''">
      <div class="goods-info">
        <div class="goods-info-left">
          <img v-if="msgDetail.goods_cover_image" :src="msgDetail.goods_cover_image" class="item-img"  mode="aspectFill">
        </div>
        <div class="goods-info-right">
          <div class="title">{{msgDetail.name}}</div>
          <div class="order-price-box">
            <div class="price-small">{{tradePrice}}</div>
            <div class="price-icon">元</div>
            <div class="price-line">{{msgDetail.original_price}}元</div>
          </div>
        </div>
      </div>
      <div class="order-num-box">
        <div class="num-title">数量</div>
        <div class="num-btn-box1">
          <button class="left" @click.stop="subNum" formType="submit">
            <div class="cut" :class="showOrderNum ? 'cut1' : ''"></div>
          </button>
          <div class="count ">{{orderNum}}</div>
          <button class="right" @click.stop="addNum" formType="submit">
            <div class="add1"></div>
            <div class="add2"></div>
          </button>
        </div>
      </div>
      <div class="price-box">
        <div class="order-price-box-left">价格</div>
        <div class="order-price-box-right">
          <div class="number" :class="'corp-' + corpName + '-money'">{{orderTotal}}</div>
          <div class="icon" :class="'corp-' + corpName + '-money'">元</div>
        </div>
      </div>
      <form class="lost" action="" report-submit @submit="$getFormId">
        <button class="subimit-btn" :class="'corp-' + corpName + '-bg'" formType="submit"  @click="comfirmNumer">确定</button>
      </form>
    </div>
  </div>
  </form>
</template>

<script type="text/ecmascript-6">
  const COMPONENT_NAME = 'ADD_NUMBER'

  export default {
    name: COMPONENT_NAME,
    props: {
      msgDetail: {
        type: Object,
        default: ''
      },
      msgDetailInfo: {
        type: Object,
        default: ''
      }
    },
    data() {
      return {
        showOrderNum: true,
        linkShow: false,
        orderNum: 1,
        currentType: ''
      }
    },
    computed: {
      tradePrice() {
        return this.msgDetail[this.currentType || 'trade_price'] || ''
      },
      orderTotal() {
        return (this.tradePrice * this.orderNum).toFixed(2)
      }
    },
    methods: {
      hideLink() {
        this.linkShow = false
        this.currentType = ''
        this.orderNum = 1
        this.showOrderNum = true
        this.$emit('hide')
      },
      showLink(type = '') {
        if (typeof type === 'string' && type) {
          this.currentType = type
        }
        this.linkShow = true
        this.orderNum = 1
      },
      addNum() {
        if (this.orderNum > 0) {
          this.showOrderNum = false
        }
        // 团购单买
        if (this.currentType === 'goods_sale_price') {
          if (this.orderNum >= this.msgDetail.base_usable_stock) {
            this.$wechat.showToast(`该商品库存不足`)
            return
          }
          this.orderNum++
          return
        }
        // 显示抢购限购数量
        let limitAll = +this.msgDetailInfo.person_all_buy_limit
        let buyAll = +this.msgDetailInfo.person_all_buy_count
        if (limitAll !== -1 && this.orderNum + buyAll + 1 > limitAll) {
          this.$wechat.showToast(`该商品限购${this.msgDetailInfo.person_all_buy_limit}件，您不能再购买了`)
          return
        }
        let number = this.msgDetailInfo.person_day_buy_limit - this.msgDetailInfo.person_day_buy_count
        if (this.orderNum >= number && this.msgDetailInfo.person_day_buy_limit * 1 !== -1) {
          this.$wechat.showToast(`该商品限购${this.msgDetailInfo.person_day_buy_limit}件，您不能再购买了`)
          return
        }
        if (this.orderNum >= this.msgDetail.usable_stock) {
          this.$wechat.showToast(`该商品库存不足`)
          return
        }
        this.orderNum++
      },
      subNum() {
        if (this.orderNum > 1) {
          this.orderNum--
        }
        if (this.orderNum <= 1) {
          this.showOrderNum = true
        }
      },
      comfirmNumer() {
        this.$emit('comfirmNumer', this.orderNum, this.currentType)
        this.hideLink()
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
 @import "~@designCommon"
  .link-box
    position: fixed
    left: 0
    top: 0
    bottom: 0
    right: 0
    z-index: 100
    background: rgba(17, 17, 17, 0.7)
  .link-bottom
    position: fixed
    bottom: -130%
    left: 0
    background: #fff
    width:100%
    z-index: 150
    padding: 0 3.2vw 3.8vw
    transition: all .5s
    box-sizing: border-box
    .goods-info
      layout(row)
      height: 26.7vw
      border-bottom-1px(#e6e6e6)
      .goods-info-left
        width: 26.7vw
        height: 26.7vw
        margin-right: 4vw
        position: relative
        top: -6.9vw
        img
          width: 100%
          height: 100%
          display: block
          border-radius: 2px
      .goods-info-right
        padding-top: 4vw
        flex: 1
        overflow: hidden
        .title
          font-size: $font-size-16
          color: $color-text-main
          font-family: $font-family-medium
          line-height: 1
          min-height: $font-size-18
          width: 220px
          no-wrap()
          margin-bottom: 20px
        .order-price-box
          layout(row)
          align-items: flex-end
          .price-small
            font-size: $font-size-20
            color: #000
            font-family: $font-family-medium
          .price-icon
            font-size: $font-size-12
            color: #000
            font-family: $font-family-medium
            padding-bottom: 2px
            margin-right: 4.5px
          .price-line
            font-size: $font-size-12
            color: $color-text-assist
            font-family: $font-family-medium
            padding-bottom: 2px
            text-decoration: line-through
  .order-num-box
    min-height: 20px
    display: flex
    box-sizing: border-box
    justify-content: space-between
    align-items: center
    padding: 26px 0
    .num-title
      font-family: $font-family-regular
      font-size: $font-size-16
      color: $color-text-main
      width: 75px
    .num-btn-box1
      width: 123px
      height: 32px
      border-radius: 4px
      border-1px(#EEEEEE, 4px, solid, 2px)
      layout(row)
      .left, .right
        width: 35px
        height: 100%
        color: #919191
        font-size: $font-size-14
        layout(row)
        justify-content: center
        align-items: center
        .cut
          width: 10px
          height: 1.5px
          background: #625E61
        .cut1
          background: #D1D1D1
      .right
        .add1
          width: 11px
          height: 1.5px
          background-color: #625E61
        .add2
          width: 1.5px
          height: 10px
          background-color: #625E61
          transform: translateX(-6px)
      .count
        width: 48px
        height: 32px
        line-height: 34.5px
        text-align: center
        border-left: 1px solid $color-white
        border-right: 1px solid $color-white
        font-family: PingFangSC-Medium
        font-size: $font-size-14
      .left
        border-right: 1px solid #eee
      .right
        border-left: 1px solid #eee
  .price-box
    layout(row)
    align-items: center
    justify-content: space-between
    padding: 10px 0 50px
    .order-price-box-left
      font-family: $font-family-regular
      font-size: $font-size-16
      color: $color-text-main
    .order-price-box-right
      layout(row)
      align-items: flex-end
      .number
        font-family: $font-family-medium
        font-size: $font-size-20
        line-height: 1
      .icon
        position :relative
        padding-left :2px
        top:1px
        font-family: $font-family-medium
        font-size: $font-size-12
  .subimit-btn
    width: 100%
    height: 50px
    line-height: 50px
    color: #fff
    border-radius: 50px
    &:after
      border: none
  .show
    bottom: 0
</style>
