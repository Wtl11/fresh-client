import Vue from 'vue'
import Page from './expend-record'

const page = new Vue(Page)
page.$mount()

export default {
  config: {
    navigationBarTitleText: '支出记录'
  }
}
