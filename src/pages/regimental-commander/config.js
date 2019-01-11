import Vue from 'vue'
import Page from './regimental-commander'

const page = new Vue(Page)
page.$mount()

export default {
  config: {
    navigationBarTitleText: '团长信息',
    onReachBottomDistance: 100
  }
}
