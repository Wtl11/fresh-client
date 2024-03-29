import request from '@utils/request'

export default {
  /**
   * 购物车列表
   * @param data
   * @param loading
   * @returns {*}
   */
  shopCart(loading) {
    const url = `/api/wap/cart`
    return request.get(url, null, loading)
  },
  /**
   * 删除购物车商品
   * @param id
   * @param loading
   * @returns {*}
   */
  delCartGoods(id, loading) {
    const url = `/api/wap/cart/${id}`
    return request.delete(url, null, loading)
  },
  /**
   * 购物车商品数量增加
   * @param id
   * @param loading
   * @returns {*}
   */
  editCartGoodsNum(id, num, loading = false) {
    let data = {
      num
    }
    const url = `/api/wap/cart/${id}`
    return request.put(url, data, loading)
  },
  getCarsss(data, loading = true) {
    const url = `/api/wap/create-order`
    return request.post(url, data, loading)
  },
  // 购物车数量
  shopCartNumber(data = null, loading = false) {
    const url = `/api/wap/cart-count`
    return request.get(url, data, loading)
  },

  // 购物车 猜你喜欢
  getCarRecommend(data = null, loading = false) {
    const url = `/api/wap/recommend/goods`
    return request.get(url, data, loading)
  },
  // 勾选购物车获得提示信息
  chooseGoods4Tips(data, loading = false) {
    const url = `/api/wap/choose-cart-goods-tips`
    return request.post(url, data, loading)
  }
}
