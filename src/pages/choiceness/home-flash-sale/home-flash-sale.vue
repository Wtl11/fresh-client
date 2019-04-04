<template>
  <div v-if="isShow" class="home-flash-sale" id="homeFlashSale">
    <section class="top-wrapper">
      <div class="inner-wrapper">
        <div class="left-wrapper">
          <figure class="button" @click="navHandle">
            <img class="img" mode="aspectFill" v-if="imageUrl" :src="imageUrl + '/yx-image/2.1/icon-pressed_xsqg@2x.png'">
          </figure>
          <p class="time">{{countDownTimes.hour}}<span class="dot">:</span>{{countDownTimes.minute}}<span class="dot">:</span>{{countDownTimes.second}}</p>
        </div>
        <ul class="right-wrapper">
          <li v-for="(item, index) in tabList" :key="item.id" class="right-item" @click="changeTab(item, index)">
            <div class="tab-item" :class="{active: tabIndex === index}"></div>
            <p class="text" :class="{active: tabIndex === index}">{{item.at}}</p>
            <p class="explain" :class="{active: tabIndex === index}">{{item.at_str}}</p>
          </li>
        </ul>
      </div>
    </section>
    <section class="scroll-wrapper">
      <scroll-view
        class="bottom-wrapper"
        scroll-x
        :scroll-into-view="viewToChild"
      >
        <div
          v-for="(child, idx) in flashArray"
          class="bottom-item-wrapper"
          :class="flashArray.length> 4 && idx === flashArray.length -1?'':'item-r-2vw'"
          :key="idx"
          :id="'child'+idx"
        >
          <home-flash-item :dataInfo="child"></home-flash-item>
          <section v-if="flashArray.length> 4 && idx === flashArray.length -1" class="look-more">
            <div class="look-wrapper" @click="navHandle">
              <div class="text">查看更多</div>
              <figure class="more-icon">
                <img class="img" mode="aspectFill" v-if="imageUrl" :src="imageUrl + '/yx-image/2.1/icon-pressed_gd@2x.png'">
              </figure>
            </div>
          </section>
        </div>
      </scroll-view>
    </section>
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
      },
      systemInfo: {
        type: Object,
        default: () => {}
      }
      // scrollLeft: {
      //   type: Number,
      //   default: undefined
      // }
    },
    data() {
      return {
        navigating: false,
        // scrollPosition: 0,
        // isIos: false,
        viewToChild: undefined
      }
    },
    methods: {
      changeTab(item, index) {
        if (index === this.tabIndex) return
        this.viewToChild = 'child0'
        setTimeout(() => {
          this.viewToChild = undefined
        }, 100)
        this.$emit('changeTab', item, index)
      },
      navHandle() {
        const id = this.tabList[this.tabIndex].id
        wx.navigateTo({url: `/pages/flash-sale-list?id=${id}`})
      },
      scrollHandle(e) {
        // this.viewToChild = undefined
        // if (this.scrollLeft === 0) {
        //   this.$emit('scrollEnd')
        // }
        // this.scrollPosition = e.target.scrollLeft
        // 滚动加载
        // if (this.flashArray.length < 5) return
        // if (this.navigating) return
        // let mixScoll = e.target.scrollWidth - e.target.scrollLeft + 50 < this.systemInfo.screenWidth
        // if (mixScoll) {
        //   this.navigating = true
        //   setTimeout(() => {
        //     this.navigating = false
        //   }, 2000)
        //   this.navHandle()
        // }
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  $color-flash-background=#FFE359
  @import "~@designCommon"

  .img
    width :100%
    height :100%
    display :block
    overflow :auto

  .home-flash-sale
    padding :0 2.666666666666667vw
    background: #fff
    border-bottom :3.2vw solid @background
    .scroll-wrapper
      padding :0 2.4vw 4.266666666666667vw
      background :$color-flash-background
      border-radius :0 0 8px 8px
      .bottom-wrapper
        display: block
        width: 100%
        background: $color-white
        white-space: nowrap
        box-sizing: border-box
        transform: translate3d(0,0,0)
        position :relative
        border-radius :8px 8px
        &.active
          display :none
        ::-webkit-scrollbar
          width: 0
          height: 0
          color: transparent
        .bottom-item-wrapper
          height :100%
          display: inline-flex
          position: relative
          box-sizing :border-box
          padding-top :10px
          padding-bottom :10px
          padding-left :2.2133333333333334vw
          &.item-r-2vw
            padding-right :2.2133333333333334vw
          &.item-r-0
            padding-right :2.2133333333333334vw
          .look-more
            padding-left :0
            .look-wrapper
              width :14.666666666666666vw
              height :100%
              layout()
              justify-content :center
              align-items :center
              .text
                font-family :$font-family-regular
                color: $color-text-sub
                font-size :13px
                width :@font-size
                letter-spacing :2px
                white-space :normal
                word-wrap: break-word
                word-break :break-all
              .more-icon
                margin-top :0.9333333333333335vw
                width :13px
                height:@width


    .top-wrapper
      height :15.733333333333333vw
      .inner-wrapper
        height :100%
        background :$color-flash-background
        border-radius :8px 8px 0 0
        box-sizing :border-box
        padding :4vw 0 2.666666666666667vw
        layout(row,block,nowrap)
        .left-wrapper
          flex: 1
          padding-left :2.666666666666667vw
          .button
            width :25.066666666666666vw
            height :4.8vw
          .time
            padding-top :1.0666666666666667vw
            font-family: DINAlternate-Bold
            font-size: 3.4666666666666663vw
            color: rgba(29,32,35,0.8)
            .dot
              position :relative
              bottom :0.26666666666666666vw
              padding :0 0.6666666666666667vw
        .right-wrapper
          layout(row,block,nowrap)
          padding-right :2.4vw
          .right-item
            text-align :center
            width :17.333333333333336vw
            position :relative
            .tab-item
              position :absolute
              top:-1.866666666666667vw
              left :0
              width :100%
              height :16vw
              background :#fff
              border-radius :4px 4px 0 0
              opacity :0
              transition :opacity 0.3s
              &.active
                opacity :1
            .text
              position :relative
              width :16vw
              height :5.6000000000000005vw
              border-radius: @height
              font-family: $font-family-medium
              font-size: 4.8vw
              color: #1D2023
              line-height :@height
              z-index :2
              text-align :center
            .explain
              position :relative
              font-family: $font-family-regular
              font-size: 3.2vw
              color: #1D2023
              text-align :center
              z-index :2

</style>
