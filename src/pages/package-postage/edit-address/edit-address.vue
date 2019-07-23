<template>
  <div class="edit-address">
    <navigation-bar :title="title"></navigation-bar>
    <div class="form-box">
      <picker mode="region" @change="getBank">
        <div class="form-box-list">
          <div class="form-list-left">城市</div>
          <div class="form-list-pla" v-if="province.length === 0">请选择城市</div>
          <div class="form-list-right" v-else>
            <span class="city-name">{{province}}</span>
            <span class="city-name">{{city}}</span>
            <span class="city-name">{{area}}</span>
          </div>
          <img class="arrow-img" mode="aspectFill" :src="imageUrl + '/yx-image/2.3/icon-pressed@2x.png'">
        </div>
      </picker>
      <div class="form-box-list">
        <div class="form-list-left">详细地址</div>
        <input type="text" class="form-list-input" placeholder="请输入详细地址" placeholder-style="font-size: 14px;font-family: PingFangSC-Regular; color: #b7b7b7">
      </div>
      <div class="form-box-list">
        <div class="form-list-left">姓名</div>
        <input type="text" class="form-list-input" placeholder="请输入姓名" placeholder-style="font-size: 14px;font-family: PingFangSC-Regular; color: #b7b7b7">
      </div>
      <div class="form-box-list">
        <div class="form-list-left">手机号</div>
        <input type="text" class="form-list-input" placeholder="请输入手机号" placeholder-style="font-size: 14px;font-family: PingFangSC-Regular; color: #b7b7b7">
      </div>
      <div class="form-box-list form-box-fixed">
        <div class="form-list-left">设为默认地址</div>
        <switch :checked="isChecked" bindchange="switch1Change"/>
      </div>
    </div>
    <div class="delete-address" @click="_delAddress">删除地址</div>
    <div class="list-button-box">
      <button class="btn btn-none" @click="_submit">保存</button>
    </div>
    <confirm-msg ref="msg" :msg="msg" useType="double" @confirm="_deleteAddress"></confirm-msg>
  </div>
</template>

<script type="text/ecmascript-6">
  import NavigationBar from '@components/navigation-bar/navigation-bar'
  import ConfirmMsg from '@components/confirm-msg/confirm-msg'

  const PAGE_NAME = 'EDIT_ADDRESS'

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
        province: '',
        city: '',
        area: '',
        isChecked: true
      }
    },
    methods: {
      getBank (e) {
        console.log(e.mp.detail.value)
        let arr = e.mp.detail.value
        this.province = arr[0]
        this.city = arr[1]
        this.area = arr[2]
      },
      switch1Change(e) {
        console.log(e)
      },
      _delAddress() {
        console.log(22)
        this.$refs.msg.show()
      },
      _submit() {},
      _deleteAddress() {}
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
