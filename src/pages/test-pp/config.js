// test-page
import Vue from 'vue'
import Page from './test-pp'

const page = new Vue(Page)
page.$mount()

export default {
  config: {
    navigationBarTitleText: 'TEST_PP'
  }
}
