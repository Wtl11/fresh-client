import Vue from 'vue'
import Page from './faq'

const page = new Vue(Page)
page.$mount()

export default {
  config: {
    navigationBarTitleText: '常见问题'
  }
}
