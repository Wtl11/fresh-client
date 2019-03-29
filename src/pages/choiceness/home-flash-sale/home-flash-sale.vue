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
          <li v-for="(item, index) in tabList" :key="item.id" class="right-item" @click="changeTab(item, index)">
            <p class="text" :class="{active: tabIndex === index}">{{item.at}}</p>
            <p class="explain" :class="{active: tabIndex === index}">{{item.at_str}}</p>
          </li>
        </ul>
      </div>
    </section>
    <scroll-view class="bottom-wrapper" scroll-x @scrolltolower="scrollHandle">
      <div v-for="(child, idx) in flashArray" :key="idx" class="bottom-item-wrapper">
        <home-flash-item :dataInfo="child"></home-flash-item>
      </div>
      <article v-if="flashArray.length > 4" class="bottom-item-wrapper">
        <div class="look-wrapper" @click="navHandle">
          <div class="text">查看更多</div>
          <figure class="more-icon">
            <img class="img" mode="aspectFill" v-if="imageUrl" :src="imageUrl + '/yx-image/2.1/icon-pressed_gd@2x.png'">
          </figure>
        </div>
      </article>
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
        default: () => []
      },
      tabIndex: {
        type: Number,
        default: 0
      },
      flashArray: {
        type: Array,
        default: () => []
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
      },
      isShow: {
        type: Boolean,
        default: true
      }
    },
    methods: {
      changeTab(item, index) {
        this.$emit('changeTab', item, index)
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
      height:47.733333333333334vw
      border-top-1px()
      display: block
      width: 100vw
      background: $color-white
      white-space: nowrap
      box-sizing: border-box
      transform: translate3d(0,0,0)
      position :relative
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
        padding-top :2.933333333333333vw
        padding-bottom :4vw
        padding-right :2.2133333333333334vw
        overflow :hidden
        &:first-child
          padding-left :3.253333333333333vw
        &:last-child
          padding-right :2.2133333333333334vw
        .look-wrapper
          width :55px
          height :100%
          layout()
          justify-content :center
          align-items :center
          border-left-1px()
          .text
            font-size :13px
            width :13px
            letter-spacing :3.5px
            white-space :normal
            word-wrap: break-word
            word-break :break-all
          .more-icon
            margin-top :3.5px
            width :13px
            height:@width

    .top-wrapper
      height :18.133333333333333vw
      padding :2.666666666666667vw 1.3333333333333335vw 0
      box-sizing :border-box
      .inner-wrapper
        height :15.466666666666667vw
        background :#fff
        border-radius :8px 8px 0 0
        box-sizing :border-box
        padding :2.933333333333333vw 0
        layout(row,block,nowrap)
        .left-wrapper
          flex: 1
          padding-left :1.6vw
          overflow :hidden
          .button
            width :25.066666666666666vw
            height :4.8vw
          .time
            padding-top :1.0666666666666667vw
            font-family: DINAlternate-Bold
            font-size: 3.4666666666666663vw
            color: $color-text-sub
            .dot
              position :relative
              bottom :0.26666666666666666vw
              padding :0 0.6666666666666667vw
        .right-wrapper
          layout(row,block,nowrap)
          padding-right :0.8vw
          .right-item
            text-align :center
            padding :0 1.3333333333333335vw
            .text
              width :16vw
              height :5.6000000000000005vw
              background: #fff
              border-radius: @height
              font-family: $font-family-medium
              font-size: 4.8vw
              color: $color-text-sub
              line-height :@height
              transition :all 0.3s
              &.active
                color: #FFFFFF;
                background: #FF8506
            .explain
              padding-top :0.6666666666666667vw
              font-family: $font-family-regular
              font-size: 3.2vw
              color: $color-text-sub
              transition :all 0.3s
              &.active
                color: #FF8506

</style>
