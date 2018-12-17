import Vue from 'vue'
import Page from './after-sale-management'

const page = new Vue(Page)
page.$mount()

export default {
  config: {
    navigationBarTitleText: '售后管理'
  }
}
