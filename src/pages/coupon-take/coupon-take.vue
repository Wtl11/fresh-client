<template>
  <div class="coupon-take">
    <navigation-bar title="领取优惠券"></navigation-bar>
    <coupon-common-channel :pageConfig="pageConfig"></coupon-common-channel>
    <section v-if="userArray.length" class="panel">
      <dl class="wrapper">
        <dt class="title-wrapper">
          <p class="text">看看谁抢到了</p>
          <div class="line-wrapper">
            <div class="line"></div>
            <div class="line"></div>
          </div>
        </dt>
        <dd class="user-wrapper" v-for="(item, index) in userArray" :key="index">
          <user-item></user-item>
        </dd>
      </dl>
    </section>
  </div>
</template>

<script type="text/ecmascript-6">
  import NavigationBar from '@components/navigation-bar/navigation-bar'
  import CouponCommonChannel from '@components/coupon-common-channel/coupon-common-channel'
  import UserItem from './user-item/user-item'
  import AuthorMixins from './author-mixins'

  const PAGE_NAME = 'COUPON_TAKE'

  export default {
    name: PAGE_NAME,
    components: {
      NavigationBar,
      CouponCommonChannel,
      UserItem
    },
    mixins: [AuthorMixins],
    data() {
      return {
        pageConfig: {
          btnText: '马上领取',
          btnStyle: 'padding-bottom:20px'
        },
        userArray: new Array(10).fill(1)
      }
    },
    methods: {
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  $color-line-coupon=rgba(85,43,0,0.2)
  @import "~@designCommon"

  .coupon-take
    min-height :100vh
    background: linear-gradient(180deg,#FFFFFF 0, #FFFFFF 100vw, #FCC446 100vw, #FFA83F 100%)
    .panel
      padding :0 15px 10.5px
      .wrapper
        font-family: $font-family-regular
        padding :0 15px 8px
        background: rgba(255,244,216,0.7)
        border-radius: 6px
        .user-wrapper
          border-bottom-1px($color-line-coupon)
          &:last-child
            border-none()
        .title-wrapper
          font-family: PingFangSC-Regular;
          font-size: 17px;
          color: $color-text-main
          text-align: center;
          line-height: 1
          position :relative
          .text
            top:20px
            row-center()
            padding :0 20px
          .line-wrapper
            padding :29px 0 8px
            position :relative
            overflow :hidden
            display :flex
            justify-content :space-between
            .line
              width :26%
              height :1px
              border-top-1px($color-line-coupon)
</style>
