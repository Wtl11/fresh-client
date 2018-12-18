<template>
  <div class="wrap">
    <navigation-bar title="我的自提点" :showArrow="true" :translucent="true"></navigation-bar>
    <div class="self-point-banner">
      <div class="curren">
        <div class="sub">当前自提点</div>
        <div class="point">
          <!--<img class="icon" v-if="imageUrl" :src="imageUrl+'/yx-image/cart/icon-address_sy@2x.png'" alt="" >-->
          <img v-if="imageUrl" :src="imageUrl+'/yx-image/mine/icon-address_sy@2x.png'" alt="" class="icon">
          <div class="txt">白云黄边北路国颐堂店</div>
        </div>
      </div>
      <div class="selt-point-history"><div class="name">历史自提点</div></div>
    </div>
    <div class="history-list">
      <div class="history-item" v-for="(item, index) in shopList" :key="index" @click="showChangeShop(item)">
        <div class="left">
          <img class="avatar" mode="aspectFill" :src="item.head_image_url" alt="">
          <div class="info">
            <div class="colonel">团长：{{item.name}}</div>
            <div class="group">社区：{{item.social_name}}</div>
            <div class="addr">提货地址：{{item.province + item.city + item.district + item.address}}</div>
          </div>
        </div>
        <div class="right">
          <img class="arr" v-if="imageUrl" :src="imageUrl+'/yx-image/cart/icon-pressed@2x.png'" alt="">
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
        shopList: [],
        changedShop: {}
      }
    },
    onShow() {
      this._getShopList()
    },
    computed: {
      ...oauthComputed
      // ...mapGetters(['role'])
    },
    methods: {
      showChangeShop(shop) {
        console.log(shop)
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
    .curren
      padding: 3.2vw
      padding-top: 18px
      .sub
        font-family: $font-family-regular
        font-size: $font-size-14
        color: $color-white
      .point
        padding-top: 11px
        layout(row)
        align-items: flex-end
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
    padding: 3.2vw
    width: 100vw
    background: $color-white
    height: 45px
    position: absolute
    bottom: -19px
    z-index: 9
    box-sizing: border-box
    border-radius: 16px 16px 0px 0px
    .name
      font-family: $font-family-regular
      font-size: $font-size-14
      color: $color-sub
  .history-list
    margin-top: 19px
    padding-left: 3.2vw
    .history-item
      height: 140px
      padding: 20px 3.2vw
      padding-left: 0
      box-sizing: border-box
      layout(row)
      justify-content: space-between
      border-bottom-1px($color-line)
      &:first-child
        border-top-1px($color-line)
      .left
        layout(row)
        .avatar
          display: block
          width: 13.34vw
          height: 13.34vw
          margin-right: 2.67vw
          border-radius: 50%
        .info
          width: 69.6vw
          .colonel,.group
            font-family: $font-family-medium
            font-size: $font-size-15
            padding-bottom: 8px
            color: $color-sub
          .addr
            padding-top: 5px
            font-family: $font-family-regular
            font-size: $font-size-14
            color: #999999
            line-height: 20px
      .right
        width: 5.5px
        height: 100px
        layout(row)
        align-items: center
        .arr
          display: block
          width: 5.5px
          height: 10.5px

  .txtsr
    min-height: 10px
</style>
