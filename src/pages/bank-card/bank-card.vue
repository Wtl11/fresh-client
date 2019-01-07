<template>
  <div class="bank-card">
    <navigation-bar title="绑定银行卡"></navigation-bar>
    <div class="white">
      <div class="ro-bank-card-item">
        <div class="ro-bank-card-name">持卡人</div>
        <input type="text" placeholder="持卡人姓名" class="ro-bank-content" placeholder-style="font-size: 14px;font-family: PingFangSC-Regular; color: #ccc" v-model="cardName" />
      </div>
      <div class="ro-bank-card-item">
        <div class="ro-bank-card-name">银行卡号</div>
        <input type="number" placeholder="输入银行卡号" placeholder-style="font-size: 14px;font-family: PingFangSC-Regular; color: #ccc" maxlength="23" @input="getCode" v-model="cardNum" class="ro-bank-content" placeholder-class="ro-bank-content-place" />
      </div>
      <div class="ro-bank-card-item">
        <div class="ro-bank-card-name">开户行</div>
        <picker mode="selector" @change="getBank" :value="bankIdx" :range="bankList" range-key="name">
          <div class="ro-bank-content" :class="bank === '选择开户银行' ? 'ro-bank-content-place' : ''">{{bank}}</div>
        </picker>
        <img class="ro-bank-card-icon" v-if="imageUrl" :src="imageUrl + '/ws-image/icon-pressed@2x.png'">
      </div>
    </div>
    <div class="ro-bank-card-btn-box">
      <div class="ro-bank-card-btn" @click="_bankCards">保存</div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import NavigationBar from '@components/navigation-bar/navigation-bar'
  import API from '@api'

  const PAGE_NAME = 'BANK_CARD'

  export default {
    name: PAGE_NAME,
    data() {
      return {
        cardNum: '',
        cardName: '',
        bank: '选择开户银行',
        bankList: [],
        id: null,
        bankIdx: 0,
        submitLock: false
      }
    },
    components: {
      NavigationBar
    },
    onLoad(options) {
      this.bank = '选择开户银行'
      this.submitLock = false
      this.bankIdx = 0
      this.cardNum = ''
      this.cardName = ''
      this.id = options.id
      this.getBankList()
      if (!this.id) {
        return
      }
      this.getBankCardDetail()
    },
    methods: {
      getCode (e) {
        this.cardNum = e.target.value.replace(/\s/g, '').replace(/(.{4})/g, '$1 ').trim()
      },
      getBank (e) {
        let index = e.target.value * 1
        this.bank = this.bankList[index].name
      },
      async _bankCards () {
        if (!this.cardName) {
          this.$wechat.showToast('持卡人不能为空')
          return
        }
        if (!this.cardNum) {
          this.$wechat.showToast('银行卡号不能为空')
          return
        }
        if (this.bank === '选择开户银行') {
          this.$wechat.showToast('开户行不能为空')
          return
        }
        let data = {
          user_name: this.cardName,
          bank: this.bank,
          withdrawal_card: this.cardNum
        }
        if (this.submitLock) {
          return
        }
        this.submitLock = true
        setTimeout(() => {
          this.submitLock = false
        }, 3000)
        let res = {}
        if (this.id) {
          res = await API.Wallet.putBankList(this.id, data)
        } else {
          res = await API.Wallet.addBankList(data)
        }
        if (res.error === this.$ERR_OK) {
          this.$wechat.showToast('绑定成功')
          setTimeout(() => {
            wx.navigateBack()
          }, 1500)
        } else {
          this.$refs.toast.show(res.message)
        }
      },
      getBankList() {
        API.Wallet.getAllBankList().then((res) => {
          if (res.error === this.$ERR_OK) {
            this.bankList = res.data
          } else {
            this.$wechat.showToast(res.message)
          }
        })
      },
      getBankCardDetail() {
        API.Wallet.getBankDetail(this.id).then((res) => {
          if (res.error === this.$ERR_OK) {
            this.cardNum = res.data.withdrawal_card
            this.bank = res.data.bank
            this.cardName = res.data.user_name
          } else {
            this.$wechat.showToast(res.message)
          }
        })
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"

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
      background: $color-main
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
