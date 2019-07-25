import request from '@utils/request'
import {baseURL} from '@utils/config'

export default {
  /**
   * 地址列表
   * @param id
   * @param loading
   * @returns {*}
   */
  getAddress(data, loading = false) {
    const url = `/api/wap/customer-address`
    return request.get(url, data, loading)
  },
  /**
   * 新建地址
   * @param id
   * @param loading
   * @returns {*}
   */
  createAddress(data, loading = false) {
    const url = `/api/wap/customer-address`
    return request.post(url, data, loading)
  },
  /**
   * 编辑地址
   * @param id
   * @param loading
   * @returns {*}
   */
  putAddress(id, data, loading = false) {
    const url = `/api/wap/customer-address/${id}`
    return request.put(url, data, loading)
  },
  /**
   * 查询地址详情
   * @param id
   * @param loading
   * @returns {*}
   */
  addressDetail(id, data, loading = false) {
    const url = `/api/wap/customer-address/${id}`
    return request.get(url, data, loading)
  },
  /**
   * 删除地址
   * @param id
   * @param loading
   * @returns {*}
   */
  delAddress(id, data, loading = false) {
    const url = `/api/wap/customer-address/${id}`
    return request.delete(url, data, loading)
  },
  /**
   * 获得订单列表
   * @param id
   * @param loading
   * @returns {*}
   */
  getOrderListData(status = '', page = 1, source_type = 2, limit = 10, loading = false) {
    let url = '/api/wap/customer-order'
    let data = {
      status,
      page,
      source_type: source_type,
      limit
    }
    return request.get(url, data, loading)
  },
  /**
   * 获取客服信息[v2.8.5]
   * @param id
   * @param loading
   * @returns {*}
   */
  getServiceInfo(data, loading = false) {
    let url = '/api/wap/service-sections'
    return request.get(url, data, loading)
  },
  /**
   * 获得订单列表详情
   * @param id
   * @param loading
   * @returns {*}
   */
  getOrderDetailData(id, data, loading = false) {
    let url = `/api/wap/free-post-order/${id}`
    return request.get(url, data, loading)
  },
  /**
   * 获得订单列表详情
   * @param id
   * @param loading
   * @returns {*}
   */
  getGoodsDetail(id, data, loading = false) {
    const url = baseURL.marketApi + `/api/wap/goods/${id}`
    return request.get(url, data, loading)
  },
  /**
   * 获得订单列表详情
   * @param id
   * @param loading
   * @returns {*}
   */
  getDistributionDetail(data, loading = false) {
    const url = baseURL.marketApi + `/api/wap/order-logistics-trace-info`
    return request.post(url, data, loading)
  }
}
