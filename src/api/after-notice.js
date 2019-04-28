import request from './request-handler'

export default {
  /** ********** 首页 ************ **/
  /**
   * @param data
   * @param loading
   * @param toast
   * @returns {*}
   */
  // 检查是否有新的售后提醒
  getNotify(data, loading = false, toast = false) {
    const url = `/api/wap/after-sale-notify-status`
    return request.get({url, data, loading, toast})
  },
  //
  getNotifyDetail(data, loading = true, toast = true) {
    const url = `/api/wap/after-sale-first-coupon`
    return request.get({url, data, loading, toast})
  }
}
