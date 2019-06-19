import Vue from 'vue'
import Page from './distribution-commission'

const page = new Vue(Page)
page.$mount()

export default {
  config: {
    navigationBarTitleText: '分销佣金',
    onReachBottomDistance: 50
  }
}
