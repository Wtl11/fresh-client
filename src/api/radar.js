import request from '@utils/request'

export default {
  /**
   * 获得行为记录列表
   * @param id
   * @param loading
   * @returns {*}
   */
  getRadarList(data, loading = false) {
    let url = 'social-shopping/api/wap/ai/action-collect'
    return request.get(url, data, loading)
  }
}
