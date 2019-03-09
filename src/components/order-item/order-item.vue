<template>
  <div class="big-order-box">
    <div class="order-item" v-for="(item, index) in orderList" :key="index">
      <div class="order-header">
        <div class="order-num">{{item.code}}</div>
        <div class="name">{{item.nickname}}</div>
        <div class="phone">{{item.mobile}}</div>
        <div class="order-status" v-if="isShowStatus">{{item.status_text}}</div>
      </div>
      <!--商品信息-->
      <div class="goods-detail" v-if="!item.goods">
        <img :src="item.image_url" class="goods-img" mode="aspectFill">
        <div class="goods-content">
          <div class="goods-title">{{item.goods_name}}</div>
          <div class="goods-money">{{item.price}}<span class="small">元</span></div>
        </div>
        <div class="goods-num-box">x<span class="goods-num">{{item.num}}</span></div>
      </div>
      <!--商品信息-->
      <div class="goods-detail" v-for="(good,idx) in item.goods" :key="idx">
        <img :src="good.image_url" class="goods-img" mode="aspectFill">
        <div class="goods-content">
          <div class="goods-title">{{good.goods_name}}</div>
          <div class="goods-money">{{good.price}}<span class="small">元</span></div>
        </div>
        <div class="goods-num-box">x<span class="goods-num">{{good.num}}</span></div>
      </div>
      <!--审核-->
      <div class="examine" v-if="isShowExamine">
        <p :class="'corp-' + corpName + '-money'">{{item.status_str}}</p>
        <p class="liner"></p>
        <p class="examine-content">{{item.status_describe}}</p>
      </div>
      <div class="order-footer">
        <div class="time">{{item.text || '下单时间'}}：{{item.created_at}}</div>
        <!--item.btn_text格式化功能按钮-->
        <div class="footer-btn" :class="[item.disable ? 'footer-btn-disable' : '' , 'corp-' + corpName + '-tab']" @click="_dealOrder(index, item)" v-if="item.isShowBtn">{{item.btn_text}}</div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  const COMPONENT_NAME = 'ORDER_ITEM'

  export default {
    name: COMPONENT_NAME,
    props: {
      orderList: { // 订单数组
        type: Array,
        default: []
      },
      isShowStatus: { // 是否展示订单状态
        type: Boolean,
        default: true
      },
      isShowExamine: { // 是否展示审核内容
        type: Boolean,
        default: true
      }
    },
    data() {
      return {}
    },
    watch: {
      orderList(news) {
      }
    },
    methods: {
      _dealOrder(index, item) {
        this.$emit('dealOrder', index, item)
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
 @import "~@designCommon"
  .big-order-box
    background: $color-background

  .order-item
    margin-bottom: 12px
    background: $color-white
    width: 100%

  .order-header
    box-sizing: border-box
    padding: 0 12px
    display: flex
    align-items: center
    height: 45px
    border-bottom-1px($color-line)
    .order-num
      background: #9F9F9F
      font-size: $font-size-14
      color: $color-white
      font-family: $font-family-medium
      text-align: center
      line-height: 22px
      border-radius: 11px
      min-width: 22px
      height: 22px
    .name
      line-height: 1.2
      no-wrap()
      margin-left: 7px
      font-size: $font-size-14
      color: $color-text-main
      font-family: $font-family-medium
      max-width: 70px
    .phone
      margin-left: 6px
      font-size: $font-size-14
      color: $color-text-main
      font-family: $font-family-medium
    .order-status
      col-center()
      right: 12px
      font-size: $font-size-14
      color: $color-money
      font-family: $font-family-medium

  .goods-detail
    display: flex
    width: 93.6%
    background: #FAFAFA
    margin: 12px auto
    padding: 10px
    box-sizing: border-box
    position: relative
    .goods-img
      background: $color-white
      min-width: 60px
      min-height: 60px
      height: 60px
      width: 60px
    .goods-content
      margin-left: 10px
      width: 79%
      display: flex
      flex-direction: column
      justify-content: space-between
      height: 60px
      font-family: $font-family-regular
      .goods-title
        min-height: 15px
        font-size: $font-size-14
        color: $color-text-main
        no-wrap()
      .goods-money
        height: 14px
        margin-top: 13px
        font-size: $font-size-14
        color: $color-text-main
        .small
          font-size: $font-size-11
          margin-left: 1.5px
    .goods-num-box
      font-size: $font-size-12
      position: absolute
      bottom: 8px
      right: 10px
      .goods-num
        margin-left: 1.5px
        font-size: $font-size-16

  .examine
    padding: 0 12px
    box-sizing: border-box
    display: flex
    align-items: center
    font-size: $font-size-14
    font-family: $font-family-regular
    background: #FAFAFA
    height: 32px
    .liner
      width: 1px
      height: 13px
      background: $color-text-sub
      transform: scaleX(0.5)
      margin: 0 6px

  .order-footer
    border-top-1px($color-line)
    margin-top: 12px
    display: flex
    box-sizing: border-box
    padding: 0 12px
    font-size: $font-size-14
    font-family: $font-family-regular
    height: 55px
    align-items: center
    justify-content: space-between
    .time
      color: $color-text-sub
    .footer-btn
      font-size: $font-size-12
      box-sizing: border-box
      height: 25px
      line-height: 25px
      border-radius: 15px
      min-width: 70px
      text-align: center
    .footer-btn-disable
      color: #808080
      border-color: #B7B7B7
</style>
