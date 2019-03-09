<template>
  <div v-if="isShow" class="active-end">
    <navigation-bar :title="activeName" :showArrow="false"></navigation-bar>
    <div class="goods-end-box">
      <div class="goods-end-img">
        <img v-if="imageUrl" class="img" :src="imageUrl+'/yx-image/order/pic-end@2x.png'" alt="">
      </div>
      <div class="goods-end-text">活动已结束</div>
      <!--<div class="goods-go-index" :class="'corp-' + corpName + '-bg'" @click="goBack">返回首页</div>-->
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import NavigationBar from '@components/navigation-bar/navigation-bar'

  const COMPONENT_NAME = 'ACTIVE_END'

  export default {
    name: COMPONENT_NAME,
    components: {
      NavigationBar
    },
    props: {
      activeName: {
        type: String,
        default: ''
      }
    },
    data() {
      return {
        isShow: false
      }
    },
    methods: {
      show() {
        this.isShow = false
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"

  .img
    width :100%
    height :100%

  .active-end
    fill-box(fixed)
    z-index :999
    background:#fff

  .goods-end-box
    padding-top: 110px
    .goods-end-img
      width: 116px
      height: 110px
      margin: 0 auto
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
</style>
