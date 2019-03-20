export default class TabItem {
  constructor (props) {
    this.text = props.text
    this.number = 0
    this.dataArray = new Array(3).fill(1)
    this.isShowEmpty = false
    this.page = 1
    this.isShowEmpty = false
    this.hasMore = true
  }
}
