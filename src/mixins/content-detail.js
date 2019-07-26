import { cartComputed, cartMethods } from '@state/helpers'
import { resolveQueryScene } from '@utils/common'
import GetOptions from '@mixins/get-options'
import API from '@api'
import ShareHandler, { EVENT_CODE } from '@mixins/share-handler'
import ShareTrick from '@mixins/share-trick'

export default {
  data: {
    BottomEmptyVisible: false,
    isLoading: false,
    isShare: false,
    preview: 0,
    articleId: 0,
    currentType: 'common',
    screenWidth: 0,
    navTitle: '',
    details: {
      shareImage: '',
      goodStatus: 0,
      category: '',
      title: '',
      coverImage: '',
      coverLittleImage: '',
      coverVideo: '',
      authPhoto: '',
      authName: '',
      authSignature: '',
      authorLevel: 0,
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
  mixins: [GetOptions, ShareHandler, ShareTrick],
  onShareAppMessage() {
    this.isShare = true
    this.shareBtn()
    const shopId = wx.getStorageSync('shopId')
    const userInfo = wx.getStorageSync('userInfo')
    let path = this.currentType === 'video' ? this.$routes.content.CONTENT_ARTICLES_DETAIL_VIDEO : this.$routes.content.CONTENT_ARTICLES_DETAIL
    return {
      title: userInfo.nickname + '与你分享#' + this.details.title,
      path: `${path}?shopId=${shopId}&articleId=${this.articleId}`,
      imageUrl: this.details.shareImage
    }
  },
  onLoad() {
    let res = this.$wx.getSystemInfoSync()
    this.screenWidth = res.screenWidth
    this.BottomEmptyVisible = (res.statusBarHeight >= 44) ? 1 : false
    let options = this._$$initOptions()
    this.articleId = options.articleId || ''
    this.preview = +options.preview || 0
    if (options.scene) {
      wx.hideShareMenu()
      let { articleId, preview } = resolveQueryScene(options.scene)
      this.articleId = articleId
      this.preview = +preview
    }
    this.articleId && this._articleOperation('browse')
  },
  onShow() {
    if (this.isShare) {
      this.isShare = false
      return false
    }
    this._getDetails(true, true)
    this.$$shareHandler({
      event: EVENT_CODE.ARTICLE_DETAIL,
      articleId: this.articleId
    })
  },
  onUnload() {
    this.$refs.navigationBar && this.$refs.navigationBar._initHeadStyle()
    this.details = {
      shareImage: '',
      goodStatus: 0,
      category: '',
      title: '',
      coverImage: '',
      coverLittleImage: '',
      coverVideo: '',
      authPhoto: '',
      authName: '',
      authSignature: '',
      authorLevel: 0,
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
    this.navTitle = ''
  },
  methods: {
    ...cartMethods,
    _getDetails(isLikes = true, showLoading = false) {
      API.Content.getDetails({ id: this.articleId, preview: this.preview }, showLoading).then(res => {
        // this.$refs.navigationBar && this.$refs.navigationBar.setNavigationBarTitle(res.data.title)
        this.navTitle = res.data.title
        this.changeData(res.data, isLikes)
        showLoading && this.$wechat.hideLoading()
      })
    },
    changeData(obj, isLikes) {
      this.currentType = obj.type || 'common'
      this.details.shareImage = obj.thumb_image || ''
      this.details.title = obj.title
      this.details.category = obj.id
      this.details.coverVideo = obj.cover_video.full_url || ''
      if (this.details.coverVideo) {
        this.details.coverImage = obj.cover_video.cover_image_url
      } else {
        this.details.coverImage = obj.cover_image.source_url
        this.details.coverLittleImage = obj.cover_image.source_url + '?imageView2/3/w/30/q/1'
      }
      this.details.authPhoto = obj.author.head_image_url
      this.details.authName = obj.author.nickname
      this.details.authSignature = obj.author.sign
      this.details.authorLevel = obj.author.level
      this.details.goodCount = obj.fabulous_num > 999 ? '999+' : obj.fabulous_num
      this.details.lookCount = obj.browse_count >= 10000 ? obj.browse_count / 10000 + '万' : obj.browse_count
      this.details.shareCount = obj.share_count > 999 ? '999+' : obj.share_count
      this.details.goodStatus = obj.is_fabulou
      if (this.currentType !== 'video' && isLikes) this._getLikes(obj.fabulous_num)
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
                  value: contItem.image,
                  id: contItem.image.id
                })
                break
              case "video":
                details.push({
                  type: 'video',
                  value: contItem.video,
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
                if (contItem.goods && contItem.goods.goods_id) {
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
        if (item.type === 'text' && item.style_type === 'content_cookbook_food_list') {
          this.details.foodList = item.content[0].text
        }
        if (item.type === 'video' && item.style_type === 'content_video') {
          this.details.videoContent.url = item.content[0].video.full_url
          this.details.videoContent.name = item.content[0].video.name
          this.details.videoIntroduce = item.content[0].introduction
        }
        if (item.type === 'goods' && item.style_type === 'content_goods_list') {
          let arr  = item.content.filter(item => {
            return item.goods && item.goods.goods_id
          })
          this.details.goodsList = arr.map(item=>{
            return item.goods
          })
        }
      })
    },
    _getLikes(num) {
      let limit = num < 10 ? num : 10
      return API.Content.getLikes({ preview: this.preview, article_id: this.articleId, page: 1, limit }).then(res => {
        if (res.error === this.$ERR_OK) this.details.likes = res.data
      })
    },
    setLikeBtn() {
      if (this.preview || this.isLoading) return false
      this.isLoading = true
      this._articleOperation('fabulou').then(res => {
        this.details.goodStatus = !this.details.goodStatus
        this.isLoading = false
      })
    },
    shareBtn() {
      if (this.preview) return false
      this._articleOperation('share')
    },
    goToBuyCar() {
      if (this.preview) return false
      wx.switchTab({ url: `${this.$routes.main.SHOPPING_CART}` })
    },
    // 去詳情
    goToDetail(item) {
      if (this.preview || item.is_online === 0 || item.usable_stock === 0) return false
      this._articleOperation('guide_goods', { goods_id: item.goods_id, goods_sku_id: item.goods_sku_id })
      const shopId = wx.getStorageSync('shopId')
      wx.navigateTo({ url: `${this.$routes.main.GOODS_DETAIL}?shopId=${shopId}&id=${item.goods_id}&articleId=${this.articleId}` })
    },
    // 加购
    addGoods(item) {
      if (this.preview) return false
      this._articleOperation('guide_goods', { goods_id: item.goods_id, goods_sku_id: item.goods_sku_id })
      API.Choiceness.addShopCart({ goods_sku_id: item.goods_sku_id, scenes: 'article', scenes_data: this.articleId }).then((res) => {
        if (res.error === this.$ERR_OK) {
          this.$wechat.showToast('加入购物车成功', 1500, false)
          this.setCartCount()
        } else {
          this.$wechat.showToast(res.message)
        }
      })
    },
    _articleOperation(handle, other) {
      if (this.preview) return false
      let isLogin = this.$isLogin()
      return API.Content.articleOperation({ article_id: this.articleId, handle: handle, ...other }).then(res => {
        if (res.error === this.$ERR_OK) {
          if (handle === 'fabulou') this._getDetails(true, false)
          if (handle === 'share') this._getDetails(false, false)
        }
      }).finally(res => {
        this.isLoading = false
      })
    }
  }
}
