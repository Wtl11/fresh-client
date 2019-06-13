import Vue from 'vue'
import Page from './classify'

const page = new Vue(Page)
page.$mount()

export default {
  config: {
    navigationBarTitleText: '分类',
    usingComponents: {},
    backgroundColorTop: '#F7F7F7',
    backgroundColorBottom: '#F7F7F7'
  }
}
