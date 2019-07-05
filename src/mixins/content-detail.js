import { cartComputed, cartMethods } from '@state/helpers'
import { resolveQueryScene } from '@utils/common'
import GetOptions from '@mixins/get-options'
import API from '@api'

export default {
  data: {
    BottomEmptyVisible: false
  },
  computed: {
    ...cartComputed
  },
  mixins: [GetOptions],
  onShareAppMessage() {
    this.shareBtn()
    const shopId = wx.getStorageSync('shopId')
    console.log('this.details.id', this.details.id)
    return {
      title: '赞播优鲜',
      path: `${this.$routes.content.CONTENT_ARTICLES_DETAIL_VIDEO}?shopId=${shopId}&&contentId=${this.details.id}`,
      imageUrl: '',
      success: (res) => {
      },
      fail: (res) => {
      }
    }
  },
  onLoad() {
    let res = this.$wx.getSystemInfoSync()
    this.BottomEmptyVisible = (res.statusBarHeight >= 44) ? 1 : false
    console.log(res)
  },
  onShow() {
    let options = this._$$initOptions()
    console.log(options, 'options')
    if (options.scene) {
      wx.hideShareMenu()
      let { shopId } = resolveQueryScene(options.scene)
      this.shopId = shopId
    }
  },
  methods: {
    ...cartMethods,
    setLikeBtn() {

    },
    shareBtn() {

    },
    goToBuyCar() {
      wx.navigateTo({ url: `${this.$routes.main.SHOPPING_CART}` })
    },
    // 去詳情
    goToDetail(item) {
      console.log('goToDetail', item)
      wx.navigateTo({ url: `${this.$routes.main.GOODS_DETAIL}?id=${item.id}` })
    },
    // 加购
    addGoods(item) {
      API.Choiceness.addShopCart({ goods_sku_id: item.goods_sku_id, activity_id: item.activity_id }).then((res) => {
        if (res.error === this.$ERR_OK) {
          this.$wechat.showToast('加入购物车成功')
          this.setCartCount()
        } else {
          this.$wechat.showToast(res.message)
        }
      })
      console.log(item)
    }
  }
}
