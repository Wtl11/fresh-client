<template>
  <div class="collage-detail">
    <navigation-bar title="拼团详情"></navigation-bar>
    <picker style="margin-top: 10px; border: 1px solid #eee" mode="selector" @change="changePicker" :value="status" :range="[0,1,2,3,4,5,6,7,8,9,10,11]">
      <div class="picker">当前选择：{{status}}</div>
    </picker>
    <p v-if="topText1" class="top-text">该活动仅支持： 国际单位社区</p>
    <p v-if="topText2" class="top-text">当前社区不支持拼团活动: 国际单位社区</p>
    <div class="top-msg">
      <!--商品信息-->
      <div v-if="goodsBox" class="goods-box">
        <div class="goods-detail">
          <img src="" alt="" class="goods-img">
          <div class="right-content">
            <p class="title">超值特惠 4斤新鲜柠檬是是三三首饰所所死侍死侍</p>
            <p class="context">脆嫩爽口，酸甜多汁，口感脆嫩，新鲜美味</p>
            <div class="marks">
              <span class="total">200人已拼</span>
              <span class="count">3人团</span>
            </div>
            <p class="price">
              <span class="money">3.8</span>
              <span class="unit">元</span>
            </p>
          </div>
        </div>
      </div>

      <p v-if="statusText" class="status-text" :class="{'orange': orangeStatus}"><img :src="imageUrl + '/yx-image/collage/'+ data.icon +'@2x.png'" alt="" class="icon">{{data.statusText}}</p>
      <p v-if="statusTip1" class="status-tip">还差<span class="mark">1</span>人，快喊邻居一起来拼团吧</p>
      <p v-if="statusTip2" class="status-tip status-tip2">仅剩<span class="mark">1</span>个名额</p>
      <p v-if="runTime" class="run-time">剩余 <span class="time-num">{{timeArr[0]}}</span>:<span class="time-num">{{timeArr[1]}}</span>:<span class="time-num">{{timeArr[2]}}</span></p>

      <!--头像-->
      <div v-if="headShow" class="heads">
        <div v-for="(item, index) in headArr" :key="index" class="head-box" :class="[{'small-head': headArr.length > 4}, {'has-border': false}]">

          <img :src="imageUrl + '/yx-image/collage/pic-touxiang@2x.png'" alt="" class="logo">

          <span v-if="index === 0" class="tag">拼主</span>
        </div>
      </div>

      <!--<button class="btn" open-type="share">{{data.btn}}</button>-->
      <div class="btn" @click="clickBtn">{{data.btn}}</div>
      <p v-if="botTip" class="bot-tip">分享邻居越多，成团越快</p>
    </div>
    <!--<div class="btn" @click="_initLocation">获取位置信息</div>-->

    <div v-if="goods || time" class="line"></div>
    <div v-if="goods" class="goods" @click="toDetail">
      <span class="label">拼团商品</span>
      <p class="text">精品油桃3公斤装，整箱...<img :src="imageUrl + '/yx-image/collage/icon-pressed@2x.png'" class="icon"></p>
    </div>
    <div v-if="time" class="time">
      <span class="label">拼团时间</span>
      <span class="text">2019-12-12 12:12:12</span>
    </div>

    <!--进度-->
    <div v-if="progressShow" class="progress-handle">
      <div class="progress-bg">
        <span class="progress" :style="{width: (19 + 33.333*step) + '%'}"></span>
        <span v-for="(item, index) in progress" :key="index" :style="{left: -2 + (index * 33.333) + '%'}" class="step" :class="{'active': step >= index}">{{item}}</span>
        <span v-for="(item, index) in text" :key="index" :style="{left: -8.5 + (index * 33.333) + '%'}" class="progress-text" :class="{'activity': step >= index}">{{item}}</span>
      </div>
    </div>

    <!--分享-->
    <share-pop ref="sharePop"></share-pop>

    <!--猜你喜欢-->
    <div v-if="recommend" class="recommend">
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
  import SharePop from './share-pop/share-pop'
  import { formatNumber } from '@utils/common'
  import API from '@api'
  const PAGE_NAME = 'COLLAGE_DETAIL'

  const STATUS_ARR = [
    // 拼主
    {
      type: 'master',
      status: 1,
      statusText: '开团成功',
      btn: '邀请邻居参团',
      step: 1,
      icon: 'icon-success'
    },
    {
      type: 'master',
      status: 2,
      statusText: '待成团',
      btn: '邀请邻居参团',
      step: 1,
      icon: 'icon-success'
    },
    {
      type: 'master',
      status: 3,
      statusText: '拼团成功',
      btn: '查看我的订单',
      step: 3,
      icon: 'icon-success'
    },
    {
      type: 'master',
      status: 4,
      statusText: '拼团失败',
      btn: '查看别的拼团',
      step: 1,
      icon: 'icon-failure'
    },
    // 已参团
    {
      type: 'customer',
      status: 5,
      statusText: '待成团',
      btn: '邀请邻居参团',
      step: 1,
      icon: 'icon-success'
    },
    {
      type: 'customer',
      status: 6,
      statusText: '参团成功',
      btn: '查看我的订单',
      step: 1,
      icon: 'icon-success'
    },
    {
      type: 'customer',
      status: 7,
      statusText: '拼团成功',
      btn: '看看别的拼团',
      step: 2,
      icon: 'icon-success'
    },
    {
      type: 'customer',
      status: 8,
      statusText: '拼团失败',
      btn: '返回商城首页',
      step: 1,
      icon: 'icon-failure'
    },
    {
      type: 'customer',
      status: 9,
      statusText: '不在范围',
      btn: '返回商城首页',
      step: 1,
      icon: 'icon-failure'
    },
    // 未参与
    {
      type: 'customer',
      status: 10,
      statusText: '',
      btn: '一键参团',
      step: 1,
      icon: ''
    },
    {
      type: 'customer',
      status: 11,
      statusText: '该团已满',
      btn: '我来开团',
      step: '',
      icon: 'icon-end'
    },
    {
      type: 'customer',
      status: 12,
      statusText: '该团已结束',
      btn: '返回商城首页',
      step: '',
      icon: 'icon-end'
    }
  ]

  export default {
    page: PAGE_NAME,
    mixins: [ClearWatch],
    data() {
      return {
        statusArr: STATUS_ARR,
        headArr: [1, 2],
        progress: [1, 2, 3, 4],
        text: ['开团', '邀请邻居', '拼团成功', '拼团返券'],
        orderId: 1,
        distance: true,
        timer: '',
        timeArr: [],
        recommendList: [],
        step: STATUS_ARR[0].step,
        data: STATUS_ARR[0],
        status: 0
      }
    },
    computed: {
      topText1() { // 开团成功
        return +this.data.status === 1
      },
      topText2() { // 不在范围
        return +this.data.status === 9
      },
      goodsBox() {
        if (+this.data.status === 5 ||
          +this.data.status === 6 ||
          +this.data.status === 7 ||
          +this.data.status === 8 ||
          +this.data.status === 10
        ) {
          return true
        }
        return false
      },
      statusText() {
        if (+this.data.status === 1 ||
          +this.data.status === 2 ||
          +this.data.status === 3 ||
          +this.data.status === 4 ||
          +this.data.status === 5 ||
          +this.data.status === 6 ||
          +this.data.status === 7 ||
          +this.data.status === 8 ||
          +this.data.status === 11 ||
          +this.data.status === 12
        ) {
          return true
        }
        return false
      },
      statusTip1() {
        if (+this.data.status === 1 ||
          +this.data.status === 2 ||
          +this.data.status === 4 ||
          +this.data.status === 5 ||
          +this.data.status === 6
        ) {
          return true
        }
        return false
      },
      statusTip2() {
        if (+this.data.status === 9 || +this.data.status === 10) {
          return true
        }
        return false
      },
      runTime() {
        if (+this.data.status === 1 ||
          +this.data.status === 2 ||
          +this.data.status === 4 ||
          +this.data.status === 5 ||
          +this.data.status === 6 ||
          +this.data.status === 9 ||
          +this.data.status === 10
        ) {
          return true
        }
        return false
      },
      headShow() {
        return +this.data.status !== 12
      },
      botTip() {
        if (+this.data.status !== 4 && +this.data.status !== 11 && +this.data.status !== 12) {
          return true
        }
        return false
      },
      goods() {
        if (+this.data.status === 1 ||
          +this.data.status === 3 ||
          +this.data.status === 4
        ) {
          return true
        }
        return false
      },
      time() {
        if (+this.data.status !== 11 && +this.data.status !== 12) {
          return true
        }
        return false
      },
      progressShow() {
        if (+this.data.status !== 11 && +this.data.status !== 12) {
          return true
        }
        return false
      },
      recommend() {
        if (+this.data.status === 11 || +this.data.status === 12) {
          return true
        }
        return false
      },
      orangeStatus() {
        if (+this.data.status === 4 || +this.data.status === 8 || +this.data.status === 11 || +this.data.status === 12) {
          return true
        }
        return false
      }
    },
    components: {
      NavigationBar,
      GoodsItem,
      SharePop
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
      this._initLocation()
      this.timeHandle()
    },
    async onShow() {
      this._refreshLocation()
      // await this.getCarRecommend()
    },
    methods: {
      changePicker(e) {
        this.status = e.target.value
        this.data = STATUS_ARR[e.target.value]
        this.step = STATUS_ARR[e.target.value].step
      },
      changeStatus() {
        this.data = STATUS_ARR[this.status]
        this.step = STATUS_ARR[this.status].step
      },
      clickBtn() {
        this.showShare()
      },
      showShare() {
        this.$refs.sharePop.show()
      },
      toDetail() {
        let id = this.data.id
        wx.navigateTo({url: `/pages/goods-detail?id=${id}`})
      },
      timeHandle() {
        clearInterval(this.timer)
        let defaultTime = new Date().getTime() + 60 * 60 * 100 * 24
        let nowTime = new Date()
        let timeDef = defaultTime - nowTime
        this.timer = setInterval(() => {
          timeDef -= 1000
          if (timeDef >= defaultTime) {
            clearInterval(this.timer)
          }
          let date = new Date(timeDef)
          let hours = formatNumber(date.getHours())
          let minutes = formatNumber(date.getMinutes())
          let seconds = formatNumber(date.getSeconds())
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
              wx.setStorageSync('lastPage', 'collage-detail')
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
          wx.setStorageSync('lastPage', 'collage-detail')
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
  .top-msg
    padding-bottom: 13px
  .goods-box
    background: #F7F7F7
    padding-bottom: 12px
    margin-bottom: 7px
  .goods-detail
    padding: 15px 13px
    display: flex
    align-items: center
    background: #FFF
    .goods-img
      width: 105px
      height: 105px
      background: #eee
      border-radius: 2px
    .right-content
      height: 105px
      margin-left: 10px
      flex: 1
      overflow: hidden
    .title
      font-family: $font-family-medium
      font-size: $font-size-16
      line-height: 20px
      color: #111
      overflow: hidden
      text-overflow: ellipsis
      white-space: nowrap
    .context
      font-family: $font-family-regular
      font-size: $font-size-14
      line-height: 14px
      color: #808080
      margin-top: 6px
      overflow: hidden
      text-overflow: ellipsis
      white-space: nowrap
    .marks
      margin-top: 8px
      display: flex
      align-items: center
      color: #fa7500
      font-size: $font-size-12
      font-family: $font-family-regular
      .total
        padding: 2px 7px
        background: rgba(255,133,6,0.15)
        border-radius: 2px
      .count
        padding: 2px 7px
        border-radius: 2px
        margin-left: 5px
        border-1px(rgba(250,117,0,0.20))
    .price
      color: #FA7500
      margin-top: 10px
      .money
        font-family: $font-family-medium
        font-size: 25px
        line-height: 25px
      .unit
        font-family: $font-family-regular
        font-size: $font-size-14
  .top-text
    height: 40px
    font-size: 15px
    font-family: $font-family-regular
    color: #FF8300
    padding: 0 12px
    line-height: 40px
    background: #FFEBD6
  .status-text
    font-family: $font-family-medium
    color: $color-main
    font-size: 22px
    display: flex
    align-items: center
    margin: 22px 0 31px
    justify-content: center
    .icon
      width: 35px
      height: 35px
      border-radius: 50%
      margin-right: 4px
      background: #ccc
  .orange
    color: #FF8506
  .status-tip
    font-size: $font-size-14
    font-family: $font-family-medium
    text-align: center
    .mark
      color: #FA7500
  .status-tip2
    margin-top: 30px
  .run-time
    font-family: $font-family-regular
    font-size: $font-size-14
    color: #3F454B
    line-height: 20px
    margin-top: 14px
    display: flex
    align-items: center
    justify-content: center
    .time-num
      display: inline-block
      width: 20px
      height: 20px
      text-align: center
      line-height: 20px
      border-radius: 4px
      margin-left: 3px
      margin-right: 3px
      background: #3F454B
      font-size: $font-size-14
      font-family: $font-family-din-bold
      color: #FFF
      &:first-child
        margin-left: 6px
  .heads
    padding: 0 12px
    margin-top: 28px
    margin-bottom: 25px
    display: flex
    align-items: center
    justify-content: center
    .head-box
      flex: 0 0 1
      height: 50px
      margin: 0 4%
      border-radius: 50%
      position: relative
    .small-head
      margin: 0 2%
    .has-border
      border: 1px solid #E0E0E0
    .logo
      width: 50px
      height: 50px
      border-radius: 50%
    .tag
      width: 34px
      height: 14px
      border-radius: 15px
      background: #FFD14F
      row-center()
      bottom: -7px
      text-align: center
      line-height: 14px
      color: #A03918
      font-size: 10px
      font-family: $font-family-medium
  .btn
    margin: 0 auto
    width: 72%
    height: 45px
    line-height: 45px
    text-align: center
    color: #FFF
    font-size: $font-size-16
    font-family: $font-family-medium
    border-radius: 50px
    background: $color-main
    margin-bottom: 12px
  .bot-tip
    color: $color-text-assist
    font-size: 13px
    font-family: $font-family-regular
    text-align: center
    margin-bottom: 7px
  .line
    height: 10px
    background: #F7F7F7

  .goods,.time
    height: 50px
    margin: 0 12px
    display: flex
    align-items: center
    justify-content: space-between
    font-size: $font-size-14
    border-bottom-1px(#E6E6E6)
    .label
      width: 180px
      overflow: hidden
      text-overflow: ellipsis
      white-space: nowrap
      color: #808080
    .text
      color: #111
      display: flex
      align-items: center
    .icon
      width: 6px
      height: 12px
      margin-left: 4px

  .progress-handle
    padding: 30px 12px 60px
    .progress-bg
      width: 275px
      height: 5px
      background: #CBCAD3
      position: relative
      margin: 0 auto
    .progress
      width: 0
      height: 5px
      background: linear-gradient(90deg, #73C200, #ABE300)
      border-radius: 5px
      position: absolute
      left: 0
      top: 0
    .step
      width: 14px
      height: 14px
      border-radius: 50%
      background: #FFF
      border: 1px solid #E5E5E5
      text-align: center
      line-height: 14px
      font-family: $font-family-medium
      color: #808080
      font-size: $font-size-10
      position: absolute
      top: -5px
      transition: all 0.3s
    .active
      background: $color-main
      color: #FFF
      border: 1px solid transparent
    .progress-text
      font-size: $font-size-12
      font-family: $font-family-regular
      color: #808080
      width: 50px
      text-align: center
      position: absolute
      top: 20px
      left: 0
    .activity
      color: $color-main
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
