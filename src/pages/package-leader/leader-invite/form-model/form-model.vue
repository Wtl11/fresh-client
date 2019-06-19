<template>
  <div :class="['form-model',{'has-margin': hasMargin}]">
    <div class="input-model">
      <h4 class="title container-wrap">个人信息</h4>
      <div class="container-wrap">
        <div class="input-box">
          <div class="input-label">姓名</div>
          <input v-model="inputData.name" maxlength="25" class="input-item" type="text" placeholder="请输入姓名" placeholder-style="color: #b3b3b3"  placeholder-class="placeholder-text">
        </div>
        <div class="input-box">
          <div class="input-label">手机号</div>
          <input type="number" v-model="inputData.mobile" placeholder-style="color: #b3b3b3" maxlength="11" placeholder-class="placeholder-text" class="input-item" placeholder="请输入手机号码">
        </div>
        <div class="input-box">
          <div class="input-label">验证码</div>
          <input v-model="inputData.auth_code"  placeholder-style="color: #b3b3b3" type="number"  maxlength="8" placeholder-class="placeholder-text"   class="input-item" placeholder="请输入验证码">
          <div v-if="isSet" class="get-code get-code-btn" @click="setCode">{{codeText}}</div>
          <div v-else class="get-code get-code-disable">{{codeText}}</div>
        </div>
      </div>
    </div>
    <div class="input-model">
      <h4 class="container-wrap title">地址信息</h4>
      <div class="container-wrap">
        <div class="input-box">
          <div class="input-label">小区名称</div>
          <input v-model="inputData.social_name"  placeholder-style="color: #b3b3b3" maxlength="25" placeholder-class="placeholder-text" class="input-item" type="text"  placeholder="请输入小区名称">
        </div>
        <div class="input-box box-height-auto" @click="selectAddresBtn">
          <div class="input-label">选择地址</div>
          <div v-if="inputData.address" class="input-item">{{inputData.address}}</div>
          <div v-else class="input-item placeholder-text">请选择地址</div>
          <div class="arrow-right">
            <img v-if="imageUrl" :src="imageUrl + '/yx-image/leader/icon-pressed@2x.png'" class="img">
          </div>
        </div>
      </div>
    </div>
    <div class="input-model">
      <h4 class="container-wrap title">资质审核</h4>
      <div class="container-wrap upload-wrap">
        <div class="upload-box"  @click="chooseFilesBtn('shop_photo_url')">
          <div v-if="inputData.shop_photo_url" class="photo-wrap">
            <div class="close-icon"></div>
            <img  :src="inputData.shop_photo_url" alt="" class="photo">
          </div>
          <div v-if="imageUrl  && !inputData.shop_photo_url"  class="photo no-cont">
            <img :src="imageUrl + '/yx-image/leader/icon-add@2x.png'" alt="" class="icon-add">
          </div>
          <div class="placeholder-text">请上传自提点门头的图片</div>
        </div>
        <div class="upload-box"  @click="chooseFilesBtn('wx_group_photo_url')">
          <div v-if="inputData.wx_group_photo_url" class="photo-wrap">
            <div class="close-icon"></div>
            <img :src="inputData.wx_group_photo_url" alt="" class="photo">
          </div>
          <div v-if="imageUrl  && !inputData.wx_group_photo_url"  class="photo no-cont">
            <img :src="imageUrl + '/yx-image/leader/icon-add@2x.png'" alt="" class="icon-add">
          </div>
          <div class="placeholder-text">请上传100人以上的微信群截图</div>
        </div>
      </div>
    </div>
    <div v-if="hasMargin" :class="['submit-btn',{disable:!isDisableSubmit}]" @click="submit">提交申请</div>
  </div>
</template>

<script type="text/ecmascript-6">
  import NavigationBar from '@components/navigation-bar/navigation-bar'
  import API from '@api'
  import chooseFiles from '@utils/we-cos/upload'
  const REGPHONE = /^(13[0-9]|14[0-9]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/
  const MAP_KEY = '206ec5511b39a51e02627ffbd8dfc16c'

  export default {
    components: {
      NavigationBar
    },
    props: {
      hasMargin: {
        type: Boolean,
        default: true
      }
    },
    data() {
      return {
        inputData: {
          name: '',
          mobile: '',
          auth_code: '',
          state: '',
          city: '',
          district: '',
          social_name: '',
          address: '',
          shop_photo_url: '',
          wx_group_photo_url: '',
          invite_shop_id: 1
        },
        justifyArr: [{
          key: 'name',
          tips: [{
            default: true,
            tip: '请输入姓名'
          }]
        }, {
          key: 'mobile',
          tips: [{
            default: true,
            tip: '请输入手机号'
          }, {
            regExp: /^(13[0-9]|14[0-9]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/,
            tip: '请输入正确的手机号'
          }]
        }, {
          key: 'auth_code',
          tips: [{
            default: true,
            tip: '请输入验证码'
          }]
        }, {
          key: 'state',
          tips: [{
            default: true,
            tip: '请选择地址'
          }]
        }, {
          key: 'city',
          tips: [{
            default: true,
            tip: '请选择地址'
          }]
        }, {
          key: 'district',
          tips: [{
            default: true,
            tip: '请选择地址'
          }]
        }, {
          key: 'address',
          tips: [{
            default: true,
            tip: '请选择地址'
          }]
        }, {
          key: 'shop_photo_url',
          tips: [{
            default: true,
            tip: '请上传门头照片'
          }]
        }, {
          key: 'wx_group_photo_url',
          tips: [{
            default: true,
            tip: '请上传100人以上的微信群照片'
          }]
        }],
        codeText: '获取验证码',
        phoneNum: '',
        tapCode: true,
        isSet: true
      }
    },
    computed: {
      isDisableSubmit() {
        let res = this.inputData.name && this.inputData.mobile && this.inputData.auth_code && this.inputData.state && this.inputData.city && this.inputData.district && this.inputData.social_name && this.inputData.address && this.inputData.shop_photo_url && this.inputData.wx_group_photo_url
        return res
      }
    },
    methods: {
      resetForm() {
        this.inputData = {
          name: '',
          mobile: '',
          auth_code: '',
          state: '',
          city: '',
          district: '',
          social_name: '',
          address: '',
          shop_photo_url: '',
          wx_group_photo_url: '',
          invite_shop_id: 1
        }
      },
      // 获取邀请状态
      async _getLeaderStatus() {
        let res = await API.Leader.getLeaderStatus()
        if (res.error !== this.$ERR_OK) {
          this.$wechat.showToast(res.message)
          return
        }
        if (!res.data.status) {
          wx.redirectTo({url: this.$routes.main.GOODS_END})
          return false
        }
        return true
      },
      justifyPhone() {
        console.log('justifyPhone')
        if (this.inputData.mobile === '') {
          this.$wechat.showToast('请输入手机号码')
          return false
        } else if (!REGPHONE.test(this.inputData.mobile)) {
          this.$wechat.showToast('请输入正确的手机号码')
          return false
        }
        return true
      },
      async selectAddresBtn() {
        let _this = this
        wx.chooseLocation({
          success(res) {
            _this.getDetailAddress(res.address)
          }
        })
      },
      async getDetailAddress(address) {
        wx.request({
          url: `https://restapi.amap.com/v3/geocode/geo?address=${address}&key=${MAP_KEY}`,
          header: {
            'content-type': 'application/json' // 默认值
          },
          success: (res) => {
            if (res.data.geocodes && res.data.geocodes.length) {
              let resData = res.data.geocodes[0]
              this.inputData.state = resData.province
              this.inputData.city = resData.city
              this.inputData.district = resData.district
              this.inputData.address = address
            }
          }
        })
      },
      chooseFilesBtn(type) {
        chooseFiles().then(res => {
          console.log(777)
          this.inputData[type] = res[0].url
        })
      },
      //      点击获取验证码
      async setCode() {
        if (!this.justifyPhone()) return false
        let data = {mobile: this.inputData.mobile}
        if (!this.tapCode) {
          return
        }
        this.tapCode = false
        let codeData = {}
        try {
          codeData = await API.Leader.setCodeMessage(data)
          this.codeText = '发送中…'
          setTimeout(() => {
            this.$wechat.showToast(codeData.message)
          }, 200)
          if (codeData.error !== this.$ERR_OK) {
            this.codeText = '获取验证码'
            this.tapCode = true
          } else {
            this.isSet = false
            let time = 60
            this.codeText = '重新获取(60s)'
            let timer = setInterval(() => {
              // this.tapCode = false
              time--
              this.codeText = `重新获取(${time}s)`
              if (time <= 0) {
                this.codeText = '获取验证码'
                this.tapCode = true
                if (REGPHONE.test(this.inputData.mobile)) {
                  this.isSet = true
                } else {
                  this.isSet = false
                }
                clearInterval(timer)
              }
            }, 1000)
          }
        } catch (e) {
          this.tapCode = true
        } finally {
          this.$wechat.hideLoading()
        }
      },
      submit() {
        let hasTip = false
        for (let i = 0; i < this.justifyArr.length; i++) {
          let item = this.justifyArr[i]
          for (let j = 0; j < item.tips.length; j++) {
            let tip = item.tips[j]
            if (tip.default && !this.inputData[item.key]) {
              this.$wechat.showToast(tip.tip)
              hasTip = true
              return true
            }
            if (tip.regExp && !tip.regExp.test(this.inputData[item.key])) {
              this.$wechat.showToast(tip.tip)
              hasTip = true
              return true
            }
            if (hasTip) return true
          }
          if (hasTip) return true
        }
        if (!hasTip) {
          this.inputData.invite_shop_id = wx.getStorageSync('shopId')
          this._getLeaderStatus() && API.Leader.inviteSubmit(this.inputData).then(res => {
            if (res.error !== this.$ERR_OK) {
              this.$wechat.showToast(res.message)
              return
            }
            wx.navigateTo({url: this.$routes.leader.LEADER_INVITE_SUCCESS})
          })
        }
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@designCommon"
  .operate-btn
    height:50px
    line-height: 50px
    text-align: center
    background: #FFE100
    font-size: $font-size-18
    font-family :$font-family-medium
    color: #161315
    z-index:100
  .placeholder-text
    color:#B3B3B3
    font-family: $font-family-regular
    font-size: $font-size-15
  .form-model
    padding-right px-change-vw(19)
    padding-left  px-change-vw(19)
    overflow:hidden
    &.has-margin
      padding-bottom:15px
      .input-model
        background: $color-white
        margin-bottom:20px
        border-radius:10px
        box-shadow: 0 6px 20px 0 rgba(17,17,17,0.06)
        .title
          height: 48px
          line-height :48px
      .upload-wrap
        padding-bottom:15px
    .input-model
      color:#333333
      .title
        height: 56px
        line-height :58px
        font-size:$font-size-16
        font-family:$font-family-medium
        color:#333333
        border-bottom-1px()
      .container-wrap
        padding-left:20px
      .input-box
        width:100%
        display: flex
        align-items: center
        height: 55px
        box-sizing: border-box
        font-size $font-size-14
        font-family: $font-family-regular
        border-bottom-1px()
        &.box-height-auto
          min-height: 55px
          height:auto
          .input-item
            height:auto
            line-height:auto
          .placeholder-text
            color: #B3B3B3
        .input-label
          width:62px
          margin-right:22px
          flex-shrink 0
        .input-item
          flex:1
          font-size: 15px
          height: 26px
          line-height: 26px
          color: #111111
        .placeholder-text
          color: #B3B3B3

        .get-code
          min-width: 80px
          right: 10px
          font-size: $font-size-13
          font-family: $font-family-regular
          padding: 0 10px
          white-space: nowrap
          height: 30px
          text-align: center
          line-height: 30px
          box-sizing: border-box
          color:#808080
          border-1px(#B7B7B7,15px)
        .get-code-disable
          background: #F8FAF7
          color: #B7B7B7
          border-radius: 15px
        .arrow-right
          padding:5px 20px
          .img
            width:6px
            height:10px
      .upload-wrap
        .upload-box
          display flex
          align-items center
          padding:20px 0px 5px
          .photo-wrap
            position:relative
            .close-icon
              width:17px
              height:@width
              background-size 100% 100%
              background-image url("./icon-delpic@2x.png")
              position:absolute
              right:10px
              top:0
              z-index:200
          .photo
            width:64px
            height:64px
            box-sizing border-box
            margin-right:10px
            border-radius: 3px
            &.no-cont
              display flex
              align-items center
              justify-content center
              background:#F7F7F7
              border-radius: 3px
          .icon-add
              width:14px
              height:@width
    .submit-btn
      text-align: center
      color:#fff
      background: #00BA65
      border-radius:24px
      height: 48px
      line-height: 48px
      margin-bottom:15px
      &.disable
        opacity: 0.5

</style>
