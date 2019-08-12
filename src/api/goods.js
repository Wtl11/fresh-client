import request from './request-handler'

export default {
  // 获取历史自提点列表
  getTipList(data, loading, toast) {
    const url = `/api/wap/goods/goods-coupon-tips`
    return request.get({url, data, loading, toast})
  }
}
