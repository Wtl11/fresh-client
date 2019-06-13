import Vue from 'vue'
import Page from './regimental-commander'

const page = new Vue(Page)
page.$mount()

export default {
  config: {
    navigationBarTitleText: '团长信息',
    onReachBottomDistance: 100,
    backgroundColorBottom: '#F7F7F7',
    backgroundColorTop: '#AECD00',
    enablePullDownRefresh: true,
    usingComponents: {}
  }
}
