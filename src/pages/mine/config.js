// 个人中心
import Vue from 'vue'
import Page from './mine'

const page = new Vue(Page)
page.$mount()

export default {
  config: {
    navigationBarTitleText: '我的'
  }
}
