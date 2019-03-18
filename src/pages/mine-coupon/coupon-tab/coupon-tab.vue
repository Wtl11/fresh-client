<template>
  <div class="coupon-tab">
    <dl class="tab-wrapper">
      <dd class="tab-item"
          :class="{active: tabIndex === index}"
          v-for="(item, index) in tabList" :key="index"
          @click="changeHandle(item, index)"
      >
        {{item.text}}({{item.number}})
      </dd>
      <dt class="line-wrapper" :style="'transform: translate3d(' + tabIndex*100 + '%,0,0)'">
        <em class="line" :class="'corp-' + corpName + '-bg'"></em>
      </dt>
    </dl>
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
    methods: {
      changeHandle(item, index) {
        this.$emit('change', item, index)
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@designCommon"

  .coupon-tab
    padding :0 34.5px
    background :#fff
    .tab-wrapper
      height :40px
      font-family: $font-family-regular
      font-size: 15px
      color: $color-text-sub
      text-align: center
      line-height: @height
      display :flex
      position :relative
      .tab-item
        flex: 1
        &.active
          font-family: $font-family-medium
          font-size: 16px;
          color: $color-text-main
      .line-wrapper
        width :50%
        position :absolute
        left :0
        bottom :0
        height :3px
        transition :transform 0.3s
        .line
          margin :0 auto
          height :100%
          border-radius: 3px
          width :30px
</style>
