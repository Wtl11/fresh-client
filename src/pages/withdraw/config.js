import Vue from 'vue'
import Page from './withdraw'

const page = new Vue(Page)
page.$mount()

export default {
  config: {
    navigationBarTitleText: '提现'
  }
}
