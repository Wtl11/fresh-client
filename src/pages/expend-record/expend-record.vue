<template>
  <div class="expend-record">
    <navigation-bar title="支出记录"></navigation-bar>
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

  const PAGE_NAME = 'EXPEND_RECORD'

  export default {
    name: PAGE_NAME,
    data() {
      return {
        walletPage: 1,
        walletList: [],
        walletMore: false
      }
    },
    components: {
      NavigationBar,
      WalletInfo
    },
    onLoad() {
      this.getNewWalletList()
    },
    onReachBottom() {
      this.getMoreWalletList()
    },
    methods: {
      getNewWalletList() {
        this.walletPage = 1
        this.walletMore = false
        let data = {
          bill_type: 2,
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
        })
      },
      getMoreWalletList() {
        if (this.walletMore) {
          return
        }
        let data = {
          bill_type: 2,
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
 @import "~@designCommon"

  .expend-record
    width: 100%
  .wallet-list
    padding-left: 15px
    box-sizing: border-box
  .noting
    text-align: center
    margin-top: 50px
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
