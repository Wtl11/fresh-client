const COUPON_CLASSIFY_PATH = [2, 3]
export default {
  methods: {
    navHandle(rangType, id, navType) {
      let flag = COUPON_CLASSIFY_PATH.some(val => val === +rangType)
      let url = ''
      if (flag) {
        url = `${this.$routes.main.COUPON_CLASSIFY}?id=${id}`
        if (navType) {
          wx[navType] && wx[navType]({url})
          return
        }
        wx.navigateTo({url})
      } else {
        url = `${this.$routes.main.CHOICENESS}`
        wx.switchTab({url})
      }
    }
  }
}
