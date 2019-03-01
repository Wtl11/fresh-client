import request from '@utils/request'

export default {
  // 团长信息
  getGroupInfo(loading = false) {
    const url = `/api/wap/shop-detail`
    return request.get(url, null, loading)
  },
  // 轮播信息
  getPlanting(data, loading = false) {
    const url = `/api/wap/ad/wheel-planting`
    return request.get(url, data, loading)
  },
  // 活动标签列表
  getGoodsTag(data, loading = false) {
    const url = `/api/wap/goods/shelf-tag`
    return request.get(url, data, loading)
  },
  // 活动标签列表
  getGoodsShelfList(data, loading = false) {
    const url = `/api/wap/goods/activity-goods`
    return request.get(url, data, loading)
  },
  // 活动详情接口
  getGoodsDetail(id, data, loading = false) {
    const url = `/api/wap/goods/goods/${id}`
    return request.get(url, data, loading)
  },
  // 活动商品其他信息
  getGoodsBuyInfo(id, data, loading = false) {
    const url = `/api/wap/goods/goods-other-info/${id}`
    return request.get(url, data, loading)
  },
  // 活动标签列表
  getGoodsDetailsThumb(data, loading = false) {
    const url = `/api/wap/goods/goods-thumb`
    return request.get(url, data, loading)
  },
  // 加入购物车
  addShopCart(data, loading = false) {
    const url = `/api/wap/cart`
    return request.post(url, data, loading)
  },
  // 购物车数量
  shopCartNumber(data, loading = false) {
    const url = `/api/wap/cart-count`
    return request.get(url, data, loading)
  },
  // 活动商品购买用户列表
  getUserImg(data, loading = false) {
    const url = `/api/wap/goods/goods-customer`
    return request.get(url, data, loading)
  },
  // 活动商品购买用户列表
  createQrCodeApi(data, loading = false) {
    const url = `/api/create-qrcode`
    return request.post(url, data, loading)
  },
  // 活动标签列表
  copyGoodsDetail(id, data, loading = false) {
    const url = `/api/wap/goods/goods/${id}`
    return request.get(url, data, loading)
  },
  // 获得默认店铺信息
  getDefaultShopInfo(data, loading = false) {
    const url = `/api/default/shop-info`
    return request.get(url, data, loading)
  },
  // 获得页面模块
  getModulesInfo(data, loading = false) {
    const url = `/api/wap/cms/page-index`
    return request.get(url, data, loading)
  },
  // 获得模块数据
  getModulesData(data, loading = false) {
    const url = `/api/wap/cms/module-data`
    return request.get(url, data, loading)
  },
  // 当前位置离自提点距离查询
  getLocationDistance(data, loading = false) {
    const url = `/api/wap/shop-distance`
    return request.get(url, data, loading)
  },
  // 商品系统分类列表
  getClassifyCategory(data, loading = false) {
    const url = `/api/wap/goods/goods-category`
    return request.get(url, data, loading)
  },
  // 商品系统商品列表列表
  getClassifyList(data, loading = false) {
    const url = `/api/wap/goods/goods`
    return request.get(url, data, loading)
  }
}
