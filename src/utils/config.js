import {corp} from '@utils/saas'
const env = process.env
const version = process.versions
const ttt = '/v1'
// todo 测试专用记得更新
const DEV = {
  api: 'http://social-shopping-api.jerryf.cn/social-shopping',
  image: 'https://img.jerryf.cn/defaults',
  upload: 'http://social-shopping-api.jerryf.cn/social-shopping',
  outLink: 'https://fresh-h5.jkweixin.net', // 外部h5链接
  defaultId: corp.defaultId
}
// todo
const TEST = {
  api: 'https://social-shopping-api.jkweixin.net/social-shopping' + ttt,
  image: 'https://img.jkweixin.net/defaults',
  upload: 'https://social-shopping-api.jkweixin.net/social-shopping',
  outLink: 'https://fresh-h5.jkweixin.net',
  defaultId: corp.defaultId
}

const PROD = {
  api: 'https://social-shopping-api.jkweixin.com/social-shopping' + version,
  image: 'https://img.jkweixin.com/defaults',
  upload: 'https://social-shopping-api.jkweixin.com/social-shopping' + version,
  outLink: 'https://fresh-h5.jkweixin.com',
  defaultId: corp.defaultId
}
export const baseURL = env === 'production' ? PROD : env === 'test' ? TEST : DEV

export const ERR_OK = 0
export const TIME_OUT = 10000
export const ERR_NO = -404
export const TOKEN_OUT = 10000 // token 失效
