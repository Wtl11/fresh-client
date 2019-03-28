export default {
  data() {
    return {
      flashTabList: undefined,
      flashTabIndex: undefined,
      flashArray: undefined,
      flashCountDownTimes: undefined
    }
  },
  methods: {
    flashChangeTab(item, index) {
      if (this.flashTabIndex === index) return
      this.flashTabIndex = index
    },
    async _getFlashList() {
      // todo
    }
  }
}
