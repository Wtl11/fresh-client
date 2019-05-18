<template>
  <div class="collage-detail">
    <navigation-bar title="拼团详情"></navigation-bar>
    <p class="top-text">当前社区不支持拼团活动: 国际单位社区</p>
    <p class="status-text"><img src="" alt="" class="icon">开团成功</p>
    <p class="status-tip">还差<span class="mark">1</span>人，赶紧邀请好友来拼团吧</p>
    <p class="run-time">剩余 <span class="time-num">{{timeArr[0]}}</span><span class="time-num">{{timeArr[1]}}</span><span class="time-num">{{timeArr[2]}}</span></p>
    <div class="heads">
      <div v-for="(item, index) in headArr" :key="index" class="head-box">
        <img src="" alt="" class="logo">
      </div>
    </div>
    <button class="btn" open-type="share">邀请好友参团</button>
    <div class="btn" @click="_initLocation">获取位置信息</div>
    <p class="bot-tip">分享好友越多，成团越快</p>
    <div class="line"></div>
    <div class="goods">
      <span class="label">拼团商品</span>
      <span class="text">精品油桃3公斤装，整箱...</span>
    </div>
    <div class="time">
      <span class="label">拼团时间</span>
      <span class="text">2019-12-12 12:12:12</span>
    </div>
    <div class="recommend">
      <p class="title">
        <img src="https://img.jkweixin.net/defaults/yx-image/2.3/icon-ulike@2x.png" alt="" class="icon">
        <span class="text">猜你喜欢</span>
      </p>
      <div class="recommend-list">
        <div v-for="(item, index) in recommendList" :key="index" class="list-item">
          <goods-item :item="item" @_getShopCart="_getShopCart"></goods-item>
        </div>

      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import NavigationBar from '@components/navigation-bar/navigation-bar'
  import ClearWatch from '@mixins/clear-watch'
  import GoodsItem from './goods-item/goods-item'
  import API from '@api'
  const PAGE_NAME = 'COLLAGE_DETAIL'
  export default {
    page: PAGE_NAME,
    mixins: [ClearWatch],
    data() {
      return {
        headArr: [1, 2],
        orderId: 1,
        distance: true,
        timer: '',
        timeArr: [],
        recommendList: []
      }
    },
    components: {
      NavigationBar,
      GoodsItem
    },
    onShareAppMessage() {
      let shopId = wx.getStorageSync('shopId')
      const flag = Date.now()
      console.log(`/pages/share-order?id=${this.orderId}&shopId=${shopId}`)
      return {
        title: `【商品名称】`,
        path: `/pages/share-order?id=${this.orderId}&shopId=${shopId}&flag=${flag}`,
        imageUrl: `${this.imageUrl}/yx-image/order/pic-share_order@2x.png`,
        success: (res) => {
          // 转发成功
        },
        fail: (res) => {
          // 转发失败
        }
      }
    },
    onUnload() {
      clearInterval(this.timer)
    },
    onHide() {
      clearInterval(this.timer)
    },
    onLoad(options) {
      this.timeHandle()
    },
    async onShow() {
      await this.getCarRecommend()
    },
    methods: {
      timeHandle() {
        let defaultTime = new Date().getTime() + 60 * 60 * 100 * 24
        let nowTime = new Date()
        let timeDef = defaultTime - nowTime
        this.timer = setInterval(() => {
          timeDef -= 1000
          if (timeDef >= defaultTime) {
            clearInterval(this.timer)
          }
          let date = new Date(timeDef)
          let hours = date.getHours()
          let minutes = date.getMinutes()
          let seconds = date.getSeconds()
          this.timeArr = [hours, minutes, seconds]
        }, 1000)
      },
      btnHandle() {
        console.log(121)
      },
      async getCarRecommend() {
        let res = await API.Cart.getCarRecommend()
        if (res.error !== this.$ERR_OK) {
          this.$wechat.showToast(res.message)
          return
        }
        this.recommendList = res.data
      },
      // 初始化地理位置
      _initLocation() {
        if (wx.getStorageSync('locationShow') * 1 === 3 || wx.getStorageSync('locationShow') * 1 === 2) {
        } else {
          let that = this
          wx.getLocation({
            async success(res) {
              console.log(res)
              wx.setStorageSync('locationData', res)
              wx.setStorageSync('locationShow', 1)
              that.locationStatus = 1
              that.getLocationData()
            },
            fail(res) {
              wx.setStorageSync('locationShow', 3)
              wx.navigateTo({
                url: `/pages/open-location`
              })
            }
          })
        }
      },
      // 更新地理位置
      _refreshLocation() {
        this.locationStatus = wx.getStorageSync('locationShow')
        if (this.locationStatus * 1 === 3) {
          wx.navigateTo({
            url: `/pages/open-location`
          })
        }
      },
      // 根据地理位置判断范围
      getLocationData() {
        let data = wx.getStorageSync('locationData')
        API.Choiceness.getLocationDistance({
          longitude: data.longitude || 0,
          latitude: data.latitude || 0
        }).then((res) => {
          if (res.error !== this.$ERR_OK) {
            return
          }
          if (res.data.distance > 1000) {
            this.distance = false
          }
        })
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@designCommon"
  .top-text
    height: 24px
    font-size: $font-size-14
    font-family: $font-family-regular
    padding: 0 14px
    line-height: 24px
    background: #fdf3d5
  .status-text
    font-size: $font-size-24
    display: flex
    align-items: center
    margin-top: 20px
    justify-content: center
    .icon
      width: 32px
      height: 32px
      border-radius: 50%
      margin-right: 10px
      background: #ccc
  .status-tip
    margin-top: 20px
    font-size: $font-size-14
    font-family: $font-family-regular
    text-align: center
  .run-time
    text-align: center
    .time-num
      display: inline-block
      width: 22px
      height: 20px
      text-align: center
      line-height: 20px
      margin-right: 5px
      background: #000
      font-size: $font-size-12
      color: #FFF
  .heads
    padding: 0 50px
    display: flex
    align-items: center
    justify-content: center
    .head-box
      width: 40px
      height: 40px
      margin-top: 20px
      margin-right: 20px
      border-radius: 50%
      overflow: hidden
      border-1px()
    .logo
      width: 100%
      height: 100%
      background: #ccc
  .btn
    margin: 10px auto
    width: 80%
    height: 45px
    line-height: 45px
    text-align: center
    color: #FFF
    font-size: $font-size-14
    font-family: $font-family-regular
    border-radius: 8px
    background: #77dafb
  .bot-tip
    color: $color-text-assist
    font-size: $font-size-14
    font-family: $font-family-regular
    text-align: center
    margin-bottom: 15px
  .line
    height: 10px
    background: #ccc

  .goods,.time
    height: 34px
    display: flex
    align-items: center
    justify-content: space-between
    padding: 0 15px
    font-size: $font-size-14
    border-bottom-1px()
    .label
      color: #ccc
    .text
      color: #333

  .progress
    padding: 0 14px
  .recommend
    .title
      height: 60px
      padding-top: 12px
      box-sizing: border-box
      background: #F7F7F7
      display: flex
      align-items: center
      justify-content: center
      .icon
        width: 17px
        height: 17px
        margin-right: 4px
      .text
        font-family: $font-family-medium
        font-size: $font-size-16
        color: #1D2023
    .recommend-list
      width: 100vw
      layout(row)
      align-items: center
      padding: 0 6px
      box-sizing: border-box
      .list-item
        width: 50%
        box-sizing: border-box
        margin-bottom: 5px
        &:nth-of-type(odd)
          padding-right: 2.5px
        &:nth-of-type(even)
          padding-left: 2.5px
</style>
