export default class {
  static COUPON_UNIT = ['', '折', '元']

  constructor() {
    this.id = 0
    this.store_id = 0
    this.shop_id = 0
    this.level = 0
    this.coupon_name = '赞播优鲜新人专享券'
    this.preferential_type = 2
    this.denomination = 5
    this.condition = 0
    this.condition_str = '满100元可用'
    this.support_activity = 0
    this.validity_type = 0
    this.start_at = ''
    this.end_at = ''
    this.take_limit = 0
    this.is_online = 0
    this.total_stock = 0
    this.usable_stock = 0
    this.deleted_at = null
    this.created_at = ''
    this.updated_at = ''
    this.preferential_str = ''
    this.denomination_str = ''
    this.status = 0
    this.status_str = ''
  }
}
