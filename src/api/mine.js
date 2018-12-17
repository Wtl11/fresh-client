import request from '@utils/request'

export default {
  getShopDetail(loading = false) {
    let url = '/social-shopping/api/wap/shop-detail'
    return request.get(url, null, loading)
  },
  getShopList(loading = true) {
    let url = '/social-shopping/api/wap/shop-list'
    return request.get(url, null, loading)
  }
}
