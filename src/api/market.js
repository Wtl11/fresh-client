import request from '@utils/request'

export default {
  getDetail(data, loading) {
    let url = '/api/wap/activity/activity-offline/' + data.marketId
    data = ''
    return request.get(url, data, loading)
  },
  createOrder(data, loading) {
    data = {
      source: 'c_offline',
      goods: {
        goods_sku_id: data.goods_sku_id
      }
    }
    let url = '/api/wap/create-order'
    return request.post(url, data, loading)
  },
  closeOrder(data, loading) {
    let url = '/api/wap/cancel-order/' + data.orderId
    data = ''
    return request.get(url, data, loading)
  }
}
