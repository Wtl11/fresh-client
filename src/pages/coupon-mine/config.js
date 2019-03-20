import Vue from 'vue'
import Page from './coupon-mine'

const page = new Vue(Page)
page.$mount()

export default {
  config: {
    navigationBarTitleText: '我的优惠券',
    backgroundColorTop: '#F7F7F7',
    backgroundColorBottom: '#F7F7F7',
    onReachBottomDistance: 300,
    enablePullDownRefresh: true,
    backgroundTextStyle: 'dark'
  }
}
