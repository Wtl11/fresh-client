import API from '@api'
import * as wechat from '@utils/wechat'
import {ERR_OK} from '@utils/config'

export const state = {
  count: ''
}

export const getters = {
  count(state) {
    return state.count
  }
}

export const mutations = {
  SET_CART_COUNT(state, count) {
    state.count = count
  }
}

export const actions = {
  init({ commit }) {
    wechat.getStorage('cart.count')
      .then(res => {
        if (res.data) {
          commit('SET_CART_COUNT', res.data)
        }
      })
  },
  setCartCount({ commit }) {
    API.Cart.shopCartNumber()
      .then((res) => {
        if (res.error !== ERR_OK) {
          return
        }
        let count = res.data.count
        if (count > 0) {
          wx.setTabBarBadge({
            index: 1,
            text: count + ''
          })
        } else {
          wx.removeTabBarBadge({index: 1})
        }
        commit('SET_CART_COUNT', count)
        console.log(count)
        wechat.setStorage('cart.count', count)
      })
  }
}
