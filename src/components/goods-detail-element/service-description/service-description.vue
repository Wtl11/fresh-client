<template>
  <div class="service-description">
    <img v-if="imageUrl && corpName === 'platform'" :src="imageUrl + '/yx-image/goods/pic-logo@2x.png'" mode="widthFix" class="send-box-img">
    <img v-if="imageUrl && corpName === 'retuan'" :src="imageUrl + '/yx-image/retuan/pic-platform_head@2x.png'" mode="widthFix" class="send-box-img-retuan">
    <div class="send-title">服务说明</div>
    <div class="send-item-list">
      <span class="list-title">• 发货须知：</span><span class="list-sub">当天下午{{runTime}}前下单，当天发货次日达；当天下午{{runTime}}后下单，次日发货。</span>
    </div>
    <div class="send-item-list">
      <span class="list-title">• 划线价格：</span><span class="list-sub">指商品的厂商指导价、价签价格或该商品的曾经展示过的价格，</span><span class="list-line">并非原价</span><span class="list-sub">，仅供参考。</span>
    </div>
    <div class="send-item-list">
      <span class="list-title">• 未划线价格：</span><span class="list-sub">指商品的实时价格，不因表述的差异改变性质。具体成交价根据商品参加活动发生变化，</span><span class="list-line">最终以订单结算页价格为准</span>。
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  const COMPONENT_NAME = 'SERVICE_DESCRIPTION'

  export default {
    name: COMPONENT_NAME,
    props: {
      runTime: {
        type: String,
        default: ''
      }
    },
    data() {
      return {

      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@designCommon"

  .service-description
    padding: 20px 20px 28px 18px
    background: $color-white
    border-radius: 8px
    box-sizing: border-box
    margin: 10px 12px 10px
    box-shadow: 0 2px 15px 0 rgba(17, 17, 17, 0.06)
    .send-box-img
      width: 32vw
      display: block
      margin: 0 auto 20px
    .send-box-img-retuan
      width: 50px
      height: 50px
      display: block
      margin: 0 auto 20px
    .send-title
      font-family: $font-family-medium
      color: $color-text-main
      font-size: $font-size-14
      margin-bottom: 15px
    .send-item-list
      text-align: justify
      margin-bottom: 19px
      line-height: 19px
      .list-title
        font-family: $font-family-regular
        color: $color-text-main
        font-size: $font-size-13
      .list-sub
        font-family: $font-family-regular
        color: $color-text-sub
        font-size: $font-size-13
      .list-line
        font-family: $font-family-regular
        color: #000
        text-decoration: underline
        font-size: $font-size-13

    .send-item-list:last-child
      margin-bottom: 0
</style>
