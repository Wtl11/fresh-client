export default {
  methods: {
    async shareHandler(args) {
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
* flash-sale-list 限时抢购分享页 2001
* goods-detail 商品/活动详情页 商品2002/活动2003
* choiceness 首页 2004
* pay-result 支付成功页 ---> share-order 分享的订单 2005
* copy-detail 团长-商品-页 ---> goods-detail 活动详情页
* coupon-share 团长-优惠券发放页 ---> coupon-take 领取优惠券 2006
* */
export class Share {
  constructor (props) {
    this.open_gid = props.openGid || ''
    this.randomstr = props.flag || ''
    this.activity_id = +props.activityId || ''
    this.coupon_id = +props.couponId || ''
    this.goods_id = +props.goodsId || ''
    this.sku_id = +props.skuId || ''
    this.sku_code = props.skuCode || ''
    this.event_no = props.eventNo
    if (this.goods_id) {
      this.event_no = this.activity_id ? 2003 : 2002
    }
  }
}
