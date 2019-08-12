import { mapGetters, mapActions, mapMutations } from 'vuex'

export const cartComputed = {
  ...mapGetters('cart', ['count'])
}

export const orderComputed = {
  ...mapGetters('order', ['goodsList', 'total', 'deliverAt', 'couponInfo', 'beforeTotal', 'commodityItem', 'articleId', 'certificate'])
}

export const orderMethods = {
  ...mapActions('order', ['setOrderInfo', 'submitOrder', 'saveCoupon', 'setCommodityItem', 'setArticleId']),
  ...mapMutations('order', ['SAVE_CERTIFICATE'])
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

export const postageComputed = {
  ...mapGetters('postage', ['addressMsg'])
}
export const postageMethods = {
  ...mapActions('postage', ['setCurrentAddress'])
}