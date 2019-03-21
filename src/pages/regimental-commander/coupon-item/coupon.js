export default class {
  static COUPON_UNIT = ['元', '折', '元']
  constructor () {
    this.id = 0
    this.store_id = 0
    this.shop_id = 0
    this.usable_stock = 0
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
      deleted_at: null,
      created_at: '',
      updated_at: '',
      preferential_str: '',
      denomination_str: '',
      status: 0,
      status_str: ''
    }
  }
}
