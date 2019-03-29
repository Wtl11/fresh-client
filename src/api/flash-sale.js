import request from './request-handler'

export default {
  /** ********** 用户优惠券页面 ************ **/
  /**
   * @param data
   * @param loading
   * @param toast
   * @returns {*}
   */
  // 获取模块数据
  getModuleInfo(data, loading = false, toast) {
    const url = `/api/wap/cms/page-index`
    return request.get({url, data, loading, toast})
  },
  // 获取商品分类列表数据
  getClassifyList(data, loading = false, toast) {
    const url = `/api/wap/goods/goods`
    return request.get({url, data, loading, toast})
  },
  // 获取限时抢购列表数据
  getFlashList(data, loading = false, toast) {
    const url = `/api/wap/goods/activity-goods`
    return request.get({url, data, loading, toast})
  }
}
