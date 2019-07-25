<template>
  <div class="edit-address">
    <navigation-bar :title="title"></navigation-bar>
    <div class="form-box">
      <picker mode="region" @change="getBank">
        <div class="form-box-list">
          <div class="form-list-left">城市</div>
          <div class="form-list-pla" v-if="addressMsg.province.length === 0">请选择城市</div>
          <div class="form-list-right" v-else>
            <span class="city-name">{{addressMsg.province}}</span>
            <span class="city-name">{{addressMsg.city}}</span>
            <span class="city-name">{{addressMsg.area}}</span>
          </div>
          <img class="arrow-img" v-if="imageUrl" mode="aspectFill" :src="imageUrl + '/yx-image/2.3/icon-pressed@2x.png'">
        </div>
      </picker>
      <div class="form-box-list">
        <div class="form-list-left">详细地址</div>
        <input v-model="addressMsg.address" type="text" class="form-list-input" placeholder="请输入详细地址" placeholder-style="font-size: 14px;font-family: PingFangSC-Regular; color: #b7b7b7">
      </div>
      <div class="form-box-list">
        <div class="form-list-left">姓名</div>
        <input v-model="addressMsg.name" type="text" class="form-list-input" :maxlength="25" placeholder="请输入姓名" placeholder-style="font-size: 14px;font-family: PingFangSC-Regular; color: #b7b7b7">
      </div>
      <div class="form-box-list">
        <div class="form-list-left">手机号</div>
        <input v-model="addressMsg.mobile" type="number" class="form-list-input" :maxlength="11" placeholder="请输入手机号" placeholder-style="font-size: 14px;font-family: PingFangSC-Regular; color: #b7b7b7">
      </div>
      <div class="form-box-list form-box-fixed">
        <div class="form-list-left">设为默认地址</div>
        <switch :checked="addressMsg.is_default" @change="switchChange"/>
      </div>
    </div>
    <div v-if="id" class="delete-address" @click="_delAddress">删除地址</div>
    <div class="list-button-box">
      <button class="btn" :class="isSubmit ? '' : 'btn-none'" @click="_submit">保存</button>
    </div>
    <confirm-msg ref="msg" :msg="msg" useType="double" @confirm="_deleteAddress"></confirm-msg>
  </div>
</template>

<script type="text/ecmascript-6">
  import NavigationBar from '@components/navigation-bar/navigation-bar'
  import ConfirmMsg from '@components/confirm-msg/confirm-msg'
  import API from '@api'

  const PAGE_NAME = 'EDIT_ADDRESS'
  let REGPHONE = /^(13[0-9]|14[0-9]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[0-9])\d{8}$/

  export default {
    name: PAGE_NAME,
    components: {
      NavigationBar,
      ConfirmMsg
    },
    data() {
      return {
        msg: '确定删除该地址吗?',
        title: '新增收货地址',
        addressMsg: {
          province: '',
          city: '',
          area: '',
          address: '',
          name: '',
          mobile: '',
          is_default: 0
        },
        id: ''
      }
    },
    onLoad(options) {
      this.id = options.id || ''
      if (this.id) {
        this._getAddressDetail()
      }
    },
    computed: {
      isSubmit() {
        return this.addressMsg.province.length !== 0 && this.addressMsg.address.length !== 0 && this.addressMsg.name.length !== 0 && this.addressMsg.mobile.length === 11
      }
    },
    methods: {
      getBank (e) {
        console.log(e.mp.detail.value)
        let arr = e.mp.detail.value
        this.addressMsg.province = arr[0]
        this.addressMsg.city = arr[1]
        this.addressMsg.area = arr[2]
      },
      switchChange(e) {
        console.log(e.mp.detail.value)
        this.addressMsg.is_default = e.mp.detail.value ? 1 : 0
      },
      _delAddress() {
        console.log(22)
        this.$refs.msg.show()
      },
      async _submit() {
        if (this.addressMsg.province === '') {
          this.$wechat.showToast('请选择城市')
          return
        } else if (this.addressMsg.address === '') {
          this.$wechat.showToast('请输入详细地址')
          return
        } else if (this.addressMsg.name === '') {
          this.$wechat.showToast('请输入姓名')
          return
        } else if (this.addressMsg.name.length <= 1) {
          this.$wechat.showToast('请输入真实姓名')
          return
        } else if (this.addressMsg.mobile === '') {
          this.$wechat.showToast('请输入手机号码')
          return
        } else if (!REGPHONE.test(this.addressMsg.mobile)) {
          this.$wechat.showToast('请输入正确的手机号码')
          return
        }
        if (this.id) {
          let res = await API.Postage.putAddress(this.id, this.addressMsg)
          if (res.error !== this.$ERR_OK) {
            this.$wechat.showToast(res.message, 1000, false)
            return
          }
          this.$wechat.showToast('编辑成功', 1000, false)
          setTimeout(() => {
            wx.navigateBack({delta: 1})
          }, 1500)
          return
        }
        let res = await API.Postage.createAddress(this.addressMsg)
        if (res.error !== this.$ERR_OK) {
          this.$wechat.showToast(res.message, 1000, false)
          return
        }
        this.$wechat.showToast('新增成功', 1000, false)
        setTimeout(() => {
          wx.navigateBack({delta: 1})
        }, 1500)
      },
      _deleteAddress() {
        API.Postage.delAddress(this.id).then((res) => {
          if (res.error === this.$ERR_OK) {
            this.$wechat.showToast('删除成功', 1000, false)
            setTimeout(() => {
              wx.navigateBack({delta: 1})
            }, 1500)
          } else {
            this.$wechat.showToast(res.message, 1000, false)
          }
        })
      },
      _getAddressDetail() {
        API.Postage.addressDetail(this.id).then((res) => {
          if (res.error === this.$ERR_OK) {
            this.addressMsg = res.data
          } else {
            this.$wechat.showToast(res.message, 1000, false)
          }
        })
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@designCommon"

  .edit-address
    width: 100%
    background: $color-background
    min-height: 100vh
    .form-box
      background: $color-white
      padding: 0 15px
      margin-top: 10px
      .form-box-list
        height: 50px
        width: 100%
        layout(row)
        align-items: center
        position: relative
        padding-right: 10px
        box-sizing: border-box
        border-bottom-1px($color-line)
        .form-list-left
          font-size: $font-size-14
          font-family: $font-family-regular
          color: #616161
          width: 80px
        .form-list-right
          flex: 1
          no-wrap()
          .city-name
            font-size: $font-size-14
            font-family: $font-family-regular
            color: #111
            margin-right: 5px
            box-sizing: border-box
        .form-list-pla
          font-size: $font-size-14
          font-family: $font-family-regular
          color: #b7b7b7
        .form-list-input
          font-size: $font-size-14
          font-family: $font-family-regular
          height: 26px
          line-height: 26px
          color: #111
          flex: 1
        .arrow-img
          display: block
          width: 7.5px
          height: 12.5px
          position: absolute
          top: 0
          bottom: 0
          right: 0
          margin: auto 0
      .form-box-fixed
        justify-content: space-between
        border-none()
        .form-list-left
          width: auto

     .delete-address
       height: 50px
       padding-left: 15px
       background: $color-white
       font-size: $font-size-14
       font-family: $font-family-regular
       color: #FC351A
       line-height: 50px
       margin-top: 10px
  .list-button-box
    padding: 40px 15px
    box-sizing: border-box
    .btn
      background: $color-main
      height: 45px
      line-height: 45px
      text-align: center
      border-radius: 50px
      color: $color-white
      font-size: $font-size-16
      margin: 0 auto
      width: 100%
    .btn-none
      opacity: 0.5
</style>
