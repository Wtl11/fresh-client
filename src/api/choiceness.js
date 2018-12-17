import request from '@utils/request'

export default {
  // 团长信息
  getGroupInfo(loading = false) {
    const url = `/social-shopping/api/wap/shop-detail`
    return request.get(url, null, loading)
  },
  // 轮播信息
  getPlanting(data, loading = false) {
    const url = `/social-shopping/api/wap/ad/wheel-planting`
    return request.get(url, data, loading)
  },
  // 活动标签列表
  getGoodsTag(data, loading = false) {
    const url = `/social-shopping/api/wap/goods/shelf-tag`
    return request.get(url, data, loading)
  },
  // 活动标签列表
  getGoodsShelfList(data, loading = false) {
    const url = `/social-shopping/api/wap/goods/shop-shelf-goods`
    return request.get(url, data, loading)
  },
  // 活动标签列表
  getGoodsDetail(id, loading = false) {
    const url = `/social-shopping/api/wap/goods/shop-shelf-goods/${id}`
    return request.get(url, null, loading)
  },
  // 加入购物车
  addShopCart(data, loading = false) {
    const url = `/social-shopping/api/wap/cart`
    return request.post(url, data, loading)
  },
  // 购物车数量
  shopCartNumber(data, loading = false) {
    const url = `/social-shopping/api/wap/cart-count`
    return request.get(url, data, loading)
  }
}
