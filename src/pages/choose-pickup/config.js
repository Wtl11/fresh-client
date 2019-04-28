import Vue from 'vue'
import Page from './choose-pickup'

const page = new Vue(Page)
page.$mount()

export default {
  config: {
    navigationBarTitleText: '选择提货点',
    backgroundColorTop: '#76bb00',
    backgroundColorBottom: '#FFFFFF',
    navigationBarTextStyle: 'white',
    backgroundTextStyle: 'light'
  }
}
