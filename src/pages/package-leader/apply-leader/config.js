import Vue from 'vue'
import Page from './apply-leader'

const page = new Vue(Page)
page.$mount()

export default {
  config: {
    navigationBarTitleText: '申请成为团长'
  }
}
