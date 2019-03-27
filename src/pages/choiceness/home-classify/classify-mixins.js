import API from '@api'
export default {
  data() {
    return {
      classifyTabList: [],
      classifyTabIndex: 0,
      classifyViewToItem: 'item0',
      classifyPage: 1,
      classifyMore: false,
      classifyArray: [],
      classifyStyles: '',
      classifyId: 88,
      classifyNavigationHeight: 0,
      classifyTabIsShow: false,
      classifyTabPosition: 9999
    }
  },
  onLoad(options) {
    this.getCategoryData(true)
  },
  onReady() {
    this.classifyNavigationHeight = (this.systemInfo.statusBarHeight || 20) + 44
    this.classifyStyles = `top:${this.classifyNavigationHeight}px;position:fixed;left:0;z-index:100`
  },
  onReachBottom() {
    // this.getMoreCategoryList(this.classifyId, this.tabIndex)
  },
  // onPageScroll(e) {
  //   console.log(e)
  //   this.classifyTabIsShow = e.scrollTop + this.classifyNavigationHeight >= this.classifyTabPosition
  // },
  methods: {
    _getTabPosition() {
      const query = wx.createSelectorQuery()
      query.select('#scrollView-relative').boundingClientRect()
      query.exec(res => {
        this.classifyTabPosition = res[0].height + res[0].top
      })
    },
    getCategoryData(isLoad = false) {
      API.Choiceness.getClassifyCategory().then((res) => {
        if (res.error !== this.$ERR_OK) {
          return
        }
        this.classifyTabList = res.data
        // let length = res.data.length
        // for (var i = 0; i < length; i++) {
        //   this.classifyList.push([])
        // }
        // res.data.forEach((item, index) => {
        //   if (item.id * 1 === this.classifyId * 1) {
        //     this.tabIndex = index
        //     // if (isLoad) {
        //     //   setTimeout(() => {
        //     //     this.boxTransition = 'all .3s'
        //     //   }, 50)
        //     // }
        //     if (index > 3) {
        //       this.viewToItem = `item${index}`
        //     } else {
        //       this.viewToItem = `item0`
        //     }
        //   }
        // })
        setTimeout(() => {
          this._getTabPosition()
        }, 500)
        this.getCategoryList(this.classifyId, this.tabIndex)
      })
    },
    getCategoryList(id, index) {
      this.classifyPage = 1
      this.classifyMore = false
      API.Choiceness.getClassifyList({goods_category_id: id, limit: 10, page: this.classifyPage}).then((res) => {
        if (res.error !== this.$ERR_OK) {
          return
        }
        this.classifyArray = res.data
        // this._isUpList(res)
      })
    },
    _isUpList(res) {
      // console.log(123)
      // this.classifyPage++
      // if (this.classifyList[this.tabIndex].length >= res.meta.total * 1) {
      //   this.classifyMore = true
      // }
    },
    async classifyChangeTab(index, id, e) {
      e.preventDefault()
      if (this.classifyTabIndex * 1 === index * 1) return
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
      this.classifyViewToItem = `item${number}`
      this.classifyTabIndex = index
      this.classifyId = id
      this.getCategoryList(this.classifyId, index)
    }
  }
}
