import Vue from 'vue'
import Page from './app-update'

const page = new Vue(Page)
page.$mount()

export default {
  config: {
    navigationBarTitleText: '系统升级'
  }
}
