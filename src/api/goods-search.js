import request from './request-handler'

export default {
  // 搜索商品列表[v2.3.2]
  getList(data, loading, toast) {
    const url = `/api/wap/goods/goods-search`
    return request.get({url, data, loading, toast})
  }
}
