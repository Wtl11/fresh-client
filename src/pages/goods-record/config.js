import Vue from 'vue'
import Page from './goods-record'

const page = new Vue(Page)
page.$mount()

export default {
  config: {
    navigationBarTitleText: '购买记录',
    usingComponents: {}
  }
}
