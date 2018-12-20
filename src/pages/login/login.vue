<template>
  <div class="login">
    <navigation-bar title="登录" :showArrow="false"></navigation-bar>
    <div class="login-img-box">
      <img :src="imageUrl + '/yx-image/login/login.png'" v-if="imageUrl" class="login-img">
      <form action="" report-submit>
        <button class="login-btn" @getuserinfo="_login" open-type="getUserInfo" formType="submit">
          <img :src="imageUrl + '/yx-image/login/icon-wechat@2x.png'" v-if="imageUrl" class="wx-logo">
          <span class="title">微信授权登录</span>
        </button>
      </form>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import NavigationBar from '@components/navigation-bar/navigation-bar'
  import API from '@api'
  import app from '@src/main'

  const PAGE_NAME = 'LOGIN'
  const TAB_BAR = app.config.tabBar.list
  export default {
    name: PAGE_NAME,
    components: {
      NavigationBar
    },
    data() {
      return {
        codeMsg: null,
        formId: 0
      }
    },
    async onLoad() {
      this.codeMsg = await this.$wechat.login()
    },
    methods: {
      _goNextPage() {
        let targetPage = wx.getStorageSync('targetPage')
        if (targetPage) {
          let isTab = TAB_BAR.findIndex((item) => targetPage.includes(item.pagePath))
          // tab页面记录参数
          isTab !== -1 ? wx.switchTab({url: '/' + targetPage}) : wx.redirectTo({url: '/' + targetPage})
          wx.setStorageSync('targetPage', '')
          return
        }
        wx.switchTab({url: '/' + TAB_BAR[0].pagePath})
      },
      async _login(e) {
        if (e.mp.detail.errMsg !== 'getUserInfo:ok') return
        let data = {code: this.codeMsg.code, iv: e.target.iv, encryptedData: e.target.encryptedData}
        let res = await API.Login.getToken(data)
        this.$wechat.hideLoading()
        if (res.error !== this.$ERR_OK) {
          this.$wechat.showToast('登录失败，请重新登录')
        }
        wx.setStorageSync('token', res.data.access_token)
        wx.setStorageSync('userInfo', res.data.customer_info)
        API.Form.getFormId({form_ids: [this.formId]})
        this._goNextPage()
      },
      getFormId(e) {
        this.formId = e.mp.detail.formId
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"

  .login
    width: 100%

  .login-img-box
    display: flex
    flex-direction: column
    align-items: center
    justify-content: center
    padding-top: 82px
    .login-img
      height: 120px
      width: @height
    .login-btn
      display: flex
      padding: 0
      margin: 35px 0
      justify-content: center
      align-items: center
      width: 300px
      height: 45px
      background: $color-main
      border-radius: 22.5px
      transition: all 0.3s
      &:active
        background: #9DD44C
        color: #E1F2C9
      .wx-logo
        width: 20px
        height: 20px
        margin-right: 5px
      .title
        font-size: $font-size-14
        color: $color-white
        font-family: $font-family-regular
      &:after
        border: none
</style>
