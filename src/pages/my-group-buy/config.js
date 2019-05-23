// 我的拼团
import Vue from 'vue'
import Page from './my-group-buy'

const page = new Vue(Page)
page.$mount()

export default {
  config: {
    navigationBarTitleText: 'MY_GROUP_BUY'
  }
}
