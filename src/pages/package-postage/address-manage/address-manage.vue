<template>
  <div class="address-manage">
    <navigation-bar title="地址管理"></navigation-bar>
    <div class="list-box-item">
      <div class="list-box">
        <div class="list-item" v-for="(item, idx) in addressList" :key="idx" @click.stop="selectAddress(item)">
          <div class="list-item-left">
            <div class="info-top">
              <div class="info-top-name">{{item.name}}</div>
              <div class="info-top-phone">{{item.mobile}}</div>
            </div>
            <div class="info-bottom"><span v-if="item.is_default === 1" class="info-bottom-label">默认</span><span class="info-bottom-name">{{item.province}}{{item.city}}{{item.area}}{{item.address}}</span></div>
          </div>
          <div class="list-item-right" @click.stop="editAddress(item.id)">
            <img :src="imageUrl + '/yx-image/postage/icon-edit_address@2x.png'" v-if="imageUrl" class="address-img">
          </div>
        </div>
      </div>
      <div class="list-button-box">
        <button class="btn" @click="openAddress">新增收货地址</button>
      </div>
    </div>
    <div class="address-null" v-if="addressList.length === 0 && isRequest">
      <div class="img-box">
        <img :src="imageUrl + '/yx-image/postage/pic-address@2x.png'" v-if="imageUrl" class="error-img">
        <p class="text">你还没有收货地址哦！</p>
      </div>
      <button class="btn" @click="openAddress">新增收货地址</button>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import NavigationBar from '@components/navigation-bar/navigation-bar'
  import API from '@api'
  import { postageMethods } from '@state/helpers'

  const PAGE_NAME = 'ADDRESS_MANAGE'

  export default {
    name: PAGE_NAME,
    components: {
      NavigationBar
    },
    data() {
      return {
        addressList: [],
        isRequest: false,
        select: ''
      }
    },
    onLoad(options) {
      this.select = options.select || ''
    },
    async onShow() {
      await this._getAddressList()
    },
    methods: {
      ...postageMethods,
      openAddress() {
        wx.navigateTo({
          url: this.$routes.postage.EDIT_ADDRESS
        })
      },
      editAddress(id) {
        wx.navigateTo({
          url: `${this.$routes.postage.EDIT_ADDRESS}?id=${id}`
        })
      },
      async _getAddressList() {
        let res = await API.Postage.getAddress()
        if (res.error !== this.$ERR_OK) {
          this.$wechat.showToast(res.message, 1000, false)
          return
        }
        this.addressList = res.data
        this.isRequest = true
      },
      selectAddress(item) {
        if (this.select) {
          this.setCurrentAddress(item)
          wx.navigateBack({delta: 1})
        }
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@designCommon"

  .address-manage
    width: 100%
    background: $color-background
    min-height: 100vh
  .address-null
    width: 100%
    background: $color-white
    height: 100vh
    position: fixed
    left: 0
    top: 0
    box-sizing: border-box
    padding-top: 22.48vh
  .img-box
    display: flex
    flex-direction: column
    justify-content: center
    align-items: center
    height: 138.5px
    .error-img
      display: block
      height: 110px
      width: 116px
    .text
      text-align: center
      font-size: $font-size-14
      color: $color-text-sub
      font-family: $font-family-regular
      margin-top: 14.5px

  .btn
    background: $color-main
    width: 72vw
    height: 45px
    line-height: 45px
    text-align: center
    border-radius: 50px
    color: $color-white
    font-size: $font-size-16
    margin: 50px auto 0
  .list-box
    background: $color-white
    box-sizing: border-box
    padding-left: 12px
  .list-item
    padding: 20px 12px 20px 0
    width: 100%
    align-items: center
    justify-content: justify-content center
    border-bottom-1px($color-line)
    layout(row)
    &:last-child
      border-none()
    .list-item-left
      flex: 1
      padding-right: 20px
      border-right-1px($color-line)
      .info-top
        width: 100%
        layout(row)
        align-items: center
        margin-bottom: 7px
        .info-top-name
          font-size: $font-size-15
          font-family: $font-family-medium
          color: #000
          max-width: 150px
          margin-right: 10px
          no-wrap()
        .info-top-phone
          font-size: $font-size-15
          font-family: $font-family-regular
          color: #000
      .info-bottom
        line-height: 17px
        .info-bottom-label
          font-size: $font-size-12
          color: $color-main
          font-family: $font-family-regular
          height: 15px
          line-height: 15px
          width: 30px
          text-align: center
          display: inline-block
          border-1px($color-main)
          margin-right: 5px
          background: rgba(115,194,0,0.1)
        .info-bottom-name
          font-size: $font-size-13
          color: #666
          font-family: $font-family-regular
    .list-item-right
      width: 45px
      height: 15.5px
      extend-click()
      .address-img
        width: 15.5px
        height: @width
        margin: auto
        display: block
  .list-button-box
    padding: 40px 15px
    box-sizing: border-box
    .btn
      width: 100%
      margin-top: 0
</style>
