import API from '@api'
export default {
  data() {
    return {
      showBuyUser: false,
      buyUsers: [],
      showUserIndex: 0,
      locationStatus: null,
      goodsListData: null,
      groupInfo: {},
      carouselTimer: null,
      showCarouselTimer: null
    }
  },
  onLoad() {
    this._initLocation()
  },
  onShow() {
    this._refreshLocation()
    this.getLocationData()
    this._getBuyUsers()
  },
  onHide() {
    this.carouselTimer && clearTimeout(this.carouselTimer)
    this.showCarouselTimer && clearTimeout(this.showCarouselTimer)
    this.showUserIndex = 0
    this.showBuyUser = false
  },
  onUnload() {
    this.carouselTimer && clearTimeout(this.carouselTimer)
    this.showCarouselTimer && clearTimeout(this.showCarouselTimer)
  },
  async onPullDownRefresh() {
    this._groupInfo(false)
  },
  methods: {
    // 初始化地理位置
    _initLocation() {
      if (wx.getStorageSync('locationShow') * 1 === 3 || wx.getStorageSync('locationShow') * 1 === 2) {
      } else {
        let that = this
        wx.getLocation({
          async success(res) {
            wx.setStorageSync('locationData', res)
            wx.setStorageSync('locationShow', 1)
            that.locationStatus = 1
            that.getLocationData()
          },
          fail(res) {
            wx.setStorageSync('locationShow', 3)
            wx.navigateTo({
              url: `/pages/open-location`
            })
          }
        })
      }
    },
    // 更新地理位置
    _refreshLocation() {
      this.locationStatus = wx.getStorageSync('locationShow')
      if (this.locationStatus * 1 === 3) {
        wx.navigateTo({
          url: `/pages/open-location`
        })
      }
      if (this.locationStatus * 1 === 1) {
        this.getLocationData()
      }
    },
    // 获取地理位置
    getLocationData() {
      let data = wx.getStorageSync('locationData')
      API.Choiceness.getLocationDistance({longitude: data.longitude || 0, latitude: data.latitude || 0}).then((res) => {
        if (res.error !== this.$ERR_OK) {
          return
        }
        let msgStatus = wx.getStorageSync('msgStatus')
        if (msgStatus !== 4 && res.data.distance > 1000) {
          // this.$refs.refundModel.show()
        }
      })
    },
    // 获取购买者的用户信息
    _getBuyUsers() {
      API.Choiceness.getUserImg({limit: 20}).then((res) => {
        if (res.error !== this.$ERR_OK) {
          this.$wechat.showToast(res.message)
          return
        }
        this.buyUsers = res.data
        this._handleBuyUserCarousel()
      })
    },
    // 购买用户信息的选择动画
    _handleBuyUserCarousel() {
      this.showCarouselTimer = setTimeout(() => {
        this.showBuyUser = true
      }, 1000)
      this.carouselTimer = setTimeout(() => {
        this.showBuyUser = false
        if (this.showUserIndex + 1 >= this.buyUsers.length) {
          clearTimeout(this.carouselTimer)
          return
        }
        setTimeout(() => {
          this.showUserIndex += 1
          this._handleBuyUserCarousel()
        }, 300)
      }, 5000)
    },
    // 获取团长的信息
    async _groupInfo(loading) {
      let res = await API.Choiceness.getGroupInfo(loading)
      if (loading) {
        this.$wechat.hideLoading()
      }
      if (res.error !== this.$ERR_OK) {
        this.$wechat.showToast(res.message)
      }
      this.groupInfo = res.data
    }
  }
}
