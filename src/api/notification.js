import request from '@utils/request'

export default {
  sendMsg(data, loading) {
    let url = '/api/wap/customer-order'
    return request.get(url, data, loading)
  }
}
