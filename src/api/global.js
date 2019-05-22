import request from './request-handler'

export default {
  // 检查是否为新人[v2.4.1.1]
  checkIsNewCustomer(data = null, loading = false, toast = false) {
    const url = `/api/wap/check-new-client`
    return request.get({url, data, loading, toast})
  }
}
