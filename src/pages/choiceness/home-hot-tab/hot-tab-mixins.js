// import HomeHot from '../home-hot/home-hot'
export default {
  data() {
    return {
      isShowTab: true,
      scrollTop: 100,
      hotTabList: new Array(10).fill(1).map((item, index) => {
        return {name: '水果' + index}
      })
    }
  },
  onPageScroll(e) {
    this.isShowTab = e.scrollTop + 44 + 20 >= this.scrollTop
    // this._getTargetScrollTop()
    if (this.isShowTab) {
      // this._getScrollTargetItem('.home-hot-tab > .item')
    }
  },
  onReady() {
    setTimeout(() => {
      this._getTargetScrollTop('.home-hot')
      this._getScrollTargetItem('.home-hot-tab > .item')
      // this._getScrollTargetItem('.item')
    }, 2000)
  },
  methods: {
    _getTargetScrollTop(el) {
      const query = wx.createSelectorQuery()
      query.select(el).boundingClientRect()
      query.exec(res => {
        console.log(res[0])
        this.scrollTop = res[0].top + res[0].height
        console.log(this.scrollTop)
      })
    },
    _getScrollTargetItem(el) {
      const query = wx.createSelectorQuery()
      query.selectAll(el).boundingClientRect()
      query.exec(res => {
        this.hotTabList.map((item, index) => {
          item.width = res[0][index].width
          item.left = res[0][index].left
          return item
        })
      })
    }
  }
}
