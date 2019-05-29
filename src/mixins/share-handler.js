import API from '@api'
export default {
  data () {
    return {
      $loginCode: {}
    }
  },
  async onLoad () {
    await this.getCode()
  },
  methods: {
    async $$shareHandler (args) {
      const token = wx.getStorageSync('token')
      if (!token) return
      const options = wx.getStorageSync('options')
      console.warn(options, 'share-handle')
      const shareTicket = options.shareTicket
      if (!shareTicket) return
      if (shareTicket === wx.getStorageSync('shareTicket')) {
        const openGId = wx.getStorageSync('openGId')
        if (openGId) {
          const flag = options.query.flag
          const share = new Share({...args, flag, openGId})
          API.Share.sendMsgWxGroup(share)
          return
        }
      }
      wx.setStorageSync('shareTicket', shareTicket)
      await this.checkCode()
      new Promise((resolve, reject) => {
        wx.getShareInfo({ shareTicket, success: resolve, fail: reject })
      }).then(async (res) => {
        if (!res || res.errMsg !== 'getShareInfo:ok') return
        const data = {
          code: this.$loginCode.code,
          iv: res.iv,
          encrypted_data: res.encryptedData
        }
        try {
          let res = await API.Share.getGroupId(data)
          const openGId = res.data.openGId
          if (!openGId) return
          wx.setStorageSync('openGId', openGId)
          const flag = options.query.flag
          const share = new Share({...args, flag, openGId})
          API.Share.sendMsgWxGroup(share)
        } catch (e) {
          console.warn(e)
        }
      })
    },
    async checkCode() {
      await this.$wechat.checkSession().catch(async() => {
        await this.getCode()
      })
    },
    async getCode() {
      try {
        this.$loginCode = await this.$wechat.login()
      } catch (e) {
        console.warn(e)
      }
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
* goods-detail 商品购买记录 2007
* */
export const EVENT_CODE = {
  FLASH_SALE_LIST: 2001,
  GOODS_DETAIL: 2002,
  ACTIVE_DETAIL: 2003,
  HOME: 2004,
  SHARE_ORDER: 2005,
  COUPON_TAKE: 2006,
  GOODS_RECORD: 2007,
  COLLAGE_DETAIL: 2008
}

export class Share {
  constructor (props) {
    this.open_gid = props.openGId || ''
    this.randomstr = props.flag || ''
    this.event = props.event || ''
    this.order_id = props.orderId || ''
    this.activity_id = +props.activityId || ''
    this.coupon_id = +props.couponId || ''
    this.goods_id = +props.goodsId || ''
    this.sku_id = +props.skuId || ''
    this.sku_code = props.skuCode || ''
    if (this.event === EVENT_CODE.GOODS_DETAIL) {
      this.event = this.activity_id
        ? EVENT_CODE.ACTIVE_DETAIL
        : EVENT_CODE.GOODS_DETAIL
    }
  }
}

// FORM_ID 埋点统计2019/04/20
/**
 * form_id 埋点
 * 1. 首页- 商品+购物车
 * 2. 首页- 限时请购商品
 * 3. 商品分类+购物车
 * 4. 优惠券商品分类+购物车
 * 5. 商品详情/活动+购物车
 * 6. 商品详情/活动+购物车
 * 7. 商品详情/活动 购买弹起窗+数量
 * 8. 支付成功 - 提醒团长接单
 * 9. 团长订单详情 - 提醒收货
 * 10. 提交订单/拓展活动支付 - 使用微信手机号
 **/
