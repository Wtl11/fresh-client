import Vue from 'vue'
import Page from './yesterday-sale-manager'

const page = new Vue(Page)
page.$mount()

export default {
  config: {
    navigationBarTitleText: '昨日订单'
  }
}
