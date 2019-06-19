<template>
  <div class="app-update">
    <navigation-bar title="系统升级" :showArrow="false"></navigation-bar>
    <div class="content">
      <figure class="logo">
        <img v-if="imageUrl" :src=" imageUrl+'/yx-image/pic-upgrade@2x.png'" class="img">
      </figure>
      <p class="text">系统正在升级中，稍后再试吧！</p>
      <div class="button-wrapper">
        <navigator :url="$routes.main.CHOICENESS" open-type="switchTab" class="button" :class="'corp-' + corpName + '-bg'">刷新一下</navigator>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import NavigationBar from '@components/navigation-bar/navigation-bar'

  const PAGE_NAME = 'APP_UPDATE'

  export default {
    name: PAGE_NAME,
    data() {
      return {
      }
    },
    components: {
      NavigationBar
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"

  .img
    width :100%
    height :100%
    font-size :0
    line-height :0

  .app-update
    .content
      font-family: $font-family-regular
      .logo
        padding-top :143.5px
        margin :0 auto
        width :116px
        height :112.5px
      .text
        padding-top :15px
        font-size: 14px
        color: $color-text-sub
        text-align: center
      .button-wrapper
        padding-top :30px
        .button
          margin :0 auto
          width :100px
          height :32px
          border-radius :@height
          line-height :@height
          font-size: 14px
          color: #FFFFFF
          text-align: center
</style>
