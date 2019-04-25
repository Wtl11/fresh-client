<template>
  <div class="notice">
    <img v-if="imageUrl" :src="imageUrl + '/yx-image/notice/pic-notice@2x.png'" class="notice-img">
    <div class="notice-msg">
      <div class="notice-content">
        <div v-for="(item, index) in notice" :key="index" class="notice-msg-item">{{item}}</div>
        <div v-for="(item, index) in notice" :key="index" class="notice-msg-item">{{item}}</div>
      </div>
    </div>
    <span class="notice-line">|</span>
    <navigator url="/pages/notice" class="notice-look" hover-class="none">查看</navigator>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    name: 'notice',
    props: {
      notice: {
        type: Array,
        default: ['由于供应商提供的商品未达到品质要求，导致你所购买的商品未能及时送达，我们将尽快为你 退款或次日补货。']
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@designCommon"
  .notice
    height: 44px
    margin: 12px
    border-1px($color-line, 4px)
    display: flex
    padding: 0 10px
    box-sizing: border-box
    align-items: center

  .notice-img
    width: 27px
    height: 14px

  .notice-msg
    margin-left: 8px
    line-height: 1
    overflow: hidden
    white-space: nowrap
    width: 66.7vw
    position: relative
    display: flex
    .notice-content
      display: flex
      animation: move 25s cubic-bezier(0.36, 0.35, 1, 1) infinite
    .notice-msg-item
      font-family: $font-family-regular
      color: $color-text-main
      font-size: $font-size-14

  .notice-line
    color: #ccc
    margin-left: 6px
    line-height: 1
    font-size: 12px
    transform: translateY(-1px)

  .notice-look
    color: #FA7502
    font-family: $font-family-regular
    font-size: 14px
    white-space: nowrap
    line-height: 1
    margin-left: 3.6vw

  @keyframes move {
    0% {
      transform: translateX(0px)
    }
    100% {
      transform: translateX(-1126px)
    }
  }
</style>
