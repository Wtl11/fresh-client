import Vue from 'vue'
import Page from './coupon-choose'

const page = new Vue(Page)
page.$mount()

export default {
  config: {
    navigationBarTitleText: '选择优惠券'
  }
}
