import request from './request-handler'

export default {
  // 微信群分享采集
  sendMsgWxGroup(data, loading = false, toast = false) {
    const url = `/api/wap/data/wx-group`
    return request.post({url, data, loading, toast})
  },
  // 群分享解密
  getGroupId(data, loading = false, toast = false) {
    const url = `/api/wap/data/group-gid`
    return request.post({url, data, loading, toast})
  }
}
