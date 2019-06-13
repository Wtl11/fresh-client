import Vue from 'vue'
import Page from './delivery-order'

const page = new Vue(Page)
page.$mount()

export default {
  config: {
    navigationBarTitleText: '配送订单'
  }
}
