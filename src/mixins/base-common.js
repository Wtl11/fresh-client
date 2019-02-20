// 不需要自动重置data数据的页
import API from '@api'
import {corp} from '@utils/saas'

const unResetPage = []

export default {
  data() {
    return {
      formId: [],
      imageUrl: this.$imageUrl,
      shopName: ''
    }
  },
  onLoad() {
    this._saveCurrentPage()
    this._getShopName()
  },
  onUnload() {
    this._resetData()
    // this._clearWatcher()
  },
  methods: {
    _getShopName() {
      this.shopName = corp.shopName
    },
    _saveCurrentPage() {
      let url = this.$getUrl()
      // 记录页面栈
      if (url.includes('pages/lost') || url.includes('pages/error')) {
        return
      }
      this.$wx.setStorageSync('errorUrl', url)
    },
    $getUrl(path = '', query = '') {
      let url = path || this.$root.$mp.page.route
      let status = this.$checkIsTabPage(url)
      query = query || this.$root.$mp.query
      if (!status) {
        let string = ''
        for (let value in query) {
          string = `&${value}=${query[value]}`
        }
        url = string ? `${url}?${string.slice(1)}` : url
      }
      return url
    },
    _clearWatcher() {
      // 清除mpvue的wathcers
      this._watchers = []
      if (this.$mp) {
        this._watcher && this._watcher.teardown()
      }
    },
    _resetData() {
      // 重置页面组件的data数据
      if (!this.$mp) return
      // 重置页面的data数据
      let flag = unResetPage.some(value => {
        let reg = new RegExp(value)
        return reg.test(this.$options.__file)
      })
      if (!flag && this.$options.data) {
        Object.assign(this.$data, this.$options.data())
      }
    },
    $checkIsTabPage(path) {
      const TAB_REG = /(pages\/choiceness)|(pages\/shopping-cart)|(pages\/mine)/
      return TAB_REG.test(path)
    },
    $openSetting() {
      // todo
    },
    // 手机formId
    $getFormId(e) {
      if (!this.$isLogin()) {
        return
      }
      let formId = e.mp.detail.formId
      API.Form.getFormId({form_ids: [formId]})
    },
    // 判断是否跳转授权登录页面
    $isLogin() {
      let url = this.$getUrl()
      let token = wx.getStorageSync('token')
      if (!token) {
        wx.reLaunch({url: '/pages/login'})
        wx.setStorageSync('targetPage', url)
        return false
      }
      return true
    }
  }
}
