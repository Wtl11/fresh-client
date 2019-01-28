import Vue from 'vue'
import Page from './classify'

const page = new Vue(Page)
page.$mount()

export default {
  config: {
    navigationBarTitleText: '分类'
  }
}
