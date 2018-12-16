import request from '@utils/request'

export default {
  /**
   * 下单
   * @param data
   * @param loading
   * @returns {*}
   */
  confirmOeder(data, loading = true) {
    const url = `/social-shopping/api/wap/create-order`
    return request.post(url, data, loading)
  }
}
