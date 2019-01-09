import request from '@utils/request'

export default {
  // 交易数据
  getExchangeData(data, loading = false) {
    const url = `/api/wap/shop-manager/statistics-trade-data`
    return request.get(url, data, loading)
  },
  // 佣金收益
  getCommission(data, loading = false) {
    const url = `/api/wap/shop-manager/statistics-commission-data`
    return request.get(url, data, loading)
  },
  // 访客数
  getCustomer(data, loading = false) {
    const url = `/api/wap/shop-manager/statistics-visitors-data`
    return request.get(url, data, loading)
  },
  // 支付客户数
  getPayCustomer(data, loading = false) {
    const url = `/api/wap/shop-manager/statistics-consume-data`
    return request.get(url, data, loading)
  },
  // 平均下单数
  getMeanCustomer(data, loading = false) {
    const url = `/api/wap/shop-manager/statistics-average-order-data`
    return request.get(url, data, loading)
  },
  // 笔单价
  getOrderPrice(data, loading = false) {
    const url = `/api/wap/shop-manager/statistics-order-price-data`
    return request.get(url, data, loading)
  }
}
