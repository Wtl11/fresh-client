import request from '@utils/request'

export default {
  /**
   * 获得订单列表
   * @param id
   * @param loading
   * @returns {*}
   */
  getOrderListData(status = '', page = 1, limit = 10, loading = false) {
    let url = '/social-shopping/api/wap/customer-order'
    let data = {
      status,
      page,
      limit
    }
    return request.get(url, data, loading)
  },
  /**
   * 获得订单列表详情
   * @param id
   * @param loading
   * @returns {*}
   */
  getOrderDetailData(id, loading = false) {
    let url = `/social-shopping/api/wap/order/${id}`
    return request.get(url, null, loading)
  },
  /**
   * 关闭订单
   * @param id
   * @param loading
   * @returns {*}
   */
  colseOrder(id, loading = false) {
    let url = `/social-shopping/api/wap/cancel-order/${id}`
    return request.get(url, null, loading)
  },
  /**
   * 获得售后列表
   * @param id
   * @param loading
   * @returns {*}
   */
  getSaleOrder(page = 1, limit = 10, loading = false) {
    let url = `/social-shopping/api/wap/customer-after-sale-orders`
    let data = {
      page,
      limit
    }
    return request.get(url, data, loading)
  },
  /**
   * 申请售后
   * @param id
   * @param loading
   * @returns {*}
   */
  reqSaleOrder(id, loading = false) {
    let url = `/social-shopping/api/wap/apply-after-sale`
    let data = {
      id
    }
    return request.post(url, data, loading)
  },
  /**
   * 申请售后
   * @param id
   * @param loading
   * @returns {*}
   */
  reqSaleOrderDetail(id, data, loading = false) {
    let url = `/social-shopping/api/wap/customer-after-sale-orders/${id}`
    return request.get(url, data, loading)
  }
}
