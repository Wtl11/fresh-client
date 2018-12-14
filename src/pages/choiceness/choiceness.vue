<template>
  <div class="choiceness">
    <div class="choiceness-top">
      <div class="choiceness-bgimg">
        <img class="bgimg-url" mode="aspectFill" v-if="imageUrl" :src="imageUrl + '/yx-image/choiceness/pic-bg@2x.png'">
      </div>
      <div class="group-info">
        <div class="info-box">
          <div class="info-shop-name">赞播优鲜</div>
          <div class="info-box-top">
            <div class="left-info">
              <div class="left-info-user"></div>
              <div class="name-box">
                <div class="name-text">刘娇娇</div>
                <div class="address-box">
                  <div class="address-icon">
                    <img v-if="imageUrl" :src="imageUrl + '/yx-image/choiceness/icon-address_small@2x.png'">
                  </div>
                  <div class="address-text">海珠区新港东</div>
                </div>
              </div>
            </div>
            <div class="right-info" @click="linkGroup">联系团长</div>
          </div>
          <div class="info-box-bottom">公告：今天下雨，大家17:00可以取货</div>
        </div>
      </div>
    </div>
    <div class="banner-box">
      <swiper class="banner" :current="praiseIndex" autoplay interval="5000" circular @change="_setPraiseIndex">
        <block v-for="(item,index) in [1,2,3,4,5]" :key="index">
          <swiper-item class="banner-item">
            <img class="item-img" mode="aspectFill" v-if="imageUrl" :src="imageUrl + '/yx-image/choiceness/pic-bg@2x.png'">
          </swiper-item>
        </block>
      </swiper>
      <div class="dots">
        <div class="dots-item" :class="{'dots-item-active': praiseIndex === idx}" v-for="(item,idx) in [1,2,3,4,5]" :key="idx" v-if="[1,2,3,4,5].length > 1"></div>
      </div>
    </div>
    <div class="select-tab">
      <div class="select-box">
        <div class="select-list" v-for="(item, index) in selectTab" :key="index" :class="tabIdx * 1 === index ? 'cur-item' : ''" @click="selectIndex(index)">{{item.text}}</div>
        <div class="select-bg">
          <div class="cur-select-bg" :style="'transform: translate(' + tabIdx*100 + '%,0)'"></div>
        </div>
      </div>
    </div>
    <div class="goods-box">
      <div class="goods-list">
        <div class="goods-left">
          <div class="goods-left-img"></div>
          <div class="goods-left-icon">
            <img class="item-img" mode="aspectFill" v-if="imageUrl" :src="imageUrl + '/yx-image/choiceness/icon-label@2x.png'">
          </div>
        </div>
        <div class="goods-right">
          <div class="title">超值特惠 4斤新鲜柠檬4斤新鲜柠檬4斤新鲜柠檬</div>
          <div class="text-sub">超值特惠 4斤新鲜柠檬4斤新鲜柠檬4斤新鲜柠檬</div>
          <div class="text-sales-box">
            <div class="text-sales">已售3303斤</div>
          </div>
          <div class="add-box">
            <div class="add-box-left">
              <section class="left">
                <div class="text-group">团购价</div>
              </section>
              <div class="price-box">
                <div class="money">3.8</div>
                <div class="unit">元</div>
                <div class="lineation">12元</div>
              </div>
            </div>
            <div class="add-box-right">
              <div class="add-goods-btn">+购物车</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="foot-ties">
      <div class="left lines"></div>
      <div class="center">已经到底了</div>
      <div class="bot lines"></div>
    </div>
    <link-group ref="groupComponents" phoneTxt="678910" wechatTxt="eleven丶"></link-group>
  </div>
</template>

<script type="text/ecmascript-6">
  import LinkGroup from '@components/link-group/link-group'
  const PAGE_NAME = 'CHOICENESS'
  const SELECTTAB = [{text: '限时尝鲜'}, {text: '精选菜篮'}, {text: '水果'}, {text: '粮油'}, {text: '百货'}]
  export default {
    name: PAGE_NAME,
    data() {
      return {
        praiseIndex: 0,
        selectTab: SELECTTAB,
        tabIdx: 0
      }
    },
    methods: {
      _setPraiseIndex(e) { // 设置集赞活动index
        this.praiseIndex = e.target.current
      },
      selectIndex(index) {
        this.tabIdx = index
      },
      linkGroup() {
        this.$refs.groupComponents.showLink()
      }
    },
    components: {
      LinkGroup
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"
  .choiceness
    width: 100%
    min-height: 100vh
    background: $color-background
  .choiceness-top
    position: relative
    padding-top: 17vw
    margin-bottom: 11px
    .group-info
      padding: 0 3.2vw
      box-sizing: border-box
      position: relative
      z-index: 11
      .info-box
        layout()
        justify-content: center
        height: 100px
        background: #fff
        border-radius: 6px
        box-shadow: 0 3px 10px 0 rgba(17,17,17,0.06)
        padding: 0 2.7vw
        box-sizing: border-box
        position: relative
        .info-shop-name
          position: absolute
          left: 0
          color: #fff
          font-family: 'PingFang-SC-Heavy'
          font-size: $font-size-22
          top: -9.3vw
          z-index: 11
        .info-box-top
          layout(row)
          align-items: center
          width: 100%
          justify-content: space-between
          padding-bottom: 8px
          border-bottom-1px(#E6E6E6)
          .left-info
            layout(row)
            align-items: center
            .left-info-user
              width: 13.3vw
              height: 13.3vw
              margin-right: 9px
              background: $color-main
              border-radius: 50%
              img
                width: 100%
                height: 100%
                display: block
            .name-text
              height: $font-size-16
              font-size: $font-size-16
              font-family: $font-family-medium
              color: $color-text-main
              margin-bottom: 8.5px
            .address-box
              layout(row)
              align-items: center
              .address-icon
                width: 8.5px
                height: 10px
                margin-right: 3px
                img
                  display: block
                  width: 100%
                  height: 100%
              .address-text
                font-size: $font-size-13
                font-family: $font-family-regular
                color: $color-text-sub
          .right-info
            width: 20vw
            height: 28px
            line-height: 28px
            font-size: $font-size-14
            font-family: $font-family-regular
            color: $color-main
            border-1px($color-main, 15px)
            text-align: center
        .info-box-bottom
          text-align: left
          width: 100%
          margin-top: 9px
          font-size: $font-size-12
          font-family: $font-family-regular
          color: $color-text-sub


    .choiceness-bgimg
      width: 100%
      height: 23.5vw
      position: absolute
      left: 0
      top: 0
      .bgimg-url
        width: 100%
        height: 100%
  .banner-box
    padding: 0 3.2vw
    box-sizing: border-box
    position: relative
    height: 40vw
    margin-bottom: 13px
    .banner
      width: 100%
      height: 100%
      border-radius: 6px
      overflow: hidden
      .banner-item
        width: 100%
        height: 100%
        position: relative
        .item-img
          width: 100%
          height: 100%
    .dots
      position: absolute
      bottom: 12px
      row-center()
      display: flex
      .dots-item
        width: 3px
        height: 3px
        border-radius: 3px
        margin: 0 2.5px
        background: #fff
        transition: all .0 .3s
      .dots-item-active
        width: 10px
        background: #fff

  .select-tab
    padding: 0 3.2vw
    box-sizing: border-box
    position: relative
    background: $color-background
    .select-box
      height: 35px
      width: 100%
      layout(row)
      align-items: center
      border-bottom: 2px solid $color-main
      position: relative
      .select-list
        position: relative
        z-index: 11
        font-size: $font-size-14
        font-family: $font-family-medium
        color: $color-text-main
        width: 20%
        text-align: center
        height: 33pxpx
        line-height: 33
        transition: all 0.3s
      .cur-item
        color: #fff
      .select-bg
        width: 100%
        height: 100%
        position: absolute
        .cur-select-bg
          width: 20%
          height: 100%
          background: $color-main
          transform: translate(0, 0)
          transition: all 0.3s
          border-top-left-radius: 6px
          border-top-right-radius: 6px
  .goods-box
    padding: 0 3.2vw
    box-sizing: border-box
    .goods-list
      height: 40.5vw
      layout(row)
      align-items: center
      .goods-left
        margin-left: 5px
        background: $color-text-main
        position: relative
        width: 32vw
        height: 32vw
        margin-right: 12px
        .goods-left-img
          width: 100%
          height: 100%
          border-radius: 3px
        .goods-left-icon
          width: 32px
          height: 32px
          position: absolute
          left: -5px
          top: -5px
          img
            display: block
            width: 100%
            height: 100%
      .goods-right
        flex: 1
        overflow: hidden
        .title
          font-size: $font-size-16
          font-family: $font-family-medium
          color: $color-text-main
          line-height: 1
          min-height: $font-size-16
          margin-bottom: 7px
          no-wrap()
        .text-sub
          font-size: $font-size-14
          font-family: $font-family-regular
          color: $color-text-sub
          line-height: 1
          min-height: $font-size-16
          margin-bottom: 9px
          no-wrap()
          padding-right: 10px
          box-sizing: border-box
        .text-sales-box
          layout(row)
          .text-sales
            font-size: $font-size-10
            font-family: $font-family-regular
            color: $color-text-sub
            margin-bottom: 11px
            border-radius: 10px
            border-1px($color-text-sub, 10px)
            padding: 2px 5px 1px
        .add-box
          layout(row)
          justify-content: space-between
          align-items: center
          .left
            layout(row)
            .text-group
              font-size: $font-size-10
              font-family: $font-family-regular
              color: $color-money
              min-height: $font-size-16
              margin-bottom: 6px
              border-radius: 10px
              background: rgba(255,131,0,0.10)
              border-1px(#FF8300, 10px)
              padding: 1px 8px 0
          .price-box
            layout(row)
            align-items: flex-end
            .money
              font-family: $font-family-medium
              color: $color-money
              font-size: $font-size-20
              line-height:1
            .unit
              font-family: $font-family-medium
              color: $color-money
              font-size: $font-size-12
              line-height:1
              margin-right: 2px
            .lineation
              font-family: $font-family-regular
              color: $color-text-assist
              font-size: $font-size-12
              text-decoration line-through
              line-height:1
          .add-goods-btn
            width: 20vw
            height: 26px
            line-height: 26px
            font-size: $font-size-14
            font-family: $font-family-regular
            color: #fff
            background: $color-main
            text-align: center
            border-radius: 14px
  .foot-ties
    layout(row)
    justify-content: center
    align-items: center
    height: 60px
    box-sizing: border-box
    padding-top: 25px
    padding-bottom: 20px
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

</style>
