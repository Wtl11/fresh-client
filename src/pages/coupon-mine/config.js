import Vue from 'vue'
import Page from './coupon-mine'

const page = new Vue(Page)
page.$mount()

export default {
  config: {
    navigationBarTitleText: '我的优惠券'
  }
}
