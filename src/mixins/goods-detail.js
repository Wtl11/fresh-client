import {ACTIVE_TYPE} from '@utils/contants'
import API from '@api'

export default {
  data() {
    return {
      latitude: 0,
      longitude: 0,
      tipTop: ''
    }
  },
  methods: {
    // 获取地理位置
    async _getLocation() {
      if (this.activityType !== ACTIVE_TYPE.GROUP_ON) return
      if (this.latitude && this.longitude) return
      try {
        let res = await this.$wechat.getLocation()
        this.longitude = res.longitude
        this.latitude = res.latitude
        if (!this.latitude || !this.longitude) {
          wx.navigateTo({url: `/pages/open-location`})
        } else {
          res = await API.Global.checkShopDistance({longitude: this.longitude, latitude: this.latitude})
          let name = res.data.shop.social_name
          name = name.substring(0, 6) + (name.length > 6 ? '...' : '')
          this.tipTop = res.data.distance_judge === 0 ? '' : `当前位置${name}社区不参与拼团活动`
        }
      } catch (e) {
        wx.navigateTo({url: `/pages/open-location`})
      }
    }
  }
}
