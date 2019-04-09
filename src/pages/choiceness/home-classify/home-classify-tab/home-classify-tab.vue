<template>
  <scroll-view
    class="home-classify-tab"
    :style="styles"
    :class="{active: !isShow}"
    v-if="tabList.length"
    :id="id"
    :scroll-into-view="viewToItem"
    scroll-x
    :scroll-with-animation="!isIos"
  >
    <div
      v-for="(item, index) in tabList"
      :key="index"
      class="item"
      :id="'item'+index"
      @click="changeTabHandle(index, item.id, $event)"
    >
      <figure class="icon">
        <img class="img" mode="aspectFill" lazy-load v-if="item.image_url" :src="item.image_url">
        <img class="img" mode="aspectFill" lazy-load v-else-if="imageUrl && index === 0" :src="imageUrl + '/yx-image/2.1/icon-all@2x.png'">
      </figure>
      <p class="text"><span class="name">{{item.name}}</span><span class="t-name" :class="tabIndex === index ? 'active'  : ''">{{item.name}}</span></p>
      <div
        class="item-under-line"
        :class="tabIndex === index ? 'active'  : ''"
      >
        <div class="line" :class="'corp-' + corpName + '-bg'"></div>
      </div>
    </div>
  </scroll-view>
</template>

<script type="text/ecmascript-6">
  const COMPONENT_NAME = 'HOME_CLASSIFY_TAB'

  export default {
    name: COMPONENT_NAME,
    props: {
      id: {
        type: String,
        default: ''
      },
      isShow: {
        type: Boolean,
        default: true
      },
      isShowTab: {
        type: Boolean,
        default: false
      },
      tabList: {
        type: Array,
        default: () => []
      },
      viewToItem: {
        type: String,
        default: 'item0'
      },
      styles: {
        type: String,
        default: ''
      },
      tabIndex: {
        type: Number,
        default: 0
      }
    },
    data() {
      return {
        isIos: true
      }
    },
    onLoad() {
      try {
        const systemInfo = wx.getSystemInfoSync()
        this.isIos = /ios/i.test(systemInfo.system)
      } catch (e) {
        console.error(e)
      }
    },
    methods: {
      changeTabHandle(index, id, e) {
        this.$emit('changeTab', index, id, e)
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  $tab-height=86px
  @import "~@designCommon"

  .img
    width :100%
    height :100%
    display :block

  .home-classify-tab
    position :absolute
    top:0
    left :0
    display: block
    height: $tab-height
    width: 100vw
    background: $color-white
    white-space: nowrap
    box-sizing: border-box
    transform: translate3d(0, 0, 0)
    &:after
      content: ""
      position: absolute
      bottom: 0
      right: 0
      width: 100%
      transform: scaleY(.5) translateZ(0)
      border-bottom: 1px solid $color-line
    &.active
      display :none
    ::-webkit-scrollbar
      width: 0
      height: 0
      color: transparent
    .item
      height: $tab-height
      padding: 0 12.5px
      text-align: center
      display: inline-flex
      position: relative
      /*transition: all 0.3s*/
      min-width: 66px
      box-sizing: border-box
      flex-direction :column
      .icon
        margin :0 auto
        padding :5px 0
        width :44px
        height :@width
        position :relative

      .text
        flex: 1
        font-family: $font-family-regular
        font-size: 13px
        color: #333
        position :relative
        .name
          opacity :0
        .t-name
          white-space: nowrap
          row-center()
          &.active
            font-size: 15px
            font-family: $font-family-medium
      .item-under-line
        position: absolute
        width: 100%
        height: 3px
        left: 0
        bottom: 0
        opacity :0
        transition: opacity 0.3s
        &.active
          opacity :1
        .line
          width: 30px
          height: 3px
          margin: 0 auto
          border-radius: 3px
</style>
