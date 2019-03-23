<template>
  <div class="coupon-take">
    <navigation-bar title="领取优惠券" :showArrow="false"></navigation-bar>
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
  const METHODS = {
    PACKET: {
      getCouponInfo: 'getDetailPacket',
      getCouponStatus: 'getStatusPacket',
      takeCoupon: 'takeCouponPacket'
    },
    TEMPLATE: {
      getCouponInfo: 'getDetailTmpl',
      getCouponStatus: 'getStatusTmpl',
      takeCoupon: 'takeCouponTmpl'
    }
  }
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
        options: {},
        takeArray: [],
        page: 1,
        limit: 10,
        hasMore: true,
        packetId: '',
        tmpId: '',
        couponInfo: undefined,
        buttonStatus: 1,
        id: 0,
        couponId: 0,
        METHODS: METHODS['PACKET']
      }
    },
    watch: {
      isAuthor(val) {
        val && (this.pageConfig.openType = '')
      }
    },
    onLoad(options) {
      this.options = options || {}
    },
    async onShow() {
      await this._initEntryParams()
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
      async _initEntryParams() {
        try {
          let el = await getCurrentPages()[getCurrentPages().length - 1]  // eslint-disable-line
          if (!el) return
          let options = el.options || this.options
          this.packetId = +options.packetId
          this.tmpId = +options.tmpId
          this.id = this.tmpId || this.packetId
          console.log(this.id)
          this._initMethods()
          let shopId = +options.shopId
          shopId && wx.setStorageSync('shopId', shopId)
          console.warn(this.id, this.packetId, this.tmpId, shopId, '=========')
        } catch (e) {
          console.error(e, '获取参数异常')
        }
      },
      // 区分接口
      _initMethods() {
        if (this.tmpId) {
          this.METHODS = METHODS['TEMPLATE']
        }
      },
      // 获取优惠券信息
      _getCouponInfo() {
        API.Coupon[this.METHODS.getCouponInfo](this.id).then((res) => {
          this.couponInfo = res.data
        }).catch(e => {
          console.error(e, '获取优惠券信息')
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
        if (!this.isAuthor) return
        if (this.buttonStatus === 1 || this.pageConfig.btnText === '立即使用') {
          this.navHandle(this.couponInfo.coupon.range_type, this.couponId, 'redirectTo')
          return
        }
        this._takeCouponAction()
      },
      _takeCouponAction() {
        API.Coupon[this.METHODS.takeCoupon](this.id).then((res) => {
          this.couponId = res.data.customer_coupon_id
          this.pageConfig.btnText = '立即使用'
          this.buttonStatus = 1
          this.$wechat.showToast('领取成功！')
          this.page = 1
          this.hasMore = true
          this._getTakeArray()
        }).catch(this._errorHandle)
      },
      _errorHandle(e) {
        console.warn(e)
        if (!e) return
        if (e.statusCode) {
          let data = e.serverData || {}
          this.pageConfig.btnText = data.message
          data.message !== '立即使用' && (this.pageConfig.btnCName = 'disable')
        }
      },
      // 获取优惠券状态
      _getCouponStatus() {
        API.Coupon[this.METHODS.getCouponStatus](this.id).then((res) => {
          this.pageConfig.btnText = res.data.status_str
          this.buttonStatus = res.data.status
          this.couponId = res.data.customer_coupon_id
          console.warn(res, '优惠券状态====')
          if (res.data.status > 1) {
            this.pageConfig.btnCName = 'disable'
          }
        }).catch(e => {
          console.error(e, '获取优惠券状态')
        })
      },
      getUserInfoHandle(e) {
        this._login(e, () => {
          this._takeCouponAction()
          this._getCouponStatus()
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
