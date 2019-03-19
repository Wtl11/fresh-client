import API from '@api'
export default {
  data() {
    return {
      isAuthor: false,
      loginCode: {},
      nowTime: Date.now()
    }
  },
  async onLoad(options) {
    this.loginCode = await this.$wechat.login()
    this._authorization()
  },
  async onShow() {
    try {
      await this.$wechat.checkSession
    } catch (e) {
      this.loginCode = await this.$wechat.login()
    }
  },
  methods: {
    // 静默授权
    async _authorization() {
      try {
        let res = await API.Market.checkToken()
        if (res.error === this.$ERR_OK) {
          this.isAuthor = true
          return
        }
      } catch (e) {
      }
      try {
        let res = await API.Login.getToken({code: this.loginCode.code}, false)
        if (res.error !== this.$ERR_OK) {
          console.error(res, '静默授权失败!')
          this.loginCode = await this.$wechat.login()
          return
        }
        this.saveTokenInfo(res.data.access_token, res.data.customer_info)
      } catch (e) {
        this.loginCode = await this.$wechat.login()
        console.error(e, '静默授权失败')
      }
    },
    // 登录
    async _login(e, callback) {
      if (e.mp.detail.errMsg !== 'getUserInfo:ok') return
      let data = {code: this.loginCode.code, iv: e.target.iv, encryptedData: e.target.encryptedData}
      try {
        let res = await API.Login.getToken(data)
        if (res.error !== this.$ERR_OK) {
          this.$wechat.showToast('登录失败，请重新登录')
          this.$wechat.hideLoading()
          console.error(res, '登录失败，请重新登录')
          this.loginCode = await this.$wechat.login()
          return
        }
        this.saveTokenInfo(res.data.access_token, res.data.customer_info)
        callback && callback()
      } catch (e) {
        console.error(e, '登录失败，请重新登录!')
        this.loginCode = await this.$wechat.login()
      }
    },
    // saveTokenInfo
    saveTokenInfo(token, userInfo) {
      token && wx.setStorageSync('token', token)
      userInfo && wx.setStorageSync('userInfo', userInfo)
      this.isAuthor = true
    }
  }
}
