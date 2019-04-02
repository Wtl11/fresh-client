<script>
  import {jwtMethods} from '@state/helpers'
  import {resolveQueryScene, entryAppType} from '@utils/common'
  import API from '@api'
  import {ERR_OK, baseURL} from '@utils/config'

  export default {
    data() {
      return {
        codeMsg: ''
      }
    },
    async created() {
      let res = await API.Choiceness.getDefaultShopInfo()
      let id = res.error === ERR_OK ? res.data.id : baseURL.defaultId
      wx.setStorageSync('defaultShopId', id)
      this.codeMsg = await this.$wechat.login()
      if (!wx.getStorageSync('token')) {
        let tokenJson = await API.Login.getToken({code: this.codeMsg.code}, false)
        if (tokenJson.error === ERR_OK) {
          let token = tokenJson.data.access_token
          let userInfo = tokenJson.data.customer_info
          wx.setStorageSync('token', token)
          wx.setStorageSync('userInfo', userInfo)
          this.setToken(token)
          this.setUserInfo(userInfo)
        }
      }
      //  判断是否可以静默登录
    },
    async onShow(options) {
      this.setScene(options)
      let storyShopId = baseURL.defaultId
      if (options.query.scene) {
        let {shopId} = resolveQueryScene(options.query.scene)
        // let sceneMsg = decodeURIComponent(options.query.scene)
        // const params = getParams(sceneMsg)
        storyShopId = shopId || wx.getStorageSync('defaultShopId')
      } else {
        if (!wx.getStorageSync('shopId') && !wx.getStorageSync('defaultShopId')) {
          let res = await API.Choiceness.getDefaultShopInfo()
          if (res.error === 0) {
            wx.setStorageSync('defaultShopId', res.data.id)
          } else {
            wx.setStorageSync('defaultShopId', baseURL.defaultId)
          }
        }
        storyShopId = wx.getStorageSync('shopId') || wx.getStorageSync('defaultShopId')
      }
      let shopId = options.query.shopId || +storyShopId
      wx.setStorageSync('shopId', shopId)
      // let token = wx.getStorageSync('token')
      let query = ''
      for (let key in options.query) {
        // 获取页面请求参数
        query += `${key}=${options.query[key]}&`
      }
      if (options.path !== 'pages/lost' && options.path !== 'pages/error' && options.path !== 'pages/login') {
        wx.setStorageSync('targetPage', `${options.path}${query ? '?' : ''}${query.slice(0, -1)}`)
      }
    },
    onPageNotFound(res) {
      wx.redirectTo({
        url: '/pages/lost'
      })
    },
    methods: {
      ...jwtMethods,
      setScene(options) {
        const type = entryAppType(options)
        wx.setStorageSync('entryAppType', type)
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  /*@import "~@design"*/
</style>
