<template>
  <div class="distance-check">
    <section
      v-if="top && isShowGuidelines"
      class="top-tip"
      :style="{top: top - 1 + 'px'}"
      @click="show"
    >
      当前位置不在配送范围内，建议换个地址试试<p class="triangle"></p>
    </section>
    <p v-if="isShowTopTip" class="tipTop" :style="{bottom: height + 'px'}">当前位置不在配送范围内，建议换个地址试试</p>
  </div>
</template>

<script type="text/ecmascript-6">
  const COMPONENT_NAME = 'DISTANCE_CHECK'

  export default {
    name: COMPONENT_NAME,
    data() {
      return {
        top: 0,
        isShowGuidelines: false,
        height: -100,
        isShowTopTip: false
      }
    },
    onLoad() {
      setTimeout(() => {
        wx.createSelectorQuery().select('#customTabBar').boundingClientRect().exec(res => {
          if (res && res[0]) {
            this.height = res[0].height
          }
        })
      }, 1500)
    },
    onUnload() {
      this.top = 0
      this.height = -100
      this.reset()
    },
    methods: {
      setTop(top) {
        this.top = top + 3
        this.isShowGuidelines = true
        // setTimeout(() => {
        //   this.hide()
        // }, 2000)
      },
      hide() {
        this.isShowGuidelines = false
        this.showTopTip()
      },
      showTopTip() {
        this.isShowTopTip = true
      },
      reset() {
        this.isShowGuidelines = false
        this.isShowTopTip = false
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  $color-triangle-width = 5px
  @import "~@designCommon"

  .tipTop
    position :fixed
    bottom :-100px
    left:0
    right :0
    padding :0 12px
    height :10.7vw
    background: #FFEBD6
    font-family: $font-family-regular
    font-size: 3.733333333333334vw
    color: #FA7500;
    line-height: @height

  .distance-check
    position: fixed
    z-index: 900

  .mask-wrapper
    background-color: rgba(17, 17, 17, 0.7)
    fill-box(fixed)
    z-index: 999
    .pic-wrapper
      width :309px
      position :absolute
      right :35px
      display :block
      .pic-img
        width :100%
        display :block
      .button
        row-center()
        width :200px
        height :50px
        top: 387px


  .top-tip
    position :fixed
    width :260px
    height :23px
    left :5px
    background: rgba(17,17,17,0.8)
    border-radius: @height
    z-index :580
    font-family: $font-family-regular
    font-size: 12px;
    color: #FFF
    line-height :@height
    text-align: center;
    .triangle
      position :absolute
      width: 0
      height: 0
      border: $color-triangle-width solid rgba(17,17,17,0.8)
      border-left: $color-triangle-width solid transparent
      border-top: $color-triangle-width solid transparent
      border-right: $color-triangle-width solid transparent
      top:-10px
      left :12px
      z-index :3
</style>
