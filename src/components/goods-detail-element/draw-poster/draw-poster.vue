<template>
  <article class="share-goods" id="share-goods">
    <img v-if="imageUrl" :src="imageUrl + '/yx-image/choiceness/pic-sharegoods@2x.png'" class="share-bg" mode="aspectFill">
    <div class="share-box">
      <img v-if="imageUrl" :src="imageUrl + '/yx-image/choiceness/5@1x.png'" class="share-img" mode="aspectFill">
      <div class="share-bottom">
        <img v-if="imageUrl" :src="imageUrl + '/yx-image/choiceness/5@1x.png'" class="wem-img" mode="aspectFill">
        <div class="share-title">智利J级车厘子250g</div>
        <div class="share-sub-title">智利J级车厘子250g</div>
        <div class="share-group-box">团购价</div>
        <div class="price-box">
          <div class="share-price-number">{{goodsMsg.trade_price}}</div>
          <div class="share-price-icon">元</div>
          <div class="share-price-line">
            {{goodsMsg.original_price}}元
            <i class="share-money-line"></i>
          </div>
        </div>
      </div>
    </div>
<!--    <we-paint ref="wePaint" @drawDone="_drawPosterDone"></we-paint>-->
  </article>
</template>

<script type="text/ecmascript-6">
  import WePaint from '@components/we-paint/we-paint'
  import base64src from '@utils/create-qr-code-wx'

  const COMPONENT_NAME = 'DRAW_POSTER'

  export default {
    name: COMPONENT_NAME,
    components: {
      WePaint
    },
    props: {
      goodsMsg: {
        type: Object,
        default: () => {}
      },
      shareImg: {
        type: String,
        default: ''
      }
    },
    data() {
      return {
      }
    },
    methods: {
      async action() {
        let name = this.goodsMsg.name.length >= 12 ? this.goodsMsg.name.slice(0, 12) + '...' : this.goodsMsg.name
        let subName = this.goodsMsg.describe.length >= 12 ? this.goodsMsg.describe.slice(0, 12) + '...' : this.goodsMsg.describe
        let qrCodeIsBase64 = /base64/i.test(this.shareImg)
        try {
          if (qrCodeIsBase64) {
            this.shareImg = await base64src(this.shareImg)
          }
        } catch (e) {
          console.error(e)
        }
        let backGroundImg
        let moneyColor
        switch (this.corpName) {
          case 'platform':
            backGroundImg = this.imageUrl + '/yx-image/choiceness/pic-sharegoods@2x.png'
            moneyColor = '#FF8300'
            break
          case 'retuan':
            backGroundImg = this.imageUrl + '/yx-image/retuan/pic-sharegoods@2x.png'
            moneyColor = '#FC4D1A'
            break
          default:
            break
        }
        let options = {
          canvasId: 'we-paint',
          multiple: 1,
          panel: {
            el: '#share-goods'
          },
          els: [
            {
              el: '#share-goods',
              drawType: 'rect',
              color: '#fff'
            },
            {
              el: '#share-goods > .share-bg', // 背景图
              drawType: 'img',
              mode: 'aspectFill',
              source: backGroundImg
            },
            {
              el: '.share-box',
              drawType: 'rect-shadow',
              color: '#fff',
              shadow: [0, 2, 22, 'rgba(0,0,0,0.10)', '#fff', 0]
            },
            {
              el: '.share-box > .share-img', // 图片
              drawType: 'img',
              source: this.goodsMsg.goods_cover_image,
              mode: 'aspectFill'
            },
            {
              el: '.share-title', // 店铺名称
              drawType: 'text-area',
              source: name,
              fontSize: 16,
              color: '#1f1f1f'
            },
            {
              el: '.share-sub-title', // 签名
              drawType: 'text-area',
              source: subName,
              fontSize: 14,
              align: 'left',
              color: '#808080'
            },
            {
              el: '.share-group-box',
              drawType: 'text-area',
              source: '团购价',
              fontSize: 14,
              color: moneyColor
            },
            {
              el: '.share-price-number',
              drawType: 'text',
              source: this.goodsMsg.trade_price,
              fontSize: 30,
              color: moneyColor
            },
            {
              el: '.share-price-icon',
              drawType: 'text',
              source: '元',
              fontSize: 17,
              color: moneyColor
            },
            {
              el: '.share-price-line',
              drawType: 'text',
              source: `${this.goodsMsg.original_price}元`,
              fontSize: 17,
              color: '#B7B7B7'
            },
            {
              el: '.share-money-line',
              drawType: 'rect',
              color: '#b7b7b7'
            },
            {
              el: '.share-bottom > .wem-img',
              drawType: 'img',
              source: this.shareImg,
              unLoad: /tmp/i.test(this.shareImg)
              // source: qrCode
            }
          ]
        }
        this.$refs.wePaint && this.$refs.wePaint.action(options, false)
      },
      _drawPosterDone(pic) {
        this.pic = pic
        // 保存到本地，并预览
        this.$wx.saveImageToPhotosAlbum({
          filePath: pic,
          success: () => {
          },
          fail: () => {
            // 拒绝授权重新调起授权
            this.$wx.openSetting()
          }
        })
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@designCommon"

  .share-goods
    padding: 32.8vw 5.3vw 17vw
    box-sizing: border-box
    position: fixed
    width: 100vw
    height: 100vh
    right :-100%
    .share-bg
      position: absolute
      left: 0
      top: 0
      height: 52.5vw
      width: 100vw
      display: block
      z-index: 9
    .share-box
      border-radius: 10px
      background: #fff
      box-shadow: 0 2px 11px 0 rgba(0, 0, 0, 0.10)
      z-index: 11
      position: relative
      .share-img
        display: block
        width: 89.4vw
        height: 89.4vw
        border-top-left-radius: 10px
        border-top-right-radius: 10px
    .share-bottom
      padding: 15px 15px 30px
      position: relative
    .wem-img
      position: absolute
      right: 15px
      bottom: 15px
      width: 90px
      height: 90px
      display: block
    .share-title
      font-size: $font-size-16
      color: #1f1f1f
      font-family: $font-family-medium
      margin-bottom: 5px
    .share-sub-title
      font-size: $font-size-14
      color: $color-text-sub
      font-family: $font-family-regular
      margin-bottom: 16px
    .share-group-box
      font-size: $font-size-14
      color: $color-money
      font-family: $font-family-regular
      width: 55px
      height: 20px
      text-align: center
      line-height: 20px
      margin-bottom: -5px
    .price-box
      layout(row)
      align-items: flex-end
      .share-price-number
        font-size: 30px
        color: $color-money
        font-family: $font-family-medium
        line-height: 1
        margin-right: 1px
      .share-price-icon
        font-size: $font-size-17
        color: $color-money
        font-family: $font-family-medium
        line-height: 1
        margin-right: 1px
        padding-bottom: 2px
      .share-price-line
        font-size: $font-size-17
        color: #b7b7b7
        font-family: $font-family-regular
        line-height: 1
        padding-bottom: 2px
        position: relative
        .share-money-line
          height: 1px
          width: 100%
          background: #888
          col-center()
</style>
