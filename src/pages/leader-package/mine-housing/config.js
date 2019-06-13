import Vue from 'vue'
import Page from './mine-housing'

const page = new Vue(Page)
page.$mount()

export default {
  config: {
    navigationBarTitleText: '我的小区',
    usingComponents: {}
  }
}
