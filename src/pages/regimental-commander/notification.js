export default class Notification {
  static getInstance() {
    if (!this.instance) {
      this.instance = new Notification()
    }
    return this.instance
  }
  static instance = null
  constructor () {
    this.socket = null
  }
  connect({url = 'wss://wss.jkweixin.com:1443/sub', id = 1000, prg = 'dev'} = {}) {
    this.socket = wx.connectSocket({
      url: `${url}?id=${id}&prg=${prg}`,
      success() {
        console.warn('连接socket成功...')
      },
      fail() {
        console.error('连接socket失败!')
      }
    })
  }
  disconnect() {
    return new Promise((resolve, reject) => {
      this.socket.onClose(() => {
        console.warn('socket断开连接！')
      })
    })
  }
  on(cb) {
    this.socket.onOpen(() => {
      this.socket.onMessage(cb)
    })
  }
}
