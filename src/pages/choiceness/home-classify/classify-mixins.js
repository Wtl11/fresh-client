import API from '@api'
export default {
  data() {
    return {
      classifyTabList: [],
      classifyTabIndex: 0,
      classifyViewToItem: 'item0',
      classifyPage: 1,
      classifyMore: true,
      classifyArray: [],
      classifyStyles: '',
      classifyId: 88,
      classifyNavigationHeight: 0,
      classifyTabIsShow: false,
      classifyTabPosition: 999999,
      classifyScrollHeight: 0,
      getScrollHeightTimer: undefined,
      classifyIsShow: undefined,
      classifyShowEmpty: undefined
    }
  },
  onReady() {
    this.classifyNavigationHeight = (this.systemInfo.statusBarHeight || 20) + 44
    this.classifyStyles = `top:${this.classifyNavigationHeight}px;position:fixed;left:0;z-index:100`
  },
  onReachBottom() {
    this.classifyPage++
    this._getClassifyList()
  },
  onPageScroll(e) {
    // console.log(e.scrollTop + this.classifyNavigationHeight, this.classifyTabPosition.top)
    this.classifyTabIsShow = e.scrollTop + this.classifyNavigationHeight >= this.classifyTabPosition.top
  },
  methods: {
    // 获取tab位置信息
    _getTabPosition() {
      if (this.classifyScrollHeight) return
      clearTimeout(this.getScrollHeightTimer)
      this.getScrollHeightTimer = setTimeout(() => {
        const query = wx.createSelectorQuery()
        query.select('#scrollView-relative').boundingClientRect()
        query.exec(res => {
          if (!res[0]) {
            this.homeStyles = ``
            return
          }
          this.classifyTabPosition = res[0]
          this.classifyScrollHeight = res[0].top - this.classifyNavigationHeight
          this.homeStyles = ``
        })
      }, 0)
    },
    // 获取商品分类列表
    async _getClassifyList(loading) {
      console.log(this.classifyMore, '')
      if (!this.classifyMore) return
      let current = this.classifyTabList[this.classifyTabIndex] || {}
      try {
        const data = {
          goods_category_id: current.id || 0,
          page: this.classifyPage
        }
        let res = await API.FlashSale.getClassifyList(data, loading)
        if (res.meta.current_page === 1) {
          this.classifyArray = res.data
          this.classifyShowEmpty = res.meta.total === 0
        } else {
          this.classifyArray = this.classifyArray.concat(res.data)
        }
        this.classifyMore = res.meta.current_page < res.meta.last_page
        this._getTabPosition()
      } catch (e) {
        console.error(e)
      }
    },
    // 重置参数
    _resetGetClassifyListParams() {
      this.classifyPage = 1
      this.classifyMore = true
    },
    // tab切换
    classifyChangeTab(index, id, e) {
      if (this.classifyTabIndex === index) return
      this.classifyTabIsShow && wx.pageScrollTo({
        scrollTop: this.classifyScrollHeight,
        duration: 0
      })
      let number = this._optimizeTabViewItem(index)
      this.classifyViewToItem = `item${number}`
      this.classifyTabIndex = index
      this._resetGetClassifyListParams()
      this._getClassifyList(true)
    },
    // 优化tab切换时的动画问题
    _optimizeTabViewItem(index) {
      let number = index * 1 === 0 ? 1 : index
      if (this.classifyTabIndex > index) {
        if (index <= 3) {
          number = 0
        } else {
          number = index
        }
      } else if (this.classifyTabIndex < index) {
        if (index <= 3) {
          number = 0
        } else {
          number = index
        }
      }
      return number
    }
  }
}
