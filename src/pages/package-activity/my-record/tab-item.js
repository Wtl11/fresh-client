export default class TabItem {
  constructor(props) {
    this.text = props.text
    this.last = 1
    this.dataArray = []
    this.isShowEmpty = false
    this.page = 1
    this.isShowEmpty = false
    this.hasMore = true
    this.status = props.status
    this.isFirstLoad = true
    this.numberKey = props.numberKey
  }
}
