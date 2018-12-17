import request from '@utils/request'

export default {
  /**
   * 收集formId
   * @param data
   * @param loading
   * @returns {*}
   */
  getToken(data, loading) {
    const url = `/api/jwt/customer/login`
    return request.post(url, data, loading)
  }
}
