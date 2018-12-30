<template>
  <div class="data-overview">
    <navigation-bar title="数据统计"></navigation-bar>
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
    <div class="data-box">
      <div class="data-box-title">佣金收益(元)</div>
      <div class="data-box-number">820.00</div>
      <div class="data-box-time">
        <div class="time-text">较前7日</div>
        <div class="time-number">20%</div>
        <div class="time-img">
          <img src="" alt="" class="icon-img"  v-if="imageUrl" :src="imageUrl + '/yx-image/wallet/icon-decline@2x.png'">
        </div>
      </div>
      <div class="data-list-box">
        <ul class="data-list">
          <li class="list-item">
            <div class="title">支付客户(人)</div>
            <div class="number">506</div>
            <div class="percentage">
              <div class="percentage-text">20%</div>
              <div class="percentage-img">
                <img src="" alt="" class="icon-img"  v-if="imageUrl" :src="imageUrl + '/yx-image/wallet/icon-decline@2x.png'">
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <div class="charts-box">
      <div class="charts-title">
        <div class="text">佣金收益</div>
        <div class="icon">
          <img src="" alt="" class="icon-img"  v-if="imageUrl" :src="imageUrl + '/yx-image/wallet/icon-question@2x.png'">
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import NavigationBar from '@components/navigation-bar/navigation-bar'

  const PAGE_NAME = 'DATA_OVERVIEW'
  const NAVLIST = [{text: '昨日', stats: 0}, {text: '近7日', stats: 1}, {text: '近30日', stats: 2}, {text: '近90日', stats: 3}]

  export default {
    name: PAGE_NAME,
    data() {
      return {
        navIndex: 0,
        navList: NAVLIST
      }
    },
    components: {
      NavigationBar
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

  .data-overview
    width: 100%
    min-height: 100vh
    background: $color-background
  .income-nav
    height: 40px
    padding: 0 20px
    margin-bottom: 10px
    background: $color-white
    .income-nav-box
      layout(row)
      position: relative
      align-items: center
      width: 100%
      height: 40px
      .item-nav
        width: 25%
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
          width: 25%
          height: 100%
          transition: all 0.3s
          .line
            width: 30px
            height: 100%
            background: $color-main
            border-radius: 1.5px
            margin: auto
  .data-box
    background: $color-white
    padding: 25px 0
    margin-bottom: 10px
  .data-box-title
    font-size: $font-size-12
    font-family: $font-family-regular
    color: $color-text-sub
    text-align: center
    margin-bottom: 9px
  .data-box-number
    font-size: 34px
    font-family: $font-family-regular
    color: $color-text-main
    text-align: center
    min-height: 34px
    margin-bottom: 9px
  .data-box-time
    layout(row)
    align-items: center
    justify-content: center
    margin-bottom: 40px
    .time-text
      font-size: $font-size-12
      font-family: $font-family-regular
      color: $color-text-sub
      margin-right: 10px
    .time-number
      font-size: $font-size-12
      font-family: $font-family-regular
      color: #171F24
      margin-right: 4px
    .time-img
      width: 10px
      height: 10px
      img
        width: 100%
        height: 100%
        display: block
  .data-list-box
    padding: 0 15px
    box-sizing: border-box
    .data-list
      width: 100%
      layout(row)
      .list-item
        width: 33.33%
        .title
          text-align: center
          font-size: $font-size-12
          font-family: $font-family-regular
          color: $color-text-sub
          margin-bottom: 10px
        .number
          text-align: center
          font-size: $font-size-20
          font-family: $font-family-regular
          color: $color-text-main
          margin-bottom: 10px
        .percentage
          layout(row)
          justify-content: center
          align-items: center
          .percentage-text
            font-size: $font-size-12
            font-family: $font-family-regular
            color: #171F24
            margin-right: 4px
          .percentage-img
            width: 10px
            height: 10px
            img
              width: 100%
              height: 100%
              display: block
  .charts-box
    height: 230px
    background: $color-white
    margin-bottom: 10px
    .charts-title
      layout(row)
      align-items: center
      padding: 17px 0 0 15px
      .text
        font-size: $font-size-16
        font-family: $font-family-medium
        color: $color-text-main
        margin-right: 5px
      .icon
        width: 13px
        height: 13px
        img
          width: 100%
          height: 100%
          display: block
  .w
    width: 1px
</style>
