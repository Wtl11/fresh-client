import Vue from 'vue'
import Page from './income-record'

const page = new Vue(Page)
page.$mount()

export default {
  config: {
    navigationBarTitleText: '收支记录'
  }
}
