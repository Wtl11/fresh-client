<template>
  <div v-if="isShow" class="home-flash-sale" id="homeFlashSale">
    <section v-if="tabList.length && flashArray.length" class="top-wrapper">
      <img lazy-load class="title-img" mode="aspectFill" v-if="imageUrl" :src="imageUrl + '/yx-image/2.3/pic-qgtitle@2x.png'">
      <ul class="tab-wrapper">
        <li v-if="index < 2" v-for="(item, index) in tabList" :key="index" class="tab-item-wrapper" :class="{active: tabIndex === index}" @click="changeTab(item, index)">
          <p class="time">{{item.at}}</p>
          <p class="explain">{{item.at_str}}</p>
        </li>
      </ul>
      <div class="more-wrapper" @click="navHandle">
        <p class="more-text">更多</p>
        <img lazy-load class="more-img" mode="aspectFill" v-if="imageUrl" :src="imageUrl + '/yx-image/2.3/icon-pressed@2x.png'">
      </div>
    </section>
    <section v-if="tabList.length && flashArray.length" class="scroll-wrapper">
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
                <img class="img" lazy-load mode="aspectFill" v-if="imageUrl" :src="imageUrl + '/yx-image/2.1/icon-pressed_gd@2x.png'">
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
      // countDownTimes: {
      //   type: Object,
      //   default: () => {
      //     return {
      //       hour: '00',
      //       minute: '00',
      //       second: '00'
      //     }
      //   }
      // },
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
  $box-radius=4px
  @import "~@designCommon"

  .img
    width :100%
    height :100%
    display :block
    overflow :auto

  .home-flash-sale
    padding :0 2.666666666666667vw
    background: #fff
    border-bottom :10px solid @background
    position :relative
    .scroll-wrapper
      padding :9px
      background :$color-flash-background
      border-radius :0 0 $box-radius $box-radius
      .bottom-wrapper
        display: block
        width: 100%
        background: $color-white
        white-space: nowrap
        box-sizing: border-box
        transform: translate3d(0,0,0)
        position :relative
        border-radius :$box-radius $box-radius
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
          padding-top :8px
          padding-bottom :5px
          padding-left :7px
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
      height :45px
      background: #F7F9FA
      border-radius :$box-radius $box-radius 0 0
      padding :0 11.5px 0 10px
      layout(row,block,nowrap)
      align-items :center
      .title-img
        padding-right :3.733333333333334vw
        width :20vw
        height :4.933333333333334vw
      .more-wrapper
        flex: 1
        layout(row,block,nowrap)
        align-items :center
        justify-content :flex-end
        font-family: $font-family-regular
        font-size: 14px;
        color: #111111;
        .more-text
          padding-right :5px
        .more-img
          width:5.5px
          height :10.5px
      .tab-wrapper
        height :100%
        layout(row,block,nowrap)
        .tab-item-wrapper
          width :21.866666666666667vw
          height :100%
          layout(column,block,nowrap)
          justify-content :center
          align-items :center
          font-family: $font-family-medium
          color: #1D2023;
          border-radius :2px 2px 0 0
          transition :all 0.3s
          background :#F7F9FA
          &.active
            background :$color-flash-background
          .time
            font-size:16px
          .explain
            margin-top :-2px
            font-size :10px

</style>
