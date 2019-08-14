<template>
  <div class="share-modal">
    <we-paint :preview='false' ref="wePaint" @drawDone="_setPosterUrl"></we-paint>
    <article class="share-panel-wrapper">
      <div v-if="showShare" class="share-mask" @click="_hideShareModal"></div>
      <div v-if="showShare&&posterData.name" class="poster-wrapper">
        <div class="background">
          <img v-if="imageUrl&&posterData.bg" :src="posterData.bg" class="bg-img">
        </div>
        <div class="goods-con">
          <img v-if="posterData.img" :src="posterData.img" class="goods-img">
          <div class="info-bottom">
            <div class="goods-info">
              <div class="name">{{posterData.name}}</div>
              <div class="text">{{posterData.goods.name}}</div>
              <div class="price-text">{{iconText}}</div>
              <div class="price">{{posterData.price}}元
              </div>
            </div>
            <div class="qr-code">
              <img v-if="shareQRCode" :src="shareQRCode" class="img">
              <div class="text">长按扫码疯抢</div>
            </div>
          </div>
        </div>
      </div>
      <section class="share-panel" :class="{show: showShare}">
        <div class="container">
          <button open-type="share" class="container-item-wrapper" @click="_hideShareModal">
            <img v-if="imageUrl" :src="imageUrl + '/yx-image/goods/pic-wechat@2x.png'" class="item-icon">
            <p class="text button">分享好友</p>
          </button>
          <nav class="container-item-wrapper" @click="_savePoster">
            <img v-if="imageUrl" :src="imageUrl + '/yx-image/goods/icon-poster@2x.png'" class="item-icon">
            <p class="text">保存海报</p>
          </nav>
        </div>
      </section>
    </article>
  </div>
</template>

<script type="text/ecmascript-6">
  import API from '@api'
  import base64src from '@utils/create-qr-code-wx'
  const COMPONENT_NAME = 'SHARE_MODAL'

  export default {
    name: COMPONENT_NAME,
    props: {
      shopId: {
        type: String,
        default: '0'
      }
    },
    data() {
      return {
        showShare: false,
        poster: '',
        posterData: {},
        shareQRCode: '',
        moduleName: '',
        shareItem: {}
      }
    },
    methods: {
      // 显示分享控件
      _showShareFun(item) {
        this.showShare = true
        this.shareItem = item
        console.log(item)
        // 如果分享的活动和上次分享的不一样，重新获取二维码
        if (this.moduleName !== item.module_name) {
          this.getQrCode()
        }
        this.moduleName = item.module_name
        // if (!this.poster) {
        //   // 没有海报且没有正在生成海报,重新生成海报
        //   this._actionDrawPoster()// 画海报
        // }
        // this.$sendMsg({ event_no: 1005, goods_id: this.goodsId, title: this.goodsMsg.name })
      },
      // 隐藏分享控件
      _hideShareModal() {
        this.showShare = false
      },
      // 获取分享二维码
      getQrCode(loading = false) {
        const flag = Date.now()
        let path = `${this.$routes.main.CHOICENESS}?shopId=${this.shopId}&moduleName=${this.moduleName}&flag=${flag}`
        API.Choiceness.createQrCodeApi({ path }, loading).then((res) => {
          if (res.error === this.$ERR_OK) {
            this.shareQRCode = res.data.image_url
            this._getPosterData()
          } else {
            console.warn(res)
          }
        }).catch(e => {
          console.warn(e)
        })
      },
      _getPosterData() {
        const goods = this.shareItem.list[0]
        let name = goods.name.length >= 12 ? goods.name.slice(0, 12) + '...' : goods.name
        let backgroundImg
        let moneyColor
        const corpName = 'platform'
        switch (corpName) {
          case 'platform':
            backgroundImg = this.imageUrl + '/yx-image/goods/pic-sharegoods1.png'
            moneyColor = '#FF8300'
            break
          case 'retuan':
            backgroundImg = this.imageUrl + '/yx-image/goods/pic-sharegoods2.png'
            moneyColor = '#FC4D1A'
            break
          default:
            break
        }
        this.posterData = {
          img: goods.goods_cover_image,
          name: name,
          price: goods.trade_price,
          bg: backgroundImg,
          color: moneyColor
        }
      },
      // 海报绘图
      async _actionDrawPoster() {
        let qrCodeIsBase64 = /base64/i.test(this.shareQRCode)
        try {
          if (qrCodeIsBase64) {
            this.shareQRCode = await base64src(this.shareQRCode)
          }
        } catch (e) {
          console.error(e)
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
              source: this.posterData.bg
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
              source: this.posterData.img,
              mode: 'aspectFill'
            },
            {
              el: '.share-title', // 店铺名称
              drawType: 'text-area',
              source: this.posterData.name,
              fontSize: 16,
              color: '#1f1f1f'
            },
            {
              el: '.share-sub-title', // 签名
              drawType: 'text-area',
              source: this.posterData.text,
              fontSize: 14,
              align: 'left',
              color: '#808080'
            },
            {
              el: '.share-group-box',
              drawType: 'text-area',
              source: this.iconText,
              fontSize: 14,
              color: this.posterData.color
            },
            {
              el: '.share-price-number',
              drawType: 'text',
              source: this.posterData.price,
              fontSize: 30,
              color: this.posterData.color
            },
            {
              el: '.share-price-icon',
              drawType: 'text',
              source: '元',
              fontSize: 17,
              color: this.posterData.color
            },
            {
              el: '.share-price-line',
              drawType: 'text',
              source: `${this.posterData.price}元`,
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
              source: this.shareQRCode,
              unLoad: /tmp/i.test(this.shareQRCode)
              // source: qrCode
            }
          ]
        }
        this.$refs.wePaint && this.$refs.wePaint.action(options, false)// 绘图
      },
      // 设置海报图片
      _setPosterUrl(pic) {
        this.poster = pic
      },
      // 保存海报到本地
      _savePoster() {
        this.$wx.saveImageToPhotosAlbum({
          filePath: this.poster,
          success: () => {
            this.handleHideSharePanel()
          },
          fail: () => {
            // 没有授权，重新调起授权
          }
        })
      },
      // 打开授权设置页
      _openWxSetting() {
        this.$wx.openSetting({
          success: (res) => {
            if (res.authSetting && res.authSetting['scope.writePhotosAlbum']) {
              this._savePoster()
            }
          },
          fail: (e) => {
            console.log(e)
          }
        })
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@designCommon"

  .share-panel-wrapper
    .share-mask
      position: fixed
      left: 0
      top: 0
      bottom: 0
      right: 0
      z-index: 999
      background: rgba(17, 17, 17, 0.7)
    .share-panel
      position: fixed
      bottom: -130%
      left: 0
      background: #fff
      width: 100%
      z-index:9999
      transition: all .25s
      &.show
        bottom :0
      .container
        background :$color-white
        display :flex
        box-sizing: border-box
        height: px-change-vw(100)
        padding-top: px-change-vw(14)
        .container-item-wrapper
          flex: 1
          position :relative
          .item-icon
            width : px-change-vw(45)
            height :@width
            display :block
            margin :0 auto px-change-vw(8)
          .text
            font-family: $font-family-regular
            font-size: 14px
            color: $color-text-sub
            text-align: center
  .poster-wrapper
    position: fixed
    top: px-change-vh(60)
    left: 0
    right: 0
    margin: auto
    padding: px-change-vw(82) 0 px-change-vw(15)
    background: #fff
    width: px-change-vw(270)
    overflow: hidden
    z-index: 9999
    -webkit-transition: all .5s
    transition: all .5s
    layout()
    justify-content: center
    align-items: center
    .poster
      width: 100%
      height: 100%
    .background
      position: absolute
      top: 0
      z-index: -1
      width: px-change-vw(270)
      height: px-change-vw(141)
      .bg-img
        width: 100%
        height: 100%
    .goods-con
      width: px-change-vw(240)
      box-shadow: 0 3px 16px 0 rgba(0,0,0,0.10)
      layout()
      .goods-img
        width: px-change-vw(240)
        height: @width
      .info-bottom
        padding: px-change-vw(14)
        layout(row)
        .goods-info
          flex: 1
          font-family: $font-family-regular
          .name
            width: 100%
            no-wrap-plus(1)
            font-size: 15px
            font-family: $font-family-medium
            color: $color-text-main
          .text
            width: 100%
            no-wrap-plus(1)
            margin-bottom: px-change-vw(10)
            font-size: 13px
            color: $color-text-sub
          .price-text
            font-size: 13px
            color: $color-money
          .price
            font-size: 22px
            color: $color-money
            .old-price
              font-size: 12px
              color: $color-text-sub
              text-decoration: line-through
        .qr-code
          align-self: flex-end
          width: 63px
          .img
            width: 63px
            height: @width
          .text
            font-size: 9px
            font-family: $font-family-regular
            color: $color-text-sub
</style>
