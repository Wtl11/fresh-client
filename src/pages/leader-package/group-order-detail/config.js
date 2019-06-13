import Vue from 'vue'
import Page from './group-order-detail'

const page = new Vue(Page)
page.$mount()

export default {
  config: {
    navigationBarTitleText: '订单详情'
  }
}
