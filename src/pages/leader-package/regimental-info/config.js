import Vue from 'vue'
import Page from './regimental-info'

const page = new Vue(Page)
page.$mount()

export default {
  config: {
    navigationBarTitleText: '团长信息'
  }
}
