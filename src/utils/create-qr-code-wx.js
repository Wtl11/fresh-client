import base64ToArrayBuffer from 'base64-arraybuffer'
const fsm = wx.getFileSystemManager()
const FILE_BASE_NAME = 'tmp_image_src'

const base64src = function(base64data) {
  return new Promise((resolve, reject) => {
    const [, format, bodyData] = /data:image\/(\w+);base64,(.*)/.exec(base64data) || []
    if (!format) {
      reject(new Error('ERROR_BASE64SRC_PARSE'))
    }
    const filePath = `${wx.env.USER_DATA_PATH}/${FILE_BASE_NAME + Date.now()}.${format}`
    const buffer = base64ToArrayBuffer.decode(bodyData)
    fsm.writeFile({
      filePath,
      data: buffer,
      encoding: 'binary',
      success() {
        resolve(filePath)
      },
      fail() {
        reject(new Error('ERROR_BASE64SRC_WRITE'))
      }
    })
  })
}

export default base64src

export function bufferToImage(buffer) {
  return new Promise((resolve, reject) => {
    const format = 'png'
    const filePath = `${wx.env.USER_DATA_PATH}/${FILE_BASE_NAME + Date.now()}.${format}`
    fsm.writeFile({
      filePath,
      data: buffer,
      encoding: 'binary',
      success() {
        resolve(filePath)
      },
      fail() {
        reject(new Error('ERROR_BUFFER_WRITE'))
      }
    })
  })
}
