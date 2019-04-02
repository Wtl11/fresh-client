import Vue from 'vue'
import Page from './flash-sale-list'

const page = new Vue(Page)
page.$mount()

export default {
  config: {
    navigationBarTitleText: '限时抢购',
    usingComponents: {}
  }
}
