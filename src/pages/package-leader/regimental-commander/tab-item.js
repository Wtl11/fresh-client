export default class TabItem {
  constructor (props) {
    this.title = props.title
    this.fn = props.fn
    this.page = 1
    this.limit = 10
    this.hasMore = true
    this.isShowEmpty = false
    this.isFirstLoad = true
    this.isOnReachBottom = props.isOnReachBottom
  }
}
