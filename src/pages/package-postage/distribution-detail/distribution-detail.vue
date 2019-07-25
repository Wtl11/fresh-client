<template>
  <div class="distribution-detail">
    <navigation-bar title="物流详情"></navigation-bar>
    <div class="info-box">
      <div class="info-top">韵达快递</div>
      <div class="info-bottom">快递单号：38419344134134</div>
    </div>
    <div class="info-line"></div>
    <div class="info-list">
      <div class="list-item" v-for="(item, index) in 10">
        <div class="item-title">代签收(*便利店 )，感谢使用</div>
        <div class="item-time">2019-06-20  20:13:00</div>
        <div class="circle" :class="index === 0 ? 'first-circle' : ''"></div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import NavigationBar from '@components/navigation-bar/navigation-bar'

  const PAGE_NAME = 'DISTRIBUTION_DETAIL'

  export default {
    name: PAGE_NAME,
    components: {
      NavigationBar
    },
    data() {
      return {
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@designCommon"

  .distribution-detail
    width: 100%
  .info-box
    padding: 20px 12px
    .info-top
      font-size: $font-size-16
      font-family: $font-family-regular
      color: #000
      margin-bottom: 10px
    .info-bottom
      font-size: $font-size-14
      font-family: $font-family-regular
      color: #000
  .info-line
    height: 10px
    width: 100%
    background: $color-background
  .info-list
    padding: 20px 40px
    box-sizing: border-box
    .list-item
      padding-bottom: 38px
      box-sizing: border-box
      position: relative
      &:after
        content: ""
        position: absolute
        top: 10px
        left: -15px
        width: 1px
        height: 100%
        transform: scaleX(.5) translateZ(0)
        border-left: 1px solid #E3E3E3
      .item-title
        font-size: $font-size-14
        font-family: $font-family-regular
        color: #000
        margin-bottom: 10px
      .item-time
        font-size: $font-size-14
        font-family: $font-family-regular
        color: #666
      .circle
        position: absolute
        width: 8px
        height: 8px
        left: -18px
        top: 7px
        background: #b7b7b7
        box-sizing: border-box
        border-radius: 50%
        border: 1px solid #fff
        z-index: 21
      .first-circle
        width: 13px
        height: 13px
        top: 4px
        left: -21px
        background: #FF5400
  .list-item
    &:last-child
      &:after
        display: none
  .distribution-detail
    width: 100%
</style>
