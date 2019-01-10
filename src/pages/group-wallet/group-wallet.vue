<template>
  <div class="group-wallet">
    <navigation-bar title="团长钱包"></navigation-bar>
    <div class="wallet-top">
      <img class="bgimg-url" mode="aspectFill" v-if="imageUrl" :src="imageUrl + '/yx-image/wallet/icon-money_bg@2x.png'">
      <div class="wallet-box" v-if="walletInfo.remaining">
        <div class="wallet-box-left">
          <div class="wallet-box-left-name">钱包余额(元)</div>
          <div class="wallet-box-left-number">{{walletInfo.remaining}}</div>
        </div>
        <div class="wallet-box-right" @click="jumpWithdraw">提现</div>
      </div>
      <div class="wallet-bottom">
        <div class="wallet-bottom-main">
          <div class="wallet-main-text" @click="jumpIncome">
            <div class="jump-text" v-if="walletInfo.income_money">收入:￥</div>
            <div class="jump-money" v-if="walletInfo.income_money">{{walletInfo.income_money}}</div>
            <img class="jump-arrows" mode="aspectFill" v-if="imageUrl && walletInfo.income_money" :src="imageUrl + '/yx-image/cart/icon-pressed@2x.png'">
          </div>
          <div class="wallet-main-text" @click="jumpExpend">
            <div class="jump-text" v-if="walletInfo.outgo_money">支出:￥</div>
            <div class="jump-money" v-if="walletInfo.outgo_money">{{walletInfo.outgo_money}}</div>
            <img class="jump-arrows" mode="aspectFill" v-if="imageUrl && walletInfo.outgo_money" :src="imageUrl + '/yx-image/cart/icon-pressed@2x.png'">
          </div>
          <div class="wallet-line"></div>
        </div>
      </div>
    </div>
    <div class="wallet-list">
      <div class="item-list" v-for="(item, index) in walletList" v-bind:key="index">
        <wallet-info :wechatInfo="item"></wallet-info>
      </div>
    </div>
    <div class="noting" v-if="walletMore && walletList.length === 0">
      <div class="notingimg"><img class="img" :src="imageUrl + '/yx-image/group/pic-kong@2x.png'" alt=""></div>
      <div class="txt">空空如也</div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import NavigationBar from '@components/navigation-bar/navigation-bar'
  import WalletInfo from '@components/wallet-info/wallet-info'
  import API from '@api'

  const PAGE_NAME = 'GROUP_WALLET'

  export default {
    name: PAGE_NAME,
    data() {
      return {
        walletInfo: {},
        walletPage: 1,
        walletList: [],
        walletMore: false
      }
    },
    components: {
      NavigationBar,
      WalletInfo
    },
    onShow() {
      this.getWalletMoney()
      this.getNewWalletList()
    },
    onReachBottom() {
      this.getMoreWalletList()
    },
    methods: {
      jumpWithdraw() {
        wx.navigateTo({url: `/pages/withdraw`})
      },
      jumpIncome() {
        wx.navigateTo({url: `/pages/income-record`})
      },
      jumpExpend() {
        wx.navigateTo({url: `/pages/expend-record`})
      },
      getWalletMoney() {
        API.Wallet.getShopMoney().then((res) => {
          if (res.error === this.$ERR_OK) {
            this.walletInfo = res.data
          } else {
            this.$wechat.showToast(res.message)
          }
          console.log(res)
        })
      },
      getNewWalletList() {
        this.walletPage = 1
        this.walletMore = false
        let data = {
          bill_type: 0,
          page: this.walletPage,
          limit: 10
        }
        API.Wallet.getShopBillList(data).then((res) => {
          if (res.error === this.$ERR_OK) {
            this.walletList = res.data
            this._isUpList(res)
          } else {
            this.$wechat.showToast(res.message)
          }
          console.log(res)
        })
      },
      getMoreWalletList() {
        if (this.walletMore) {
          return
        }
        let data = {
          bill_type: 0,
          page: this.walletPage,
          limit: 10
        }
        API.Wallet.getShopBillList(data).then((res) => {
          if (res.error === this.$ERR_OK) {
            this.walletList = this.walletList.concat(res.data)
            this._isUpList(res)
          } else {
            this.$wechat.showToast(res.message)
          }
          console.log(res)
        })
      },
      _isUpList(res) {
        this.walletPage++
        if (this.walletList.length >= res.meta.total * 1) {
          this.walletMore = true
        }
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"

  .group-wallet
    width: 100%
  .wallet-top
    height: 34vw
    width: 100%
    position: relative
    margin-bottom: 40px
    .bgimg-url
      width: 100%
      height: 100%
      display: block
      position: absolute
      z-index: 1
      left: 0
      top: 0
    .wallet-box
      padding: 6.8vw 20px 0 27px
      box-sizing: border-box
      position: relative
      z-index: 2
      layout(row)
      align-items: center
      justify-content: space-between
      .wallet-box-left-name
        font-size: $font-size-14
        color: $color-white
        font-family: $font-family-regular
        margin-bottom: 8px
      .wallet-box-left-number
        font-size: 30px
        color: $color-white
        font-family: $font-family-din-bold
      .wallet-box-right
        width: 70px
        text-align: center
        height: 24px
        line-height: 24px
        font-size: $font-size-14
        color: $color-text-sub
        font-family: $font-family-regular
        background: $color-white
        border-radius: 15px
    .wallet-bottom
      position: absolute
      bottom: -30px
      left: 0
      padding: 0 15px
      height: 60px
      box-sizing: border-box
      width: 100%
      z-index: 2
      .wallet-bottom-main
        position: relative
        width: 100%
        height: 60px
        border-radius: 4px
        box-shadow: 0 4px 8px 0 rgba(0,0,0,0.06)
        background: $color-white
        align-items: center
        layout(row)
        .wallet-main-text
          width: 50%
          height: 100%
          layout(row)
          align-items: center
          justify-content: center
          .jump-text
            font-size: $font-size-14
            font-family: $font-family-regular
            color: $color-text-assist
          .jump-money
            font-size: $font-size-16
            font-family: $font-family-regular
            color: $color-text-main
          .jump-arrows
            display: block
            width: 7.5px
            height: 12.5px
            margin-left: 4px
        .wallet-line
          position: absolute
          left: 50%
          top: -44.5px
          width: 1px
          height: 27px
          border-right-1px(#E6E6E6)
  .wallet-list
    padding-left: 15px
    box-sizing: border-box
  .noting
    text-align: center
    margin-top: 50px
    padding-top: 50px
    .notingimg
      width: 116px
      height: 110px
      margin: 0 auto 15px
      .img
        display: block
        width: 100%
        height: 100%
    .txt
      font-family: $font-family-regular
      font-size: $font-size-14
      color: $color-text-sub

</style>
