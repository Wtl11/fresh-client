// 精选
import Vue from 'vue'
import Page from './choiceness'

const page = new Vue(Page)
page.$mount()

export default {
  config: {
    navigationBarTitleText: 'CHOICENESS',
    enablePullDownRefresh: true,
    backgroundColorTop: '#FFFFFF',
    backgroundColorBottom: '#F7F7F7',
    navigationBarTextStyle: 'black',
    backgroundTextStyle: 'dark',
    onReachBottomDistance: 50,
    usingComponents: {}
  }
}
