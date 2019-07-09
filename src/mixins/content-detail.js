import { cartComputed, cartMethods } from '@state/helpers'
import { resolveQueryScene } from '@utils/common'
import GetOptions from '@mixins/get-options'
import API from '@api'

export default {
  data: {
    BottomEmptyVisible: false,
    preview: 0,
    contentId: '',
    currentType: 'common',
    details: {
      goodStatus: 0,
      category: '',
      title: '',
      coverImage: '',
      coverVideo: '',
      authPhoto: '',
      authName: '',
      authSignature: '',
      goodCount: 0,
      lookCount: 0,
      shareCount: 0,
      // 不同情况的字段
      videoContent: {
        url: '',
        name: ''
      },
      videoIntroduce: '',
      foodList: '',
      goodsList: [],
      // 内容详情
      details: [],
      likes: []
    }
  },
  computed: {
    ...cartComputed
  },
  mixins: [GetOptions],
  onShareAppMessage() {
    this.shareBtn()
    const shopId = wx.getStorageSync('shopId')
    let path = this.currentType === 'video' ? this.$routes.content.CONTENT_ARTICLES_DETAIL_VIDEO : this.$routes.content.CONTENT_ARTICLES_DETAIL
    return {
      title: this.details.title,
      path: `${path}?shopId=${shopId}&contentId=${this.contentId}`,
      imageUrl: this.details.coverImage,
      success: (res) => {
      },
      fail: (res) => {
      }
    }
  },
  onLoad() {
    let res = this.$wx.getSystemInfoSync()
    this.BottomEmptyVisible = (res.statusBarHeight >= 44) ? 1 : false
    this.preview = 0
    let options = this._$$initOptions()
    if (options.contentId) {
      this.contentId = options.contentId || ''
    }
    if (options.scene) {
      this.preview = 1
      wx.hideShareMenu()
      let { shopId, contentId } = resolveQueryScene(options.scene)
      this.shopId = shopId
      this.contentId = contentId
    }
    this.contentId && this._articleOperation('browse')
  },
  onShow() {
    let options = this._$$initOptions()
    console.log(options, 'options')
    if (options.contentId) {
      this.contentId = options.contentId || ''
      this.preview = 0
    }
    if (options.scene) {
      this.preview = 1
      wx.hideShareMenu()
      let { shopId, contentId } = resolveQueryScene(options.scene)
      this.shopId = shopId
      this.contentId = contentId
    }
    this._getDetails()
  },
  methods: {
    ...cartMethods,
    _getDetails() {
      API.Content.getDetails({ id: this.contentId, preview: this.preview }).then(res => {
        this.changeData(res.data)
      })
    },
    changeData(obj) {
      this.currentType = obj.type || 'common'
      this.details.title = obj.title
      this.details.category = obj.id
      this.details.coverImage = obj.cover_image.source_url
      this.details.coverVideo = obj.cover_video.full_url || ''
      this.details.authPhoto = obj.author.head_image_url
      this.details.authName = obj.author.nickname
      this.details.authSignature = obj.author.sign
      this.details.goodCount = obj.fabulous_num
      this.details.lookCount = obj.browse_count
      this.details.shareCount = obj.share_count
      this.details.goodStatus = obj.is_fabulou
      if (this.currentType !== 'video') this._getLikes()
      obj.assembly.forEach(item => {
        if (item.type === 'combination' && item.style_type === 'content') {
          let details = []
          item.content.map(cont => {
            if (!(cont.content && cont.content.length)) return false
            let contItem = cont.content[0]

            /* eslint-disable */
            switch (cont.type) {
              case "image":
                details.push({
                  type: 'image',
                  value: contItem.image.source_url,
                  id: contItem.image.id
                })
                break
              case "video":
                details.push({
                  type: 'video',
                  value: contItem.video.full_url,
                  id: contItem.video.id
                })
                break
              case "text":
                details.push({
                  type: 'text',
                  value: contItem.text
                })
                break
              case "goods":
                if (contItem.goods.goods_id) {
                  details.push({
                    type: 'goods',
                    value: contItem.goods
                  })
                }
                break
            }
          })
          this.details.details = details
        }
        if (item.type === 'text' && item.style_type === 'content_foods_list') {
          this.details.foodList = item.content[0].text
        }
        if (item.type === 'video' && item.style_type === 'content_video') {
          this.details.videoContent.url = item.content[0].video.full_url
          this.details.videoContent.name = item.content[0].video.name
        }
        if (item.type === 'goods' && item.style_type === 'content_goods_list') {
          this.details.goodsList = item.content.map(item => {
            return item.goods
          })
        }
      })
    },
    _getLikes() {
      let limit = this.goodStatus < 7 ? this.goodStatus : 7
      return API.Content.getLikes({ preview: this.preview, article_id: this.contentId, page: 1, limit}).then(res => {
        if (res.error === this.$ERR_OK) this.details.likes = res.data
      })
    },
    setLikeBtn() {
      this.details.goodStatus = !this.details.goodStatus
      this._articleOperation('fabulou')
    },
    shareBtn() {
      this._articleOperation('share')
    },
    goToBuyCar() {
      wx.switchTab({ url: `${this.$routes.main.SHOPPING_CART}` })
    },
    // 去詳情
    goToDetail(item) {
      this._articleOperation('guide_goods', { goods_id: item.goods_id, goods_sku_id: item.goods_sku_id })
      wx.navigateTo({ url: `${this.$routes.main.GOODS_DETAIL}?id=${item.goods_id}&contentId=${this.contentId}` })
    },
    // 加购
    addGoods(item) {
      this._articleOperation('guide_goods', { goods_id: item.goods_id, goods_sku_id: item.goods_sku_id })
      API.Choiceness.addShopCart({ goods_sku_id: item.goods_sku_id, content_id: this.contentId }).then((res) => {
        if (res.error === this.$ERR_OK) {
          this.$wechat.showToast('加入购物车成功')
          this.setCartCount()
        } else {
          this.$wechat.showToast(res.message)
        }
      })
    },
    _articleOperation(handle, other) {
      if (this.preview) return false
      let isLogin = this.$isLogin()
      console.log('isLogin', isLogin)
      return API.Content.articleOperation({ article_id: this.contentId, handle: handle, ...other }).then(res => {
        if (res.error === this.$ERR_OK) {
          if (handle === 'fabulou') this._getDetails()
        }
      })
    }
  }
}
