import request from './request-handler'

export default {
  /** ********** 首页页面 ************ **/
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
  // 获取模块数据
  getModuleData(data, loading = false, toast) {
    const url = `/social-shopping/api/wap/cms/module-data`
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
  },
  /** ********** 限时抢购页面 ************ **/
  /**
   * @param data
   * @param loading
   * @param toast
   * @returns {*}
   */
  // 获取限时抢购tablist
  getFlashTabList(data, loading = true, toast) {
    const url = `/api/wap/activity/activity-fixed`
    return request.get({url, data, loading, toast})
  }
}
