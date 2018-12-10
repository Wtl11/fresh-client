import request from '@utils/request'

export default {
  // 授权
  getToken(data, loading) {
    const url = `/api/jwt/customer/login`
    return request.post(url, data, loading)
  }
}
