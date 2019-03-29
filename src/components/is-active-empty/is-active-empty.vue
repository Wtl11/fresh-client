<template>
  <div class="is-active-empty">
    <div class="notingimg">
      <img class="img" v-if="imageUrl" :src="imageUrl + '/yx-image/group/pic-kong@2x.png'" alt="">
    </div>
    <div class="txt">{{text}}</div>
  </div>
</template>

<script type="text/ecmascript-6">
  const COMPONENT_NAME = 'IS_ACTIVE_EMPTY'

  export default {
    name: COMPONENT_NAME,
    props: {
      text: {
        type: String,
        default: '空空如也'
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@designCommon"

  .is-active-empty
    text-align: center
    margin-top: 50px
    .notingimg
      width: 116px
      height: 110px
      margin: 0 auto 15px
      .img
        display: block
        width: 100%
        height: 100%
    .txt
      font-family: $font-family-regular
      font-size: $font-size-14
      color: $color-text-sub
</style>
