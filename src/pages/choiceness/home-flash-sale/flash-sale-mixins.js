import {countDownHandle} from '@utils/common'
import API from '@api'

export default {
  data() {
    return {
      flashTabList: undefined,
      flashTabIndex: 0,
      flashArray: undefined,
      flashCountDownTimes: {
        hour: '00',
        minute: '00',
        second: '00'
      },
      flashIsShow: undefined,
      flashCountDownTimer: undefined
    }
  },
  onUnload() {
    // this.flashCountDownTimer && clearInterval(this.flashCountDownTimer)
  },
  onHide() {
    // clearInterval(this.flashCountDownTimer)
  },
  onShow() {
    this._getTabList()
  },
  methods: {
    // tab切换
    flashChangeTab(item, index) {
      if (this.flashTabIndex === index) return
      // clearInterval(this.flashCountDownTimer)
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
      // clearTimeout(this.flashCountDownTimer)
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
      if (!this.flashTabList || !this.flashTabList[this.flashTabIndex]) return
      let currentTime = this.flashTabList[this.flashTabIndex].at_diff || 0
      if (currentTime < 0) {
        currentTime = 0
      }
      this.flashCountDownTimes = countDownHandle(currentTime)
      clearTimeout(this.flashCountDownTimer)
      this._countDown(currentTime)
      // this.flashCountDownTimer = setTimeout(() => {
      //   currentTime--
      //   this.flashCountDownTimes = countDownHandle(currentTime)
      //   console.log(this.flashCountDownTimes)
      //   if (!this.flashCountDownTimes || !this.flashCountDownTimes.differ || this.flashCountDownTimes.differ <= 0) {
      //     clearTimeout(this.flashCountDownTimer)
      //     this._getTabList()
      //   } else {
      //     return this._countDownAction()
      //   }
      // }, 998)
    },
    _countDown(currentTime) {
      console.info(currentTime)
      this.flashCountDownTimer = setTimeout(() => {
        currentTime--
        this.flashCountDownTimes = countDownHandle(currentTime)
        if (!this.flashCountDownTimes || !this.flashCountDownTimes.differ || this.flashCountDownTimes.differ <= 0) {
          clearTimeout(this.flashCountDownTimer)
          this._getTabList()
        } else {
          this._countDown(currentTime)
        }
      }, 998)
    }
  }
}
