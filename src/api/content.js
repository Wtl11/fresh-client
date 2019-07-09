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
  getDetails({ id, ...data }, loading = false, toast = false) {
    const url = `/api/wap/content/article-show/${id}`
    return request.get({ url, data, loading, toast })
  },
  articleOperation(data, loading = false, toast = false) {
    const url = `/api/wap/content/article-bury-point-operation`
    return request.get({ url, data, loading, toast })
  }
}
