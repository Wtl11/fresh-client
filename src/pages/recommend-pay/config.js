import Vue from 'vue'
import Page from './recommend-pay'

const page = new Vue(Page)
page.$mount()

export default {
  config: {
    navigationBarTitleText: '提交订单',
    usingComponents: {}
  }
}
