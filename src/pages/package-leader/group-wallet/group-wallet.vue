<template>
  <div class="group-wallet">
    <navigation-bar title="团长钱包"></navigation-bar>
    <div class="wallet-top">
      <img class="bgimg-url" mode="aspectFill" v-if="imageUrl && corpName === 'platform'" :src="imageUrl + '/yx-image/wallet/icon-money_bg@2x.png'">
      <img class="bgimg-url" mode="aspectFill" v-if="imageUrl && corpName === 'retuan'" :src="imageUrl + '/yx-image/retuan/icon-money_bg@2x.png'">
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
            <div class="jump-text" v-if="walletInfo.income_money">收入:¥</div>
            <div class="jump-money" v-if="walletInfo.income_money">{{walletInfo.income_money}}</div>
            <img class="jump-arrows" mode="aspectFill" v-if="imageUrl && walletInfo.income_money" :src="imageUrl + '/yx-image/cart/icon-pressed@2x.png'">
          </div>
          <div class="wallet-main-text" @click="jumpExpend">
            <div class="jump-text" v-if="walletInfo.outgo_money">支出:¥</div>
            <div class="jump-money" v-if="walletInfo.outgo_money">{{walletInfo.outgo_money}}</div>
            <img class="jump-arrows" mode="aspectFill" v-if="imageUrl && walletInfo.outgo_money" :src="imageUrl + '/yx-image/cart/icon-pressed@2x.png'">
          </div>
          <div class="wallet-line"></div>
        </div>
      </div>
    </div>
    <div class="wallet-list">
      <div class="item-list" v-for="(wechatInfo, index) in walletList" :key="wechatInfo.id">
        <div class="wallet-info">
          <div class="info-left">
            <img class="info-left-img" :src="wechatInfo.head_image_url" v-if="wechatInfo.customer_id * 1 !== 0">
            <img class="info-left-img" src="" v-if="wechatInfo.customer_id * 1 === 0 && imageUrl" :src="imageUrl + '/yx-image/wallet/pic-platform_head@2x.png'">
          </div>
          <div class="info-right">
            <div class="info-text-box">
              <div class="info-text-title">{{wechatInfo.title}}</div>
              <div class="info-text-bottom">
                <div class="label-btn " :class="[wechatInfo.type === 30 ? 'corp-' + corpName + '-wallet-label' : '', wechatInfo.type === 31 ? 'corp-' + corpName + '-wallet-label': '']">{{wechatInfo.type_str}}</div>
                <div class="info-time">{{wechatInfo.created_at}}</div>
              </div>
            </div>
            <div class="info-money-box">
              <div class="money-number" :class="[wechatInfo.type === 30 ? 'corp-' + corpName + '-money' : '', wechatInfo.type === 31 ? 'corp-' + corpName + '-money': '']">{{wechatInfo.total}}</div>
              <div class="money-balance" v-if="wechatType * 1 === 1">余额 ¥{{wechatInfo.after_remaining}}</div>
              <div class="money-balance" v-if="wechatType * 1 === 2">{{wechatInfo.status_str}}</div>
              <div class="withdraw"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="noting" v-if="walletMore && walletList.length === 0">
      <div class="notingimg"><img class="img" :src="imageUrl + '/yx-image/group/pic-kong@2x.png'" alt=""></div>
      <div class="txt">空空如也</div>
    </div>
    <loading-more v-else-if="!walletMore"></loading-more>
  </div>
</template>

<script type="text/ecmascript-6">
  import NavigationBar from '@components/navigation-bar/navigation-bar'
  import LoadingMore from '@components/loading-more/loading-more'
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
      LoadingMore
    },
    onShow() {
      this.getWalletMoney()
      this.getNewWalletList()
    },
    onReachBottom() {
      // if (this._loadingMore) return
      this.getMoreWalletList()
    },
    methods: {
      jumpWithdraw() {
        wx.navigateTo({url: this.$routes.leader.WITHDRAW})
      },
      jumpIncome() {
        wx.navigateTo({url: this.$routes.leader.INCOME_RECORD})
      },
      jumpExpend() {
        wx.navigateTo({url: this.$routes.leader.EXPEND_RECORD})
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
        // this._loadingMore = true
        API.Wallet.getShopBillList(data).then((res) => {
          if (res.error === this.$ERR_OK) {
            this.walletList = this.walletList.concat(res.data)
            this._isUpList(res)
          } else {
            this.$wechat.showToast(res.message)
          }
          // this._loadingMore = false
        }).catch(e => {
          // this._loadingMore = false
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

 .wallet-info
   width: 100%
   layout(row)
   align-items: center
   .info-left
     width: 40px
     height: 40px
     margin-right: 10px
     .info-left-img
       width: 100%
       height: 100%
       display: block
       background: #73C200
       border-radius: 50%
   .info-right
     flex: 1
     padding: 17px 0 15px
     border-bottom-1px($color-line)
     layout(row)
     align-items: center
     justify-content: space-between
     padding-right: 15px
     box-sizing: border-box
     .info-text-title
       font-size: $font-size-14
       min-height: $font-size-16
       font-family: $font-family-regular
       color: $color-text-main
       width: 170px
       margin-bottom: 8px
       no-wrap()
     .info-text-bottom
       layout(row)
       align-items: center
       .label-btn
         font-size: $font-size-10
         color: #616161
         font-family: $font-family-regular
         height: 14px
         line-height: 15px
         padding: 0 5px
         border-radius: 8.5px
         border-1px(#616161, 8.5px)
         margin-right: 5px
       .info-time
         font-size: $font-size-11
         color: $color-text-assist
         font-family: $font-family-regular
     .info-money-box
       text-align: right
       color: $color-text-main
     .money-number
       font-size: $font-size-16
       font-family: $font-family-medium
       margin-bottom: 8px
     .money-subtract
       color: $color-money
     .money-balance
       font-size: $font-size-11
       color: $color-text-assist
       font-family: $font-family-regular


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
            margin-left: 5px
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
