<template>
  <div class="income-record">
    <navigation-bar title="收支记录"></navigation-bar>
    <div class="income-nav">
      <div class="income-nav-box">
        <div class="item-nav" v-for="(item, index) in navList" v-bind:key="index" @click="clickNav(item)" :class="{'item-nav-active': navIndex === index}">{{item.text}}</div>
        <div class="nav-line-box">
          <div class="nav-line" :style="{'transform': ' translateX('+ (navIndex * 100) +'%)'}">
            <div class="line"></div>
          </div>
        </div>
      </div>
    </div>
    <div class="income-money-box">
      <div class="income-number">￥2000.00</div>
      <div class="income-icon">
        <img class="jump-question" mode="aspectFill" v-if="imageUrl" :src="imageUrl + '/yx-image/wallet/icon-question@2x.png'">
      </div>
    </div>
    <div class="big-box">
      <div class="income-big-box"  :style="{'transform': ' translateX('+ -(navIndex * 100) +'vw)'}">
        <div class="await-income">
          <wallet-info></wallet-info>
        </div>
        <div class="await-income">
          <wallet-info></wallet-info>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import NavigationBar from '@components/navigation-bar/navigation-bar'
  import WalletInfo from '@components/wallet-info/wallet-info'

  const PAGE_NAME = 'INCOME_RECORD'
  const NAVLIST = [{text: '已入账', stats: 0}, {text: '待入账', stats: 1}]

  export default {
    name: PAGE_NAME,
    data() {
      return {
        navIndex: 0,
        navList: NAVLIST
      }
    },
    components: {
      NavigationBar,
      WalletInfo
    },
    methods: {
      clickNav(item) {
        this.navIndex = item.stats
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"

  .income-record
    width: 100%
  .income-nav
    border-bottom-1px($color-line)
    height: 40px
    padding: 0 50px
    .income-nav-box
      layout(row)
      position: relative
      align-items: center
      width: 100%
      height: 40px
      .item-nav
        width: 50%
        height: 100%
        font-size: $font-size-15
        font-family: $font-family-regular
        color: $color-text-sub
        text-align: center
        line-height: 40px
      .item-nav-active
        font-size: $font-size-16
        font-family: $font-family-medium
        color: $color-text-main
        transition: all 0.3s
      .nav-line-box
        position: absolute
        bottom: 1px
        left: 0
        height: 3px
        width: 100%
        .nav-line
          width: 50%
          height: 100%
          transition: all 0.3s
          .line
            width: 30px
            height: 100%
            background: $color-main
            border-radius: 1.5px
            margin: auto
  .income-money-box
    height: 70px
    background: #fafafa
    layout(row)
    align-items: center
    justify-content: center
    .income-number
      font-size: $font-size-20
      font-family: $font-family-regular
      color: $color-text-main
      margin-right: 10px
    .jump-question
      width: 13px
      height: 13px
      display: block
      position: relative
      top: -5px
  .big-box
    width: 100vw
    overflow: hidden
    .income-big-box
      width: 200vw
      display: flex
      transform: translateX(0)
      transition: all 0.3s
      .await-income
        width: 100vw
        padding-left: 15px
        box-sizing: border-box
  .z
    width: 1px
</style>
