import request from '@utils/request'
import { baseURL } from '@utils/config'

export default {
  /**
   * 获取签名
   * @returns {Promise.<*>}
   */
  getUploadSign() {
    const url = `${baseURL.upload}/api/cos/upload-sign`
    return request.get(url, {}, false)
  },
  /**
   * 获取文件夹存储桶
   * @param data
   * @returns {Promise.<*>}
   */
  getUploadParam(data) {
    const url = `${baseURL.upload}/api/cos/upload-param`
    return request.get(url, data, false)
  },
  /**
   * 数据入库
   * @param data
   * @returns {Promise.<*>}
   */
  saveFile(data) {
    const url = `${baseURL.upload}/api/cos/save-file`
    return request.post(url, data, false)
  }
}
