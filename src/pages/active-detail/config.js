import Vue from 'vue'
import Page from './active-detail'

const page = new Vue(Page)
page.$mount()

export default {
  config: {
    navigationBarTitleText: '&#39;&#39;'
  }
}
