import request from '@utils/request'

export default {
  // 授权
  getToken(data, loading) {
    const url = `/social-shopping/api/wap/cusstomer-login`
    return request.post(url, data, loading)
  }
}
