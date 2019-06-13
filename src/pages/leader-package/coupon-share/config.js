import Vue from 'vue'
import Page from './coupon-share'

const page = new Vue(Page)
page.$mount()

export default {
  config: {
    navigationBarTitleText: '优惠券分享',
    backgroundColorTop: '#FFFFFF',
    backgroundColorBottom: '#FFA83F'
  }
}
