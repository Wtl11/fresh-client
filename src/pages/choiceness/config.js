// 精选
import Vue from 'vue'
import Page from './choiceness'

const page = new Vue(Page)
page.$mount()

export default {
  config: {
    navigationBarTitleText: 'CHOICENESS',
    enablePullDownRefresh: true,
    backgroundColorTop: '#73C200',
    navigationBarTextStyle: 'white',
    backgroundTextStyle: 'light',
    onReachBottomDistance: 50,
    usingComponents: {}
  }
}
