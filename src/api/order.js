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
  }
}
