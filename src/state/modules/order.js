import API from '@api'
import * as wechat from '@utils/wechat'
import {ERR_OK} from '@utils/config'

export const state = {
  goodsList: [],
  total: '',
  deliverAt: '',
  beforeTotal: '',
  couponInfo: {}
}

export const getters = {
  goodsList(state) {
    return state.goodsList
  },
  total(state) {
    return state.total
  },
  deliverAt(state) {
    return state.deliverAt
  },
  orderId(state) {
    return state.orderId
  },
  beforeTotal: state => state.beforeTotal,
  couponInfo: state => state.couponInfo
}

export const actions = {
  // 保存优惠券信息
  saveCoupon({commit, state}, coupon) {
    let total = coupon.real_condition_total || state.beforeTotal
    commit('SAVE_COUPON', coupon)
    commit('SET_TOTAL', total)
  },
  setOrderInfo({commit, state}, {goodsList, total, deliverAt}) {
    commit('SET_GOODS_LIST', goodsList)
    commit('SET_TOTAL', total)
    commit('DELIVER_AT', deliverAt)
    commit('SET_BEFORE_TOTAL', total)
  },
  submitOrder({commit, state}, {orderInfo, complete}) {
    API.SubmitOrder.submitOrder(orderInfo)
      .then(res => {
        console.log(res, 123)
        wechat.hideLoading()
        if (res.error !== ERR_OK) {
          wechat.showToast(res.message)
          return
        }
        API.SubmitOrder.saveMobile(orderInfo.mobile)
          .then(res => {
            wechat.hideLoading()
            if (res.error !== ERR_OK) {
              wechat.showToast(res.message)
            }
          })
        let payRes = res.data
        const {timestamp, nonceStr, signType, paySign} = payRes
        let orderId = res.data.order_id
        wx.requestPayment({
          timeStamp: timestamp,
          nonceStr,
          package: payRes.package,
          signType,
          paySign,
          success (res) {
            setTimeout(() => {
              if (orderInfo.url) {
                wx.redirectTo({url: `${orderInfo.url}?orderId=${orderId}&&type=0&total=${state.total}`})
              } else {
                wx.redirectTo({url: `/pages/pay-result?orderId=${orderId}&&type=0&total=${state.total}`})
              }
            }, 1500)
          },
          fail (res) {
            wx.redirectTo({url: `/pages/order-detail?id=${orderId}&&type=0`})
          },
          complete
        })
      })
  }
}

export const mutations = {
  SAVE_COUPON(state, coupon) {
    state.couponInfo = coupon
  },
  SET_GOODS_LIST(state, goodsList) {
    state.goodsList = goodsList
  },
  SET_TOTAL(state, total) {
    state.total = total
  },
  DELIVER_AT(state, deliverAt) {
    state.deliverAt = deliverAt
  },
  SET_BEFORE_TOTAL(state, total) {
    state.beforeTotal = total
  }
}
