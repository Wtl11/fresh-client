import request from '@utils/request'

export default {
  sendMsg(data, loading) {
    let url = '/api/wap/ai/action-collect'
    return request.get(url, data, loading)
  },
  getCustomerCount(data, loading) {
    let url = '/api/wap/ai/customer-count'
    return request.post(url, data, loading)
  }
}
