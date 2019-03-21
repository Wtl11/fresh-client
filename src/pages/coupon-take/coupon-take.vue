<template>
  <div class="coupon-take">
    <navigation-bar title="领取优惠券"></navigation-bar>
    <coupon-common-channel
      :pageConfig="pageConfig"
      :couponInfo="couponInfo"
      @getUserInfo="getUserInfoHandle"
      @buttonHandle="_takeCoupon"
    ></coupon-common-channel>
    <section v-if="takeArray.length" class="panel">
      <dl class="wrapper">
        <dt class="title-wrapper">
          <p class="text">看看谁抢到了</p>
          <div class="line-wrapper">
            <div class="line"></div>
            <div class="line"></div>
          </div>
        </dt>
        <dd class="user-wrapper" v-for="(item, index) in takeArray" :key="index">
          <user-item :userInfo="item"></user-item>
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
  import API from '@api'
  import CouponNavigator from '@mixins/coupon-navigator'

  const PAGE_NAME = 'COUPON_TAKE'

  export default {
    name: PAGE_NAME,
    components: {
      NavigationBar,
      CouponCommonChannel,
      UserItem
    },
    mixins: [AuthorMixins, CouponNavigator],
    data() {
      return {
        pageConfig: {
          btnText: '马上领取',
          btnStyle: 'padding-bottom:20px',
          openType: 'getUserInfo',
          btnCName: '' // disable
        },
        takeArray: [],
        page: 1,
        limit: 10,
        hasMore: true,
        packetId: '',
        tmpId: '',
        couponInfo: undefined,
        buttonStatus: 1
      }
    },
    watch: {
      isAuthor(val) {
        val && (this.pageConfig.openType = '')
      }
    },
    onShow() {
      this._initEntryParams()
      this._getTakeArray()
      this._getCouponInfo()
      this._getCouponStatus()
    },
    onReachBottom() {
      this.page++
      this._getTakeArray()
    },
    methods: {
      // 初始化页面参数
      _initEntryParams() {
        let options = (wx.getLaunchOptionsSync() || {}).query || {}
        this.packetId = +options.packetId
        this.tmpId = options.tmpId
        let shopId = +options.shopId
        shopId && wx.setStorageSync('shopId', shopId)
      },
      // 获取优惠券信息
      _getCouponInfo() {
        API.Coupon.getPacketDetail({packetId: this.packetId}).then((res) => {
          this.couponInfo = res.data
        }).catch(e => {
          console.error(e)
        })
      },
      // 获取
      _getTakeArray() {
        if (this.tmpId) {
          this.takeArray = []
          return
        }
        if (!this.hasMore) return
        API.Coupon.getTakeList({packetId: this.packetId, page: this.page}).then((res) => {
          if (res.meta.current_page === 1) {
            this.takeArray = res.data
          } else {
            let arr = this.takeArray.concat(res.data)
            this.takeArray = arr
          }
          this.hasMore = res.meta.current_page < res.meta.last_page
        }).catch(e => {
          console.error(e)
        })
      },
      // 领取优惠券
      _takeCoupon() {
        if (this.buttonStatus === 1) {
          this.navHandle(this.couponInfo.coupon.range_type, this.couponInfo.coupon.coupon_id)
          return
        }
        API.Coupon.takeCoupon({packetId: this.packetId}).then((res) => {
          this.pageConfig.btnText = '立即使用'
          this.buttonStatus = 1
          this.page = 1
          this.hasMore = true
          this._getTakeArray()
        }).catch(e => {
          console.error(e)
        })
      },
      // 获取优惠券状态
      _getCouponStatus() {
        // todo
        API.Coupon.getPacketStatus({packetId: this.packetId}).then((res) => {
          this.pageConfig.btnText = res.data.status_str
          this.buttonStatus = res.data.status
        }).catch(e => {
          console.error(e)
        })
      },
      getUserInfoHandle(e) {
        this._login(e, () => {
          this._takeCoupon()
        })
      }
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
