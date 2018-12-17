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
  }
}

export const actions = {
  setOrderInfo({commit, state}, {goodsList, total, deliverAt}) {
    commit('SET_GOODS_LIST', goodsList)
    commit('SET_TOTAL', total)
    commit('DELIVER_AT', deliverAt)
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
