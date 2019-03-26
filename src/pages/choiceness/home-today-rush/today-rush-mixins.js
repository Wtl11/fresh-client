import API from '@api'
export default {
  data() {
    return {
      activityTime: {
        day: '00',
        hour: '00',
        minute: '00',
        second: '00'
      },
      isShowActiveEnd: false,
      goodsList: [],
      timer: null,
      goodsMore: false,
      goodsPage: 2
    }
  },
  watch: {
    modulesList(modulesList) {
      modulesList.forEach((item) => {
        if (item.module_name === 'activity') {
          this.goodsList = item.content_data.list
          this._kanTimePlay(item.content_data.last_time)
          this.goodsListData = item
          this.goodsPage = 2
          this.goodsMore = false
          if (this.goodsList.length === 0) {
            this.goodsMore = true
            this.isShowActiveEnd = true
          }
        }
      })
    }
  },
  onUnload() {
    clearInterval(this.timer)
  },
  onReachBottom() {
    this.getMoreGoodsList(false, () => {
      this.isShowActiveEnd = !this.goodsList.length
    })
  },
  onPullDownRefresh() {
    this.goodsPage = 2
    this.goodsMore = false
    this.isShowActiveEnd = !this.goodsList.length
  },
  methods: {
    // 获取更多的今日抢购的商品列表
    getMoreGoodsList(loading = false, callback) {
      if (this.goodsMore) {
        return
      }
      let data = {
        activity_id: this.goodsListData.content_data.other_id,
        page: this.goodsPage,
        limit: 10
      }
      API.Choiceness.getGoodsShelfList(data, loading).then((res) => {
        this.$wechat.hideLoading()
        if (res.error === this.$ERR_OK) {
          this.goodsList = this.goodsList.concat(res.data)
          this._isUpList(res)
        } else {
          this.$wechat.showToast(res.message)
        }
        callback && callback()
      })
    },
    // 跟新列表
    _isUpList(res) {
      this.goodsPage++
      if (this.goodsList.length >= res.meta.total * 1) {
        this.goodsMore = true
      }
    },
    // 添加购物车
    async addShoppingCart(item) {
      let isLogin = await this.$isLogin()
      if (!isLogin) {
        return
      }
      API.Choiceness.addShopCart({goods_sku_id: item.goods_sku_id, activity_id: item.activity_id}).then((res) => {
        if (res.error === this.$ERR_OK) {
          this.$sendMsg({
            event_no: 1007,
            goods_id: item.goods_id,
            title: item.name
          })
          this.$wechat.showToast('加入购物车成功', 1000, false)
          this.setCartCount()
        } else {
          this.$wechat.showToast(res.message, 1000, false)
        }
      })
    },
    _kanTimePlay(time) {
      clearInterval(this.timer)
      this.end_time = time
      this.timer = setInterval(() => {
        if (this.end_time > 0) {
          this.end_time--
        }
        this.activityTime = this._groupTimeCheckout(this.end_time)
        if (this.timeEnd) {
          clearInterval(this.timer)
        }
      }, 1000)
    },
    _groupTimeCheckout(time) {
      let differ = time * 1
      let day = Math.floor(differ / (60 * 60 * 24))
      day = day >= 10 ? day : '0' + day
      let hour = Math.floor(differ / (60 * 60)) - (day * 24)
      hour = hour >= 10 ? hour : '0' + hour
      let minute = Math.floor(differ / 60) - (day * 24 * 60) - (hour * 60)
      minute = minute >= 10 ? minute : '0' + minute
      let second = Math.floor(differ) - (day * 24 * 60 * 60) - (hour * 60 * 60) - (minute * 60)
      second = second >= 10 ? second : '0' + second
      let times
      if (differ > 0) {
        times = {
          day,
          hour,
          minute,
          second
        }
        this.timeEnd = false
      } else {
        times = {
          day: '00',
          hour: '00',
          minute: '00',
          second: '00'
        }
        this.timeEnd = true
      }
      return times
    }
  }
}
