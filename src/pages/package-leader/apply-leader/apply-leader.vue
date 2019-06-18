<template>
  <div class="apply-leader">
    <navigation-bar title="申请成为团长"></navigation-bar>
    <scroll-view :style="{height:scrollHeight + 'px'}" scroll-y class="scroll">
        <img v-if="imageUrl" :src="imageUrl + '/yx-image/leader/pic-group_topbg@2x.png'" mode="widthFix"  class="img-top">
        <h3 class="top-title">申请团长身份</h3>
        <div class="tip-text">需要您填写真实姓名并验证手机</div>
        <form-model></form-model>
    </scroll-view>
  </div>
</template>

<script type="text/ecmascript-6">
  import NavigationBar from '@components/navigation-bar/navigation-bar'
  import FormModel from './form-model/form-model.vue'

  import API from '@api'
  const PAGE_NAME = 'APPLY_LEADER'
  const REGPHONE = /^(13[0-9]|14[0-9]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/
  export default {
    name: PAGE_NAME,
    components: {
      NavigationBar,
      FormModel
    },
    props: {
      isShowNavigation: {
        type: Boolean,
        default: true
      }
    },
    data() {
      return {
        scrollHeight: 500,
        inputData: {
          name: '',
          mobile: '',
          auth_code: ' ',
          social_name: ' ',
          state: ' ',
          city: '',
          district: '',
          address: ''
        },
        codeText: '获取验证码',
        phoneNum: '',
        tapCode: true,
        isSet: true
      }
    },
    async onLoad() {
      let res = this.$wx.getSystemInfoSync()
      this.scrollHeight = res.screenHeight - res.statusBarHeight - 44
    },
    methods: {
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
        this.tapCode = false
        let codeData = {}
        try {
          codeData = await API.Leader.messageBind(data)
          this.codeText = '发送中…'
          setTimeout(() => {
            this.$wechat.showToast(codeData.message)
          }, 200)
          if (codeData.error !== this.$ERR_OK) {
            this.codeText = '获取验证码'
            this.tapCode = true
          } else {
            this.isSet = false
            let time = 60
            this.codeText = '重新获取(60s)'
            let timer = setInterval(() => {
              // this.tapCode = false
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
        } catch (e) {
          this.tapCode = true
          console.error(e)
        } finally {
          this.$wechat.hideLoading()
        }
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@designCommon"

  .apply-leader
    width:100vh
    height:100vh
    background:$color-background
  .top-title
      font-family: $font-family-medium
      font-size: $font-size-22
      color: $color-white
      padding:21px 39px 5px

    .tip-text
      font-family: $font-family-regular
      font-size: $font-size-15
      color: $color-white
      padding-left:39px
      padding-bottom:18px
    .img-top
      width:100vw
      z-index:-100
      position:absolute
      top:0
      left:0
      right:0

    .scroll
      position fixed
      bottom:0
      left:0
      right:0
      box-sizing:border-box
      background-size:contain
      background-repeat no-repeat
</style>
