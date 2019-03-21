import {mapGetters, mapActions} from 'vuex'

export const cartComputed = {
  ...mapGetters('cart', ['count'])
}

export const orderComputed = {
  ...mapGetters('order', ['goodsList', 'total', 'deliverAt', 'couponInfo', 'beforeTotal'])
}

export const orderMethods = {
  ...mapActions('order', ['setOrderInfo', 'submitOrder', 'saveCoupon'])
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
