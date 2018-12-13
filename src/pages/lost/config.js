import Vue from 'vue'
import Page from './lost'

const page = new Vue(Page)
page.$mount()

export default {
  config: {
    navigationBarTitleText: '赞播优鲜'
  }
}
