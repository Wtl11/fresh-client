<script>
  import {oauthMethods} from '@state/helpers'

  export default {
    created() {
    },
    onShow(options) {
      let storyShopId = wx.getStorageSync('shopId') || 1
      let shopId = options.query.shopId || +storyShopId
      wx.setStorageSync('shopId', shopId)
      let token = wx.getStorageSync('token')
      if (!token) {
        let query = ''
        for (let key in options.query) {
          // 获取页面请求参数
          query += `${key}=${options.query[key]}`
        }
        if (options.path !== 'pages/lost' && options.path !== 'pages/error' && options.path !== 'pages/login') {
          wx.setStorageSync('targetPage', `${options.path}${query ? '?' : ''}${query}`)
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
