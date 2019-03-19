export default {
  data() {
    return {
      maskAnimation: '',
      modalAnimation: ''
    }
  },
  methods: {
    showAnimation(callback, duration = 500) {
      let modalAnimation = wx.createAnimation({
        duration,
        timingFunction: 'cubic-bezier(1, -0.07, 0.51, 1.48)',
        delay: 0
      })
      let maskAnimation = wx.createAnimation({
        duration,
        timingFunction: 'linear',
        delay: 0
      })
      maskAnimation.opacity(0).step()
      modalAnimation.scale(0.3).step()
      this.maskAnimation = maskAnimation.export()
      this.modalAnimation = modalAnimation.export()
      setTimeout(() => {
        maskAnimation.opacity(1).step()
        modalAnimation.scale(1).step()
        this.maskAnimation = maskAnimation.export()
        this.modalAnimation = modalAnimation.export()
        callback && callback(duration)
      }, 200)
    },
    hideAnimation(callback, duration = 300) {
      let modalAnimation = wx.createAnimation({
        duration,
        timingFunction: 'linear',
        delay: 0
      })
      let maskAnimation = wx.createAnimation({
        duration,
        timingFunction: 'linear',
        delay: 0
      })
      maskAnimation.opacity(0).step()
      modalAnimation.scale(0.3).step()
      this.maskAnimation = maskAnimation.export()
      this.modalAnimation = modalAnimation.export()
      setTimeout(() => {
        maskAnimation.opacity(1).step()
        modalAnimation.scale(1).step()
        this.maskAnimation = maskAnimation.export()
        this.modalAnimation = modalAnimation.export()
        callback && callback(duration)
      }, 300)
    }
  }
}
