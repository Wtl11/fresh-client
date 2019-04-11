import API from '@api'
import {jwtComputed} from '@state/helpers'

export default {
  onShow() {
    this._getCouponModalList()
  },
  computed: {
    ...jwtComputed
  },
  watch: {
    userInfo(val = {}) {
      this._getCouponModalList(val.id)
    }
  },
  methods: {
    _getCouponModalList(id) {
      if (!wx.getStorageSync('token')) return
      let customerId = id || (wx.getStorageSync('userInfo') || {}).id || 0
      API.Coupon.getModalList({customer_id: customerId}).then(res => {
        this._ref('couponModal', 'show', res.data)
      }).catch(e => {
        console.error(e)
      })
    },
    _ref(key, fn, params) {
      this.$refs[key] && this.$refs[key][fn] && this.$refs[key][fn](params)
    }
  }
}
