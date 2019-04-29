import request from './request-handler'

export default {
  // 获取历史自提点列表
  getList(data, loading, toast) {
    const url = `/api/wap/goods/goods-customer-page`
    return request.get({url, data, loading, toast})
  }
}
