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
    // this._clearFlashTimer()
  },
  onHide() {
    // this._clearFlashTimer()
  },
  methods: {
    // tab切换
    flashChangeTab(item, index) {
      if (this.flashTabIndex === index) return
      // clearInterval(this.flashCountDownTimer)
      this.flashTabIndex = index
      this._getFlashTabList(false)
    },
    // 获取限时活动列表
    async _getFlashList(loading) {
      // this._countDownAction()
      if (this.flashTabList && this.flashTabList.length === 0) {
        this.flashIsShow = false
        return
      }
      if (!this.flashTabList || !this.flashTabList[this.flashTabIndex]) return
      let data = {
        activity_id: this.flashTabList[this.flashTabIndex].id || 0
      }
      let res = await API.FlashSale.getFlashList(data, loading)
      this.flashArray = res.data
    },
    // 获取flashTab切换
    async _getFlashTabList(loading = false) {
      try {
        let res = await API.FlashSale.getFlashTabList('', loading)
        this.flashTabList = res.data
        await this._getFlashList()
      } catch (e) {
        console.error(e)
      }
    },
    // 倒计时
    _countDownAction() {
      if (!this.flashTabList || !this.flashTabList[this.flashTabIndex]) return
      let currentTime = this.flashTabList[this.flashTabIndex].at_diff
      if (currentTime == null || !this.flashIsShow) {
        return
      }
      if (currentTime < 0) {
        currentTime = 0
      }
      this.flashCountDownTimes = countDownHandle(currentTime)
      this._clearFlashTimer()
      this._countDownTimeout(currentTime)
    },
    _countDownTimeout(currentTime) {
      this.flashCountDownTimer = setTimeout(() => {
        currentTime--
        this.flashCountDownTimes = countDownHandle(currentTime)
        if (!this.flashCountDownTimes || !this.flashCountDownTimes.differ || this.flashCountDownTimes.differ <= 0) {
          this._clearFlashTimer()
          return this._getFlashTabList()
        } else {
          return this._countDownTimeout(currentTime)
        }
      }, 1000)
    },
    _clearFlashTimer() {
      clearInterval(this.flashCountDownTimer)
      clearTimeout(this.flashCountDownTimer)
    }
  }
}
