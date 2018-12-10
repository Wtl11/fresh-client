<script>
  import { oauthMethods } from '@state/helpers'
console.log(222)
  export default {
    created() {
      // 调用API从本地缓存中获取数据
      const logs = wx.getStorageSync('logs') || []
      logs.unshift(Date.now())
      wx.setStorageSync('logs', logs)

      console.log('app created and cache logs by setStorageSync')
    },
    onShow() {
      // todo
      this.update('qwezxczcxc')
    },
    methods: {
      ...oauthMethods
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"
</style>
