import request from '@utils/request'

export default {
  // 获得钱包余额
  getShopMoney(data, loading = false) {
    const url = `/api/wap/shop-manager/money`
    return request.get(url, data, loading)
  },
  // 收入记录
  getShopBillList(data, loading = false) {
    const url = `/api/wap/shop-manager/shop-bill`
    return request.get(url, data, loading)
  },
  // 收入记录金额
  getIncomeMoney(data, loading = false) {
    const url = `/api/wap/shop-manager/income-money-detail`
    return request.get(url, data, loading)
  },
  // 待入账记录
  getAwaitIncomeList(data, loading = false) {
    const url = `/api/wap/shop-manager/wait-income-bill`
    return request.get(url, data, loading)
  },
  // 所有的银行列表
  getAllBankList(data, loading = false) {
    const url = `/api/wap/shop-manager/all-bank-card`
    return request.get(url, data, loading)
  },
  // 填写银行列表
  getBankList(data, loading = false) {
    const url = `/api/wap/shop-manager/bank-card`
    return request.get(url, data, loading)
  },
  // 填写银行详情
  getBankDetail(id, data, loading = false) {
    const url = `/api/wap/shop-manager/bank-card/${id}`
    return request.get(url, data, loading)
  },
  // 添加银行卡
  addBankList(data, loading = false) {
    const url = `/api/wap/shop-manager/bank-card`
    return request.post(url, data, loading)
  },
  // 更新银行卡
  putBankList(id, data, loading = false) {
    const url = `/api/wap/shop-manager/bank-card/${id}`
    return request.put(url, data, loading)
  },
  // 申请提现
  postWithdrawToBank(data, loading = false) {
    const url = `/api/wap/shop-manager/withdrawal-money`
    return request.post(url, data, loading)
  },
  // 申请提现到零钱
  postWithdraw(data, loading = false) {
    const url = `/api/wap/shop-manager/withdrawal-weixin-money`
    return request.post(url, data, loading)
  }
}
