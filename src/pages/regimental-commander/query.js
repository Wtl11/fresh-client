export default class Query {
  static getInstance() {
    if (!this.instance) {
      this.instance = new Query()
    }
    return this.instance
  }
  constructor () {
    this.query = wx.createSelectorQuery() || {}
    this.query.select('#contentWrapper').boundingClientRect()
  }
}
