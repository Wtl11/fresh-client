import request from '@utils/request'

export default {
  getDetail(data, loading) {
    let url = '/api/wap/activity/activity-offline/' + data.marketId
    data = ''
    return request.get(url, data, loading)
  },
  createOrder(data, loading) {
    const userInfo = wx.getStorageSync('userInfo') || {}
    data = {
      goods: [
        {
          goods_sku_id: data.goods_sku_id,
          activity_id: data.marketId,
          num: 1,
          cart_id: 0
        }
      ],
      nickname: userInfo.nickname || '',
      mobile: userInfo.mobile || '',
      source: 'c_offline'
    }
    let url = '/api/wap/create-order'
    return request.post(url, data, loading)
  },
  closeOrder(data, loading) {
    let url = '/api/wap/cancel-order/' + data.orderId
    data = ''
    return request.get(url, data, loading)
  },
  checkToken(data, loading = false) {
    let url = '/api/wap/check-login'
    return request.get(url, data, loading)
  }
}
