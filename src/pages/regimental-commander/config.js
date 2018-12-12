// &#34;团长首页&#34;
import Vue from 'vue'
import Page from './regimental-commander'

const page = new Vue(Page)
page.$mount()

export default {
  config: {
    navigationBarTitleText: 'REGIMENTAL_COMMANDER',
    backgroundColor: '#F7F7F7'
  }
}
