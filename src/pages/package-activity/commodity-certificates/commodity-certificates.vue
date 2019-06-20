<template>
  <div class="commodity-certificates">
    <navigation-bar title="商品券"></navigation-bar>
    <div class="coupon">
      <div v-for="(item, index) in couponList" :key="index" class="coupon-item" @click="selectCoupon(item)">
        <section class="top-wrapper">
          <img class="top-bg-img" v-if="imageUrl" :src="imageUrl + '/yx-image/invitation/pic-couponbg_myzk1.png'">
          <div class="top-container">
            <artilce class="left">
              <div class="goods-box">
                <img v-if="imageUrl && item.other_info" :src="item.other_info.goods_cover_image" class="goods-img" mode="aspectFill">
                <span class="goods-price">{{item.denomination ? item.denomination + '元' : ''}}</span>
              </div>
            </artilce>
            <article class="right">
              <div class="title">
                <!--<p class="use-type" :style="{color, borderColor: color}">{{item.range_type_str}}</p>-->
                <p class="txt" :style="{color}">{{item.coupon_name}}</p>
              </div>
              <p class="condition" :style="{color}">有效期至 {{item.end_at}}</p>
              <img class="lab-img" v-if="imageUrl && status === 2" :src="imageUrl + '/yx-image/2.3/pic-coupon_ygq.png'">
              <img class="lab-img" v-if="imageUrl && status === 0" :src="imageUrl + '/yx-image/2.3/pic-coupon_ysy.png'">
            </article>
          </div>
        </section>
        <section class="middle-wrapper">
          <img class="middle-bg-img" v-if="imageUrl" :src="imageUrl + '/yx-image/2.3/pic-couponbg_myzk2.png'">
          <div class="middle-container">
            <div class="middle-box">
              <aritlce class="title" :style="{color}" @click.stop="handleShowTip(index)">
                <p>使用说明</p>
                <img class="down-img" :class="{'rotate': item.showTip}" mode="widthFix" v-if="imageUrl" :src="imageUrl + '/yx-image/2.3/icon-pressed_down@2x.png'">
              </aritlce>
              <div class="middle-detail" @click.stop="goGoodsDetail(item)">
                <span class="middle-detail-text">查看此商品</span>
                <img class="detail-img" mode="widthFix" v-if="imageUrl" :src="imageUrl + '/yx-image/invitation/icon-coupon_down@2x.png'">
              </div>
            </div>
            <p v-if="item.showTip" class="explain">{{item.description}}</p>
          </div>
        </section>
        <section class="bottom-wrapper">
          <img class="bottom-bg-img" v-if="imageUrl" :src="imageUrl + '/yx-image/2.3/pic-couponbg_myzk3.png'">
        </section>
      </div>
      <is-active-empty v-if="isShowEmpty"></is-active-empty>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import NavigationBar from '@components/navigation-bar/navigation-bar'
  import isActiveEmpty from '@components/is-active-empty/is-active-empty'
  // import Coupon from './coupon'
  import { isEmptyObject } from '@utils/common'
  import { orderComputed, orderMethods } from '@state/helpers'
  import API from '@api'

  const PAGE_NAME = 'COMMODITY_CERTIFICATES'

  export default {
    name: PAGE_NAME,
    components: {
      NavigationBar,
      isActiveEmpty
    },
    data() {
      return {
        choose: false,
        couponList: [],
        select: true,
        page: 1,
        isShowEmpty: false,
        lastPage: 1
      }
    },
    async onShow() {
      this.choose = !!this.$mp.query.choose || false
      await this._getLIst(true)
      this.setCommodityItem({ sd: 'sdfsd' })
    },
    async onReachBottom() {
      if (this.page >= this.lastPage) {
        return
      }
      this.page++
      await this._getLIst(false)
    },
    computed: {
      ...orderComputed
    },
    watch: {
      commodityItem(newValue) {
        this.select = isEmptyObject(newValue)
      }
    },
    methods: {
      ...orderMethods,
      async _getLIst(isFirstLoad = false) {
        let res = await API.Coupon.getClientList({ status: this.choose ? 1 : '', page: this.page, tag_type: 1 }, isFirstLoad)
        if (res.error !== this.$ERR_OK) {
          this.$wechat.showToast(res.message)
          return
        }
        this.lastPage = res.meta.last_page
        if (this.page === 1) {
          this.couponList = res.data
          this.isShowEmpty = !res.meta.total
        } else {
          this.couponList = this.couponList.concat(res.data)
        }
        console.log(res)
      },
      goGoodsDetail(item) {
        wx.navigateTo({ url: `${this.$routes.main.GOODS_DETAIL}?id=${item.other_info.goods_id}&activityId=0&activityType=DEFAULT` })
      },
      handleShowTip(index) {
        let arr = JSON.parse(JSON.stringify(this.couponList))
        arr[index].showTip = !arr[index].showTip
        this.couponList = JSON.parse(JSON.stringify(arr))
      },
      selectCoupon(item) {
        if (!this.choose) {
          return
        }
        this.setCommodityItem(item)
        wx.navigateBack()
        console.log(item)
      },
      notUse() {
        this.select = false
        this.setCommodityItem({})
      }
    }
  }
</script>


<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@designCommon"

  .commodity-certificates
    min-height: 100vh
    background: #f7f7f7
    box-sizing: border-box
    overflow-y: auto

  .select-coupon
    display: flex
    justify-content: space-between
    padding: 0 12px
    height: 50px
    align-items: center
    box-sizing: border-box
    background: $color-white
    .select-title
      font-size: $font-size-14
      color: #000000
      font-family: $font-family-regular
    .select-icon-box
      width: 20px
      height: 100%
      position: relative
      padding: 0 8px
    .select-icon
      all-center()
      right: 0
      box-sizing: border-box
      border-radius: 50%
      width: 20px
      height: @width
      opacity: 0
      transition: all 0.2s
      &.active
        opacity: 1

  .coupon
    margin-top: 1.8vw

  .bottom-wrapper
    width: 100%
    position: relative
    .bottom-bg-img
      position: absolute
      display: block
      width: 100%
      height: 6.133333333333333vw

  .middle-wrapper
    width: 100vw
    position: relative
    min-height: 4vw
    overflow: hidden
    margin-top: -2px
    .middle-bg-img
      position: absolute
      display: block
      width: 100vw
    .middle-container
      position: relative
      padding-left: 6.4vw
      padding-right: @padding-left
      font-family: $font-family-regular
      font-size: 3.4666666666666663vw
      color: #1D2023
      .middle-box
        display: flex
        justify-content: space-between
      .title
        display: flex
        align-items: center
        justify-content: space-between
        width: 70.5px
        .down-img
          width: 12.5px
          height: 7px
          display: block
          transition: transform 0.3s
          transform: rotate(0deg)
          margin-top: 1px
          &.rotate
            transform: rotate(180deg)
      .explain
        transition: all 0.2s
        padding-top: 2.4vw
        font-size: 3.2vw
        line-height: 1.42
      .middle-detail-text
        color: #73C200
      .detail-img
        margin-left: 6px
        height: 12.5px
        width: 7px

  .top-wrapper
    width: 100%
    height: 28.5vw
    position: relative
    .top-bg-img
      position: absolute
      display: block
      width: 100%
      height: 100%
    .top-container
      position: relative
      padding-top: 1.866666666666667vw
      padding-left: 3.2vw
      padding-right: @padding-left
      height: 83%
      layout(block, block, nowrap)
      .left
        display: flex
        align-items: center
        width: 18.4vw
        height: 100%
        margin: 0 3.46vw
        .goods-box
          position: relative
          width: 18.4vw
          height: 18.4vw
          .goods-img
            border-radius: 2px
            width: 18.4vw
            height: 18.4vw
            overflow: hidden
          .goods-price
            position: absolute
            bottom: 0
            left: 0
            height: 4.8vw
            color: $color-white
            font-size: $font-size-13
            text-align: center
            line-height: 4.8vw
            width: 100%
            background: rgba(17, 17, 17, 0.5)
      .right
        flex: 2.548582995951417
        position: relative
        layout(column, block, nowrap)
        box-sizing: border-box
        .lab-img
          position: absolute
          right: 0
          top: 0
          width: 16.666666666666664vw
          height: 18vw
          z-index: 50
        .button
          col-center()
          right: 4vw
          width: 17.333333333333336vw
          height: 6.4vw
          border-radius: @width
          font-family: $font-family-regular
          font-size: 3.2vw
          background: #73C200
          color: #FFFFFF;
          text-align: center;
          line-height: @height
        .title
          layout(row, block, nowrap)
          align-items: center
          color: #1D2023
          .use-type
            height: 12px
            border: 1px solid rgba(29, 32, 35, 0.8)
            border-radius: 2px
            color: #1d2023
            font-size: 11px
            line-height: 12.5px
            padding: 0 2px
          .txt
            font-family: $font-family-medium
            font-size: 4vw
            max-width: 51vw
            margin-top: 4.26667vw
            color: $color-text-main
            line-height: 5.0667vw
            height: 10.13333vw
        .condition
          font-family: $font-family-regular
          padding-top: 1.6vw
          opacity: 0.8
          color: $color-text-sub
          font-size: 3.46667vw
          line-height: 1

  .img
    position: absolute
    top: 0
    left: 0
    display: block
    width: 100%
    height: 100%
    font-size: 0
    line-height: 0

  .coupon-item
    width: 100vw
    position: relative
    margin-bottom: 5.2vw
</style>
