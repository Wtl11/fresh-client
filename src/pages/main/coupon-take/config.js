import Vue from 'vue'
import Page from './coupon-take'

const page = new Vue(Page)
page.$mount()

export default {
  config: {
    navigationBarTitleText: '领取优惠券',
    backgroundColorTop: '#FFFFFF',
    backgroundColorBottom: '#FFA83F',
    onReachBottomDistance: 300
  }
}
