import API from '@api'

export default {
  data() {
    return {
      notifyDesc: [],
      isShowNotify: true
    }
  },
  methods: {
    async _getNotify() {
      try {
        const res = await API.AfterNotice.getNotify()
        this.notifyDesc.push(res.data.desc)
        this.isShowNotify = res && res.data.has_notify && res.data.desc
      } catch (e) {
        this.isShowNotify = false
        console.error(e)
      }
    }
  }
}
