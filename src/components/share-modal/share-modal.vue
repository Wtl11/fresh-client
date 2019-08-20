<template>
  <div class="share-modal">
    <we-paint :loading="false" :preview="false" ref="wePaint" @drawDone="_savePoster"></we-paint>
    <div v-if="showShare" class="share-panel-wrapper">
      <div class="share-mask" @click="_hideShareModal"></div>
      <div v-if="posterData.bg" class="poster-wrapper" id="share-goods">
        <div class="background">
          <img v-if="posterData.bg" :src="posterData.bg" class="bg-img">
        </div>
        <div class="poster-con">
          <div class="top-con">
            <img v-if="posterData.userImg" :src="posterData.userImg" class="user-img">
            <div class="top-text">
              <div class="user-name">{{posterData.userName}}</div>
              <div class="title">{{posterData.textArr.topText}}</div>
            </div>
          </div>
          <div v-if="posterData.goods.length>1" class="goods-list">
            <div v-for="(item, index) in posterData.goods" :key="index" :id="'goods-'+index" class="goods-con">
              <img v-if="item.img" :src="item.img" class="goods-img">
              <div class="text-con">
                <div class="price-con"><span class="unit">￥</span><span class="price">{{posterData.goods[0].price}}</span></div>
                <div class="buy-text">{{posterData.textArr.buyText}}</div>
              </div>
            </div>
          </div>
          <div v-else-if="posterData.goods[0]" id="goods-0" class="one-goods">
            <img v-if="posterData.goods[0].img" :src="posterData.goods[0].img" class="goods-img">
            <div class="text-con">
              <div class="price-con"><span class="unit">￥</span><span class="price">{{posterData.goods[0].price}}</span></div>
              <div class="buy-text">{{posterData.textArr.buyText}}</div>
            </div>
          </div>
          <div class="bottom-con">
            <div class="goods-info">
              <div class="text1">{{posterData.textArr.text1}}</div>
              <div class="text2">{{posterData.textArr.text2}}</div>
              <div class="text3">{{posterData.textArr.text3}}</div>
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
          <button :id="'share-'+moduleName" open-type="share" class="container-item-wrapper" @click="_hideShareModal">
            <img v-if="imageUrl" :src="imageUrl + '/yx-image/goods/pic-wechat@2x.png'" class="item-icon">
            <p class="text button">分享好友</p>
          </button>
          <nav class="container-item-wrapper" @click="_handleSavePoster">
            <img v-if="imageUrl" :src="imageUrl + '/yx-image/goods/icon-poster@2x.png'" class="item-icon">
            <p class="text">保存海报</p>
          </nav>
        </div>
      </section>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import API from '@api'
  import base64src from '@utils/create-qr-code-wx'
  import WePaint from '@components/we-paint/we-paint'
  const COMPONENT_NAME = 'SHARE_MODAL'

  export default {
    name: COMPONENT_NAME,
    props: {
      endTime: {
        type: String,
        default: ''
      }
    },
    components: {
      WePaint
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
      _initData() {
        this.posterData = {}
        this.poster = ''
        this.shareQRCode = ''
        this.moduleName = ''
      },
      // 显示分享控件
      _showShareFun(item) {
        this.showShare = true
        this.shareItem = item
        // 如果分享的活动和上次分享的不一样，初始化参数并，重新获取二维码
        if (this.moduleName !== item.module_name) {
          this._initData()
          this.moduleName = item.module_name
          this.getQrCode()
        }
      },
      // 隐藏分享控件
      _hideShareModal() {
        this.showShare = false
      },
      // 点击保存海报
      _handleSavePoster() {
        this.$wechat.showLoading('海报保存中...')
        if (!this.shareQRCode) {
          // 没有二维码，重新获取二维码并画海报
          this.getQrCode(true)
          return
        }
        if (!this.poster) {
          // 没有海报,重新生成海报
          this._actionDrawPoster()// 画海报
        } else {
          this._savePoster(this.poster)// 保存海报
        }
        this.moduleName = this.shareItem.module_name
      },
      // 获取分享二维码
      getQrCode(drawPoster = false) {
        const shopId = wx.getStorageSync('shopId')
        let path = ''
        if (this.moduleName === 'activity_fixed') {
          path = `pages/flash-sale-list?id=${this.shareItem.id}&s=${shopId}`
        } else {
          path = `pages/choiceness?s=${shopId}&mn=${this.moduleName}`
        }
        console.log(`share path : ${path}`)
        API.Choiceness.createQrCodeApi({ path }, drawPoster).then((res) => {
          if (res.error === this.$ERR_OK) {
            this.shareQRCode = res.data.image_url
            this._getPosterData(drawPoster)
          } else {
            console.warn(res)
          }
        }).catch(e => {
          console.warn(e)
          this.$wechat.hideLoading()
        })
      },
      // 设置画海报的参数
      _getPosterData(drawPoster = false) {
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
        let _goodsArr = []
        if (this.shareItem && this.shareItem.list.length) {
          // 最多只展示4个商品
          let length = this.shareItem.list.length < 4 ? this.shareItem.list.length : 4
          for (let i = 0; i < length; i++) {
            const item = this.shareItem.list[i]
            _goodsArr.push({
              img: item.goods_cover_image,
              price: item.trade_price
            })
          }
        }
        // 不同活动的海报文案
        const textConfig = {
          new_client: {
            topText: '太划算了吧，新人特惠速度抢',
            text1: '新人特惠',
            text2: '首单钜惠，新人专享',
            text3: '美好实惠生活上赞播',
            buyText: '抢'
          },
          goods_hot_tag: {
            topText: '太划算了吧，今日爆款速度抢',
            text1: '今日爆款',
            text2: '热销爆品，超值人气',
            text3: '每天9点更新商品',
            buyText: '抢'
          },
          activity_fixed: {
            topText: '太划算了吧，限时抢购速度抢',
            text1: '限时抢购',
            text2: '每日更新正在疯抢中',
            text3: `本场 ${this.endTime} 结束`,
            buyText: '抢'
          },
          groupon: {
            topText: '太划算了吧，拼团返现速度抢',
            text1: '拼团返现',
            text2: '与社区邻居拼团购',
            text3: `本场 ${this.endTime} 结束`,
            buyText: '拼'
          },
          free_shipping: {
            topText: '太划算了吧，全国包邮速度抢',
            text1: '全国包邮',
            text2: '精选商品，送货到家',
            text3: '来自阿里巴巴的源头好货',
            buyText: '抢'
          }
        }
        this.posterData = {
          bg: backgroundImg,
          color: moneyColor,
          goods: _goodsArr,
          textArr: textConfig[this.shareItem.module_name]
        }
        const userInfo = wx.getStorageSync('userInfo') || ''
        if (userInfo) {
          this.posterData.userName = userInfo.nickname || ''
          this.posterData.userImg = userInfo.avatar || ''
        }
        drawPoster && this._actionDrawPoster()
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
              el: '.bg-img', // 背景图
              drawType: 'img',
              mode: 'aspectFill',
              source: this.posterData.bg
            },
            {
              el: '#share-goods .poster-con',
              drawType: 'rect-shadow',
              color: '#fff',
              shadow: [0, 3, 16, 'rgba(0,0,0,0.10)', '#fff', 0]
            },
            {
              el: '#share-goods .user-img',
              drawType: 'img',
              source: this.posterData.userImg,
              mode: 'aspectFill'
            },
            {
              el: '#share-goods .user-name',
              drawType: 'text-area',
              source: this.posterData.userName,
              fontSize: 11,
              color: '#808080'
            },
            {
              el: '#share-goods .title',
              drawType: 'text-area',
              source: this.posterData.textArr.topText,
              fontSize: 11,
              color: '#1f1f1f'
            },
            {
              el: '#share-goods .text1',
              drawType: 'text-area',
              source: this.posterData.textArr.text1,
              fontSize: 20,
              color: '#1f1f1f'
            },
            {
              el: '#share-goods .text2',
              drawType: 'text-area',
              source: this.posterData.textArr.text2,
              fontSize: 11,
              color: '#808080',
              marginBottom: '8px'
            },
            {
              el: '#share-goods .text3',
              drawType: 'text-area',
              source: this.posterData.textArr.text3,
              fontSize: 11,
              color: this.posterData.color
            },
            {
              el: '#share-goods .qr-code > .img',
              drawType: 'img',
              source: this.shareQRCode,
              unLoad: /tmp/i.test(this.shareQRCode)
            },
            {
              el: '#share-goods .qr-code > .text',
              drawType: 'text',
              source: '长按扫码疯抢',
              color: '#808080',
              fontSize: 9
            }
          ]
        }
        this.posterData.goods.forEach((item, idx) => {
          let goodsItem = [
            {
              el: `#goods-${idx} > .goods-img`,
              drawType: 'img',
              source: item.img,
              mode: 'aspectFill'
            },
            {
              el: `#goods-${idx} .text-con`,
              drawType: 'rect',
              color: '#ff8300'
            },
            {
              el: `#goods-${idx} .unit`,
              drawType: 'text',
              source: '￥',
              color: '#ffffff'
            },
            {
              el: `#goods-${idx} .price`,
              drawType: 'text',
              source: this.posterData.goods[0].price,
              fontSize: 18,
              height: '30px',
              color: '#ffffff'
            },
            {
              el: `#goods-${idx} .buy-text`,
              drawType: 'text-area',
              source: this.posterData.textArr.buyText,
              fontSize: 13,
              color: '#ffffff'
            }
          ]
          options.els = options.els.concat(goodsItem)
        })
        this.$refs.wePaint && this.$refs.wePaint.action(options, false)// 绘图
      },
      // 保存海报到本地
      _savePoster(pic) {
        this.poster = pic
        let self = this
        this.$wx.saveImageToPhotosAlbum({
          filePath: pic,
          success: () => {
            this.$wechat.showToast('海报保存成功')
            this._hideShareModal()
            this.$wechat.hideLoading()
          },
          fail: (e) => {
            this.$wechat.hideLoading()
            // 没有授权，重新调起授权
            self.$wx.showModal({
              content: '保存海报需进行相册授权，请到小程序设置中打开授权',
              confirmText: '去授权',
              confirmColor: '#73C200',
              success(res) {
                if (res.confirm) {
                  self.$wx.openSetting({
                    success: (res) => {
                      if (res.authSetting && res.authSetting['scope.writePhotosAlbum']) {
                        pic && self._savePoster(pic)
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
    .poster-con
      box-sizing: border-box
      background: #fff
      width: px-change-vw(240)
      margin: 0 px-change-vw(14)
      padding: px-change-vw(12) px-change-vw(14)
      box-shadow: 0 3px 16px 0 rgba(0,0,0,0.10)
      layout()
      .top-con
        width: 100%
        padding-bottom: px-change-vh(9)
        layout(row)
        .user-img
          width: 35px
          height: @width
          margin-right: 6px
          border: 1px solid #E7E7E7
          border-radius: 100%
          overflow: hidden
        .top-text
          flex: 1
          layout()
          align-items: center
          font-family: $font-family-regular
          font-size: 11px
          line-height: 1
          .user-name
            width: 100%
            color: $color-text-sub
            padding-bottom: 6px
          .title
            width: 100%
            color: #1f1f1f
      .goods-list
        width: 100%
        min-height: px-change-vw(160)
        layout(row)
        justify-content: space-between
        .goods-con
          width: px-change-vw(102)
          height: @width
          max-width: 49%
          position: relative
          margin-bottom: px-change-vw(8)
          .goods-img
            width: 100%
            height: 100%
      .one-goods
        width: px-change-vw(212)
        position: relative
        .goods-img
          width: px-change-vw(212)
          height: @width
      .text-con
        box-sizing: border-box
        position: absolute
        bottom: 0
        width: 100%
        height: 24px
        line-height: 24px
        padding: 0 5px
        color: #fff
        background: #ff8300
        layout(row)
        justify-content: space-between
        .price-con
          font-family: $font-family-medium
          font-size: 18px
          .unit
            font-size: 13px
            font-family: $font-family-regular
        .buy-text
          font-family: $font-family-regular
          font-size: 14px
      .bottom-con
        box-sizing: border-box
        padding-top: px-change-vh(15)
        layout(row)
        .goods-info
          flex: 1
          font-family: $font-family-regular
          line-height: 1
          .text1
            width: 100%
            margin-bottom: px-change-vh(9)
            font-size: 20px
            font-family: $font-family-medium
            color: #1f1f1f
          .text2
            width: 100%
            margin-bottom: px-change-vh(23)
            font-size: 11px
            color: $color-text-sub
          .text3
            font-size: 11px
            color: $color-money
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
