// 售后订单
import Vue from 'vue'
import Page from './customer-service'

const page = new Vue(Page)
page.$mount()

export default {
  config: {
    navigationBarTitleText: 'CUSTOMER_SERVICE'
  }
}
