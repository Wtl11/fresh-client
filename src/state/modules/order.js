import API from '@api'
import * as wechat from '@utils/wechat'
import {ERR_OK} from '@utils/config'

export const state = {
  goodsList: [],
  total: '',
  deliverAt: ''
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
  }
}

export const actions = {
  setOrderInfo({commit, state}, {goodsList, total, deliverAt}) {
    commit('SET_GOODS_LIST', goodsList)
    commit('SET_TOTAL', total)
    commit('DELIVER_AT', deliverAt)
  },
  submitOrder({commit, state}, {orderInfo, complete}) {
    API.SubmitOrder.submitOrder(orderInfo)
      .then(res => {
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
          })//  API.SubmitOrder.saveMobile
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
            console.log(orderId)
            setTimeout(() => {
              wx.redirectTo({url: `/pages/pay-result?orderId=${orderId}&&type=0`})
            }, 1500)
          },
          fail (res) {
            console.log(orderId)
            wx.redirectTo({url: `/pages/order-detail?id=${orderId}&&type=0`})
          },
          complete
        })
      })
  }
}

export const mutations = {
  SET_GOODS_LIST(state, goodsList) {
    state.goodsList = goodsList
  },
  SET_TOTAL(state, total) {
    state.total = total
  },
  DELIVER_AT(state, deliverAt) {
    state.deliverAt = deliverAt
  }
}
