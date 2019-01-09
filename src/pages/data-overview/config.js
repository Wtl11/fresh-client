import Vue from 'vue'
import Page from './data-overview'

const page = new Vue(Page)
page.$mount()

export default {
  config: {
    navigationBarTitleText: '数据统计',
    // 这儿添加要用的小程序组件
    usingComponents: {
      'ec-canvas': '../../../static/ec-canvas/ec-canvas'
    }
  }
}
