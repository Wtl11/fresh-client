import Vue from 'vue'
import Page from './leader-invite-success'

const page = new Vue(Page)
page.$mount()

export default {
  config: {
    navigationBarTitleText: '团长申请'
  }
}
