<template>
  <div class="header-detail">
    <button class="share-wrapper" formType="submit" :open-type="activityId? 'share': ''" @click="showShare">
      <img v-if="imageUrl" :src="imageUrl + '/yx-image/2.3/icon-sharexq@2x.png'" mode="aspectFill" class="share-img">
      <p class="share-text">分享</p>
    </button>
    <div class="info-box">
      <article class="title-wrapper">
        <div class="title" :class="goodsMsg.name ? 'has-title' : ''">{{goodsMsg.name}}</div>
        <div class="has-sub-title" v-if="goodsMsg.describe">{{goodsMsg.describe}}</div>
      </article>
      <div class="info-sub">
        <img v-if="imageUrl && corpName === 'platform'" :src="imageUrl + '/yx-image/choiceness/icon-fast@2x.png'" mode="aspectFill" class="info-sub-img">
        <img v-if="imageUrl && corpName === 'retuan'" :src="imageUrl + '/yx-image/retuan/icon-fast@2x.png'" mode="aspectFill" class="info-sub-img">
        <div class="sub-text">现在下单，预计({{goodsMsg.delivery_at}})可自提</div>
      </div>
      <div class="info-stock">已售<span :class="'corp-' + corpName + '-money'">{{goodsMsg.sale_count}}</span>{{goodsMsg.goods_units}}<span v-if="activityId * 1 > 0">，剩余<span :class="'corp-' + corpName + '-money'">{{goodsMsg.usable_stock}}</span>{{goodsMsg.goods_units}}</span></div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  const COMPONENT_NAME = 'HEADER_DETAIL'

  const SAFELIST = [
    { url: '/yx-image/choiceness/icon-lightning@2x.png', text: '次日达', type: 0 },
    { url: '/yx-image/choiceness/icon-ok@2x.png', text: '100%售后', type: 1 },
    { url: '/yx-image/choiceness/icon-ok@2x.png', text: '直采直销', type: 2 }
  ]
  const RETUANSAFELIST = [
    { url: '/yx-image/retuan/icon-lightning@2x.png', text: '次日达', type: 0 },
    { url: '/yx-image/retuan/icon-ok@2x.png', text: '100%售后', type: 1 },
    { url: '/yx-image/retuan/icon-ok@2x.png', text: '直采直销', type: 2 }
  ]

  export default {
    name: COMPONENT_NAME,
    props: {
      goodsMsg: {
        type: Object,
        default: () => {}
      },
      activityId: {
        type: Number,
        default: 0
      }
    },
    data () {
      return {
        safeList: SAFELIST
      }
    },
    onLoad () {
      if (this.corpName === 'retuan') {
        this.safeList = RETUANSAFELIST
      }
    },
    methods: {
      showShare () {
        this.$emit('showShare')
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@designCommon"

  .safeguard-box
    padding-left: 10px
    height: 45px
    background: #FAFAFA
    border-radius: 0 0 8px 8px
    box-sizing: border-box
    margin-bottom :10px
    box-shadow: 0 2px 15px 0 rgba(17, 17, 17, 0.06)
    layout(row)
    align-items: center

    .safeguard-item
      margin-right: 30px
      layout(row)
      align-items: center

      .icon
        width: 14px
        height: 14px
        margin-right: 5px
        display: block

      .text
        font-family: $font-family-regular
        font-size: $font-size-14
        color: $color-text-main


  .header-detail
    padding: 0 12px
    box-sizing: border-box
    position: relative
    margin-bottom :10px

    .share-wrapper
      position: absolute
      right: 30px
      top: 21px
      z-index: 99

      .share-img
        width: 36px
        height: @width
        display: block

      .share-text
        padding-top: 6px
        text-align: center
        font-family: $font-family-regular
        font-size: 11px;
        color: #342903;

    .info-box
      background: $color-white
      width: 100%
      padding: 10px 10px 15px
      box-sizing: border-box
      border-radius : 0 0 8px 8px

      .title-wrapper
        position: relative

        .share-wrapper
          col-center()
          right: 18px

          .share-img
            width: 36px
            height: @width
            display: block

          .share-text
            padding-top: 6px
            text-align: center
            font-family: $font-family-regular
            font-size: 11px;
            color: #342903;

        .title
          width: 71vw
          font-size: $font-size-17
          color: #1F1F1F
          min-height: 20px
          line-height: $font-size-20
          font-family: $font-family-medium
          no-wrap-plus()

        .has-title
          width: 71vw
          no-wrap-plus()

        .has-sub-title
          width: 71vw
          margin-top: 7px
          font-family: $font-family-regular
          font-size: $font-size-14
          color: #808080
          letter-spacing: 0.3px
          word-break: break-word

      .info-sub
        layout(row)
        align-items: center
        margin: 10px 0 10px

        .info-sub-img
          width: 14.5px
          height: 15.5px
          display: block
          margin-right: 5px

        .sub-text
          color: #9B9B9B
          font-size: $font-size-14
          font-family: $font-family-regular

    .info-stock
      font-size: $font-size-14
      color: #9e9e9e
      font-family: $font-family-regular

</style>
