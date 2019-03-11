import request from '@utils/request'

export default {
  getDetail(data, loading) {
    let url = '/api/wap/activity/activity-offline/' + data.marketId
    data = ''
    return request.get(url, data, loading)
  },
  createOrder(data, loading) {
    console.log(data)
    data = {
      goods: {
        goods_sku_id: data.goods_sku_id,
        activity_id: data.marketId,
        num: 1,
        cart_id: 0
      },
      nickname: '',
      mobile: '',
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
  testShare(data, loading) {
    let url = '/api/wap/cancel-order/'
    return request.get(url, data, loading)
  }
}
