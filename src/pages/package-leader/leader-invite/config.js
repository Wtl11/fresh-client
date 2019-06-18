import Vue from 'vue'
import Page from './leader-invite'

const page = new Vue(Page)
page.$mount()

export default {
  config: {
    navigationBarTitleText: '团长招募'
  }
}
