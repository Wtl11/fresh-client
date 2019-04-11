export default {
  methods: {
    async shareHandler() {
      const token = wx.getStorageSync('token')
      if (!token) return
      const options = wx.getStorageSync('options')
      console.warn(options, 'share-handle')
      const shareTicket = options.shareTicket
      if (!shareTicket) return
      wx.getShareInfo({
        shareTicket,
        success(res) {
          if (!res || res.errMsg !== 'getShareInfo:ok') return
          const flag = options.query.flag
          console.log(res, flag)
        }
      })
    }
  }
}
// 有分享控件的页面
/*
* flash-sale-list 限时抢购分享页
* goods-detail 商品/活动详情页
* choiceness 首页
* pay-result 支付成功页 ---> share-order 分享的订单
* copy-detail 团长-商品-页 ---> goods-detail 活动详情页
* coupon-share 团长-优惠券发放页 ---> coupon-take 领取优惠券
* */
