import request from './request-handler'

export default {
  /** ********** 首页 ************ **/
  // 今日爆款
  getTodayHotList(data, loading = false, toast) {
    const url = `/api/wap/goods/goods-hot-tag`
    return request.get({url, data, loading, toast})
  },
  // 新人特惠
  getNewClientList(data, loading = false, toast) {
    const url = `/api/wap/activity/activity-new-client/goods-sku`
    return request.get({url, data, loading, toast})
  },
  // 猜你喜欢
  getGuessList(data, loading = false, toast) {
    const url = `/api/wap/recommend/goods`
    return request.get({url, data, loading, toast})
  }
}
