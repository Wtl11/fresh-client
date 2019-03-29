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
    this.flashCountDownTimer && clearInterval(this.flashCountDownTimer)
  },
  methods: {
    // tab切换
    flashChangeTab(item, index) {
      if (this.flashTabIndex === index) return
      this.flashTabIndex = index
      this._getFlashList(true)
    },
    // 获取限时活动列表
    async _getFlashList(loading) {
      this._countDownAction()
      if (!this.flashTabList[this.flashTabIndex]) return
      let data = {
        activity_id: this.flashTabList[this.flashTabIndex].id || 0
      }
      let res = await API.FlashSale.getFlashList(data, loading)
      this.flashArray = res.data
    },
    // 倒计时
    _countDownAction() {
      if (!this.flashTabList[this.flashTabIndex]) return
      let currentTime = this.flashTabList[this.flashTabIndex].at_diff || 0
      this.flashCountDownTimes = countDownHandle(currentTime)
      this.flashCountDownTimer && clearInterval(this.flashCountDownTimer)
      this.flashCountDownTimer = setInterval(() => {
        currentTime--
        this.flashCountDownTimes = countDownHandle(currentTime)
        if (!this.flashCountDownTimes.differ) {
          clearInterval(this.flashCountDownTimer)
        }
      }, 1000)
    }
  }
}
