import Vue from 'vue'
import Page from './activity-goods-list'

const page = new Vue(Page)
page.$mount()

export default {
  config: {
    navigationBarTitleText: 'ACTIVITY_GOODS_LIST',
    enablePullDownRefresh: true,
    backgroundTextStyle: 'dark',
    onReachBottomDistance: 50
  }
}
