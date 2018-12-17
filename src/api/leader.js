import request from '@utils/request'

export default {
  /**
   * 团长登录
   * @param data
   * @param loading
   * @returns {*}
   */
  loginLeader(data, loading) {
    const url = `/social-shopping/api/wap/shop-manager-login`
    return request.post(url, data, loading)
  },
  /**
   * 获取二维码
   * @param data
   * @param loading
   * @returns {*}
   */
  messageBind(data, loading) {
    const url = `/social-shopping/api/wap/message-bind`
    return request.post(url, data, loading)
  },
  /**
   * 团长详情
   * @param data
   * @param loading
   * @returns {*}
   */
  leaderDetail(loading = false) {
    const url = `/social-shopping/api/wap/shop-manager/shop-manager-detail`
    return request.get(url, {}, loading)
  },
  /**
   * 团长详情
   * @param data
   * @param loading
   * @returns {*}
   */
  recommendGoods(loading = false) {
    const url = `/social-shopping/api/wap/goods/shop-shelf-hot-goods`
    return request.get(url, {}, loading)
  },
  /**
   * 获取团长统计信息
   * @param data
   * @param loading
   * @returns {*}
   */
  leaderOrderTotal(loading = false) {
    const url = `/social-shopping/api/wap/shop-manager/shop-manager-statistics`
    return request.get(url, {}, loading)
  }
}
