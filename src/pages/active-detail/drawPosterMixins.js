import base64src from '@utils/create-qr-code-wx'
export default {
  methods: {
    async _actionDrawPoster() {
      let name = this.goodsMsg.name.length >= 12 ? this.goodsMsg.name.slice(0, 12) + '...' : this.goodsMsg.name
      let subName = this.goodsMsg.describe.length >= 12 ? this.goodsMsg.describe.slice(0, 12) + '...' : this.goodsMsg.describe
      if (!this.shareImg) {
        this.$wechat.showToast('图片生成失败，请重新尝试！')
        this.getQrCode()
        return
      }
      let qrCodeIsBase64 = /base64/i.test(this.shareImg)
      try {
        if (qrCodeIsBase64) {
          this.shareImg = await base64src(this.shareImg)
        }
      } catch (e) {
        console.error(e)
      }
      this.$sendMsg({
        event_no: 1005,
        goods_id: this.goodsId,
        title: this.goodsMsg.name
      })
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
          this.active = 1
          this.$wx.openSetting()
        }
      })
    }
  }
}
