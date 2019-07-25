<template>
  <div class="bank-card">
    <navigation-bar title="实名认证"></navigation-bar>
    <div class="white">
      <div class="ro-bank-card-item">
        <div class="ro-bank-card-name">姓名</div>
        <input type="text" maxlength="12" placeholder="请输入微信绑定的真实姓名" class="ro-bank-content" placeholder-style="font-size: 14px;font-family: PingFangSC-Regular; color: #ccc" v-model="name" />
      </div>
      <div class="ro-bank-card-item">
        <div class="ro-bank-card-name">手机号</div>
        <input type="number" placeholder="请输入团长的手机号" placeholder-style="font-size: 14px;font-family: PingFangSC-Regular; color: #ccc" maxlength="11" v-model="phoneNum" class="ro-bank-content" placeholder-class="ro-bank-content-place" />
      </div>
      <div class="ro-bank-card-item">
        <div class="ro-bank-card-name">验证码</div>
        <input type="number" placeholder="请输入验证码" placeholder-style="font-size: 14px;font-family: PingFangSC-Regular; color: #ccc" maxlength="6" v-model="code" class="ro-bank-content" style="width: 40vw" placeholder-class="ro-bank-content-place" />
        <span v-if="isSet" class="get-code" :class="['corp-' + corpName + '-goods-btn']" @click="setCode">{{codeText}}</span>
        <span v-else class="get-code" :class="['get-code-disable', 'corp-' + corpName + '-goods-btn']">{{codeText}}</span>
      </div>
    </div>
    <div class="ro-bank-card-btn-box lost">
      <div class="ro-bank-card-btn" :class="'corp-' + corpName + '-bg'" @click="_showBankToast">保存</div>
    </div>
    <article class="confirm-msg" v-if="isShowToast" :animation="maskAnimation" @click="_hideBankToast">
      <button class="content" :animation="modalAnimation">
        <p class="title">请核对您的信息</p>
        <div class="item-wrapper">
          <p class="it-left">姓名</p>
          <p class="it-right">{{name}}</p>
        </div>
        <div class="item-wrapper">
          <p class="it-left">手机号</p>
          <p class="it-right">{{phoneNum}}</p>
        </div>
        <div class="btn-group">
          <div class="btn confirm" :class="'corp-' + corpName + '-text'" @click.stop="_bankCards">确定</div>
        </div>
      </button>
    </article>
  </div>
</template>

<script type="text/ecmascript-6">
  import NavigationBar from '@components/navigation-bar/navigation-bar'
  import AnimationModal from '@mixins/animation-modal'
  import API from '@api'

  const PAGE_NAME = 'BANK_CARD'
  let REGPHONE = /^(13[0-9]|14[0-9]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[0-9])\d{8}$/
  export default {
    name: PAGE_NAME,
    mixins: [AnimationModal],
    data() {
      return {
        phoneNum: '',
        name: '',
        // id: null,
        submitLock: false,
        isShowToast: false,
        codeText: '获取验证码',
        isSet: true,
        code: '',
        tapCode: true
      }
    },
    components: {
      NavigationBar
    },
    onLoad(options) {
      // this.bank = '选择开户银行'
      // this.submitLock = false
      // this.bankIdx = 0
      // this.phoneNum = ''
      // this.name = ''
      // this.id = options.id
      // this.getBankList()
      // if (!this.id) {
      //   return
      // }
      // this.getBankCardDetail()
      this._getRealInfo()
    },
    onUnload() {
      clearInterval(this._timer)
    },
    methods: {
      _getRealInfo() {
        API.Wallet.getRealInfo().then((res) => {
          if (res && res.error === this.$ERR_OK) {
            this.name = res.data.real_name
            this.phoneNum = res.data.mobile
          } else {
            // this.$wechat.showToast(res.message)
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
            this._timer = setInterval(() => {
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
                clearInterval(this._timer)
              }
            }, 1000)
          }
        } catch (e) {
          this.tapCode = true
          console.error(e)
        } finally {
          this.$wechat.hideLoading()
        }
      },
      // getCode (e) {
      //   this.cardNum = e.target.value.replace(/\s/g, '').replace(/(.{4})/g, '$1 ').trim()
      // },
      // getBank (e) {
      //   let index = e.target.value * 1
      //   this.bank = this.bankList[index].name
      // },
      _formCheck() {
        if (!this.name) {
          this.$wechat.showToast('姓名不能为空')
          return
        }
        if (this.phoneNum === '') {
          this.$wechat.showToast('请输入手机号码')
          return
        } else if (!REGPHONE.test(this.phoneNum)) {
          this.$wechat.showToast('请输入正确的手机号码')
          return
        }
        if (this.code === '') {
          this.$wechat.showToast('请输入验证码')
          return
        }
        return true
      },
      async _bankCards () {
        if (!this._formCheck()) return
        let data = {
          real_name: this.name,
          mobile: this.phoneNum,
          auth_code: this.code
        }
        if (this.submitLock) {
          return
        }
        this.submitLock = true
        setTimeout(() => {
          this.submitLock = false
        }, 1000)
        // if (this.id) {
        //   res = await API.Wallet.putBankList(this.id, data)
        // } else {
        //   res = await API.Wallet.addBankList(data)
        // }
        try {
          const res = await API.Wallet.setRealInfo(data)
          if (res.error === this.$ERR_OK) {
            this.$wechat.showToast('认证成功')
            this._hideBankToast()
            setTimeout(() => {
              wx.navigateBack()
            }, 1500)
          } else {
            this.$wechat.showToast(res.message)
          }
        } catch (e) {
          this.$wechat.showToast(e.message())
        }
      },
      _showBankToast() {
        if (!this._formCheck()) return
        this.isShowToast = true
      },
      _hideBankToast() {
        this.isShowToast = false
      }
      // getBankList() {
      //   API.Wallet.getAllBankList().then((res) => {
      //     if (res.error === this.$ERR_OK) {
      //       this.bankList = res.data
      //     } else {
      //       this.$wechat.showToast(res.message)
      //     }
      //   })
      // },
      // getBankCardDetail() {
      //   API.Wallet.getBankDetail(this.id).then((res) => {
      //     if (res.error === this.$ERR_OK) {
      //       this.cardNum = res.data.withdrawal_card
      //       this.bank = res.data.bank
      //       this.cardName = res.data.user_name
      //     } else {
      //       this.$wechat.showToast(res.message)
      //     }
      //   })
      // }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@designCommon"

  // 弹窗
  .confirm-msg
    background-color: rgba(17, 17, 17, 0.7)
    fill-box(fixed)
    z-index: 500
    layout()
    align-items: center
    .mask
      fill-box()
      background-color: $color-20202E
      opacity: 0.8
    .content
      position: relative
      width: 290px
      min-height: 224px
      background-color: $color-white
      border: 1px solid rgba(32, 32, 46, 0.10)
      border-radius: 6px
      layout()
      left:0
      top:0
      bottom:0
      right:0
      margin:auto
      opacity :1
      line-height :1
    .title
      font-family: PingFangSC-Medium
      font-size: 16px
      color: #111111
      margin :25px auto 30px
    .item-wrapper
      font-family: PingFangSC-Regular
      font-size: 14px
      display :flex
      margin-bottom :20px
      text-align :left
      .it-left
        width :74px
        color: #616161
        padding-left :25px
      .it-right
        coor: $color-text-main
    .btn-group
      margin :15px auto 0
      width :136px
      height:36px
      background: #73C200
      border: 1px solid #73C200
      border-radius: @height
      .confirm
        font-family: PingFangSC-Regular;
        font-size: 16px;
        color:#fff
        text-align :center
        line-height :36px

  .bank-card
    width: 100%
    background: $color-background
    min-height: 100vh
  .white
    background: $color-white
    margin-top: 10px
  .ro-bank-card-item
    margin: 0 15px
    box-sizing: border-box
    height: 55px
    display: flex
    align-items: center
    border-bottom-1px()
    font-size: $font-size-14
    white-space: nowrap
    position: relative
    .get-code
      min-width: 80px
      col-center()
      right: 10px
      font-size: $font-size-13
      font-family: $font-family-regular
      padding: 0 10px
      white-space: nowrap
      height: 30px
      text-align: center
      line-height: 30px
      box-sizing: border-box
      z-index :50
    .get-code-disable
      background: #F8FAF7
      color: #B7B7B7
      border-radius: 15px
      border-1px($color-line, 15px)
      col-center()
    &:last-child
      border-none()
    .ro-bank-card-name
      min-width: 56px
      color: $color-828AA2
      font-family $font-family-regular
    .ro-bank-content
      height: 44.5px
      line-height: 44.5px
      width: 73.6vw
      color: $color-374B63
      font-family: $font-family-regular !important
    input.ro-bank-content
      width: 55vw
      font-size: $font-size-14
      font-family: $font-family-regular !important
    .ro-bank-content
      margin-left: 30px
    .ro-bank-content-place
      font-size: $font-size-14
      font-family: $font-family-regular !important
      color: #ccc
    .ro-bank-card-icon
      position: absolute
      col-center()
      right: 0
      height: 12px
      width: 6px

  .ro-bank-card-btn-box
    .ro-bank-card-btn
      width: 92vw
      height: 43px
      margin: 20px auto
      border-radius: 50px
      line-height: 43px
      text-align: center
      font-family: $font-family-regular
      font-size: $font-size-16
      color: $color-white
    .ro-bank-card-disable
      opacity: 0.5
</style>