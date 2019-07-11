<template>
  <div class="level-icon">
    <img v-if="imageUrl" :src="imageUrl +'/yx-image/article/icon-diamond@2x.png'" class="auth-photo-v">
    Lv{{num}}
  </div>
</template>

<script type="text/ecmascript-6">
  import NavigationBar from '@components/navigation-bar/navigation-bar'

  const PAGE_NAME = 'GOODS_ITEM'

  export default {
    name: PAGE_NAME,
    components: {
      NavigationBar
    },
    props: {
      num: {
        require: true,
        type: [Number, String],
        default: 0
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@designCommon"
  .auth-photo-v
    height:13px
    width:15px
    position:absolute
    top:0
    bottom:0
    left:-8px
    z-index:100
  .level-icon
    position:relative
    height: 13px
    line-height 13px
    margin-left:10px
    background-color #FF8506
    border-radius 0 7px 7px 0
    font-size :10px
    color: #ffffff
    padding:0 4px 0 10px
    letter-spacing 1px
    text-shadow 0 0 1px 0 #FF440B
</style>
