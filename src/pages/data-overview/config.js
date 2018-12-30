import Vue from 'vue'
import Page from './data-overview'

const page = new Vue(Page)
page.$mount()

export default {
  config: {
    navigationBarTitleText: '数据统计'
  }
}
