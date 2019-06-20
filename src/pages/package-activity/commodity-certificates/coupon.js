export default class {
  static COLOR = ['#B7B7B7', '', '#B7B7B7']
  static COUPON_UNIT = ['', '折', '元']

  constructor() {
    return new Array(30).fill(
      {
        customer_coupon_id: 0,
        coupon_id: 0,
        coupon_name: '马来西亚大番茄500g 0.88元兑换马来西亚大番茄500g 0.88元兑换',
        preferential_type: 0,
        preferential_str: '',
        denomination: 0,
        description: '马来西亚大番茄500g',
        denomination_str: '',
        condition: 0,
        condition_str: '',
        range_type: 0,
        range_type_str: '',
        range_type_desc: '',
        start_at: '',
        end_at: '2019.04.23',
        status: 1,
        status_str: '',
        unusable_reason: '',
        price: '8.88元',
        showTip: false,
        goods_id: 3510
      }
    )
    // return []
  }
}
