<template>
  <div class="navigation-bottom">
    <div class="navigation-top" :style="{height: (49 + height) + 'px'}"></div>
    <div class="navigation-box">
      <div class="nav-list-box" v-for="(item, index) in platformList" :key="index" @click="jumpNav(item)">
        <div class="nav-top-icon">
          <div class="help-number" v-if="item.type === 'cart' && count * 1 >= 1">{{count * 1 > 99 ? 99 : count}}</div>
          <img class="icon-img" v-if="imageUrl"
               :src="item.type === currentType ? imageUrl + item.imgUrlActive : imageUrl + item.imgUrl" alt="">
        </div>
        <div class="nav-top-text">{{item.text}}</div>
      </div>
      <div class="navigation-bottom" :style="{height: height + 'px'}"></div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import {cartComputed} from '@state/helpers'

  const COMPONENT_NAME = 'NAVIGATION_BOTTOM'
  const PLATFORM = [
    {
      imgUrl: '/yx-image/retuan/hdpi/icon-select.png',
      imgUrlActive: '/yx-image/retuan/hdpi/icon-select_press01.png',
      text: '首页',
      type: 'index'
    },
    {
      imgUrl: '/yx-image/retuan/hdpi/icon-goodscart.png',
      imgUrlActive: '/yx-image/retuan/hdpi/icon-goodscat_press01.png',
      text: '购物车',
      type: 'cart'
    },
    {
      imgUrl: '/yx-image/retuan/hdpi/icon-my.png',
      imgUrlActive: '/yx-image/retuan/hdpi/icon-my_press01.png',
      text: '我的',
      type: 'mine'
    }
  ]
  const RETUANPLATFORM = [
    {
      imgUrl: '/yx-image/retuan/hdpi/icon-select.png',
      imgUrlActive: '/yx-image/retuan/hdpi/icon-select_press.png',
      text: '首页',
      type: 'index'
    },
    {
      imgUrl: '/yx-image/retuan/hdpi/icon-goodscart.png',
      imgUrlActive: '/yx-image/retuan/hdpi/icon-goodscat_press.png',
      text: '购物车',
      type: 'cart'
    },
    {
      imgUrl: '/yx-image/retuan/hdpi/icon-my.png',
      imgUrlActive: '/yx-image/retuan/hdpi/icon-my_press.png',
      text: '我的',
      type: 'mine'
    }
  ]

  export default {
    name: COMPONENT_NAME,
    props: {
      currentType: '',
      type: Object,
      default: 'index'
    },
    data() {
      return {
        platformList: [],
        height: 0
      }
    },
    onLoad() {
      let res = this.$wx.getSystemInfoSync()
      this.height = res.statusBarHeight >= 44 ? 28 : 0
      // console.warn(this.height, res, 'asdasd')
      switch (this.corpName) {
        case 'platform':
          this.platformList = PLATFORM
          break
        case 'retuan':
          this.platformList = RETUANPLATFORM
          break
        default:
          break
      }
    },
    computed: {
      ...cartComputed
    },
    methods: {
      async jumpNav(item) {
        if (item.type === this.currentType) return
        switch (item.type) {
          case 'index':
            wx.switchTab({url: '/pages/choiceness'})
            break
          case 'cart':
            wx.switchTab({url: '/pages/shopping-cart'})
            await this.$isLogin()
            break
          case 'mine':
            wx.switchTab({url: '/pages/mine'})
            await this.$isLogin()
            break
          default:
            break
        }
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
 @import "~@designCommon"

  .navigation-bottom
    width: 100%

  .navigation-top
    width: 100%
    height: 49px

  .navigation-box
    border-top-1px(#eee)
    position: fixed
    left: 0
    bottom: 0
    width: 100%
    layout(row)
    align-items: center
    display: flex
    background: #fff
    z-index: 200
    .nav-list-box
      width: 33.3333vw
      height: 49px
      layout()
      align-items: center
      justify-content: center
      .nav-top-icon
        width: 23px
        height: 23px
        display: block
        position: relative
        .help-number
          position: absolute
          top: -4px
          right: -7px
          min-width: 16px
          text-align: center
          height: 16px
          line-height: 14px
          padding: 0 3px
          box-sizing: border-box
          font-family: $font-family-medium
          color: $color-white
          font-size: $font-size-10
          border: 1px solid $color-white
          background: #FF3B39
          border-radius: 50%
        .icon-img
          width: 23px
          height: 23px
          display: block
      .nav-top-text
        margin-top: 1px
        font-size: $font-size-10
        font-family: $font-family-regular
        color: #222

  .z
    width: 1px
</style>
