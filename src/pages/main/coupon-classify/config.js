import Vue from 'vue'
import Page from './coupon-classify'

const page = new Vue(Page)
page.$mount()

export default {
  config: {
    navigationBarTitleText: '商品',
    backgroundColorTop: '#F7F7F7',
    backgroundColorBottom: '#F7F7F7',
    onReachBottomDistance: 300,
    enablePullDownRefresh: true,
    backgroundTextStyle: 'dark'
  }
}
