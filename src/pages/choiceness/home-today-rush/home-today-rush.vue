<template>
  <div class="home-today-rush" v-if="bigItem.module_name === 'activity'">
    <div class="nav-list-border"></div>
    <div class="goods-title-box">
      <div class="goods-title-main">
        <div class="goods-box-icon" :class="'corp-' + corpName + '-label'"></div>
        <div class="goods-title-text">今日抢购</div>
        <div class="goods-title-sub">今日下单 次日提货</div>
        <div class="goods-time-box">
          <img class="goods-time-box-img" mode="aspectFill" v-if="imageUrl && corpName === 'platform'"
               :src="imageUrl + '/yx-image/choiceness/pic-today_bg@2x.png'">
          <img class="goods-time-box-img" mode="aspectFill" v-if="imageUrl && corpName === 'retuan'"
               :src="imageUrl + '/yx-image/retuan/pic-today_bg@2x.png'">
          <div class="goods-text-box">
            <div class="top-text" :class="'corp-' + corpName + '-time'">距结束</div>
            <div class="top-text"  :class="'corp-' + corpName + '-time'">{{activityTime.hour}}:{{activityTime.minute}}:{{activityTime.second}}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="goods-box">
      <div class="goods-list" v-for="(item, index) in goodsList" :key="index" @click="jumpGoodsDetail(item)">
        <div class="goods-left">
          <img class="goods-left-img" mode="aspectFill" v-if="item.goods_cover_image" :src="item.goods_cover_image">
          <img class="goods-left-icon" mode="aspectFill" v-if="imageUrl && corpName === 'platform'"
               :src="imageUrl + '/yx-image/choiceness/icon-label@2x.png'">
          <img class="goods-left-icon" mode="aspectFill" v-if="imageUrl && corpName === 'retuan'"
               :src="imageUrl + '/yx-image/retuan/icon-label@2x.png'">
        </div>
        <div class="goods-right">
          <div class="goods-right-top">
            <div class="title">{{item.name}}</div>
            <div class="text-sub" v-if="item.describe" :class="item.describe ? 'has-title' : ''">{{item.describe}}</div>
            <!--<div class="text-sales-box">-->
            <!--<div class="text-sales">已售{{item.sale_count}}件</div>-->
            <!--</div>-->
          </div>
          <div class="add-box">
            <div class="add-box-left">
              <section class="left">
                <!--<div class="text-group" :class="'corp-' + corpName + '-money'">团购价</div>-->
                <img class="text-group-img" mode="aspectFill" v-if="imageUrl && corpName === 'platform'"
                     :src="imageUrl + '/yx-image/choiceness/pic-price_bg@2x.png'">
                <img class="text-group-img" mode="aspectFill" v-if="imageUrl && corpName === 'retuan'"
                     :src="imageUrl + '/yx-image/retuan/pic-price_rtbg@2x.png'">
              </section>
              <div class="price-box">
                <div class="money" :class="'corp-' + corpName + '-money'">{{item.trade_price}}</div>
                <div class="unit" :class="'corp-' + corpName + '-money'">元</div>
                <div class="lineation">{{item.original_price}}元</div>
              </div>
            </div>
            <div class="right">
              <form action="" report-submit @submit="$getFormId" @click.stop="addShoppingCart(item)">
                <button class="add-box-right" v-if="item.usable_stock * 1 > 0" formType="submit">
                  <div class="add-goods-btn" :class="'corp-' + corpName + '-bg'">
                    <div class="add-icon">
                      <div class="add1"></div>
                      <div class="add2"></div>
                    </div>
                    <div class="add-text">购物车</div>
                  </div>
                </button>
              </form>
              <div class="add-box-right" v-if="item.usable_stock * 1 <= 0" @click.stop>
                <div class="add-goods-btn add-goods-btn-active">
                  <div class="add-text">已抢完</div>
                </div>
              </div>
              <div class="add-text-sales">已售{{item.sale_count}}{{item.goods_units}}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="foot-ties" v-if="goodsMore && goodsList.length !== 0">
      <div class="left lines"></div>
      <div class="center">已经到底了</div>
      <div class="bot lines"></div>
    </div>
    <div class="noting" v-if="isShowActiveEnd">
      <div class="notingimg"><img class="img" :src="imageUrl + '/yx-image/group/pic-kong@2x.png'" alt=""></div>
      <div class="txt">活动即将开始，敬请期待</div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  const COMPONENT_NAME = 'HOME_TODAY_RUSH'

  export default {
    name: COMPONENT_NAME,
    props: {
      bigItem: {
        type: Object,
        default: () => {}
      },
      activityTime: {
        type: Object,
        default: () => {}
      },
      isShowActiveEnd: {
        type: Boolean,
        default: false
      },
      goodsList: {
        type: Array,
        default: () => []
      },
      goodsMore: {
        type: Boolean,
        default: false
      }
    },
    methods: {
      jumpGoodsDetail(item) {
        wx.navigateTo({
          url: `/pages/goods-detail?id=${item.goods_id}&activityId=${item.activity_id}`
        })
      },
      addShoppingCart(item) {
        this.$emit('addShoppingCart', item)
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@designCommon"

  .nav-list-border
    height: 10px
    background: $color-background

  .goods-title-box
    padding: 0 5px
    box-sizing: border-box
    border-bottom-1px($color-line)
    background: $color-background
    .goods-title-main
      layout(row)
      align-items: center
      height: 45px
      background: $color-white
      border-top-left-radius: 8px
      border-top-right-radius: 8px
      box-sizing: border-box
      padding-left: 6px
      overflow: hidden
      position: relative
      .goods-box-icon
        width: 4px
        height: 14px
        margin-right: 6px
      .goods-title-text
        font-size: $font-size-16
        color: $color-text-main
        font-family: $font-family-medium
        margin-right: 6px
      .goods-title-icon
        width: 4px
        height: 4px
        background: $color-money
        margin: 0 5px
        border-radius: 50%
      .goods-title-sub
        font-size: $font-size-13
        color: $color-text-sub
        font-family: $font-family-regular
      .goods-time-box
        position: absolute
        right: 0
        top: 0
        height: 45px
        width: 90px
        overflow: hidden
        z-index: 98
        .goods-time-box-img
          position: absolute
          right: 0
          top: 0
          display: block
          height: 45px
          width: 90px
        .goods-text-box
          position: absolute
          right: 0
          top: 0
          height: 45px
          width: 75px
          layout()
          align-items: center
          justify-content: center
          .top-text
            font-size: $font-size-12
            line-height: $font-size-14
            font-family: $font-family-regular
          .top-text-bottom
            margin-bottom: 3px

  .goods-box
    padding: 0 3.2vw
    box-sizing: border-box
    .goods-list
      height: 40.5vw
      layout(row)
      border-bottom-1px(#e6e6e6)
      align-items: center
      .goods-left
        position: relative
        width: 29.33vw
        height: 29.33vw
        margin-right: 12px
        .goods-left-img
          width: 100%
          height: 100%
          border-radius: 3px
          display: block
        .goods-left-icon
          width: 32px
          height: 32px
          position: absolute
          left: -5px
          top: -5px
          display: block
      .goods-right
        flex: 1
        overflow: hidden
        layout()
        justify-content: space-between
        min-height: 29.33vw
        .title
          padding-top: 3px
          font-size: $font-size-16
          font-family: $font-family-medium
          color: $color-text-main
          line-height: 1
          min-height: $font-size-18
          margin-bottom: 2px
          no-wrap()
        .text-sub
          font-size: $font-size-13
          font-family: $font-family-regular
          color: $color-text-sub
          min-height: $font-size-15
          margin-bottom: 5px
          line-height: $font-size-16
          box-sizing: border-box
        .text-sales-box
          layout(row)
          .text-sales
            font-size: $font-size-10
            font-family: $font-family-regular
            color: $color-text-sub
            margin-bottom: 11px
            border-radius: 10px
            height: 13px
            line-height: 13px
            border-1px($color-text-sub, 10px)
            padding: 0 5px
        .add-box
          layout(row)
          justify-content: space-between
          align-items: center
          .left
            layout(row)
            .text-group
              font-size: $font-size-10
              font-family: $font-family-regular
              height: 13px
              line-height: 13px
              margin-bottom: 3px
              border-radius: 10px
            .text-group-img
              width: 37px
              height: 17px
              display: block
          .price-box
            layout(row)
            align-items: flex-end
            .money
              font-family: $font-family-medium
              font-size: $font-size-20
              line-height: 1
            .unit
              font-family: $font-family-medium
              font-size: $font-size-12
              line-height: 1
              margin-right: 2px
              padding-bottom: 2.5px
            .lineation
              font-family: $font-family-regular
              color: $color-text-assist
              font-size: $font-size-12
              text-decoration line-through
              padding-bottom: 1px
              line-height: 1
          .add-goods-btn
            layout(row)
            width: 75px
            height: 28px
            justify-content: center
            align-items: center
            border-radius: 14px
            .add-text
              font-size: $font-size-14
              font-family: $font-family-regular
              color: #fff
            .add-icon
              width: 11px
              height: 11px
              position: relative
              margin-right: 2px
              .add1
                width: 11px
                height: 1.5px
                background-color: #fff
                position: absolute
                left: 0
                top: 4.5px
                border-radius: 30px
              .add2
                width: 1.5px
                height: 11px
                background-color: #fff
                border-radius: 30px
                position: absolute
                left: 4.5px
                top: 0

          .add-goods-btn-active
            background: #b7b7b7

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

  .noting
    text-align: center
    margin-top: 50px
    .notingimg
      width: 116px
      height: 110px
      margin: 0 auto 15px
      .img
        display: block
        width: 100%
        height: 100%
    .txt
      font-family: $font-family-regular
      font-size: $font-size-14
      color: $color-text-sub

  .txt
    height: 100px

  .has-title
    no-wrap-plus()
  .add-text-sales
    font-size: $font-size-10
    font-family: $font-family-regular
    color: $color-text-sub
    margin-top: 1.5px
    text-align: center
  .add-box-right
    &:after
      border: none
</style>
