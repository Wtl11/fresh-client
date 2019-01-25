<template>
  <div class="wrap">
    <navigation-bar title="我的自提点" :showArrow="true" :translucent="true"></navigation-bar>
    <div class="self-point-banner" :class="statusBarHeight * 1 === 20 ? '' : 'self-point-top'">
      <div class="curren">
        <div class="sub">当前自提点</div>
        <div class="point">
          <div class="point-left">
            <img v-if="imageUrl" mode="aspectFill" :src="imageUrl+'/yx-image/mine/icon-address_sy@2x.png'" alt="" class="icon">
            <div v-if="groupInfo !== ''" class="txt">{{groupInfo.social_name}}</div>
          </div>
          <div class="point-right">距离您322252m</div>
        </div>
      </div>
      <div class="selt-point-history"><div class="name">其他自提点</div></div>
    </div>
    <div class="history-list">
      <div class="history-item" v-for="(item, index) in shopList" :key="index" @click="showChangeShop(item)">
        <div class="left">
          <img class="avatar" mode="aspectFill" :src="item.head_image_url" alt="">
          <div class="info">
            <div class="colonel">
              <div class="colonel-left">团长：{{item.name}}</div>
              <div class="colonel-right">距离您322252m</div>
            </div>
            <div class="group">社区：{{item.social_name}}</div>
            <div class="address">提货地址：{{item.province + item.city + item.district + item.address}}</div>
          </div>
        </div>
        <div class="right">
          <img class="arrow" v-if="imageUrl" :src="imageUrl+'/yx-image/cart/icon-pressed@2x.png'" alt="">
        </div>
      </div>
    </div>
    <dialog-modal ref="dialogModal" tip="温馨提示" message="确定切换自提点吗？" @confirm="changeShop"></dialog-modal>
  </div>
</template>

<script type="text/ecmascript-6">
  import NavigationBar from '@components/navigation-bar/navigation-bar'
  import API from '@api'
  import {oauthComputed} from '@state/helpers'
  import DialogModal from '@components/dialog-model/dialog-model'

  export default {
    components: {
      NavigationBar,
      DialogModal
    },
    beforeCreate() {
    },
    data() {
      return {
        currentShopId: '',
        shopList: [],
        statusBarHeight: 20,
        groupInfo: '',
        page: 1,
        shopMore: false,
        changedShop: {}
      }
    },
    created() {
      let res = wx.getSystemInfoSync()
      this.statusBarHeight = res.statusBarHeight || 20
    },
    async onShow() {
      await this._getShopList()
      this._setShopId()
      await this._groupInfo()
    },
    onReachBottom() {
      this.getMoreShopList()
    },
    computed: {
      ...oauthComputed
      // ...mapGetters(['role'])
    },
    methods: {
      _setShopId() {
        this.$wechat.getStorage('shopId')
          .then(res => {
            this.currentShopId = res.data
          })
      },
      async _groupInfo() {
        let res = await API.Choiceness.getGroupInfo()
        this.$wechat.hideLoading()
        if (res.error !== this.$ERR_OK) {
          this.$wechat.showToast(res.message)
        }
        this.groupInfo = res.data
      },
      showChangeShop(shop) {
        if (this.currentShopId === shop.id) {
          this.$wechat.showToast('您已在当前自提点')
          return
        }
        this.changedShop = shop
        this.$refs.dialogModal.show()
      },
      changeShop() {
        let shopId = this.changedShop.id
        this.$wechat.setStorage('shopId', shopId)
        wx.switchTab({url: '/pages/choiceness'})
      },
      _getShopList() {
        this.shopMore = false
        let data = { page: this.page, limit: 10 }
        API.Mine.getShopList(data)
          .then((res) => {
            this.$wechat.hideLoading()
            if (res.error !== this.$ERR_OK) {
              return
            }
            this.shopList = res.data
            this._isUpList(res)
          }).catch(() => {
            this.$wechat.hideLoading()
          })
      },
      getMoreShopList() {
        if (this.shopMore) {
          return
        }
        let data = { page: this.page, limit: 10 }
        API.Mine.getShopList(data).then((res) => {
          this.$wechat.hideLoading()
          if (res.error === this.$ERR_OK) {
            this.shopList = this.shopList.concat(res.data)
            this._isUpList(res)
          } else {
            this.$wechat.showToast(res.message)
          }
        })
      },
      _isUpList(res) {
        this.page++
        if (this.shopList.length >= res.meta.total * 1) {
          this.shopMore = true
        }
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"
  .wrap
    width: 100vw
    min-height: 100vh
    background: $color-white
    position: relative
  .self-point-banner
    box-sizing: border-box
    width: 100vw
    padding-top: 17vw
    position: relative
    height: 45.33vw
    background-image: linear-gradient(0deg, #ABE300 0%, #73C200 89%)
    .banner
      width: 100vw
      height: 45.33vw
      position: absolute
      left: 0
      z-index: 3
      top:0
      .banner-img
        display: block
        width: 100%
        height: 100%
    .curren
      position: absolute
      padding: 3.2vw
      bottom: 36px
      box-sizing: border-box
      z-index: 9
      width: 100%
      .sub
        font-family: $font-family-regular
        font-size: $font-size-14
        color: $color-white
      .point
        padding-top: 11px
        layout(row)
        align-items: center
        justify-content: space-between
        .point-left
          layout(row)
          align-items: center
          .icon
            width: 11px
            margin-right: 5px
            height: 14px
          .txt
            font-family: $font-family-medium
            font-size: $font-size-16
            color: $color-white
            line-height: 16px
            width: 58vw
            no-wrap()
        .point-right
          font-size: $font-size-14
          font-family: $font-family-regular
          color: #fff
  .self-point-top
    height: 48vw
    padding-top: 29.6vw
  .selt-point-history
    padding-right: 0px 12px
    width: 100vw
    background: $color-white
    height: 45px
    line-height: 45px
    position: absolute
    bottom: -19px
    z-index: 9
    box-sizing: border-box
    border-radius: 16px 16px 0px 0px
    .name
      font-family: $font-family-regular
      font-size: $font-size-14
      height: 45px
      margin-left: 12px
      line-height: 45px
      border-bottom: 0.5px solid $color-line
      color: $color-sub
  .history-list
    margin-top: 19px
    padding:0 3.2vw
    .history-item
      padding: 20px 0
      box-sizing: border-box
      layout(row)
      justify-content: space-between
      align-items: center
      border-bottom-1px($color-line)
      &:first-child
      .left
        layout(row)
        flex: 1
        .avatar
          display: block
          width: 50px
          height: 50px
          margin-right: 10px
          border-radius: 50%
        .info
          flex: 1
          .colonel
            layout(row)
            align-items: center
            justify-content: space-between
            .colonel-left
              font-family: $font-family-medium
              font-size: $font-size-15
              height: 15px
              no-wrap()
              padding-bottom: 8px
              padding-top: 4px
              color: $color-sub
              width: 43vw
            .colonel-right
              font-family: $font-family-regular
              font-size: $font-size-14
              color: #FF8506
          .group
            font-family: $font-family-medium
            font-size: $font-size-15
            line-height: 20px
            padding-bottom: 15px
            color: $color-sub
          .address
            font-family: $font-family-regular
            font-size: $font-size-14
            color: #999999
            line-height: 20px
            width: 73.6vw
      .right
        width: 7.5px
        height: 100%
        layout(row)
        align-items: center
        .arrow
          display: block
          width: 7.5px
          height: 12.5px

  .txtsr
    min-height: 10px
</style>
