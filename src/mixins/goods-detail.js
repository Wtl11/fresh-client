import {ACTIVE_TYPE} from '@utils/contants'

export default {
  data() {
    return {
      latitude: 0,
      longitude: 0
    }
  },
  methods: {
    // 获取地理位置
    async _getLocation() {
      // if (this.activityType !== ACTIVE_TYPE.GROUP_ON) return
      console.log(ACTIVE_TYPE)
      if (this.latitude && this.longitude) return
      try {
        const res = await this.$wechat.getLocation()
        this.longitude = res.longitude
        this.latitude = res.latitude
        if (!this.latitude || !this.longitude) {
          wx.navigateTo({url: `/pages/open-location`})
        }
      } catch (e) {
        wx.navigateTo({url: `/pages/open-location`})
      }
      console.log(this.longitude, this.latitude)
    }
  }
}
