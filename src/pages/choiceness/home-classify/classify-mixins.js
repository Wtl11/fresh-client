import API from '@api'
export default {
  data() {
    return {
      classifyTabList: [],
      classifyTabIndex: 0,
      classifyViewToItem: '',
      classifyPage: 1,
      classifyMore: true,
      classifyArray: [],
      classifyStyles: '',
      // classifyNavigationHeight: 0,
      classifyTabIsShow: false,
      // classifyTabPosition: 999999,
      classifyScrollHeight: 9999999,
      getScrollHeightTimer: undefined,
      classifyIsShow: undefined,
      classifyShowEmpty: undefined,
      navigationBar: 0
    }
  },
  onReady() {
    // this.classifyNavigationHeight = (this.systemInfo.statusBarHeight || 20) + 44
    // this.classifyStyles = `top:${this.classifyNavigationHeight}px;position:fixed;left:0;z-index:100`
  },
  onReachBottom() {
    this.classifyPage++
    this._getClassifyList()
  },
  onPageScroll(e) {
    if (!this.classifyStyles) return
    // console.log(e.scrollTop + this.classifyNavigationHeight, this.classifyTabPosition.top)
    // console.log(e.scrollTop + this.navigationBar, this.classifyScrollHeight)
    this.classifyTabIsShow = e.scrollTop + this.navigationBar >= this.classifyScrollHeight
  },
  methods: {
    // 获取tab位置信息
    _getTabPosition() {
      const query = wx.createSelectorQuery()
      setTimeout(() => {
        query.select('#navigationBar').boundingClientRect()
          .select('#homePosition').boundingClientRect()
          .select('#homeBanner').boundingClientRect()
          .select('#homeFlashSale').boundingClientRect()
          .select('#homeEmpty').boundingClientRect()
          .exec(res => {
            let height = 0
            res.forEach(item => {
              if (item && item.height) {
                height += item.height
                item.id === 'navigationBar' && (this.navigationBar = item.height)
              }
            })
            this.classifyStyles = `top:${this.navigationBar}px;position:fixed;left:0;z-index:100`
            this.classifyScrollHeight = height + 10
          })
      }, 500)
    },
    // 获取商品分类列表
    async _getClassifyList(loading) {
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
        scrollTop: this.classifyScrollHeight - this.navigationBar,
        duration: 0
      })
      let number = this._optimizeTabViewItem(index)
      this.classifyViewToItem = `item${number}`
      setTimeout(() => {
        this.classifyViewToItem = ``
      }, 100)
      this.classifyTabIndex = index
      this._resetGetClassifyListParams()
      this._getClassifyList(false)
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
