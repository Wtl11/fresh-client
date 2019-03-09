import {baseURL} from '@utils/config'
import {corp} from '@utils/saas'
export default class EventMsg {
  constructor (obj) {
    this.cname = `corp-${corp.shopSaas}-text`
    this.image_url = obj.image_url || `${baseURL.image}/yx-image/group/pic-head@2x.png`
    this.customer_name = obj.customer_id ? obj.customer_name : '游客'
    const param = obj.param || {}
    this.count_sum = obj.customer_id ? '第' + (param.count_sum || 0) + '次' : ''
    this.event_no = obj.event_no + ''
    if (this.event_no === '1000') {
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
    if (this.event_no === '1001') {
      this.msg = [
        {
          text: `${this.customer_name}通过扫描他人分享的海报`,
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
          text: obj.title,
          cname: this.cname
        }
      ]
    }
    if (this.event_no === '1002') {
      this.msg = [
        {
          text: `${this.customer_name}通过他人分享的链接`,
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
          text: obj.title,
          cname: this.cname
        }
      ]
    }
    if (this.event_no === '1003') {
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
          text: obj.title,
          cname: this.cname
        },
        {
          text: `,请把握商机`,
          cname: ''
        }
      ]
    }
    if (this.event_no === '1004') {
      this.msg = [
        {
          text: `${this.customer_name}`,
          cname: ''
        },
        {
          text: `转发`,
          cname: this.cname
        },
        {
          text: `了你的`,
          cname: ''
        },
        {
          text: obj.title,
          cname: this.cname
        },
        {
          text: ',你的商品正在裂变'
        }
      ]
    }
    if (this.event_no === '1005') {
      this.msg = [
        {
          text: `${this.customer_name}`,
          cname: ''
        },
        {
          text: `保存`,
          cname: this.cname
        },
        {
          text: `了你的`,
          cname: ''
        },
        {
          text: obj.title,
          cname: this.cname
        },
        {
          text: '海报',
          cname: ''
        }
      ]
    }
    if (this.event_no === '1006') {
      this.msg = [
        {
          text: `${this.customer_name}`,
          cname: ''
        },
        {
          text: `提交了订单`,
          cname: this.cname
        },
        {
          text: `金额为`,
          cname: ''
        },
        {
          text: obj.total,
          cname: this.cname
        },
        {
          text: '元,并完成支付',
          cname: ''
        }
      ]
    }
    if (this.event_no === '1007') {
      this.msg = [
        {
          text: `${this.customer_name}把`,
          cname: ''
        },
        {
          text: obj.title,
          cname: this.cname
        },
        {
          text: '加入了',
          cname: ''
        },
        {
          text: '购物车',
          cname: this.cname
        }
      ]
    }
  }
}
