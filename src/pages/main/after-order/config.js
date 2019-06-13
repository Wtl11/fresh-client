import Vue from 'vue'
import Page from './after-order'

const page = new Vue(Page)
page.$mount()

export default {
  config: {
    navigationBarTitleText: '售后订单'
  }
}
