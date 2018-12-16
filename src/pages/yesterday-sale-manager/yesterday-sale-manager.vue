<template>
  <div class="after-sale-management">
    <navigation-bar title="消费者订单"></navigation-bar>
    <div class="after-header">
      <div class="after-search">
        <img :src="imageUrl + '/yx-image/group/icon-search@2x.png'" v-if="imageUrl" class="search-icon">
        <input type="text" class="search" placeholder="提供单号，手机号，微信昵称，搜索" placeholder-class="search-pal"/>
      </div>
      <div class="rag-goods-tab">
        <span :class="{'rag-goods-tab-item-active': navIndex === index}" class="rag-goods-tab-item" v-for="(item, index) in nav" :key="index" @click="_setNav(index, item)">
          {{item.title}}
        </span>
      </div>
    </div>
    <scroll-view class="big-box">
      <div class="order-big-box" :style="{'transform': ' translateX('+ -(navIndex * width) +'px)'}">
        <!--今日订单-->
        <div class="order-box">
          <order-item></order-item>
        </div>
        <!--昨日订单-->
        <div class="order-box">
          <order-item></order-item>
        </div>
        <!--全部订单-->
        <div class="order-box">
          <order-item></order-item>
        </div>
      </div>
    </scroll-view>
    <div class="end">— 没有订单了—</div>
  </div>
</template>

<script type="text/ecmascript-6">
  import NavigationBar from '@components/navigation-bar/navigation-bar'
  import OrderItem from '@components/order-item/order-item'

  const Nav = [{title: '今日订单', status: 2}, {title: '昨日订单', status: 3}, {title: '全部订单', status: 3}]
  const PAGE_NAME = 'AFTER_SALE_MANAGEMENT'

  export default {
    name: PAGE_NAME,
    data() {
      return {
        nav: Nav,
        navIndex: 0,
        width: 0
      }
    },
    onLoad() {
      this.$wx.getSystemInfo({
        success: (res) => {
          this.width = res.screenWidth
        }
      })
    },
    methods: {
      _setNav(index, item) {
        this.navIndex = index
      }
    },
    components: {
      NavigationBar,
      OrderItem
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"

  .after-sale-management
    height: 100vh
    background: $color-background
    width: 100vw

  .after-header
    padding: 15px 0 12px
    box-sizing: border-box
    margin-bottom: 10px
    height: 107px
    background: $color-white
    .after-search
      background: #F4F4F4
      height: 35px
      display: flex
      align-items: center
      width: 92vw
      margin: 0 auto
      padding: 0 12px
      box-sizing: border-box
      .search-icon
        height: 16.5px
        width: 15px
      .search
        height: 100%
        margin-left: 10px
        font-size: $font-size-14
        font-family: $font-family-regular
        flex: 1
      .search-pal
        font-family: $font-family-regular
        color: $color-text-assist
    .rag-goods-tab
      width: 264px
      margin: 12px auto 0
      display: flex
      overflow: hidden
      margin-bottom: 11.5px
      .rag-goods-tab-item
        width: 88px
        font-size: $font-size-14
        font-family: $font-family-medium
        text-align: center
        line-height: 31px
        height: 33px
        color: $color-main
        border: 1px solid $color-main
        transition: all 0.4s
        box-sizing: border-box
        &:first-child
          border-right: none
          border-radius: 50px 0px 0px 50px
        &:last-child
          border-left: none
          border-radius: 0px 50px 50px 0px
      .rag-goods-tab-item-active
        transform-origin: 50%
        background: $color-main
        color: $color-white

  .big-box
    width: 100vw
    overflow: hidden
    .order-big-box
      width: 200vw
      display: flex
      transform: translateX(0)
      transition: all 0.3s
    .order-box
      width: 100vw

</style>
