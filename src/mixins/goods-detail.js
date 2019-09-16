import {ACTIVE_TYPE} from '@utils/contants'
import API from '@api'
import base64src from '@utils/create-qr-code-wx'

export default {
  data() {
    return {
      latitude: 0,
      longitude: 0,
      tipTop: ''
    }
  },
  methods: {
    // 检查是否能参加拼团活动
    async _checkCanGroup() {
      if (this.activityType !== ACTIVE_TYPE.GROUP_ON) return
      if (wx.getStorageSync('token')) {
        const hasOrder = await API.Global.checkHasGroupOrder()
        if (hasOrder.data && hasOrder.data.is_buy_groupon === 1) return
      }
      // const hasOrder = await API.Global.checkHasGroupOrder()
      // 检查是否有拼团订单，没有订单才判断地理位置, 没有0  有1
      try {
        // 获取地理位置
        // if (this.latitude && this.longitude) return
        let res = await this.$wechat.getLocation()
        this.longitude = res.longitude
        this.latitude = res.latitude
        if (!this.latitude || !this.longitude) {
          wx.navigateTo({url: `${this.$routes.main.OPEN_LOCATION}`})
        } else {
          res = await API.Global.checkShopDistance({longitude: this.longitude, latitude: this.latitude})
          let name = res.data.shop.social_name
          name = name.substring(0, 8) + (name.length > 8 ? '...' : '')
          this.tipTop = res.data.distance_judge === 0 ? '' : `当前位置不可参与${name}社区拼团活动`
        }
      } catch (e) {
        if (e && e.errMsg) {
          this.longitude = 0
          this.latitude = 0
          this.tipTop = ''
          wx.navigateTo({url: `${this.$routes.main.OPEN_LOCATION}`})
        }
      }
    },
    /**
     * 画海报
     * @private
     */
    async _getPosterData() {
      let maxLen = 9
      let name = this.goodsMsg.name.length >= maxLen ? this.goodsMsg.name.slice(0, maxLen) + '...' : this.goodsMsg.name
      let subName = this.goodsMsg.describe.length >= maxLen ? this.goodsMsg.describe.slice(0, maxLen) + '...' : this.goodsMsg.describe
      let backgroundImg
      let moneyColor
      switch (this.corpName) {
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
        name: name,
        text: subName,
        bg: backgroundImg,
        color: moneyColor
      }
      let qrCodeIsBase64 = /base64/i.test(this.shareImg)
      try {
        if (qrCodeIsBase64) {
          this.shareImg = await base64src(this.shareImg)
        }
      } catch (e) {
      }
    },
    // 隐藏分享控件
    handleHideSharePanel() {
      this.showSharePanel = false
    },
    // 显示分享控件
    async handleShowShare() {
      this.showSharePanel = true
      // 没有二维码，重新请求二维码，并重画海报
      if (!this.shareImg) {
        this.getQrCode(true)
      }
      this._getPosterData()
    },
    // 海报绘图
    async _actionDrawPoster() {
      this.$wechat.showLoading('海报保存中')
      if (this.poster) {
        this._setPosterUrl(this.poster)
      }
      let options = {
        canvasId: 'we-paint',
        multiple: 1,
        panel: {
          el: '.poster-wrapper'
        },
        els: [
          {
            el: '.poster-wrapper',
            drawType: 'rect',
            color: '#fff'
          },
          {
            el: '.poster-wrapper > .background', // 背景图
            drawType: 'img',
            mode: 'aspectFill',
            source: this.posterData.bg
          },
          {
            el: '.goods-con',
            drawType: 'rect-shadow',
            color: '#fff',
            shadow: [0, 2, 22, 'rgba(0,0,0,0.10)', '#fff', 0]
          },
          {
            el: '.goods-con > .goods-img', // 图片
            drawType: 'img',
            source: this.goodsMsg.goods_cover_image,
            mode: 'aspectFill'
          },
          {
            el: '.goods-info > .name', // 店铺名称
            drawType: 'text-area',
            source: this.posterData.name,
            fontSize: 15,
            color: '#111111'
          },
          {
            el: '.goods-info > .text', // 签名
            drawType: 'text-area',
            source: this.posterData.text,
            fontSize: 13,
            align: 'left',
            color: '#808080'
          },
          // {
          //   el: '.goods-info > .price-text',
          //   drawType: 'text-area',
          //   source: this.iconText,
          //   fontSize: 13,
          //   color: this.posterData.color
          // },
          {
            el: '.goods-info > .price > .number',
            drawType: 'text',
            source: this.goodsMsg.trade_price,
            fontSize: 22,
            color: this.posterData.color,
            yAdjust: 6
          },
          {
            el: '.goods-info > .price > .unit',
            drawType: 'text',
            source: '元',
            fontSize: 20,
            color: this.posterData.color,
            yAdjust: 6
          },
          {
            el: '.goods-info > .price > .old-price',
            drawType: 'text',
            source: `${this.goodsMsg.original_price}元`,
            fontSize: 12,
            color: '#B7B7B7',
            yAdjust: 3
          },
          {
            el: '.goods-info > .price > .old-price > .line-through',
            drawType: 'rect',
            color: '#b7b7b7',
            yAdjust: 1
          },
          {
            el: '.info-bottom > .qr-code > .img',
            drawType: 'img',
            source: this.shareImg,
            unLoad: /tmp/i.test(this.shareImg)
            // source: qrCode
          },
          {
            el: '.info-bottom > .qr-code > .text',
            drawType: 'text',
            source: `长按扫码疯抢`,
            fontSize: 9,
            color: '#808080',
            xAdjust: 2
          }
        ]
      }
      this.$refs.wePaint && this.$refs.wePaint.action(options, false)// 绘图
    },
    // 设置海报图片
    _setPosterUrl(pic) {
      this.poster = pic
      this.$wechat.hideLoading()
      this._savePoster()
      // 如果生成好海报前点击了保存海报，则在生成好海报后调用保存方法
      // if (this.clickSave) {
      //   this.$wechat.hideLoading()
      //   this._savePoster()
      //   this.clickSave = false
      // }
    },
    // 保存海报到本地
    _savePoster() {
      // if (!this.poster) return this.$wechat.showToast('海报生成中')
      // if (!this.poster) {
      //   // 没有海报,重新生成海报
      //   this.$wechat.showLoading('海报生成中')
      //   // this._actionDrawPoster()
      //   this.clickSave = true
      //   return
      // }
      this._isSharing = true
      const self = this
      this.$wx.saveImageToPhotosAlbum({
        filePath: this.poster,
        success: () => {
          this.$wechat.showToast('海报保存成功')
          this.handleHideSharePanel()
          this.$sendMsg({ event_no: 1005, goods_id: this.goodsId, title: this.goodsMsg.name })
        },
        fail: (e) => {
          // 没有授权，重新调起授权
          this.$wx.showModal({
            content: '保存海报需进行相册授权，请到小程序设置中打开授权',
            confirmText: '去授权',
            confirmColor: '#73C200',
            success(res) {
              if (res.confirm) {
                self.$wx.openSetting({
                  success: (res) => {
                    if (res.authSetting && res.authSetting['scope.writePhotosAlbum']) {
                      self._savePoster()
                    }
                  }
                })
              }
            }
          })
        }
      })
    }
  }
}
