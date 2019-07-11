import request from './request-handler'

export default {
  /** ********** 首页 ************ **/
  /**
   * @param data
   * @param loading
   * @param toast
   * @returns {*}
   */
  getDetails({ id, ...data }, loading = false, toast = false) {
    const url = `/api/wap/content/article-show/${id}`
    return request.get({ url, data, loading, toast })
  },
  articleOperation(data, loading = false, toast = false) {
    const url = `/api/wap/content/article-bury-point-operation`
    return request.get({ url, data, loading, toast })
  },
  getLikes(data, loading = false, toast = false) {
    const url = `/api/wap/content/article-fabulou-list`
    return request.get({ url, data, loading, toast })
  },
  /**
   * 我的作品列表
   * @param data
   * @param loading
   * @returns {*}
   */
  getWorkList(data, loading = false, toast = false) {
    const url = `/api/wap/content/article-list`
    return request.get({ url, data, loading, toast })
  }
}
