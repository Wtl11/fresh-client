import {countDownHandle} from '@utils/common'
import API from '@api'

export default {
  data() {
    return {
      flashTabList: undefined,
      flashTabIndex: 0,
      flashArray: undefined,
      flashCountDownTimes: undefined,
      flashIsShow: undefined,
      flashCountDownTimer: undefined
    }
  },
  onUnload() {
    clearInterval(this.flashCountDownTimer)
  },
  onHide() {
    clearInterval(this.flashCountDownTimer)
  },
  onShow() {
    this._getTabList()
  },
  methods: {
    // tab切换
    flashChangeTab(item, index) {
      if (this.flashTabIndex === index) return
      this.flashTabIndex = index
      this._getTabList(false)
      // this.flashScrollLeft = 0
      // if (this.$refs.flashSale && !this.$refs.flashSale.scrollPosition) {
      //   this._getTabList(false)
      // }
    },
    // flashScrollEnd() {
    //   this.flashScrollLeft = undefined
    //   this._getTabList(false)
    // },
    // 获取限时活动列表
    async _getFlashList(loading) {
      if (this.flashTabList && this.flashTabList.length === 0) {
        this.flashIsShow = false
        return
      }
      this._countDownAction()
      if (!this.flashTabList[this.flashTabIndex]) return
      let data = {
        activity_id: this.flashTabList[this.flashTabIndex].id || 0
      }
      let res = await API.FlashSale.getFlashList(data, loading)
      this.flashArray = res.data
    },
    // tab-list
    async _getTabList(loading = false) {
      try {
        let res = await API.FlashSale.getFlashTabList('', loading)
        this.flashTabList = res.data
        this._getFlashList()
      } catch (e) {
        console.error(e)
      }
    },
    // 倒计时
    _countDownAction() {
      if (!this.flashTabList[this.flashTabIndex]) return
      let currentTime = this.flashTabList[this.flashTabIndex].at_diff || 0
      if (currentTime <= 0) {
        currentTime = 0
        return
      }
      // if (!currentTime) return // 倒计时为0不跑
      this.flashCountDownTimes = countDownHandle(currentTime)
      clearInterval(this.flashCountDownTimer)
      this.flashCountDownTimer = setInterval(() => {
        currentTime--
        // console.log(currentTime)
        this.flashCountDownTimes = countDownHandle(currentTime)
        if (this.flashCountDownTimes.differ <= 0 || !this.flashCountDownTimes.differ) {
          clearInterval(this.flashCountDownTimer)
          this._getTabList()
        }
      }, 1000)
    }
  }
}
