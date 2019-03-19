import Vue from 'vue'
import Page from './coupon-classify'

const page = new Vue(Page)
page.$mount()

export default {
  config: {
    navigationBarTitleText: '商品'
  }
}
