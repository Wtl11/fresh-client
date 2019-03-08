import Vue from 'vue'
import Page from './recommend'

const page = new Vue(Page)
page.$mount()

export default {
  config: {
    navigationBarTitleText: '活动标题'
  }
}
