export const state = {
  goodsList: [],
  total: ''
}

export const getters = {
  goodsList(state) {
    return state.goodsList
  }
}

export const actions = {
  setGoodsList({commit, state}, goodsList) {
    commit('update', goodsList)
  }
}

export const mutations = {
  SET_GOODS_LIST(state, goodsList) {
    state.goodsList = goodsList
  }
}
