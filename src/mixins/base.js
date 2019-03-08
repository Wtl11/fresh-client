import API from '@api'
import DefaultMsg from './default-msg'
import {ERR_OK} from '@utils/config'

export default {
  methods: {
    $sendMsg(obj) {
      let data = DefaultMsg.create().set(obj)
      API.Notification.sendMsg(data, false).then(res => {
        if (res.error !== ERR_OK) {
          console.error(res)
        }
        console.warn(res)
      }).catch(e => {
        console.error(e)
      })
    }
  }
}
