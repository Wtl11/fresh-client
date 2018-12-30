import Vue from 'vue'
import Page from './bank-card'

const page = new Vue(Page)
page.$mount()

export default {
  config: {
    navigationBarTitleText: '绑定银行卡'
  }
}
