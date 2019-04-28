import Vue from 'vue'
import Page from './notice'

const page = new Vue(Page)
page.$mount()

export default {
  config: {
    navigationBarTitleText: '通知'
  }
}
