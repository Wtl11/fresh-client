import request from '@utils/request'

export default {
  // 授权
  getToken(data, loading) {
    const url = `/social-shopping/api/wap/customer-login`
    return request.post(url, data, loading)
  }
}
