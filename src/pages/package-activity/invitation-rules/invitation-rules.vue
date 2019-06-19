<template>
  <div class="invitation-rules">
    <navigation-bar title="活动规则"></navigation-bar>
    <div class="rules-top">
      <img v-if="imageUrl" :src="imageUrl + '/yx-image/invitation/pic-hdgz@2x.png'" class="rules-img">
      <div class="rules-title">
        多重奖励
        重磅来袭
      </div>
    </div>
    <div class="rules-msg">
      <div class="item">
        <div class="rules-title">Q1 如何参加邀请有礼活动？</div>
        <div class="rules-text"><span class="circular"></span>点击分享本活动并且邀请好友加入「赞播优鲜」</div>
      </div>
      <div class="item">
        <div class="rules-title">Q2 怎样算是邀请成功？</div>
        <div class="rules-text"><span class="circular"></span>好友通过您分享的链接领取新人专享礼包后，使用红包里面的优惠券下单成功，方可确认本次邀请成功，同一登录微信号，手机号，同一支付账号均视为同一用户</div>
      </div>
      <div class="item">
        <div class="rules-title">Q3 邀请成功会得到什么？</div>
        <div class="rules-text"><span class="circular"></span>新人用户奖励</div>
        <div class="rules-no">您分享给新用户，对方即可获得新人红包新用户使用红包成功下单后，会获得红包奖励</div>
        <div class="rules-text"><span class="circular"></span>邀请人奖励</div>
        <div class="rules-no">成功邀请1位新人下单后，得XXX商品券</div>
        <div class="rules-no">成功邀请3位新人下单后，得XXX商品券</div>
        <div class="rules-no">成功邀请6位新人下单后，得XXX商品券</div>
        <div class="rules-no">成功邀请>6位新人下单后，得XXX商品券</div>
      </div>

    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import NavigationBar from '@components/navigation-bar/navigation-bar'

  const PAGE_NAME = 'INVITATION_RULES'

  export default {
    name: PAGE_NAME,
    components: {
      NavigationBar
    },
    data() {
      return {}
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@designCommon"

  .invitation-rules
    height: 100vh
    overflow: hidden
    background-image: linear-gradient(0deg, #FFEB8A 72%, #F7D54F 100%)

  .rules-top
    position: relative
    height: (155 / 375 * 100) vw
    padding: 6vw 0 0 4.8vw
    box-sizing: border-box
    .rules-img
      position: absolute
      width: 100%
      height: 100%
      top: 0
      left: 0
    .rules-title
      font-family: FZZCHJW--GB1-0
      font-size: 31px
      color: $color-white
      width: 145px
      letter-spacing: 5px
      line-height: 36px
      text-shadow: 3px 3px 2px rgba(194, 132, 0, 0.62)
      position: relative
      z-index: 1

  .rules-msg
    height: 100vh
    background: $color-white
    border-radius: 6px
    display: block
    box-sizing: border-box
    position: relative
    z-index: 1
    margin: -12vw 3.2vw 0
    padding: 6.666667vw 6.2vw 0 3.466667vw
    .rules-title
      color: #1D2023
      line-height: 1
      font-family: $font-family-medium
      font-size: $font-size-16
    .item
      margin-bottom: 29px
    .rules-text
      color: #3F454B
      line-height: 20px
      margin: 11px 0 0
      margin-left: 5.2vw
      font-family: $font-family-regular
      font-size: $font-size-13
      display: flex
      .circular
        display: inline-block
        border-radius: 50%
        overflow: hidden
        width: 3.5px
        min-width: 3.5px
        height: 3.5px
        margin-top: 8.25px
        min-height: 3.5px
        margin-right: 4px
        background: $color-main
    .rules-no
      color: #3F454B
      line-height: 20px
      margin-left: 7.22667vw
      font-family: $font-family-regular
      font-size: $font-size-13
      display: flex
</style>

