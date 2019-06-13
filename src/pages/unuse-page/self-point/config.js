// 我的自提点
import Vue from 'vue'
import Page from './self-point'

const page = new Vue(Page)
page.$mount()

export default {
  config: {
    navigationBarTitleText: '我的自提点'
  }
}
