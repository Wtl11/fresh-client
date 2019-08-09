<script>
  import {jwtMethods} from '@state/helpers'
  import {entryAppType, resolveQueryScene} from '@utils/common'
  import API from '@api'
  import {ERR_OK, baseURL} from '@utils/config'
  import $routes from './utils/routes'
  /* eslint-disable */
  export default {
    data() {
      return {
        codeMsg: ''
      }
    },
    created() {
      // 调用API从本地缓存中获取数据
      /*
       * 平台 api 差异的处理方式:  api 方法统一挂载到 mpvue 名称空间, 平台判断通过 mpvuePlatform 特征字符串
       * 微信：mpvue === wx, mpvuePlatform === 'wx'
       * 头条：mpvue === tt, mpvuePlatform === 'tt'
       * 百度：mpvue === swan, mpvuePlatform === 'swan'
       * 支付宝(蚂蚁)：mpvue === my, mpvuePlatform === 'my'
       */
    },
    async onLaunch() {
      let res = await API.Choiceness.getDefaultShopInfo()
      // wx.setStorageSync('social_name', res.data.social_name)
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
      wx.setStorageSync('options', options)
      this.setScene(options)
      // 获取shopId
      let shopId
      let defaultShopId = wx.getStorageSync('defaultShopId')
      let sceneShopId = resolveQueryScene(options.query.scene).shopId
      if (sceneShopId) {
        shopId = sceneShopId
      } else if(+options.query.shopId){
        shopId = +options.query.shopId
      } else if(!wx.getStorageSync('shopId')){
        if (!defaultShopId) {
          try {
            let res = await API.Choiceness.getDefaultShopInfo()
            if (res.error === 0) {
              wx.setStorageSync('defaultShopId', res.data.id)
            } else {
              wx.setStorageSync('defaultShopId', baseURL.defaultId)
            }
            defaultShopId = res.data.id || baseURL.defaultId
          } catch (e) {
            console.error(e)
          }
        }
        shopId = defaultShopId || baseURL.defaultId
      }
      if (shopId > 0) {
        wx.setStorageSync('shopId', shopId)
      }
      if (!defaultShopId) {
        try {
          let res = await API.Choiceness.getDefaultShopInfo()
          if (res.error === 0) {
            wx.setStorageSync('defaultShopId', res.data.id)
          } else {
            wx.setStorageSync('defaultShopId', baseURL.defaultId)
          }
          // defaultShopId = res.data.id || baseURL.defaultId
        } catch (e) {
          console.error(e)
        }
      }
      // 设页面
      let query = ''
      for (let key in options.query) {
        // 获取页面请求参数
        query += `${key}=${options.query[key]}&`
      }
      if (options.path !== this.$routes.main.LOST && options.path !== this.$routes.main.ERROR && options.path !== this.$routes.main.LOGIN ) {
        wx.setStorageSync('targetPage', `${options.path}${query ? '?' : ''}${query.slice(0, -1)}`)
      }
    },
    onPageNotFound(res) {
      $routes.main.LOST && wx.redirectTo({
        url: $routes.main.LOST
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
