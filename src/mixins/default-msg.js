export default class DefaultMsg {
  constructor () {
    this.event_no = 0 // 事件号
    this.log_type = 0
    this.goods_id = 0 // 商品id
    this.activity_id = 0
    this.flow_id = 0
    this.store_id = 0 // 站点id
    this.merchant_id = 0
    this.shop_id = 0 // 团长id
    this.customer_id = 0
    this.total = '' // 金额等
    this.title = '' // 标题等
    this.customer_name = '' // 客户名称
    this.from_customer_id = 0
    this.user_info = {}
  }
  static create() {
    return new this()
  }
  set(obj = {}) {
    Object.assign(this, obj)
    return this
  }
}
