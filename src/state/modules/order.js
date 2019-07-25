import API from '@api'
import * as wechat from '@utils/wechat'
import { ERR_OK } from '@utils/config'
import $$routes from '@utils/routes'

export const state = {
  goodsList: [],
  total: '',
  deliverAt: '',
  beforeTotal: '',
  couponInfo: {},
  commodityItem: {}
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
  couponInfo: state => state.couponInfo,
  commodityItem: state => state.commodityItem
}

export const actions = {
  setCommodityItem({ commit, state }, item) {
    console.log(item.real_condition_total)
    // let total = item.real_condition_total ? item.real_condition_total : state.couponInfo.real_condition_total ? state.couponInfo.real_condition_total : state.beforeTotal
    commit('SET_COMMODITY_ITEM', item)
  },
  // 保存优惠券信息
  saveCoupon({ commit, state }, coupon) {
    let total = coupon.real_condition_total || state.beforeTotal
    commit('SAVE_COUPON', coupon)
    commit('SET_TOTAL', total)
  },
  setOrderInfo({ commit, state }, { goodsList, total, deliverAt }) {
    commit('SET_GOODS_LIST', goodsList)
    commit('SET_TOTAL', total)
    commit('DELIVER_AT', deliverAt)
    commit('SET_BEFORE_TOTAL', total)
  },
  submitOrder({ commit, state }, {orderInfo, complete, isFree = false, isPostage = false}) {
    // isPostage 是否是全国包邮订单
    console.log(isPostage)
    API.SubmitOrder.submitOrder(orderInfo)
      .then(res => {
        if (res.error !== ERR_OK) {
          wechat.hideLoading()
          wechat.showToast(res.message)
          return
        }
        API.SubmitOrder.saveMobile(orderInfo.mobile)
          .then(res => {
            if (res.error !== ERR_OK) {
              wechat.hideLoading()
              wechat.showToast(res.message)
            }
          })
        let payRes = res.data
        const { timestamp, nonceStr, signType, paySign } = payRes
        let orderId = res.data.order_id || 0
        if (isFree) {
          // wx.redirectTo({ url: `${$$routes.main.PAY_RESULT}?orderId=${orderId}&&type=0&total=${state.total}` })
          // 判断是否全国包邮
          if (isPostage) {
            wx.redirectTo({ url: `${$$routes.main.PAY_RESULT}?orderId=${orderId}&&type=0&total=${state.total}&isPostage=1` })
          } else {
            wx.redirectTo({ url: `${$$routes.main.PAY_RESULT}?orderId=${orderId}&&type=0&total=${state.total}` })
          }
          return
        }
        wx.requestPayment({
          timeStamp: timestamp,
          nonceStr,
          package: payRes.package,
          signType,
          paySign,
          success(res) {
            if (orderInfo.url) {
              let timer = null
              let count = 0
              wechat.showLoading()
              API.Global.checkPayResult({ order_id: orderId }).then(res => {
                console.warn(res, '支付轮询')
                if (res.data.is_payed === 1) {
                  console.warn(`${orderInfo.url}?orderId=${orderId}`)
                  setTimeout(() => {
                    wechat.hideLoading()
                    wx.redirectTo({ url: `${orderInfo.url}?orderId=${orderId}` })
                  }, 1000)
                } else {
                  _loopCheckPay({ orderId, orderInfo, timer, count, isPostage })
                }
              }).catch(e => {
                _loopCheckPay({ orderId, orderInfo, timer, count, isPostage })
              })
            } else {
              setTimeout(() => {
                wechat.hideLoading()
                // wx.redirectTo({ url: `${$$routes.main.PAY_RESULT}?orderId=${orderId}&&type=0&total=${state.total}` })
                // 判断是否全国包邮
                if (isPostage) {
                  wx.redirectTo({ url: `${$$routes.main.PAY_RESULT}?orderId=${orderId}&&type=0&total=${state.total}&isPostage=1` })
                } else {
                  wx.redirectTo({ url: `${$$routes.main.PAY_RESULT}?orderId=${orderId}&&type=0&total=${state.total}` })
                }
              }, 1500)
            }
          },
          fail(res) {
            wechat.hideLoading()
            // 判断是否全国包邮
            if (isPostage) {
              wx.redirectTo({ url: `${$$routes.postage.ORDER_DETAIL}?id=${orderId}&&type=0` })
            } else {
              wx.redirectTo({ url: `${$$routes.main.ORDER_DETAIL}?id=${orderId}&&type=0` })
            }
            // wx.redirectTo({ url: `${$$routes.main.ORDER_DETAIL}?id=${orderId}&&type=0` })
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
  },
  SET_COMMODITY_ITEM(state, commodityItem) {
    state.commodityItem = commodityItem
  }
}

function _loopCheckPay({ orderId, orderInfo, timer = null, count = 0, isPostage }) {
  wechat.showLoading()
  timer && clearInterval(timer)
  timer = setInterval(() => {
    count++
    console.warn(count, '支付轮询')
    if (count >= 10) {
      wechat.hideLoading()
      clearInterval(timer)
      // 判断是否全国包邮
      if (isPostage) {
        wx.redirectTo({ url: `${$$routes.postage.ORDER_DETAIL}?id=${orderId}&&type=0` })
      } else {
        wx.redirectTo({ url: `${$$routes.main.ORDER_DETAIL}?id=${orderId}&&type=0` })
      }
      // wx.redirectTo({ url: `${$$routes.main.ORDER_DETAIL}?id=${orderId}&&type=0` })
      return
    }
    API.Global.checkPayResult({ order_id: orderId }).then(res => {
      console.warn('支付：' + res)
      if (res.data.is_payed === 1) {
        clearInterval(timer)
        setTimeout(() => {
          wechat.hideLoading()
          wx.redirectTo({ url: `${orderInfo.url}?orderId=${orderId}` })
        }, 1000)
        // wx.redirectTo({url: `${orderInfo.url}?orderId=${orderId}`})
      }
    }).catch(e => {
      console.warn(e)
    })
  }, 1000)
}
