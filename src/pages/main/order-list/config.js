// 订单列表
import Vue from 'vue'
import Page from './order-list'

const page = new Vue(Page)
page.$mount()

export default {
  config: {
    navigationBarTitleText: '订单列表',
    usingComponents: {}
  }
}
