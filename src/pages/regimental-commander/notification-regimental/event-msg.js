import {baseURL} from '@utils/config'
export default class EventMsg {
  constructor (obj) {
    this.cname = 'textColor'
    this.image_url = obj.image_url || `${baseURL.image}/yx-image/group/pic-head@2x.png`
    this.customer_name = obj.customer_id ? obj.customer_name : '游客'
    const params = obj.params || {}
    this.count_sum = obj.customer_id ? '第' + (params.count_sum || 0) + '次' : ''
    if (obj.event_no === '1000') {
      this.msg = [
        {
          text: `${this.customer_name}${this.count_sum}`,
          cname: ''
        },
        {
          text: `查看`,
          cname: this.cname
        },
        {
          text: `了你的`,
          cname: ''
        },
        {
          text: `小店`,
          cname: this.cname
        }
      ]
    }
  }
}
