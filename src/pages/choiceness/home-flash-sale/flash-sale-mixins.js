import {countDownHandle} from '@utils/common'

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
  methods: {
    flashChangeTab(item, index) {
      if (this.flashTabIndex === index) return
      this.flashTabIndex = index
    },
    async _getFlashList() {
      // todo
      // await new Promise((resolve, reject) => {
      //   setTimeout(() => {
      //     resolve()
      //     this.flashIsShow = false
      //   }, 2000)
      // })
      // this.flashIsShow = false
      this._countDownAction()
    },
    _countDownAction() {
      if (!this.flashTabList[this.flashTabIndex]) return
      let currentTime = this.flashTabList[this.flashTabIndex].at_diff || 0
      this.flashCountDownTimes = countDownHandle(currentTime)
      this.flashCountDownTimer && clearInterval(this.flashCountDownTimer)
      this.flashCountDownTimer = setInterval(() => {
        currentTime--
        this.flashCountDownTimes = countDownHandle(currentTime)
      }, 1000)
    }
  }
}
