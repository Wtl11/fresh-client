<template>
  <div class="leader-invite-success">
    <navigation-bar title="团长申请"></navigation-bar>
    <div class="copnt-wrap">
      <img v-if="imageUrl" :src="imageUrl + '/yx-image/leader/icon-pay_success@2x.png'" class="success-icon">
      <h4 class="text-h4">申请团长身份成功</h4>
      <h5 class="text-h5">审核结果会在48小时内联系你</h5>
      <div class="back-btn" @click="goHome">返回商城首页</div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import NavigationBar from '@components/navigation-bar/navigation-bar'

  const PAGE_NAME = 'LEADER_INVITE_SUCCESS'

  export default {
    name: PAGE_NAME,
    components: {
      NavigationBar
    },
    data() {
      return {
      }
    },
    methods: {
      goHome() {
        wx.switchTab({url: this.$routes.main.CHOICENESS})
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@designCommon"

  .leader-invite-success
    width: 100%
    font-family:$font-family-regular
    .copnt-wrap
      display flex
      flex-direction column
      align-items center
      margin-top:px-change-vh(74)
    .success-icon
      width:76px
      height:@width
    .text-h4
      font-size $font-size-19
      color: #333333
      margin-top:px-change-vh(20)
    .text-h5
      font-size $font-size-15
      color: #333333
      margin-top:px-change-vh(22)
    .back-btn
      width:px-change-vw(271)
      height:45px
      line-height:45px
      text-align center
      font-size :$font-size-16
      color:$color-white
      background :$color-main
      border-radius:22px
      margin-top:px-change-vh(65)

</style>
