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
      classifyTabIsShow: false,
      classifyTabPosition: 999999,
      classifyScrollHeight: 9999999,
      getScrollHeightTimer: undefined,
      classifyIsShow: undefined,
      classifyShowEmpty: undefined,
      navigationBar: 0,
      classifyTabScrolling: false
    }
  },
  onReachBottom() {
    this.classifyPage++
    this._getClassifyList()
  },
  onPageScroll(e) {
    if (this.classifyTabScrolling) return
    const currentScrollTop = e.scrollTop + this.navigationBar
    const t10 = this.classifyScrollHeight + this.classifyTabPosition
    const t15 = this.classifyScrollHeight + this.classifyTabPosition * 1.1
    const t20 = this.classifyScrollHeight + this.classifyTabPosition * 1.5
    if (currentScrollTop < t10) {
      this.classifyStyles = ''
    }
    if (currentScrollTop > t10 && currentScrollTop < t15) {
      this._setClassifyStyles(0, 1, 0)
    }
    if (currentScrollTop >= t15 && currentScrollTop <= t20) {
      this._setClassifyStyles(0, 1)
    }
    if (currentScrollTop > t20) {
      this._setClassifyStyles(this.classifyTabPosition, 1)
    }
  },
  methods: {
    _setClassifyStyles(y, opacity, time = 300) {
      this.classifyStyles = `
      opacity:${opacity};
      top:${this.navigationBar - this.classifyTabPosition}px;
      position:fixed;
      left:0;
      z-index:90;
      transform:translate3d(0,${y}px,0);
      transition: transform ${time}ms ease-out
      `
    },
    // 获取tab位置信息
    _getTabPosition() {
      const query = wx.createSelectorQuery()
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          query.select('#navigationBar').boundingClientRect()
            .select('#homePosition').boundingClientRect()
            .select('#homeBanner').boundingClientRect()
            .select('#homeFlashSale').boundingClientRect()
            .select('#homeEmpty').boundingClientRect()
            .select('#scrollView-relative').boundingClientRect()
            .exec(res => {
              let height = 0
              res.forEach(item => {
                if (item && item.height) {
                  item.id === 'navigationBar' && (this.navigationBar = item.height)
                  if (item.id === 'scrollView-relative') {
                    this.classifyTabPosition = item.height
                  } else {
                    height += item.height
                  }
                }
              })
              if (this.classifyScrollHeight !== height + 10) {
                this.classifyScrollHeight = height + 10
              }
              resolve()
            })
        }, 500)
      })
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
      if (this.classifyStyles) {
        this.classifyStyles = ''
        this.classifyTabScrolling = true
        setTimeout(() => {
          this.classifyTabScrolling = false
        }, 100)
        wx.pageScrollTo({
          scrollTop: this.classifyScrollHeight - this.navigationBar,
          duration: 0
        })
      }
      let number = this._optimizeTabViewItem(index, this.classifyTabIndex)
      this.classifyViewToItem = `item${number}`
      setTimeout(() => {
        this.classifyViewToItem = ``
      }, 100)
      this.classifyTabIndex = index
      this._resetGetClassifyListParams()
      this._getClassifyList(false)
    },
    // 优化tab切换时的动画问题
    _optimizeTabViewItem(index, lastIndex) {
      let number = index
      if (index < lastIndex) {
        number = index - 2 >= 0 ? index - 2 : 0
      }
      return number
    }
  }
}
