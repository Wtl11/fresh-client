import {mapGetters, mapActions} from 'vuex'
// import {mapState, mapGetters, mapActions} from 'vuex'

// export const someComputed = {
//   ...mapState('some', {
//     currentUser: (state) => state.currentUser
//   }),
//   ...mapGetters('some', ['constants'])
// }
//
// export const someMethods = mapActions('some', ['action1', 'action2'])

export const oauthComputed = {
  ...mapGetters('oauth', ['info'])
}

export const oauthMethods = {
  ...mapActions('oauth', ['update'])
}

export const orderComputed = {
  ...mapGetters('order', ['goodsList', 'total', 'deliverAt'])
}

export const orderMethods = {
  ...mapActions('order', ['setOrderInfo'])
}
