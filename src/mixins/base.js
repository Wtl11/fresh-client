import API from '@api'
import DefaultMsg from './default-msg'
import {ERR_OK} from '@utils/config'
import routes from '@utils/routes'
// import {isEmptyObject} from '@utils/common'
// 不自动发送的页面
const UN_AUTO_SNED_PAGE = [
  'goods-detail',
  'choiceness',
  'goods-record',
  'coupon-take',
  'flash-sale-list',
  'collage-detail',
  'app-update',
  'goods-end',
  'error',
  'lost',
  'open-location',
  'share-order',
  'freeze-shop',
  'choose-pickup',
  routes.content.CONTENT_END
]
export default {
  onLoad(e) {
  },
  onReady() {
    this._autoSend()
    if (this.$mp && this.$mp.page) {
      getApp().globalData._path = this.$mp.page.route
    }
  },
  methods: {
    $sendMsg(obj) {
      let data = DefaultMsg.create().set(obj)
      API.Notification.sendMsg(data, false).then(res => {
        if (res.error !== ERR_OK) {
          console.error(res)
        }
        // console.warn('发送事件。。。', data)
      }).catch(e => {
        console.error(e)
      })
    },
    // $$sendEventCommon() {
    //   // todo
    //   if (!this.$mp) return
    //   if (this.$mp.mpType !== 'page') return
    //   let pr = this.$mp.page.__displayReporter.showReferpagepath.replace('.html', '') // 来源页
    //   let pd = this.$mp.page.route // 当前页
    //   let scene = this.$mp.appOptions.scene // 场景值
    //   let options = isEmptyObject(this.$mp.query) ? this.$mp.appOptions.query : this.$mp.query
    //   console.log(pr, pd, scene, options)
    // },
    _autoSend() {
      if (!wx.getStorageSync('token') || !wx.getStorageSync('shopId')) return
      if (!this.$mp) return
      if (this.$mp.mpType !== 'page') return
      if (!this.$mp.page) return
      const _pp = this.$mp.page.route
      let flag = UN_AUTO_SNED_PAGE.some(val => RegExp(val).test(_pp) || RegExp(_pp).test(val))
      if (flag) return
      this.$$sendEvent()
    },
    $$sendEvent({_event = 'view', _track = '', goodsId = 0, activityId = 0} = {}) {
      if (!this.$mp) return
      if (this.$mp.mpType !== 'page') return
      if (!this.$mp.page) return
      let _uuid = wx.getStorageSync('zbyx_uuid')
      if (!_uuid) {
        _uuid = createGuid()
        wx.setStorageSync('zbyx_uuid', _uuid)
      }
      let _pc = ''
      if (this.$mp.page.__displayReporter && this.$mp.page.__displayReporter.showReferpagepath) {
        _pc = this.$mp.page.__displayReporter.showReferpagepath.replace('.html', '') // 来源页
      }
      // let _pc = this.$mp.page.__displayReporter.showReferpagepath.replace('.html', '') // 来源页
      let _pp = this.$mp.page.route // 当前页
      // let scene = this.$mp.appOptions.scene // 场景值
      // let options = isEmptyObject(this.$mp.query) ? this.$mp.appOptions.query : this.$mp.query
      API.Global.sendEvent({
        _event, _uuid, _track, _pc, _pp, goods_id: goodsId, activity_id: activityId
      })
    }
  }
}

function createGuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = Math.random() * 16 | 0
    const v = c === 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}
