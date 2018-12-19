<template>
  <div class="mine-housing">
    <navigation-bar title="我的小区"></navigation-bar>
    <div class="hose-img-box">
      <img :src="imageUrl + '/yx-image/group/pic-banner4@2x.png'" v-if="imageUrl" class="hose-img">
    </div>
    <div class="hose-tab">
      <div class="hose-box">
        <div :class="{'hose-tab-item-active': navIdx === index}" class="hose-tab-item" v-for="(item, index) in nav" :key="index" @click="_setNav(index, $event)">{{item}}</div>
        <div class="line" :style="{'left': navLeft + 'px'}"></div>
      </div>
    </div>
    <div class="big-box">
      <div class="hose-content" :style="{'transform': ' translateX('+ -(navIdx * width) +'px)'}">
        <!--申请-->
        <div class="hoseApply">
          <div class="qr-code-box">
            <img :src="imageUrl + '/yx-image/group/pic-frame@2x.png'" v-if="imageUrl" class="qr-code-bg" mode="aspectFill">
            <img :src="imageUrl + '/yx-image/login/wx-qr-code.jpg'" v-if="imageUrl" class="qr-code-img">
          </div>
          <div class="code-tip">保存图片后，微信扫码添加</div>
          <div class="btn" @click="_downQrCodeImg">保存到手机</div>
        </div>
        <!--登录-->
        <div class="hoseLogin">
          <div class="login-item">
            <img :src="imageUrl + '/yx-image/group/icon-phone@2x.png'" v-if="imageUrl" class="login-item-icon">
            <div class="liner"></div>
            <input type="number" class="login-input" placeholder="请输入申请团长的手机号" :maxlength="11" placeholder-class="text-color" v-model="phoneNum">
          </div>
          <div class="login-item">
            <img :src="imageUrl + '/yx-image/group/icon-code  @2x.png'" v-if="imageUrl" class="login-item-icon">
            <div class="liner"></div>
            <input type="number" class="login-input login-input-small" placeholder="请输入验证码" :maxlength="6" placeholder-class="text-color" v-model="code">
            <span class="get-code" :class="{'get-code-disable': !isSet}" @click="setCode">{{codeText}}</span>
          </div>
          <div class="btn" @click="_login">登录</div>
        </div>
      </div>
    </div>

  </div>
</template>

<script type="text/ecmascript-6">
  import NavigationBar from '@components/navigation-bar/navigation-bar'
  import API from '@api'

  const PAGE_NAME = 'MINE_HOUSING'
  const NAV = ['申请团长', '团长登录']
  const NAV_WIDTH = 140
  let REGPHONE = /^(13[0-9]|14[0-9]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/
  export default {
    name: PAGE_NAME,
    data() {
      return {
        nav: NAV,
        navIdx: 0,
        navLeft: 50,
        width: 0,
        codeText: '获取验证码',
        phoneNum: '',
        tapCode: true,
        isSet: true,
        code: ''
      }
    },
    onLoad() {
      this.$wx.getSystemInfo({
        success: (res) => {
          this.width = res.screenWidth
        }
      })
    },
    methods: {
      // 保存二维码
      _downQrCodeImg() {
        wx.downloadFile({
          url: this.imageUrl + '/yx-image/login/wx-qr-code.jpg',
          success: (res) => {
            wx.saveImageToPhotosAlbum({
              filePath: res.tempFilePath,
              success: () => {
                this.$wechat.showToast('保存成功')
              },
              fail: () => {
                // 拒绝授权重新调起授权
                setTimeout(() => {
                  wx.openSetting()
                }, 500)
              }
            })
          }
        })
      },
      //      点击获取验证码
      async setCode() {
        if (this.phoneNum === '') {
          this.$wechat.showToast('请输入手机号码')
          return
        } else if (!REGPHONE.test(this.phoneNum)) {
          this.$wechat.showToast('请输入正确的手机号码')
          return
        }
        let data = {mobile: this.phoneNum}
        if (!this.tapCode) {
          return
        }
        let codeData = await API.Leader.messageBind(data)
        this.codeText = '发送中…'
        this.$wechat.hideLoading()
        this.$wechat.showToast(codeData.message)
        if (codeData.error !== this.$ERR_OK) {
          this.codeText = '获取验证码'
        } else {
          this.isSet = false
          let time = 60
          this.codeText = '重新获取(60s)'
          let timer = setInterval(() => {
            this.tapCode = false
            time--
            this.codeText = `重新获取(${time}s)`
            if (time <= 0) {
              this.codeText = '获取验证码'
              this.tapCode = true
              if (REGPHONE.test(this.phoneNum)) {
                this.isSet = true
              } else {
                this.isSet = false
              }
              clearInterval(timer)
            }
          }, 1000)
        }
      },
      async _login() {
        if (this.phoneNum === '') {
          this.$wechat.showToast('请输入手机号码')
          return
        } else if (!REGPHONE.test(this.phoneNum)) {
          this.$wechat.showToast('请输入正确的手机号码')
          return
        } else if (this.code.length !== 6) {
          this.$wechat.showToast('请输入正确验证码')
          return
        }
        let res = await API.Leader.loginLeader({mobile: this.phoneNum, auth_code: this.code})
        this.$wechat.hideLoading()
        this.$wechat.showToast(res.message)
        if (res.error === this.$ERR_OK) {
          wx.setStorageSync('isLeader', true)
          wx.setStorageSync('shopId', res.data.id)
          wx.redirectTo({url: '/pages/regimental-commander'})
        }
      },
      _setNav(index, e) {
        this.navIdx = index
        this.navLeft = index * NAV_WIDTH + (NAV_WIDTH - 40) / 2
      },
      _getScroll(e) {
        this._setNav(e.target.current)
      }
    },
    components: {
      NavigationBar
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"

  .mine-housing
    display: flex
    flex-direction: column
    min-height: 100vh
    background: $color-white
    box-sizing: border-box
    width: 100vw
    overflow: hidden

  .hose-img-box
    height: 40.26vw
    overflow: hidden
    .hose-img
      display: block
      width: 100%
      height: 100%

  .hose-tab
    display: flex
    width: 100vw
    box-sizing: border-box
    position: relative
    box-shadow: 0 2px 10px 0 rgba(0, 0, 0, 0.04)
    justify-content: center
    .hose-box
      position: relative
      display: flex
    .hose-tab-item
      height: 50px
      font-size: 15px
      color: $color-text-main
      font-family: $font-family-regular
      line-height: 50px
      padding: 0 40px
      transition: all 0.3s
    .hose-tab-item-active
      font-family: $font-family-medium
    .line
      transition: all 0.3s
      position: absolute
      bottom: 0
      left: 0
      width: 40px
      height: 3px
      border-radius: 22.5px
      background: $color-main

  .big-box
    height: 60vh
    width: 100vw
    overflow: hidden
    .hose-content
      height: 100%
      width: 200vw
      display: flex
      transform: translateX(0)
      transition: all 0.3s
      .hoseApply
        height: 100%
        width: 100vw
        padding-top: 36.5px
        box-sizing: border-box
        .qr-code-box
          margin: 0 auto
          width: 154px
          height: @width
          position: relative
          display: flex
          justify-content: center
          align-items: center
          .qr-code-bg
            position: absolute
            top: 0
            left: 0
            width: 100%
            height: 100%
          .qr-code-img
            background: $color-background
            width: 142px
            height: @width
        .code-tip
          text-align: center
          font-size: $font-size-14
          color: $color-text-sub
          font-family: $font-family-regular
          margin-top: 15px
        .btn
          margin: 33px auto 0
          width: 195.5px
          height: 45px
          line-height: 45px
          background: $color-main
          color: $color-white
          font-size: $font-size-16
          font-family: $font-family-regular
          text-align: center
          transition: all 0.2s
          border-radius: 22.5px
          &:active
            background: #9DD44C
            color: #E1F2C9
      .hoseLogin
        padding-top: 30px
        box-sizing: border-box
        height: 100%
        width: 100vw
        .login-item
          width: 84vw
          margin: 15px auto
          background: $color-background
          display: flex
          align-items: center
          height: 50px
          padding: 0 10px
          box-sizing: border-box
          position: relative
          .login-item-icon
            margin-right: 10.5px
            width: 15px
            height: 15px
            display: block
          .liner
            transform: scaleX(0.5)
            background: #E5E5E5
            height: 16px
            width: 1px
          .login-input
            font-size: 15px
            font-family: $font-family-regular
            color: $color-text-main
            margin-left: 14.5px
            width: 60%
          .login-input-small
            width: 50%
          .text-color
            font-family: $font-family-regular
            color: #808080
          .get-code
            min-width: 80px
            border-1px($color-main, 15px)
            col-center()
            right: 10px
            font-size: $font-size-13
            font-family: $font-family-regular
            padding: 0 10px
            white-space: nowrap
            height: 30px
            text-align: center
            line-height: 30px
            color: $color-main
            box-sizing: border-box
          .get-code-disable
            background: #F8FAF7
            color: #B7B7B7
            border-1px($color-line, 15px)
            col-center()
        .btn
          margin: 92.5px auto 0
          width: 195.5px
          height: 45px
          line-height: 45px
          background: $color-main
          color: $color-white
          font-size: $font-size-16
          font-family: $font-family-regular
          text-align: center
          transition: all 0.2s
          border-radius: 22.5px
          &:active
            background: #9DD44C
            color: #E1F2C9
</style>
