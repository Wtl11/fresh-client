<template>
  <div class="coupon-tab">
    <div class="container">
      <dl class="tab-wrapper">
        <dd class="tab-item"
            :class="{active: tabIndex === index}"
            v-for="(item, index) in tabList" :key="index"
            @click="changeHandle(item, index)"
        >
          {{item.text}}
        </dd>
        <dt class="line-wrapper" :style="'transform: translate3d(' + tabIndex*100 + '%,0,0)'">
          <em class="line"></em>
        </dt>
      </dl>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  const COMPONENT_NAME = 'COUPON_TAB'

  export default {
    name: COMPONENT_NAME,
    props: {
      tabList: {
        type: Array,
        default: []
      },
      tabIndex: {
        type: Number,
        default: 0
      }
    },
    onLoad() {
      console.log(this.tabList)
    },
    methods: {
      changeHandle(item, index) {
        this.$emit('change', item, index)
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  $tab-height = 57px
  @import "~@designCommon"

  .place-box
    height: $tab-height

  .coupon-tab
    position: relative
    z-index: 1
    width: 100%
    .container
      padding: 0 0.5px
      background: #fff
      box-sizing: border-box
      position: relative
      &:after
        content: ""
        position: absolute
        bottom: 0
        right: 0
        width: 100%
        transform: scaleY(.5) translateZ(0)
        border-bottom: 1px solid $color-line
      .tab-wrapper
        height: $tab-height
        font-family: $font-family-regular
        font-size: 15px
        color: $color-text-sub
        text-align: center
        line-height: @height
        display: flex
        position: relative
        .tab-item
          flex: 1
          &.active
            font-family: PingFang-SC-Bold
            font-size: 15px
            color: #F27F2E
        .line-wrapper
          width: 50%
          position: absolute
          left: 0
          bottom: 0
          height: 2.5px
          transition: transform 0.3s
          z-index: 6
          .line
            margin: 0 auto
            background: #F27F2E
            height: 100%
            border-radius: 3px
            width: 80px
</style>
