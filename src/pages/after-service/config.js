// 售后服务
import Vue from 'vue'
import Page from './after-service'

const page = new Vue(Page)
page.$mount()

export default {
  config: {
    navigationBarTitleText: '售后订单'
  }
}
