import {mapGetters, mapActions} from 'vuex'

export const orderComputed = {
  ...mapGetters('order', ['goodsList', 'total', 'deliverAt'])
}

export const cartComputed = {
  ...mapGetters('cart', ['count'])
}

export const orderMethods = {
  ...mapActions('order', ['setOrderInfo', 'submitOrder'])
}

export const cartMethods = {
  ...mapActions('cart', ['setCartCount'])
}

export const jwtComputed = {
  ...mapGetters('jwt', ['token', 'userInfo'])
}

export const jwtMethods = {
  ...mapActions('jwt', ['setToken', 'setUserInfo'])
}
