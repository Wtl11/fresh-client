import request from '@utils/request'

export default {
  getOrderListData(status = '', page = 1, limit = 10, loading = false) {
    let url = '/social-shopping/api/wap/customer-order'
    let data = {
      status,
      page,
      limit
    }
    return request.get(url, data, loading)
  },
  getOrderDetailData(id, loading = false) {
    let url = `/social-shopping/api/wap/order/${id}`
    return request.get(url, null, loading)
  },
  colseOrder(id, loading = false) {
    let url = `/social-shopping/api/wap/cancel-order/${id}`
    return request.get(url, null, loading)
  },
  getSaleOrder(page = 1, limit = 10, loading = false) {
    let url = `/social-shopping/api/wap/customer-after-sale-orders`
    let data = {
      page,
      limit
    }
    return request.get(url, data, loading)
  }
}
