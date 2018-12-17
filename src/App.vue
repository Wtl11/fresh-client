<script>
  import {oauthMethods} from '@state/helpers'

  export default {
    created() {
      // 调用API从本地缓存中获取数据
      const logs = wx.getStorageSync('logs') || []
      logs.unshift(Date.now())
      wx.setStorageSync('logs', logs)

      console.log('app created and cache logs by setStorageSync')
    },
    onShow(options) {
      wx.setStorageSync('shopId', options.query.shopId)
      let token = wx.getStorageSync('token')
      if (!token) {
        let query = ''
        for (let key in options.query) {
          // 获取页面请求参数
          query += `${key}=${options.query[key]}`
          console.log(query)
        }
        // console.log(options)
        wx.setStorageSync('targetPage', `${options.path}${query ? '?' : ''}${query}`)
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
