<template>
  <div v-if="isShow" class="pay-result-com">
    <navigation-bar title="支付成功" :showArrow="false"></navigation-bar>
    <div class="pay-content">
      <div class="icon">
        <img v-if="imageUrl" :src="imageUrl + '/yx-image/choiceness/icon-pay_success@2x.png'" class="img">
      </div>
      <p class="price-wrapper">已支付<span class="number">{{dataInfo.trade_price}}元</span></p>
      <p class="text-wrapper">{{dataInfo.name}}</p>
      <div class="button" @click="hide">确定</div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import NavigationBar from '@components/navigation-bar/navigation-bar'
  const COMPONENT_NAME = 'PAY_RESULT_COM'

  export default {
    name: COMPONENT_NAME,
    props: {
      dataInfo: {
        type: Object,
        default: () => {}
      }
    },
    components: {
      NavigationBar
    },
    data() {
      return {
        isShow: false
      }
    },
    methods: {
      hide() {
        this.isShow = false
      },
      show() {
        this.isShow = true
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"

  .pay-result-com
    fill-box(fixed)
    z-index :999
    background:#fff
    .pay-content
      position :relative
      font-family: PingFangSC-Medium;
      font-size: 16px;
      .icon
        margin :64px auto 0
        width :79px
        height :@width
        .img
          width :100%
          height :100%
      .price-wrapper
        margin-top :15px
        font-family: $font-family-regular
        color: #333333;
        text-align :center
        .number
          color: #FF8300;
      .text-wrapper
        margin :20px 52px 0
        color: #343434;
        text-align: center;
        line-height: 1.2
      .button
        margin :51px 52px
        height :45px
        background :$color-main
        border-radius :@height
        font-size: 18px;
        color: #FFFFFF;
        text-align :center
        line-height :@height
</style>
