import Vue from 'vue'
import Page from './group-wallet'

const page = new Vue(Page)
page.$mount()

export default {
  config: {
    navigationBarTitleText: '团长钱包'
  }
}
