export const state = {
  pageStacker: {}
}

export const getters = {
  pageStacker: state => state.pageStacker
}

export const mutations = {
  PUSH_PAGE(state, {pageRoute, options}) {
    !state.pageStacker[pageRoute] && (state.pageStacker[pageRoute] = [])
    state.pageStacker[pageRoute].push(options)
  },
  POP_PAGE(state, {pageRoute}) {
    state.pageStacker[pageRoute] && state.pageStacker[pageRoute].pop()
  }
}

export const actions = {}
