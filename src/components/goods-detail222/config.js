// 商品详情
import Vue from 'vue'
import Page from './goods-detail'

const page = new Vue(Page)
page.$mount()

export default {
  config: {
    navigationBarTitleText: 'GOODS_DETAIL',
    usingComponents: {}
  }
}
