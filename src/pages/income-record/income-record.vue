<template>
  <div class="income-record">
    <navigation-bar title="收入记录"></navigation-bar>
    <div class="income-nav">
      <div class="income-nav-box">
        <div class="item-nav" v-for="(item, index) in navList" v-bind:key="index" @click="clickNav(item)" :class="{'item-nav-active': navIndex === index}">{{item.text}}</div>
        <div class="nav-line-box">
          <div class="nav-line" :style="{'transform': ' translateX('+ (navIndex * 100) +'%)'}">
            <div class="line"></div>
          </div>
        </div>
      </div>
    </div>
    <div class="big-box">
      <div class="income-big-box" :style="{'transform': ' translateX('+ -(navIndex * 100) +'vw)'}">
        <div class="await-income">
          <div class="income-money-box">
            <div class="income-number" @click="openQuestion" v-if="incomeInfo.income_money">￥{{incomeInfo.income_money}}</div>
            <div class="income-icon" @click="openQuestion" v-if="incomeInfo.income_money">
              <img class="jump-question" mode="aspectFill" v-if="imageUrl" :src="imageUrl + '/yx-image/wallet/icon-question@2x.png'">
            </div>
          </div>
          <div class="income-item" v-for="(item, index) in incomeList" v-bind:key="index">
            <wallet-info :wechatInfo="item"></wallet-info>
          </div>
          <div class="noting" v-if="incomeMore && incomeList.length === 0">
            <div class="notingimg"><img class="img" :src="imageUrl + '/yx-image/group/pic-kong@2x.png'" alt=""></div>
            <div class="txt">空空如也</div>
          </div>
        </div>
        <div class="await-income">
          <div class="income-money-box">
            <div class="income-number" @click="openQuestion" v-if="incomeInfo.wait_income_money">￥{{incomeInfo.wait_income_money}}</div>
            <div class="income-icon" @click="openQuestion" v-if="incomeInfo.wait_income_money">
              <img class="jump-question" mode="aspectFill" v-if="imageUrl" :src="imageUrl + '/yx-image/wallet/icon-question@2x.png'">
            </div>
          </div>
          <div class="income-item" v-for="(item, index) in awaitIncomeList" v-bind:key="index">
            <wallet-info :wechatInfo="item"></wallet-info>
          </div>
          <div class="noting" v-if="awaitIncomeMore && awaitIncomeList.length === 0">
            <div class="notingimg"><img class="img" :src="imageUrl + '/yx-image/group/pic-kong@2x.png'" alt=""></div>
            <div class="txt">空空如也</div>
          </div>
        </div>
      </div>
    </div>
    <confirm-msg ref="colseModel" useType="income"></confirm-msg>
  </div>
</template>

<script type="text/ecmascript-6">
  import NavigationBar from '@components/navigation-bar/navigation-bar'
  import WalletInfo from '@components/wallet-info/wallet-info'
  import ConfirmMsg from '@components/confirm-msg/confirm-msg'
  import API from '@api'

  const PAGE_NAME = 'INCOME_RECORD'
  const NAVLIST = [{text: '已入账', stats: 0}, {text: '待入账', stats: 1}]

  export default {
    name: PAGE_NAME,
    data() {
      return {
        navIndex: 0,
        navList: NAVLIST,
        incomeInfo: {},
        incomePage: 1,
        incomeMore: false,
        incomeList: [],
        awaitIncomePage: 1,
        awaitIncomeMore: false,
        awaitIncomeList: []
      }
    },
    components: {
      NavigationBar,
      ConfirmMsg,
      WalletInfo
    },
    onLoad() {
      this.getIncomeData()
      this.getNewIncomeList()
      this.getNewAwaitIncomeList()
    },
    onReachBottom() {
      if (this.navIndex * 1 === 0) {
        this.getMoreIncomeList()
      } else {
        this.getMoreAwaitIncomeList()
      }
    },
    methods: {
      clickNav(item) {
        this.navIndex = item.stats
      },
      openQuestion() {
        this.$refs.colseModel.show()
      },
      getIncomeData() {
        API.Wallet.getIncomeMoney().then((res) => {
          if (res.error === this.$ERR_OK) {
            this.incomeInfo = res.data
          } else {
            this.$wechat.showToast(res.message)
          }
        })
      },
      getNewIncomeList() {
        this.incomePage = 1
        this.incomeMore = false
        let data = {
          bill_type: 1,
          page: this.incomePage,
          limit: 10
        }
        API.Wallet.getShopBillList(data).then((res) => {
          if (res.error === this.$ERR_OK) {
            this.incomeList = res.data
            this._isUpList(res)
          } else {
            this.$wechat.showToast(res.message)
          }
        })
      },
      getMoreIncomeList() {
        if (this.incomeMore) {
          return
        }
        let data = {
          bill_type: 1,
          page: this.incomePage,
          limit: 10
        }
        API.Wallet.getShopBillList(data).then((res) => {
          if (res.error === this.$ERR_OK) {
            this.incomeList = this.incomeList.concat(res.data)
            this._isUpList(res)
          } else {
            this.$wechat.showToast(res.message)
          }
        })
      },
      _isUpList(res) {
        this.incomePage++
        if (this.incomeList.length >= res.meta.total * 1) {
          this.incomeMore = true
        }
      },
      getNewAwaitIncomeList() {
        this.awaitIncomePage = 1
        this.awaitIncomeMore = false
        let data = {
          page: this.awaitIncomePage,
          limit: 10
        }
        API.Wallet.getAwaitIncomeList(data).then((res) => {
          if (res.error === this.$ERR_OK) {
            this.awaitIncomeList = res.data
            this._isUpAwaitList(res)
          } else {
            this.$wechat.showToast(res.message)
          }
        })
      },
      getMoreAwaitIncomeList() {
        if (this.awaitIncomeMore) {
          return
        }
        let data = {
          page: this.awaitIncomePage,
          limit: 10
        }
        API.Wallet.getAwaitIncomeList(data).then((res) => {
          if (res.error === this.$ERR_OK) {
            this.awaitIncomeList = this.awaitIncomeList.concat(res.data)
            this._isUpAwaitList(res)
          } else {
            this.$wechat.showToast(res.message)
          }
        })
      },
      _isUpAwaitList(res) {
        this.awaitIncomePage++
        if (this.incomeList.length >= res.meta.total * 1) {
          this.awaitIncomeMore = true
        }
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"

  .income-record
    width: 100%
  .income-nav
    border-bottom-1px($color-line)
    height: 40px
    padding: 0 50px
    .income-nav-box
      layout(row)
      position: relative
      align-items: center
      width: 100%
      height: 40px
      .item-nav
        width: 50%
        height: 100%
        font-size: $font-size-15
        font-family: $font-family-regular
        color: $color-text-sub
        text-align: center
        line-height: 40px
      .item-nav-active
        font-size: $font-size-16
        font-family: $font-family-medium
        color: $color-text-main
        transition: all 0.3s
      .nav-line-box
        position: absolute
        bottom: 1px
        left: 0
        height: 3px
        width: 100%
        .nav-line
          width: 50%
          height: 100%
          transition: all 0.3s
          .line
            width: 30px
            height: 100%
            background: $color-main
            border-radius: 1.5px
            margin: auto
  .income-money-box
    height: 70px
    background: #fafafa
    layout(row)
    align-items: center
    justify-content: center
    .income-number
      font-size: $font-size-20
      font-family: $font-family-regular
      color: $color-text-main
      margin-right: 10px
    .jump-question
      width: 13px
      height: 13px
      display: block
      position: relative
      top: -5px
  .big-box
    width: 100vw
    overflow: hidden
    .income-big-box
      width: 200vw
      display: flex
      transform: translateX(0)
      transition: all 0.3s
      .await-income
        width: 100vw
        box-sizing: border-box
        .income-item
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
