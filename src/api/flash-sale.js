import request from './request-handler'

export default {
  /** ********** 用户优惠券页面 ************ **/
  /**
   * @param data
   * @param loading
   * @param toast
   * @returns {*}
   */
  // 用户优惠券列表
  getModuleInfo(data, loading, toast) {
    const url = `/api/wap/cms/page-index`
    return request.get({url, data, loading, toast})
  },
  // 用户优惠券可使用数和不可使用数
  getClientListNumber(data, loading = false, toast) {
    const url = `/api/wap/coupon/customer-coupon-count`
    return request.get({url, data, loading, toast})
  }
}
