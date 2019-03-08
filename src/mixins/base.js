import API from '@api'
import DefaultMsg from './default-msg'

export default {
  methods: {
    $sendMsg(obj) {
      let data = DefaultMsg.create().set(obj)
      API.Notification.sendMsg(data, false)
    }
  }
}
