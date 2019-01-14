<script>
  import {oauthMethods} from '@state/helpers'
  import {getParams} from '@utils/common'
  import API from '@api'

  export default {
    async created() {
      let res = await API.Choiceness.getDefaultShopInfo()
      if (res.error === 0) {
        wx.setStorageSync('defaultShopId', res.data.id)
      } else {
        wx.setStorageSync('defaultShopId', 7)
      }
    },
    async onShow(options) {
      let storyShopId = 7
      if (options.query.scene) {
        let sceneMsg = decodeURIComponent(options.query.scene)
        const params = getParams(sceneMsg)
        storyShopId = params.shopId || wx.getStorageSync('defaultShopId')
      } else {
        if (!wx.getStorageSync('shopId') && !wx.getStorageSync('defaultShopId')) {
          let res = await API.Choiceness.getDefaultShopInfo()
          if (res.error === 0) {
            wx.setStorageSync('defaultShopId', res.data.id)
          } else {
            wx.setStorageSync('defaultShopId', 7)
          }
        }
        storyShopId = wx.getStorageSync('shopId') || wx.getStorageSync('defaultShopId')
      }
      let shopId = options.query.shopId || +storyShopId
      wx.setStorageSync('shopId', shopId)
      let token = wx.getStorageSync('token')
      if (!token) {
        let query = ''
        for (let key in options.query) {
          // 获取页面请求参数
          query += `${key}=${options.query[key]}&`
        }
        if (options.path !== 'pages/lost' && options.path !== 'pages/error' && options.path !== 'pages/login') {
          wx.setStorageSync('targetPage', `${options.path}${query ? '?' : ''}${query.slice(0, -1)}`)
        }
        wx.reLaunch({url: '/pages/login'})
      }
      // todo
      // this.update('')
    },
    onPageNotFound(res) {
      wx.redirectTo({
        url: '/pages/lost'
      })
    },
    methods: {
      ...oauthMethods
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"
</style>
