<template>
  <div v-if="isShow" class="home-flash-sale">
    <section class="top-wrapper">
      <div class="inner-wrapper">
        <div class="left-wrapper">
          <figure class="button" @click="navHandle">
            <img class="img" mode="aspectFill" v-if="imageUrl" :src="imageUrl + '/yx-image/2.1/pic-title_xsqg@2x.png'">
          </figure>
          <p class="time">{{countDownTimes.hour}}<span class="dot">:</span>{{countDownTimes.minute}}<span class="dot">:</span>{{countDownTimes.second}}</p>
        </div>
        <ul class="right-wrapper">
          <li v-for="(item, index) in tabList" :key="index" class="right-item" @click="changeTab(item, index)">
            <p class="text" :class="{active: tabIndex === index}">{{item.text}}</p>
            <p class="explain" :class="{active: tabIndex === index}">{{item.explain}}</p>
          </li>
        </ul>
      </div>
    </section>
    <scroll-view class="bottom-wrapper" scroll-x @scrolltolower="scrollHandle">
      <div v-for="(child, idx) in flashArray" :key="idx" class="bottom-item-wrapper">
        <home-flash-item></home-flash-item>
      </div>
    </scroll-view>
  </div>
</template>

<script type="text/ecmascript-6">
  import HomeFlashItem from './home-flash-item/home-flash-item'
  const COMPONENT_NAME = 'HOME_FLASH_SALE'

  export default {
    name: COMPONENT_NAME,
    components: {
      HomeFlashItem
    },
    props: {
      tabList: {
        type: Array,
        default: () => [
          {
            text: '10:00',
            explain: '正在抢购'
          },
          {
            text: '16:00',
            explain: '即将开抢'
          },
          {
            text: '24:59',
            explain: '3月19日'
          }
        ]
      },
      tabIndex: {
        type: Number,
        default: 0
      },
      flashArray: {
        type: Array,
        default: () => new Array(5).fill(1)
      },
      countDownTimes: {
        type: Object,
        default: () => {
          return {
            hour: '00',
            minute: '00',
            second: '00'
          }
        }
      }
    },
    data() {
      return {
        isShow: true
      }
    },
    onLoad() {
      setTimeout(() => {
        this.isShow = true
      }, 2000)
    },
    methods: {
      changeTab(item, index) {
        this.$emit('changeTab', item, index)
      },
      scrollHandle(e) {
        console.log(e)
      },
      navHandle() {
        wx.navigateTo({url: '/pages/flash-sale-list'})
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@designCommon"

  .img
    width :100%
    height :100%
    display :block

  .home-flash-sale
    width: 100%
    background: $color-background
    border-bottom :10px solid $color-background
    .bottom-wrapper
      height:179px
      border-top-1px()
      display: block
      width: 100vw
      background: $color-white
      white-space: nowrap
      box-sizing: border-box
      transform: translate3d(0,0,0)
      &.active
        display :none
      ::-webkit-scrollbar
        width: 0
        height: 0
        color: transparent
      .bottom-item-wrapper
        height :100%
        display: inline-block
        position: relative
        box-sizing :border-box
        padding-top :11px
        padding-bottom :15px
        padding-right :8.3px
        &:first-child
          padding-left :12.2px
        &:last-child
          padding-right :8.3px

    .top-wrapper
      height :68px
      padding :10px 5px 0
      box-sizing :border-box
      .inner-wrapper
        height :58px
        background :#fff
        border-radius :8px 8px 0 0
        box-sizing :border-box
        padding :11px 0
        layout(row,block,nowrap)
        .left-wrapper
          flex: 1
          padding-left :6px
          overflow :hidden
          .button
            width :94px
            height :18px
          .time
            padding-top :4px
            font-family: DINAlternate-Bold
            font-size: 13px
            color: $color-text-sub
            .dot
              position :relative
              bottom :1px
              padding :0 2.5px
        .right-wrapper
          layout(row,block,nowrap)
          padding-right :3px
          .right-item
            text-align :center
            padding :0 5px
            .text
              width :60px
              height :21px
              background: #fff
              border-radius: @height
              font-family: $font-family-medium
              font-size: 18px;
              color: $color-text-sub
              line-height :@height
              transition :all 0.3s
              &.active
                color: #FFFFFF;
                background: #FF8506
            .explain
              padding-top :2.5px
              font-family: $font-family-regular
              font-size: 12px;
              color: $color-text-sub
              transition :all 0.3s
              &.active
                color: #FF8506

</style>
