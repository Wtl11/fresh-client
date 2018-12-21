import Vue from 'vue'
import Page from './pay-result'

const page = new Vue(Page)
page.$mount()

export default {
  config: {
    navigationBarTitleText: '支付结果'
  }
}
