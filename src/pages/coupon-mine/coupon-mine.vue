<template>
  <div class="mine-coupon">
    <navigation-bar title="我的优惠券"></navigation-bar>
    <coupon-tab :tabList="tabList" :tabIndex="tabIndex" @change="changeHandle"></coupon-tab>
    <article class="scroll-wrapper">
      <nav class="scroll-item-wrapper"
           :style="'transform: translate3d(' + -tabIndex*100 + '%,0,0)'"
           v-for="(item, index) in tabList" :key="index"
      >
        <ul class="coupon-wrapper">
          <block v-for="(child, idx) in item.dataArray" :key="idx">
            <li class="coupon-item-wrapper">
              <coupon-item :useType="index?'disable':'able'"></coupon-item>
            </li>
          </block>
          <li v-if="item.isShowEmpty" class="empty-wrapper">
            <img class="img" mode="aspectFill" v-if="imageUrl" :src="imageUrl + '/yx-image/2.1/pic-kong@2x.png'">
            <p class="text">空空如也</p>
          </li>
        </ul>
      </nav>
    </article>
  </div>
</template>

<script type="text/ecmascript-6">
  import NavigationBar from '@components/navigation-bar/navigation-bar'
  import CouponTab from './coupon-tab/coupon-tab'
  import CouponItem from './coupon-item/coupon-item'

  const PAGE_NAME = 'MINE_COUPON'

  export default {
    name: PAGE_NAME,
    components: {
      NavigationBar,
      CouponTab,
      CouponItem
    },
    data() {
      return {
        tabList: [
          {text: '可用', number: 0, dataArray: [1, 2, 3], isShowEmpty: false},
          {text: '不可用', number: 0, dataArray: [], isShowEmpty: true}
        ],
        tabIndex: 0
      }
    },
    methods: {
      changeHandle(item, index) {
        this.tabIndex = index
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@designCommon"

  .empty-wrapper
    padding-top :106px
    .img
      display :block
      margin :0 auto
      width :116px
      height :110px
    .text
      padding-top :15px
      font-family: $font-family-regular
      font-size: 14px
      color: $color-text-sub
      text-align: center

  .mine-coupon
    background :$color-background
    min-height :100vh
    .scroll-wrapper
      width :200vw
      layout(row,block,nowrap)
      .scroll-item-wrapper
        flex: 1
        height :500px
        transition :transform 0.3s
        .coupon-wrapper
          padding :15px 12px
          .coupon-item-wrapper
            padding-bottom :10px

</style>
