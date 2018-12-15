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
    const url = `/social-shopping/api/wap/shop-manager-login`
    return request.post(url, data, loading)
  }
}
