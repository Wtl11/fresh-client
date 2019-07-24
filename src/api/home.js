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
  },
  // 拼团活动
  getGroupList(data, loading = false, toast) {
    const url = `/api/wap/activity/activity-groupon-goods`
    return request.get({url, data, loading, toast})
  },
  // 活动商品列表[v2.1]
  getActivityList(data, loading = false, toast) {
    const url = `/api/wap/goods/activity-goods`
    return request.get({url, data, loading, toast})
  },
  // 全国包邮
  getFreeShippingList(data, loading = false, toast) {
    const url = `http://market-api.jkweixin.net/market/v2/api/wap/goods`
    return request.get({url, data, loading, toast})
  }
}
