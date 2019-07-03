import request from './request-handler'

export default {
  // 获取历史自提点列表
  getList(data, loading, toast) {
    const url = `/api/wap/shop-history-list`
    return request.get({url, data, loading, toast})
  },
  // 获取历史自提点列表
  getNearbyList(data, loading, toast) {
    const url = `/v3/api/wap/shop-nearby-list`
    return request.get({url, data, loading, toast})
  }
}
