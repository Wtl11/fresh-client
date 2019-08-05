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
      coupon_name: '大菜花兑换券',
      preferential_type: 0,
      denomination: 0,
      condition: 0,
      condition_str: '',
      support_activity: 0,
      validity_type: 0,
      start_at: '',
      end_at: '2018.12.31',
      take_limit: 0,
      is_online: 0,
      total_stock: 0,
      usable_stock: 0,
      preferential_str: '',
      denomination_str: '',
      status: 0,
      status_str: '',
      range_type: 0,
      range_type_str: '通用',
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
      ],
      other_info: {
        goods_cover_image: 'http://social-shopping-api-1254297111.picgz.myqcloud.com/1/2019/04/25/155619196914944.png?imageView2/3/w/400/h/400/q/90'
      }
    }
  }
}
