// test-page
import Vue from 'vue'
import Page from './shopping-cart'

const page = new Vue(Page)
page.$mount()

export default {
  config: {
    navigationBarTitleText: '购物车',
    onReachBottomDistance: 50
  }
}
