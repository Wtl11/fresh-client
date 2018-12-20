<template>
  <div class="wrap">
    <navigation-bar title="我的自提点" :showArrow="true" :translucent="true"></navigation-bar>
    <div class="self-point-banner">
      <div class="banner">
        <img v-if="imageUrl" :src="imageUrl+'/yx-image/cart/bg-ddxq@2x.png'" class="banner-img" alt="">
      </div>
      <div class="curren">
        <div class="sub">当前自提点</div>
        <div class="point">
          <!--<img class="icon" v-if="imageUrl" :src="imageUrl+'/yx-image/cart/icon-address_sy@2x.png'" alt="" >-->
          <img v-if="imageUrl" :src="imageUrl+'/yx-image/mine/icon-address_sy@2x.png'" alt="" class="icon">
          <div class="txt">{{groupInfo.province + groupInfo.city + groupInfo.district + groupInfo.address}}</div>
        </div>
      </div>
      <div class="selt-point-history"><div class="name">其他自提点</div></div>
    </div>
    <div class="history-list">
      <div class="history-item" v-for="(item, index) in shopList" :key="index" @click="showChangeShop(item)">
        <div class="left">
          <img class="avatar" mode="aspectFill" :src="item.head_image_url" alt="">
          <div class="info">
            <div class="colonel">团长：{{item.name}}</div>
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
        groupInfo: {},
        changedShop: {}
      }
    },
    async onShow() {
      await this._getShopList()
      this._setShopId()
      await this._groupInfo()
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
        API.Mine.getShopList()
          .then((res) => {
            this.$wechat.hideLoading()
            if (res.error !== this.$ERR_OK) {
              return
            }
            this.shopList = res.data
          }).catch(() => {
            this.$wechat.hideLoading()
          })
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
    padding: 64px 0 0
    position: relative
    height: 170px
    background-image: linear-gradient(0deg, #ABE300 0%, #73C200 89%)
    .banner
      width: 100vw
      height: 170px
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
      z-index: 9
      padding: 3.2vw
      padding-top: 18px
      .sub
        font-family: $font-family-regular
        font-size: $font-size-14
        color: $color-white
      .point
        padding-top: 11px
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
        .avatar
          display: block
          width: 50px
          height: 50px
          margin-right: 10px
          border-radius: 50%
        .info
          width: 69.6vw
          .colonel,.group
            font-family: $font-family-medium
            font-size: $font-size-15
            height: 15px
            no-wrap()
            padding-bottom: 11px
            color: $color-sub
          .group
            font-family: $font-family-medium
            font-size: $font-size-15
            no-wrap()
            height: 15px
            padding-bottom: 15px
            color: $color-sub
          .address
            font-family: $font-family-regular
            font-size: $font-size-14
            color: #999999
            line-height: 20px
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
