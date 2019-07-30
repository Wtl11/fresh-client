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
  import ClearWatch from '@mixins/clear-watch'
  import {resolveQrCode} from '@utils/common'

  const PAGE_NAME = 'OUT_HTML'

  export default {
    name: PAGE_NAME,
    mixins: [ClearWatch],
    data() {
      return {
        url: '',
        routeType: ''
      }
    },
    components: {
      // NavigationBar
    },
    onLoad(e = {}) {
      if (e.scene) {
        let scene = decodeURIComponent(e.scene)
        let options = resolveQrCode(scene) || {}
        if (options.s) {
          wx.setStorageSync('shopId', options.s)
        }
        this.routeType = options.routeType
      } else {
        this.routeType = e.routeType
      }
      const chartsConfig = this.getChartsConfig(this.routeType)
      const recruit = this.recruitConfig(this.routeType)
      this.url = e.url || chartsConfig || recruit
      // console.log(this.url)
    },
    methods: {
      recruitConfig(type) {
        const arr = ['recruit-regimental', 'recruit-supplier', 'recruit-alliance', 'FAQ']
        if (!arr.some(val => val === type)) {
          return null
        }
        // const webUrl = `http://192.168.9.130:6874` || baseURL.webview // todo
        const webUrl = baseURL.webview
        let url = `${webUrl}/${type}`
        let token = wx.getStorageSync('token')
        let shopId = wx.getStorageSync('shopId')
        let params = `${url}?token=${token}&api=${baseURL.api}&currentCorp=${corp.currentCorp}&shopId=${shopId}`
        return params
      },
      getChartsConfig(type) {
        if (type !== 'data-overview') {
          return null
        }
        let url = `${baseURL.webview}/${type}`
        let token = wx.getStorageSync('token')
        let leaderId = wx.getStorageSync('leaderId')
        let statusBarHeight = wx.getSystemInfoSync().statusBarHeight
        let params = `${url}?token=${token}&api=${baseURL.api}&currentCorp=${corp.currentCorp}&leaderId=${leaderId}&statusBarHeight=${statusBarHeight}`
        return params
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">

  .out-html
    width: 100%
</style>
