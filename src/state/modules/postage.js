
export const state = {
  addressMsg: {
    name: ''
  }
}

export const getters = {
  addressMsg(state) {
    return state.addressMsg
  }
}

export const mutations = {
  SET_ADDRESS(state, addressMsg) {
    state.addressMsg = addressMsg
  }
}

export const actions = {
  setCurrentAddress({commit, state}, address) {
    commit('SET_ADDRESS', address)
  }
}
