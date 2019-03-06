// import API from '@api'
import DefaultMsg from './default-msg'
export default {
  methods: {
    $sendMsg(obj) {
      obj = DefaultMsg.create().set(obj)
      // API.Notification.sendMsg(obj)
    }
  }
}
