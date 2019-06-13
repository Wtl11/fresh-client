import Vue from 'vue'
import Page from './find-product'

const page = new Vue(Page)
page.$mount()

export default {
  config: {
    navigationBarTitleText: '找产品'
  }
}
