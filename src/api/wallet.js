import request from '@utils/request'

export default {
  // 获得钱包余额
  getShopMoney(data, loading = false) {
    const url = `/api/wap/shop-manager/money`
    return request.get(url, data, loading)
  },
  // 收支记录
  getShopBillList(data, loading = false) {
    const url = `/api/wap/shop-manager/shop-bill`
    return request.get(url, data, loading)
  }
}
