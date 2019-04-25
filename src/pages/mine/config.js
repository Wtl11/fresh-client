// 个人中心
import Vue from 'vue'
import Page from './mine'

const page = new Vue(Page)
page.$mount()

export default {
  config: {
    navigationBarTitleText: '我的',
    backgroundColorTop: '#73c200',
    backgroundColorBottom: '#fff',
    navigationBarTextStyle: 'white',
    backgroundTextStyle: 'light'
  }
}
