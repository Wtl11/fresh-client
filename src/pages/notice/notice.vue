<template>
  <div class="notice">
    <navigation-bar title="赞播优鲜"></navigation-bar>
    <div class="notice-coupon-content" v-if="showCoupon">
      <div class="notice-coupon">
        <image v-if="imageUrl" :src="imageUrl + '/yx-image/notice/pic-5_money@2x.png'" class="notice-coupon-img">
          <div class="notice-coupon-msg">
            <div class="notice-coupon-price">
<!--              <span class="notice-coupon-icon">¥</span>-->
              <span>{{coupon.denomination}}</span>
              <span class="notice-coupon-icon">{{coupon.preferential_type == 1 ? '折': '元'}}</span>
            </div>
            <div class="notice-tip">{{coupon.condition_str}}</div>
          </div>
        </image>
      </div>
      <div class="notice-text">{{couponText}}</div>
      <div class="notice-btn">点击查看</div>
    </div>
    <div class="notice-content">
      <div class="notice-name">
        <span class="after">/</span>
        <img v-if="imageUrl" :src="imageUrl + '/yx-image/notice/pic-notice@2x.png'" class="notice-img">
        <span class="before">/</span>
      </div>
      <div class="notice-title">
        由于供应商提供的商品未达到品质要求，导致你所购买的商品未能及时送达，我们将尽快为你 <span class="notice-title-block">退款或次日补货。</span>
      </div>
    </div>

  </div>
</template>

<script type="text/ecmascript-6">
  import NavigationBar from '@components/navigation-bar/navigation-bar'
  import API from '@api'

  const PAGE_NAME = 'NOTICE'

  export default {
    name: PAGE_NAME,
    components: {
      NavigationBar
    },
    data() {
      return {
        showCoupon: true,
        coupon: {},
        couponText: '送你一张5元优惠券',
        textArr: []
      }
    },
    onLoad() {
      this._getDetail()
    },
    methods: {
      _getDetail() {
        API.AfterNotice.getNotifyDetail().then(res => {
          // res.data.coupon = []
          // console.log(typeof this.data.coupon.id )
          // console.log(res.data.coup)
          // let flag = res.data.coupon.length || this.data.coupon.id
          this.showCoupon = res.data.coupon.id
          this.coupon = res.data.coupon
          this.couponText = res.data.tips
          console.log(this.coupon, '-=1-23')
          let a = res.data.desc
          let b = res.data['font-weight']
          console.log(a, b)
          // this.coupon = res.data.coupon
        })
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@designCommon"
  .notice
    height: 100vh
    background-image: linear-gradient(134deg, #FAFAFA 0%, #FAFAFA 100%)

  .notice-content
    padding: 0 30.5px
    box-sizing: border-box

  .notice-name
    height: 14px
    padding-top: 34px
    display: flex
    justify-content: center
    align-items: center
    .notice-img
      height: 14px
      width: 27.5px
      position: relative
    .before, .after
      line-height: 1
      margin: 0 19px
      color: #999
      font-family: $font-family-medium
      font-size: $font-size-14
    .before
      left: -19px

  .notice-title
    padding: 16.5px 0 19px
    font-size: $font-size-14
    color: #555
    font-family: $font-family-regular
    .notice-title-block
      font-family: $font-family-medium

  .notice-coupon-content
    padding: 29.5px 0 45px
    background: $color-white

  .notice-coupon
    position: relative
    height: 190px

    .notice-coupon-img
      all-center()
      width: 192px
      height: 100%
    .notice-coupon-msg
      position: absolute
      top: 33.95px
      row-center()
      z-index: 1
      .notice-coupon-price
        margin-left: 9px
        font-family: $font-family-bold
        font-size: 50px
        color: #FA7502
      .notice-coupon-icon
        display: inline-block
        margin-left: 3.5px
        transform: translateY(-3.5px)
        font-size: $font-size-16
    .notice-tip
      text-align: center
      line-height: 1
      font-size: $font-size-13
      color: rgba(250, 117, 2, 0.8)

  .notice-text
    color: #444444
    margin: 28.95px 0 24px
    text-align: center
    line-height: 1
    font-family: PingFang-SC-Heavy
    font-size: 28px

  .notice-btn
    margin: 0 auto
    border-radius: 22.5px
    height: 45px
    line-height: 45px
    text-align: center
    font-size: $font-size-16
    color: $color-text-main
    font-family: $font-family-regular
    background-image: linear-gradient(148deg, #F9DE57 0%, #FFD959 100%)
    width: 86.67vw
    transition: all 0.2s
    &:active
      opacity: 0.8
</style>
