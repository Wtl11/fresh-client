<template>
  <div class="goods-end">
    <navigation-bar :title="shopName" :showArrow="false"></navigation-bar>
    <div class="goods-end-box">
      <img v-if="imageUrl" class="goods-end-img" :src="imageUrl+'/yx-image/order/pic-noresult@2x.png'" alt="">
      <div class="goods-end-text">主人，文章下线啦～</div>
      <div class="goods-go-index" :class="'corp-' + corpName + '-bg'" @click="goBack">返回首页</div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import NavigationBar from '@components/navigation-bar/navigation-bar'

  const PAGE_NAME = 'CONTENT_END'

  export default {
    name: PAGE_NAME,
    components: {
      NavigationBar
    },
    data() {
      return {
      }
    },
    methods: {
      goBack() {
        wx.switchTab({ url: `${this.$routes.main.CHOICENESS}` })
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@designCommon"
  .goods-end-box
    padding-top: 110px

    .goods-end-img
      width: 116px
      height: 110px
      margin: 0 auto
      display: block

    .goods-end-text
      font-family: $font-family-regular
      text-align: center
      margin-top: 15px
      font-size: $font-size-14
      color: $color-text-sub

    .goods-go-index
      color: $color-white
      height: 28px
      width: 95px
      line-height: 28px
      margin: 42px auto 0
      font-size: $font-size-14
      font-family: $font-family-regular
      text-align: center
      border-radius: 50px

  .goods-end
    width: 100%
</style>

