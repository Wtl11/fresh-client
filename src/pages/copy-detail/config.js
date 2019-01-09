import Vue from 'vue'
import Page from './copy-detail'

const page = new Vue(Page)
page.$mount()

export default {
  config: {
    navigationBarTitleText: '商品详情'
  }
}
