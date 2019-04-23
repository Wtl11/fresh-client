// 个人中心
import Vue from 'vue'
import Page from './mine'

const page = new Vue(Page)
page.$mount()

export default {
  config: {
    navigationBarTitleText: '我的',
    backgroundColorTop: '#85c300',
    backgroundColorBottom: '#fff',
    navigationBarTextStyle: 'white',
    backgroundTextStyle: 'light'
  }
}
