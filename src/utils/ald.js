class Ald {
  static getInstance() {
    if (!this.instance) {
      this.instance = new Ald()
    }
    return this.instance
  }
  constructor() {
    this.ald = getApp && getApp()
  }
  sendEvent(content) {
    if (!this.ald) {
      console.warn(this.ald, getApp)
      this.ald = getApp()
    }
    this.ald && this.ald.sendEvent && this.ald.sendEvent(content)
  }
}

export default Ald.getInstance()