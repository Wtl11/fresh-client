import request from '@utils/request'

export default {
  /**
   * 获得拼团详情
   * @param order_id、id
   * @param loading
   * @returns {*}
   */
  getGrouponDetail(data, loading = false) {
    let url = '/api/wap/activity/activity-groupon-customer'
    return request.get(url, data, loading)
  },
  /**
   * 检查是否满足参团条件
   * @param activity_id,goods_sku_id,groupon_id,num,longitude,latitude
   * @param loading
   * @returns {*}
   */
  checkGroupon(data, loading = false) {
    let url = '/api/wap/activity/activity-groupon-check-goods'
    return request.get(url, data, loading)
  },
  /**
   * 判断距离
   * @param longitude,latitude
   * @param loading
   * @returns {*}
   */
  getDistance(data, loading = false) {
    let url = '/api/wap/shop-distance'
    return request.get(url, data, loading)
  },
  /**
   * 分享图
   * @param goods_id,activity_id
   * @param loading
   * @returns {*}
   */
  getShareImage(data, loading = false) {
    let url = 'api/wap/goods/goods-share-image'
    return request.get(url, data, loading)
  }
}
