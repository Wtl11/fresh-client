<template>
  <div class="wrap">
    <navigation-bar title="我的订单" :showArrow="true" :translucent="false"></navigation-bar>
    <div class="nav-box">
      <div class="order-nav">
        <div class="nav-item" :class="tabIdx * 1 === index ? 'nav-item-active' : ''" v-for="(item, index) in navList" :key="index" @click="selectIndex(item, index)">{{item.name}}</div>
      </div>
      <div class="line-box">
        <div class="line" :style="'transform: translate(' + tabIdx*100 + '%,0)'"><div class="lines" :class="'corp-' + corpName + '-bg'"></div></div>
      </div>
    </div>
    <div class="big-box">
      <div class="order-big-box" :style="{'transform': ' translateX('+ -(tabIdx * 100) +'vw)'}">
        <div v-for="(list, index) in orderListArr" :key="index" class="order-item-list" :class="tabIdx * 1 === index ? '' : 'order-item-list-height70'">
          <div class="order-list" v-if="list.data.length > 0">
            <div v-for="(item, itemIndex) in list.data" :key="itemIndex" @click="jumpDetail(item)" class="order-item">
              <div class="top">
                <div class="group-name">订单号：1344134314414</div>
                <div class="status" :class="'corp-' + corpName + '-money'">{{item.status === 11 || item.status_text === '活动中' ? '已付款' : item.status_text}}</div>
              </div>
              <div class="list-item" v-for="(twoitem, twoindex) in item.goods" :key="index">
                <div class="item-left-img"><img class="img" :src="twoitem.image_url" alt=""></div>
                <div class="item-right">
                  <div class="title">{{twoitem.goods_name}}</div>
                  <div class="sub-title">规格：{{twoitem.goods_units}}</div>
                  <div class="price-box">
                    <div class="price-left">
                      <div class="number">{{twoitem.price}}</div>
                      <div class="icon">元</div>
                    </div>
                  </div>
                </div>
                <img v-if="imageUrl" :src="imageUrl+'/yx-image/cart/icon-pressed@2x.png'" alt="" class="item-arrow-img">
              </div>
              <div class="bot">
                <div class="time">{{item.created_at}}</div>
                <div class="payment"><span class="goods-count">实付:</span><span class="sum">45</span><span class="principal">元</span></div>
              </div>
              <div class="btn-box">
                <div class="btn-text">确认收货</div>
              </div>
            </div>
          </div>
          <div class="noting" v-if="list.data.length === 0 && !list.hasMore">
            <div class="notingimg"><img v-if="imageUrl" class="img" :src="imageUrl + '/yx-image/group/pic-kong@2x.png'" alt=""></div>
            <div class="txt">空空如也</div>
          </div>
        </div>
      </div>
    </div>
    <div class="after-model" v-if="false">
      <div class="model-box">
        <div class="model-title">请添加客服人员微信进行售后申请</div>
        <div class="model-img"></div>
        <div class="model-sub">保存到本地</div>
        <div class="model-copy mb-25">
          <div class="copy-number">客服微信号1：kefu111</div>
          <div class="copy-btn">复制</div>
        </div>
        <div class="model-copy">
          <div class="copy-number">客服微信号1：kefu111</div>
          <div class="copy-btn">复制</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import WePaint from '@components/we-paint/we-paint'
  import NavigationBar from '@components/navigation-bar/navigation-bar'
  import API from '@api'
  import {countDownHandle} from '@utils/common'

  const NAVLIST = [{id: 1, name: '全部订单', status: ''}, {id: 2, name: '待付款', status: 0}, {id: 3, name: '待发货', status: 1}, {id: 4, name: '配送中', status: 2}, {id: 4, name: '已完成', status: 2}]
  const GROUP_STATUS_ARR = [{name: '拼团中'}, {name: '拼团成功'}, {name: '拼团失败'}, {name: '拼团失败'}, {name: '拼团失败'}]
  const ORDER_LIST_ARR = [
    { page: 1, data: [], hasMore: true },
    { page: 1, data: [], hasMore: true },
    { page: 1, data: [], hasMore: true },
    { page: 1, data: [], hasMore: true }
  ]

  export default {
    components: {
      WePaint,
      NavigationBar
    },
    data() {
      return {
        navList: NAVLIST,
        groupStatusArr: GROUP_STATUS_ARR,
        orderListArr: ORDER_LIST_ARR,
        tabIdx: 0,
        status: '',
        orderPage: 1,
        orderMore: false
      }
    },
    onLoad(e) {
      console.log(e)
      this.status = e.id
      this.tabIdx = e.index
    },
    onShow() {
      this.getOrderList(this.tabIdx)
    },
    onUnload() {
      this.groupTimer && clearInterval(this.groupTimer)
    },
    onHide() {
      this.groupTimer && clearInterval(this.groupTimer)
    },
    onReachBottom() {
      this.getOrderList(this.tabIdx, true)
    },
    methods: {
      getStatusName(status) {
        return this.groupStatusArr[status] || '试试'
      },
      getStatus(tabIdx) {
        let status = ''
        switch (tabIdx * 1) {
          case 0:
            status = ''
            break
          case 1:
            status = 0
            break
          case 2:
            status = 1
            break
          case 3:
            status = 2
            break
        }
        return status
      },
      getOrderList(tabIdx, getMore = false) {
        let ol = this.orderListArr[tabIdx]
        // 加载更多就page+1，否则都重置当前tab的page和hasMore
        if (getMore) {
          if (!ol.hasMore) {
            return
          }
          ol.page += 1
        } else {
          ol.page = 1
          ol.hasMore = true
        }
        let status = this.getStatus(tabIdx)
        API.Order.getOrderListData(status, ol.page).then((res) => {
          if (res.error === this.$ERR_OK) {
            let hasCountdown = false
            for (let order of res.data) {
              if (order.groupon && order.groupon.surplus_seconds) {
                order.at_countdown = countDownHandle(order.groupon.surplus_seconds)
                hasCountdown = true
              }
            }
            if (getMore) {
              ol.data = ol.data.concat(res.data)
            } else {
              ol.data = res.data
            }
            hasCountdown && this._startTimer()
            if (ol.data.length >= res.meta.total * 1) {
              ol.hasMore = false
            }
          } else {
            this.$wechat.showToast(res.message)
          }
        })
      },
      _startTimer() {
        this.groupTimer && clearInterval(this.groupTimer)
        this.groupTimer = setInterval(() => {
          let clearT = true
          for (let item of this.orderListArr[this.tabIdx].data) {
            let surplusSeconds = item.groupon.surplus_seconds
            if (surplusSeconds && surplusSeconds !== 0) {
              surplusSeconds--
              item.at_countdown = countDownHandle(surplusSeconds)
              item.groupon.surplus_seconds = surplusSeconds
              clearT = false
            }
          }
          clearT && clearInterval(this.groupTimer)
        }, 1000)
      },
      selectIndex(item, index) {
        this.groupTimer && clearInterval(this.groupTimer)
        this.status = item.status
        this.tabIdx = index
        this.getOrderList(this.tabIdx)
      },
      jumpDetail(item) {
        wx.navigateTo({
          url: `${this.$routes.postage.ORDER_DETAIL}?id=${item.order_id}`
        })
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@designCommon"
  .wrap
    width: 100vw
    min-height: 100vh
    background: $color-background
    position: relative
  .nav-box
    width: 100vw
    height: 40px
    position: relative
    .line-box
      width: 100%
      height: 3px
      position: absolute
      bottom: 0
      .line
        box-sizing: border-box
        width: 20%
        transform: translate(0, 0)
        transition: all .3s
        height: 3px
        .lines
          width: 33%
          height: 3px
          margin: 0 auto
          border-radius: 1.5px
    .order-nav
      width: 100vw
      height: 40px
      border-bottom-1px($color-line)
      background: $color-white
      layout(row)
      position: relative
      justify-content: space-around
      align-items: center
      .nav-item
        width: 20%
        height: 40px
        transition: all .3s
        line-height: 40px
        text-align: center
        font-family: $font-family-regular
        font-size: $font-size-14
        color: $color-sub
      .nav-item-active
        font-family: $font-family-medium
        font-size: $font-size-16
  .order-list
    padding-bottom: 20px
    .order-item
      width: 100vw
      margin-top: 10px
      box-sizing: border-box
      background: $color-white
      .top
        height: 45px
        padding: 0 3.2vw
        layout(row)
        align-items: center
        justify-content: space-between
        border-bottom-1px($color-line)
        .group-name
          font-family: $font-family-regular
          font-size: $font-size-14
          color: $color-text-main
        .status
          font-family: $font-family-regular
          font-size: $font-size-14
      .center
        .goods-item
          height: 104.5px
          padding: 0 3.2vw
          layout(row)
          justify-content: space-between
          align-items: center
          border-bottom-1px($color-line)
          .goods-info
            layout(row)
            align-items: center
          .goods-img
            width: 20vw
            height: 20vw
          .arrlow
            width: 6px
            height: 10px
            .arr
              width: 100%
              height: 100%
              display: block
          .goods-info
            width: 53.34vw
            padding-left: 2.67vw
            .tit
              font-family: $font-family-medium
              font-size: $font-size-14
              color: $color-sub
              letter-spacing: 0.3px
            .guige
              font-family: $font-family-regular
              font-size: $font-size-14
              color: $color-text-sub
            .price
              font-family: $font-family-regular
              font-size: $font-size-11
              color: #1F1F1F
              .num
                font-family: $font-family-regular
                color: $color-sub
                font-size: $font-size-16
      .bot
        height: 45px
        padding: 0 3.2vw
        layout(row)
        align-items: center
        justify-content: space-between
        .time
          font-family: $font-family-regular
          font-size: $font-size-14
          color: #000000
        .payment
          color: #000000
          .goods-count
            font-family: $font-family-medium
            font-size: $font-size-14
            margin-right: 5px
          .sum
            font-family: $font-family-medium
            font-size: $font-size-18
          .principal
            font-family: $font-family-medium
            font-size: $font-size-12

      .btn-box
        padding: 5px 3.2vw 15px
        layout(row)
        justify-content: flex-end
        .btn-text
          font-family: $font-family-regular
          color: $color-main
          font-size: $font-size-12
          width: 70px
          height: 25px
          line-height: 25px
          text-align: center
          border-1px($color-main, 15px)
  .noting
    text-align: center
    margin-top: 106px
    .notingimg
      width: 116px
      height: 110px
      margin: 0 auto 15px
      .img
        display: block
        width: 100%
        height: 100%
    .txt
      font-family: $font-family-regular
      font-size: $font-size-14
      color: $color-text-sub
  .txt
    height: 100px
  .big-box
    width: 100vw
    overflow: hidden
    .order-big-box
      width: 400vw
      display: flex
      transform: translateX(0)
      transition: all 0.3s
      .order-item-list
        width: 100vw
        box-sizing: border-box
      .order-item-list-height70
        height: 70vh
  .list-item
    padding: 0 3.2vw
    box-sizing: border-box
    height: 28vw
    layout(row)
    align-items: center
    border-bottom-1px(#e6e6e6)
    .item-arrow-img
      position: absolute
      right: 3.2vw
      top: 0
      bottom: 0
      margin: auto
      margin-left: 5px
      display: block
      width: 7.5px
      height: 12.5px
    .item-left-img
      width: 20vw
      height: 20vw
      margin-right: 2.6vw
      img
        width: 100%
        height: 100%
        background: #fff
        border-radius: 2px
    .item-right
      flex: 1
      overflow: hidden
      .title
        font-size: $font-size-14
        color: $color-sub
        font-family: $font-family-regular
        line-height: 1
        margin-bottom: 7px
        min-height: 16px
        no-wrap()
      .sub-title
        font-size: $font-size-14
        color: $color-text-sub
        font-family: $font-family-regular
        line-height: 1
        margin-bottom: 23px
        min-height: $font-size-14
      .price-box
        layout(row)
        align-items: center
        justify-content: space-between
        .price-left
          layout(row)
          align-items: flex-end
          .number
            font-size: $font-size-16
            color: $color-text-main
            font-family: $font-family-regular
          .icon
            font-size: $font-size-11
            color: #1f1f1f
            font-family: $font-family-regular
            padding-bottom: 2px
        .price-right
          layout(row)
          align-items: flex-end
          .number
            font-size: $font-size-16
            color: $color-text-main
            font-family: $font-family-regular
          .icon
            font-size: $font-size-12
            color: #1f1f1f
            font-family: $font-family-regular
            padding-bottom: 2px

  /*售后弹框*/
  .after-model
    position: fixed
    width: 100vw
    height: 100vh
    left: 0
    right: 0
    top: 0
    bottom: 0
    background: rgba(17,17,17,.8)
    z-index: 100
    .model-box
      width: 290px
      height: 356px
      background: $color-white
      position: absolute
      left: 0
      right: 0
      top: 0
      bottom: 0
      margin: auto
      border-radius: 8px
      padding-top: 20px
      .model-title
        font-family: $font-family-regular
        font-size: $font-size-15
        color: $color-text-main
        text-align: center
        margin-bottom: 20px
      .model-img
        width: 150px
        height: @width
        display: block
        margin: auto
        background: $color-text-main
        margin-bottom: 16px
      .model-sub
        font-family: $font-family-regular
        font-size: $font-size-15
        color: $color-text-main
        text-align: center
        margin-bottom: 34px
      .model-copy
        layout(row)
        align-items: center
        justify-content: space-between
        box-sizing: border-box
        padding: 0 33px
        .copy-number
          font-family: $font-family-regular
          font-size: $font-size-15
          color: $color-text-main
        .copy-btn
          font-family: $font-family-regular
          font-size: $font-size-12
          color: $color-main
          border-1px($color-main, 20px)
          width: 54px
          height: 20px
          line-height: 20px
          text-align: center
  .mb-25
    margin-bottom: 25px
</style>
