export default {
  onShow() {
    setTimeout(() => {
      this._ref('couponModal', 'show')
    }, 1000)
  },
  methods: {
    _ref(key, fn, params) {
      this.$refs[key] && this.$refs[key][fn](params)
    }
  }
}
