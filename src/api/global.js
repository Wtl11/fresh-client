import request from './request-handler'

export default {
  // 检查是否为新人[v2.4.1.1]
  checkIsNewCustomer(data = null, loading = false, toast = false) {
    const url = `/api/wap/check-new-client`
    return request.get({url, data, loading, toast})
  },
  // 当前位置离自提点距离判断[v2.4.1.2]
  checkShopDistance(data = null, loading = false, toast = false) {
    const url = `/api/wap/shop-distance-judge`
    return request.get({url, data, loading, toast})
  },
  // 拼团-未成团列表[v2.4.1.2]
  getUnGroupList(data = null, loading = false, toast = false) {
    const url = `/api/wap/activity/activity-groupon-spell-groupon`
    return request.get({url, data, loading, toast})
  },
  // 拼团-检查下单[v2.4.1.2]
  checkAbleCreateGroup(data = null, loading = false, toast = false) {
    const url = `/api/wap/activity/activity-groupon-check-goods`
    return request.get({url, data, loading, toast})
  },
  // 拼团-成功记录列表[v2.4.1.2]
  getFinishGroupList(data = null, loading = false, toast = false) {
    const url = `/api/wap/activity/activity-groupon-goods-customer`
    return request.get({url, data, loading, toast})
  },
  // 检查订单支付状态[v2.4.1.2]
  checkPayResult(data = null, loading = false, toast = false) {
    const url = `/api/wap/check-order-pay-status`
    return request.get({url, data, loading, toast})
  },
  // 小程序采集（1.0）
  sendEvent(data = null, loading = false, toast = false) {
    const url = `/api/wap/data/data-center-collect`
    return request.get({url, data, loading, toast})
  },
  // 查询物品信息-好物圈商品信息
  getProduct(data = null, loading = false, toast = false) {
    const url = `/api/wap/goods-thing-circle/query-product`
    return request.post({url, data, loading, toast})
  },
  // 运营时间
  getRunTime(data = null, loading = false, toast = false) {
    const url = `/api/wap/scm/run-time`
    return request.get({url, data, loading, toast})
  }
}
