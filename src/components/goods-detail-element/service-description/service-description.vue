<template>
  <div class="service-description">
    <img v-if="imageUrl && corpName === 'platform'" :src="imageUrl + '/yx-image/goods/pic-zbyx@2x.png'" mode="widthFix" class="send-box-img">
    <img v-if="imageUrl && corpName === 'retuan'" :src="imageUrl + '/yx-image/retuan/pic-platform_head@2x.png'" mode="widthFix" class="send-box-img-retuan">
    <div class="text-wrap">
      <div class="send-title">服务说明</div>
      <div class="send-item-list small-margin">
        <span class="list-title">• 关于价格</span>
      </div>
      <div class="send-item-list small-margin">
        <span class="list-title">划线价格：</span><span class="list-sub">指商品的厂商指导价、标签价或该商品的曾经展示过的价格，<span class="list-line">并非原价</span>，仅供参考。</span>
      </div>
      <div class="send-item-list">
        <span class="list-title">未划线价格：</span><span class="list-sub">指商品的实时价格，具体成交价根据商品参加活动发生变化，<span class="list-line">最终以订单结算页价格为准</span>。</span>
      </div>
      <div class="send-item-list small-margin">
        <span class="list-title">• 关于发货</span>
      </div>
      <div class="send-item-list">
        <span class="list-title">自提商品：</span><span class="list-sub">当天{{runTime}}[该出需要读取配送仓的实际截单时间]前下单，该订单会于次日配货送至团长提货处，请留意团长的提货通知，如有疑问请联系团长咨询。产地集采及采购周期长的商品以详情页预计到货时间为准。</span>
      </div>
      <div class="send-item-list">
        <span class="list-title">• 关于签收：</span><span class="list-sub">为保障客户的权益，签收时请与团长当面核对无误后再进行认领提货，如由他人代提货而没有团长在场的情况下验货，则视为客户所选购的商品无任何问题。由于生鲜类商品的特殊性，如因个人原因（包括但不限于联系人信息错误、无人签收、无法取得联系）导致延迟取货，造成商品异常，不予售后处理。</span>
      </div>
      <div class="send-item-list">
        <span class="list-title">• 关于退换货：</span><span class="list-sub">核销订单后，如有商品质量问题，请在24小时内联系团长申请售后，并给团长提供商品的完整照片和相关证明，我们会及时为您进行售后的处理。</span>
      </div>
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
    background: $color-white
    border-radius: 8px
    box-sizing: border-box
    margin: 10px 12px 10px
    box-shadow: 0 2px 15px 0 rgba(17, 17, 17, 0.06)
    .send-box-img
      width: 100%
      display: block
      margin: 0 auto 10px
    .send-box-img-retuan
      width: 50px
      height: 50px
      display: block
      margin: 0 auto 20px
    .text-wrap
      padding: 20px 20px 28px 18px
      .send-title
          font-family: $font-family-medium
          color: $color-text-main
          font-size: $font-size-14
          margin-bottom: 15px
        .send-item-list
          text-align: justify
          margin-bottom: 19px
          line-height: 19px
          &.small-margin
            margin-bottom: 8px
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
