// 精选
import Vue from 'vue'
import Page from './choiceness'
import {ACTIVE_TYPE} from '@utils/contants'

const page = new Vue(Page)
page.$mount()

export const TAB_ARR_CONFIG = {
  [ACTIVE_TYPE.FLASH]: {
    limit: 10,
    dataArray: 'flashArray'
  },
  [ACTIVE_TYPE.NEW_CLIENT]: {
    title: '新人特惠',
    subTitle: '专属特权',
    iconText: '新人价',
    buttonText: '+购物车',
    dataArray: 'newClientList',
    limit: 20
  },
  [ACTIVE_TYPE.GOODS_HOT_TAG]: {
    title: '今日爆款',
    subTitle: '火爆推荐',
    iconText: '爆款价',
    buttonText: '+购物车',
    dataArray: 'todayHotList',
    limit: 20
  },
  [ACTIVE_TYPE.GROUP_ON]: {
    title: '拼团返现',
    subTitle: '成团有礼',
    iconText: '拼团价',
    buttonText: '去拼团',
    dataArray: 'groupList',
    limit: 20
  },
  [ACTIVE_TYPE.FREE_SHIPPING]: {
    title: '全国包邮',
    subTitle: '送货到家',
    iconText: '包邮价',
    buttonText: '+购物车',
    dataArray: 'freeShippingList',
    limit: 20
  },
  [ACTIVE_TYPE.CENTRALIZE_PURCHASE]: {
    title: '产地集采',
    subTitle: '现采现卖',
    iconText: '预售价',
    buttonText: '+购物车',
    dataArray: 'purchaseList',
    limit: 20
  },
  [ACTIVE_TYPE.GUESS]: {
    title: '猜你喜欢',
    subTitle: '为你优选',
    iconText: '团购价',
    buttonText: '+购物车',
    dataArray: 'guessList',
    limit: 20
  }
}
