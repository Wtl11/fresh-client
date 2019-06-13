import Vue from 'vue'
import Page from './open-location'

const page = new Vue(Page)
page.$mount()

export default {
  config: {
    navigationBarTitleText: '选择自提点'
  }
}
