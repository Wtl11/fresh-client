<template>
  <div class="withdraw">
    <navigation-bar title="提现"></navigation-bar>
    <div class="withdraw-jump" @click="jumpBankcard">
      <div class="withdraw-text"  :class="addBank === '添加银行卡' ? 'withdraw-text-place' : ''">{{addBank}}</div>
      <img class="jump-arrows" mode="aspectFill" v-if="imageUrl" :src="imageUrl + '/yx-image/cart/icon-pressed@2x.png'">
    </div>
    <div class="withdraw-money">
      <div class="money-title">提现金额</div>
      <div class="money-input-box">
        <div class="money-icon">¥</div>
        <input type="digit" class="money-input" v-model="drawMoney">
      </div>
      <div class="money-can-withdraw">
        <span v-if="walletInfo.remaining">可提现金额</span>
        <span class="money-number" v-if="walletInfo.remaining">¥{{walletInfo.remaining}}</span>
      </div>
    </div>
    <div class="withdraw-btn-box">
      <div class="withdraw-btn"  @click="submitMoney">提现</div>
    </div>
    <ul class="withdraw-rule">
      <li class="rule-item" v-for="(item, index) in ruleList" v-bind:key="index">
        <div class="icon"></div>
        <div class="text">{{item.text}}</div>
      </li>
    </ul>
  </div>
</template>

<script type="text/ecmascript-6">
  import NavigationBar from '@components/navigation-bar/navigation-bar'
  import API from '@api'

  const PAGE_NAME = 'WITHDRAW'
  const RULELIST = [{text: '团长每日可提现3次，单笔限额10000元'}, {text: '微信按提现金额0.1%收取手续费，最低1元'}, {text: '提交成功后，预计1-3个工作日内到账'}]

  export default {
    name: PAGE_NAME,
    data() {
      return {
        ruleList: RULELIST,
        bankList: [],
        addBank: '添加银行卡',
        addBankId: null,
        walletInfo: {},
        drawMoney: '',
        submitLock: false
      }
    },
    components: {
      NavigationBar
    },
    onShow() {
      this.getWalletMoney()
      this.getBankList()
    },
    methods: {
      getBankList() {
        API.Wallet.getBankList().then((res) => {
          if (res.error === this.$ERR_OK) {
            this.bankList = res.data
            if (this.bankList.length !== 0) {
              console.log(this.bankList[0].withdrawal_card, this.bankList[0].user_name)
              let number = this.bankList[0].withdrawal_card.substr(-3)
              let name = `${this.bankList[0].user_name}-${this.bankList[0].bank}(${number})`
              this.addBank = name
              this.addBankId = this.bankList[0].id
            }
          } else {
            this.$wechat.showToast(res.message)
          }
        })
      },
      getWalletMoney() {
        API.Wallet.getShopMoney().then((res) => {
          if (res.error === this.$ERR_OK) {
            this.walletInfo = res.data
          } else {
            this.$wechat.showToast(res.message)
          }
        })
      },
      submitMoney () {
        if (!this.addBankId) {
          this.$wechat.showToast('请绑定银行卡')
          return
        }
        if (this.drawMoney === '') {
          this.$wechat.showToast('请输入提现金额')
          return
        }
        if (this.drawMoney * 1 > this.walletInfo.remaining * 1) {
          this.$wechat.showToast('账户余额不足')
          return
        }
        if (this.submitLock) {
          return
        }
        this.submitLock = true
        setTimeout(() => {
          this.submitLock = false
        }, 3000)
        API.Wallet.postWithdraw({money: this.drawMoney}).then((res) => {
          if (res.error === this.$ERR_OK) {
            this.$wechat.showToast('提现申请成功')
            setTimeout(() => {
              wx.navigateBack()
            }, 2000)
          } else {
            this.$wechat.showToast(res.message)
          }
        })
      },
      jumpBankcard() {
        if (!this.addBankId) {
          wx.navigateTo({url: `/pages/bank-card`})
        } else {
          wx.navigateTo({url: `/pages/bank-card?id=${this.addBankId}`})
        }
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"

  .withdraw
    width: 100%
    min-height: 100vh
    background: $color-background
  .withdraw-jump
    height: 50px
    layout(row)
    align-items: center
    justify-content: space-between
    padding: 0 15px
    box-sizing: border-box
    background: $color-white
    margin-bottom: 10px
    .withdraw-text
      font-size: $font-size-14
      font-family: $font-family-regular
      color: $color-text-main
    .withdraw-text-place
      color: $color-text-assist
    .jump-arrows
      display: block
      width: 7.5px
      height: 12.5px
      margin-left: 4px
  .withdraw-money
    padding: 15px
    background: $color-white
    box-sizing: border-box
    margin-bottom: 25px
    .money-title
      font-size: $font-size-14
      font-family: $font-family-regular
      color: $color-text-main
      margin-bottom: 19px
  .money-input-box
    layout(row)
    align-items: center
    padding-bottom: 10px
    border-bottom-1px($color-line)
    margin-bottom: 15px
    .money-icon
      font-size: 40px
      font-family: $font-family-medium
      color: $color-text-main
    .money-input
      font-size: 40px
      font-family: $font-family-medium
      color: $color-text-main
      width: 80%
      height: 40px
      padding-left: 10px
      line-height: 40px
  .money-can-withdraw
    font-size: $font-size-14
    font-family: $font-family-regular
    color: $color-text-assist
    min-height: $font-size-14
    .money-number
      color: $color-text-main
      margin-left: 5px
  .withdraw-btn-box
    padding: 0 15px
    box-sizing: border-box
    margin-bottom: 15px
    .withdraw-btn
      width: 100%
      height: 45px
      line-height: 45px
      text-align: center
      background: $color-main
      border-radius: 22.5px
      font-size: $font-size-16
      font-family: $font-family-medium
      color: $color-white
  .withdraw-rule
    padding: 0 15px 0 17.5px
    box-sizing: border-box
    .rule-item
      layout(row)
      align-items: center
      margin-bottom: 5px
      .icon
        width: 4px
        height: 4px
        background: $color-text-assist
        border-radius: 50%
        margin-right: 5px
      .text
        font-size: $font-size-12
        font-family: $font-family-regular
        color: $color-text-assist
</style>
