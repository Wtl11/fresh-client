export default {
  methods: {
    // 获取地理位置
    async _getLocation() {
      try {
        const res = await this.$wechat.getLocation()
        console.log(res)
      } catch (e) {
        console.log(1)
      }
    }
  }
}
