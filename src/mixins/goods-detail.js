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
    // 检查是否能参加拼团活动
    async _checkCanGroup() {
      if (this.activityType !== ACTIVE_TYPE.GROUP_ON) return
      if (this.latitude && this.longitude) return
      const hasOrder = await API.Global.checkHasGroupOrder()
      // 检查是否有拼团订单，没有订单才判断地理位置, 没有0 有1
      if (hasOrder.data && hasOrder.data.is_buy_groupon === 1) return
      try {
        // 获取地理位置
        let res = await this.$wechat.getLocation()
        this.longitude = res.longitude
        this.latitude = res.latitude
        if (!this.latitude || !this.longitude) {
          wx.navigateTo({url: `${this.$routes.main.OPEN_LOCATION}`})
        } else {
          res = await API.Global.checkShopDistance({longitude: this.longitude, latitude: this.latitude})
          let name = res.data.shop.social_name
          name = name.substring(0, 8) + (name.length > 8 ? '...' : '')
          this.tipTop = res.data.distance_judge === 0 ? '' : `当前位置不可参与${name}社区拼团活动`
        }
      } catch (e) {
        if (e && e.errMsg) {
          this.longitude = 0
          this.latitude = 0
          this.tipTop = ''
          wx.navigateTo({url: `${this.$routes.main.OPEN_LOCATION}`})
        }
      }
    }
  }
}
