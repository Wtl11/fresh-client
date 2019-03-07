// 行为记录
import Vue from 'vue'
import Page from './radar'

const page = new Vue(Page)
page.$mount()

export default {
  config: {
    navigationBarTitleText: 'RADAR'
  }
}
