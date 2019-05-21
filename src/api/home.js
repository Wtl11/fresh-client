import request from './request-handler'

export default {
  /** ********** 首页 ************ **/
  // 今日爆款
  getTodayHotList(data, loading, toast) {
    const url = `/api/wap/goods/goods-hot-tag`
    return request.get({url, data, loading, toast})
  },
  // 新人特惠
  getNewClientList(data, loading, toast) {
    const url = `/api/wap/activity/activity-new-client/goods-sku`
    return request.get({url, data, loading, toast})
  }
}
