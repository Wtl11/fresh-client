import request from '@utils/request'

export default {
  /**
   * 下单
   * @param data
   * @param loading
   * @returns {*}
   */
  submitOrder(data, loading = true) {
    const url = `/social-shopping/api/wap/create-order`
    return request.post(url, data, loading)
  },
  /**
   * 保存用户手机号
   * @param data
   * @param loading
   * @returns {*}
   */
  saveMobile(mobile, loading = false) {
    const url = `/social-shopping/api/wap/customer-save-mobile`
    return request.post(url, {mobile}, loading)
  }
}
