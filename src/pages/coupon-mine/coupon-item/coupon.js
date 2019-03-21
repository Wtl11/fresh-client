export default class {
  static COLOR = ['#B7B7B7', '', '#B7B7B7']
  static COUPON_UNIT = ['', '折', '元']
  constructor () {
    this.customer_coupon_id = 0
    this.coupon_id = 0
    this.coupon_name = ''
    this.preferential_type = 0
    this.preferential_str = ''
    this.denomination = 0
    this.denomination_str = ''
    this.condition = 0
    this.condition_str = ''
    this.range_type = 0
    this.range_type_str = ''
    this.range_type_desc = ''
    this.start_at = ''
    this.end_at = ''
    this.status = 0
    this.status_str = ''
    this.unusable_reason = ''
  }
}
