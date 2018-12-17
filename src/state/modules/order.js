export const state = {
  goodsList: [],
  total: ''
}

export const getters = {
  info: state => state.goodsList
}

export const actions = {
  update({commit, state}, info) {
    commit('update', info)
  }
}

export const mutations = {
  update(state, info) {
    state.goodsList = info
  }
}
