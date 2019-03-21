export default class {
  constructor () {
    this.is_pass = 0
    this.coupon_id = 0
    this.coupon_activity_id = 0
    this.step = ''
    this.coupon = {
      id: 0,
      store_id: 0,
      shop_id: 0,
      level: 0,
      coupon_name: '',
      preferential_type: 0,
      denomination: 0,
      condition: 0,
      condition_str: '',
      support_activity: 0,
      validity_type: 0,
      start_at: '',
      end_at: '',
      take_limit: 0,
      is_online: 0,
      total_stock: 0,
      usable_stock: 0,
      preferential_str: '',
      denomination_str: '',
      status: 0,
      status_str: '',
      range_type: 0,
      range_type_str: '',
      range_type_desc: '',
      ranges: [
        {
          id: 0,
          coupon_id: 0,
          range_type: 0,
          range_id: 0
        },
        {
          id: 0,
          coupon_id: 0,
          range_type: 0,
          range_id: 0
        }
      ]
    }
  }
}
