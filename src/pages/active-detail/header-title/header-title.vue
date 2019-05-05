<template>
  <div class="header-title">
    <div class="banner-title-main" v-if="activityId > 0">
      <img v-if="imageUrl" :src="imageUrl + '/yx-image/choiceness/pic-spxq_bg@2x.png'" mode="aspectFill" class="banner-title-bg">
      <div class="banner-main-box">
        <div class="banner-main-left">
          <div class="left-price">{{goodsMsg.trade_price}}</div>
          <div class="left-price-text">元</div>
          <div class="left-price-line">
            <div class="line-price-top">
              <img v-if="imageUrl" :src="imageUrl + '/yx-image/choiceness/pic-qgj@2x.png'" class="text-img" mode="aspectFill">
              <div class="text">秒杀价</div>
            </div>
            <div class="line-price-box">{{goodsMsg.original_price}}元</div>
          </div>
        </div>
        <div class="banner-main-right">
          <div class="time-text">{{goodsMsg.at_diff_str}}</div>
          <div class="time-all-box">{{activityTime.hour}}:{{activityTime.minute}}:{{activityTime.second}}</div>
        </div>
      </div>
    </div>
    <div class="banner-title-type" v-if="activityId === 0">
      <div class="left-price" :class="'corp-' + corpName + '-money'">{{goodsMsg.trade_price}}</div>
      <div class="left-price-text">
        <div class="price-text" :class="'corp-' + corpName + '-money'">元</div>
        <div class="line-price-text">{{goodsMsg.original_price}}元</div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import {countDownHandle} from '@utils/common'
  import {BTN_STATUS} from '../active-status'

  const COMPONENT_NAME = 'HEADER_TITLE'

  export default {
    name: COMPONENT_NAME,
    props: {
      goodsMsg: {
        type: Object,
        default: () => {}
      },
      activityId: {
        type: Number,
        default: 0
      }
    },
    data() {
      return {
        activityTime: {
          hour: '00',
          minute: '00',
          second: '00'
        },
        timer: null
      }
    },
    computed: {
      activeStatus() {
        let active = this.goodsMsg.activity || {}
        return +active.status
      }
    },
    watch: {
      goodsMsg(val) {
        this._clearTimer()
        if (!this.activityId) return
        if (this.activeStatus === BTN_STATUS.DOWN) {
          return
        }
        let diff = val.at_diff || 0
        this._kanTimePlay(diff)
      }
    },
    onHide() {
      this._clearTimer()
    },
    onUnload() {
      this._clearTimer()
      this.timer = null
      this.activityTime = {
        hour: '00',
        minute: '00',
        second: '00'
      }
    },
    methods: {
      _kanTimePlay(diff) {
        this.activityTime = countDownHandle(diff)
        this.timer = setTimeout(() => {
          diff--
          if (diff < 0) {
            diff = 0
          }
          console.log(diff)
          this.activityTime = countDownHandle(diff)
          if (this.activityTime.differ <= 0) {
            this._clearTimer()
            this.$emit('kanTimeEnd')
          } else {
            return this._kanTimePlay(diff)
          }
        }, 1000)
      },
      _clearTimer() {
        clearTimeout(this.timer)
        clearInterval(this.timer)
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@designCommon"

  .header-title
    padding: 0 12px
    box-sizing: border-box
    position: absolute
    left: 0
    bottom: -1px
    width: 100%
    .banner-title-main
      padding-bottom: 13vw
      width: 100%
      position: relative
      .banner-title-bg
        position: absolute
        left: 0
        bottom: 0
        width: 100%
        height: 100%
      .banner-main-box
        position: absolute
        left: 0
        bottom: 0
        width: 100%
        height: 100%
        padding: 0 19px 0 10px
        box-sizing: border-box
        layout(row)
        align-items: center
        justify-content: space-between
        .banner-main-left
          layout(row)
          align-items: center
          .left-price
            font-size: 30px
            font-family: $font-family-medium
            color: $color-white
          .left-price-text
            font-size: 22px
            font-family: $font-family-medium
            color: $color-white
            margin-right: 6px
          .line-price-top
            height: 11px
            width: 36.5px
            position: relative
            .text-img
              width: 100%
              height: 100%
              display: block
              position: absolute
              left: 0
              bottom: 0
            .text
              height: 11px
              font-size: 9px
              color: $color-money
              line-height: 11px
              font-family: $font-family-regular
              text-align: center
              position: relative
              z-index: 11
          .line-price-box
            font-size: $font-size-12
            font-family: $font-family-regular
            text-decoration: line-through
            line-height: 1
            color: #fff
            margin-top: 2px

        .banner-main-right
          text-align: center
          .time-text
            font-size: $font-size-13
            color: $color-text-main
            font-family: $font-family-regular
            line-height:15px
          .time-all-box
            font-size: $font-size-13
            color: $color-text-main
            font-family: $font-family-regular
            line-height:15px
    .banner-title-type
      height: 13vw
      background: #ff6d0d
      width: 100%
      border-top-left-radius: 8px
      border-top-right-radius: 8px
      layout(row)
      align-items: center
      padding-left: 10px
      box-sizing: border-box
      .left-price
        font-size: 30px
        font-family: $font-family-medium
        color:rgba(255,255,255,1)
      .left-price-text
        layout(row)
        align-items: flex-end
        .price-text
          font-size: 22px
          font-family: $font-family-medium
          margin-right: 5px
          color:rgba(255,255,255,1)
        .line-price-text
          font-size: $font-size-12
          font-family: $font-family-regular
          text-decoration: line-through
          line-height: 1
          color:rgba(255,255,255,0.8)
          position :relative
          bottom :4px

</style>
