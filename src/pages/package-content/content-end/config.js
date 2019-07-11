import Vue from 'vue'
import Page from './content-end'

const page = new Vue(Page)
page.$mount()

export default {
  config: {
    navigationBarTitleText: '赞播优鲜'
  }
}
