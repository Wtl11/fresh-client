export default class {
  static COLOR = ['#B7B7B7', '', '#B7B7B7']
  static COUPON_UNIT = ['', '折', '元']

  constructor(props = {}) {
    return new Array(30).fill(
      {
        customer_coupon_id: 0,
        coupon_id: 0,
        coupon_name: '马来西亚大番茄500',
        preferential_type: 0,
        preferential_str: '',
        denomination: 0,
        description: '马来西亚大番茄500',
        denomination_str: '',
        condition: 0,
        condition_str: '',
        range_type: 0,
        range_type_str: '',
        range_type_desc: '',
        start_at: '',
        end_at: '2019.04.23',
        status: props.status,
        status_str: '',
        unusable_reason: '',
        price: '8.88元',
        showTip: false,
        goods_id: 3510,
        other_info: {
          goods_cover_image: 'http://social-shopping-api-1254297111.picgz.myqcloud.com/1/2019/04/25/155619196914944.png?imageView2/3/w/400/h/400/q/90'
        }
      }
    )
    // return []
  }
}
