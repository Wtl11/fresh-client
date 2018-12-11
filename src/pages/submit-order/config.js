// 提交订单
import Vue from 'vue'
import Page from './submit-order'

const page = new Vue(Page)
page.$mount()

export default {
  config: {
    navigationBarTitleText: 'SUBMIT_ORDER'
  }
}
