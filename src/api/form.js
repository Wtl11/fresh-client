import request from '@utils/request'

export default {
  /**
   * 收集formId
   * @param data
   * @param loading
   * @returns {*}
   */
  getFormId(data, loading = false) {
    const url = `/api/wap/collect-formid`
    return request.post(url, data, loading)
  }
}
