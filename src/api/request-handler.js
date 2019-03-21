import request from '@utils/request'
import {ERR_OK} from '@utils/config'
import * as wechat from '@utils/wechat'

class Request {
  static getInstance() {
    if (!this.instance) {
      this.instance = new Request()
    }
    return this.instance
  }
  constructor () {
    this.initMethods()
  }
  initMethods() {
    let arr = ['get', 'post', 'put', 'delete']
    arr.forEach((item) => {
      this[item] = (args) => {
        let {url, data, loading = true, toast = true, fn} = args
        return new Promise((resolve, reject) => {
          request[item](url, data, loading).then((res) => {
            // 隐藏loading
            if (loading) {
              wechat.hideLoading()
            }
            // 错误处理
            if (!res || res.error == null) {
              toast && wechat.showToast('系统异常.')
              throw new Error('' + res)
            }
            // toast处理
            if (ERR_OK !== res.error) {
              toast && wechat.showToast(res.message)
              throw new Error(res.message)
            }
            // 自定义函数处理
            if (typeof fn === 'function') {
              res = fn(res)
            }
            resolve(res)
          }).catch(e => {
            reject(e)
          })
        })
      }
    })
  }
}

export default Request.getInstance()
