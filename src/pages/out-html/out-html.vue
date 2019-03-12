<template>
  <div class="out-html">
    <!--<navigation-bar title="" :showArrow="true"></navigation-bar>-->
    <web-view :src="url"></web-view>
  </div>
</template>

<script type="text/ecmascript-6">
  // import NavigationBar from '@components/navigation-bar/navigation-bar'
  import {baseURL} from '@utils/config'
  import {corp} from '@utils/saas'
  const PAGE_NAME = 'OUT_HTML'

  export default {
    name: PAGE_NAME,
    data() {
      return {
        url: ''
      }
    },
    components: {
      // NavigationBar
    },
    onLoad(e) {
      let chartsConfig = this.getChartsConfig(e.routeType)
      this.url = e.url || chartsConfig
    },
    methods: {
      getChartsConfig(type) {
        if (type !== 'data-overview') return
        let url = `http://192.168.9.130:6874/${type}`
        let token = wx.getStorageSync('token')
        let leaderId = wx.getStorageSync('leaderId')
        let statusBarHeight = wx.getSystemInfoSync().statusBarHeight
        return `${url}?token=${token}&api=${baseURL.api}&leaderId=${leaderId}&currentCorp=${corp.currentCorp}&statusBarHeight=${statusBarHeight}`
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">

  .out-html
    width: 100%
</style>
