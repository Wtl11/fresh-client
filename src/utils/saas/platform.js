const env = process.env

export const platform = {
  currentCorp: 1,
  defaultId: env === 'production' ? 15 : 1, // 默认店铺id
  shopName: '赞播优鲜',
  shopSaas: 'platform'
}
