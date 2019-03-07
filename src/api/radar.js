import request from '@utils/request'

export default {
  /**
   * 获得行为记录列表
   * @param id
   * @param loading
   * @returns {*}
   */
  getRadarList(data, loading = false) {
    let url = 'api/wap/ai/action-logs'
    return request.post(url, data, loading)
  }
}
