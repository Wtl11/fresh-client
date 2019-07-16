import Fly from '@flyio'
import {showLoading, hideLoading} from './wechat'
import {baseURL, TIME_OUT, ERR_OK, ERR_NO} from './config'
import {silentAuthorization} from './common'
import wx from './wx'
import {corp} from '@utils/saas'
import $$routes from '@utils/routes'
const fly = new Fly()
let ErrorNum = 0
// 公共请求头
const COMMON_HEADER = {}
const NETPAGE = `${$$routes.main.ERROR}`

// 请求拦截器
fly.interceptors.request.use((request) => {
  request.headers['Authorization'] = wx.getStorageSync('token')
  request.headers['Current-Shop'] = wx.getStorageSync('shopId') || baseURL.defaultId
  request.headers['Current-Corp'] = corp.currentCorp
  request.headers['Open-GId'] = wx.getStorageSync('openGId') || ''
  return request
})

// 响应拦截器
fly.interceptors.response.use((response) => {
  return response
}, (error) => {
  return Promise.resolve(error && error.response)
})

// 配置请求基地址
fly.config.baseURL = baseURL.api

// 检查http状态码
function checkStatus(response) {
  // login
  // 如果http状态码正常，则直接返回数据
  if (response && (response.status === 200 || response.status === 304 || response.status === 422)) {
    return response
    // 如果不需要除了data之外的数据，可以直接 return response.data
  } else if (response && response.status >= 500) {
    wx.reLaunch({url: NETPAGE})
  }
  // 异常状态下，把错误信息返回去
  return {
    status: ERR_NO,
    msg: '网络异常'
  }
}

/**
 * 检查code
 * @param res
 * @returns {string|Object[]|CanvasPixelArray}
 */
async function checkCode(res = {}) {
  // silentAuthorization()
  // 如果code异常(这里已经包括网络错误，服务器错误，后端抛出的错误)，可以弹出一个错误提示，告诉用户
  if (res.status === ERR_NO) {
    console.warn(res.msg)
  }
  // 如果网络请求成功，而提交的数据，或者是后端的一些未知错误所导致的，可以根据实际情况进行捕获异常
  if (res.data && (res.data.code !== ERR_OK)) {
    // 可以进行switch操作，根据返回的code进行相对应的操作，然后抛异常
    console.warn(res.data.message)
    const _path = getApp().globalData._path
    switch (res.data.code) {
      case 13001: // 无团长权限code,跳转团长登录页面
        wx.removeStorageSync('isLeader')
        if (checkIsCurrentPage($$routes.leader.REGIMENTAL_COMMANDER, _path)) return
        wx.redirectTo({url: $$routes.leader.MINE_HOUSING})
        break
      case 10003: // 活动过期，跳转活动失效页面
        if (checkIsCurrentPage($$routes.main.GOODS_END, _path)) return
        break
      case 10000: // 登录状态失效时跳转
        if (ErrorNum <= 0) {
          await silentAuthorization()
          ErrorNum = -1
        }
        ErrorNum++
        break
      case 13002: // 店铺冻结
        if (checkIsCurrentPage($$routes.main.FREEZE_SHOP, _path)) return
        wx.redirectTo({url: $$routes.main.FREEZE_SHOP})
        break
      case 13003:
        return res.data
      case 13004: // 系统升级
        if (checkIsCurrentPage($$routes.main.APP_UPDATE, _path)) return
        wx.redirectTo({url: $$routes.main.APP_UPDATE})
        return
    }
    throw requestException(res)
  }
  return res.data || {}
}

function checkIsCurrentPage(current, target) {
  return current.includes(target)
}

/**
 * 抛异常
 * @param res
 * @returns {{}}
 */
function requestException(res = {}) {
  hideLoading()
  const error = {}
  error.statusCode = res.status
  const serviceData = res.data || {}
  if (serviceData) {
    error.code = serviceData.code
    error.error = serviceData.error
    error.message = serviceData.message
    error.serverData = serviceData
  }
  return error
}

export default {
  post(url, data, loading = true) {
    if (loading) {
      showLoading()
    }
    return fly.post(url, data, {
      timeout: TIME_OUT,
      headers: COMMON_HEADER
    }).then((response) => {
      return checkStatus(response)
    }).then((res) => {
      return checkCode(res)
    })
  },
  get(url, params, loading = true) {
    if (loading) {
      showLoading()
    }
    return fly.get(url, params, {
      timeout: TIME_OUT,
      headers: COMMON_HEADER
    }).then((response) => {
      return checkStatus(response)
    }).then((res) => {
      return checkCode(res)
    })
  },
  put(url, data, loading = true) {
    if (loading) {
      showLoading()
    }
    return fly.put(url, data, {
      timeout: TIME_OUT,
      headers: COMMON_HEADER
    }).then((response) => {
      return checkStatus(response)
    }).then((res) => {
      return checkCode(res)
    })
  },
  delete(url, data, loading = true) {
    if (loading) {
      showLoading()
    }
    return fly.delete(url, data, {
      timeout: TIME_OUT,
      headers: COMMON_HEADER
    }).then((response) => {
      return checkStatus(response)
    }).then((res) => {
      return checkCode(res)
    })
  }
}
