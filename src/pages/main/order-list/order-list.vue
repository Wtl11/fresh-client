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
    <div class="order-title" @click="jumpPostage">
      <div class="order-title-left">
        <img v-if="imageUrl" :src="imageUrl+'/yx-image/postage/icon-baoyou_shopping@2x.png'" alt="" class="order-title-icon">
        <div class="order-title-name">全国包邮</div>
      </div>
      <div class="order-title-right">
        <div class="right-name">查看订单</div>
        <img v-if="imageUrl" :src="imageUrl+'/yx-image/2.3/icon-pressed@2x.png'" alt="" class="right-icon">
      </div>
    </div>
    <div class="big-box">
      <div class="order-big-box" :style="{'transform': ' translateX('+ -(tabIdx * 100) +'vw)'}">
        <div v-for="(list, index) in orderListArr" :key="index" class="order-item-list" :class="tabIdx * 1 === index ? '' : 'order-item-list-height70'">
          <div class="order-list" v-if="list.data.length > 0">
            <div v-for="(item, itemIndex) in list.data" :key="itemIndex" @click="jumpDetail(item)" class="order-item">
              <div class="top">
                <div class="group-name">{{item.social_name}}</div>
                <div class="status" :class="'corp-' + corpName + '-money'">{{item.status === 11 || item.status_text === '活动中' ? '已付款' : item.status_text}}</div>
              </div>
              <div class="center">
                <p v-if="item.groupon && item.groupon.pay_status !== 0 && item.groupon.groupon_status_str" class="group-status">
                  <img v-if="imageUrl" :src="imageUrl+'/yx-image/2.4/icon-spellgroup@2x.png'" alt="" class="group-icon">
                  <span :class="'corp-' + corpName + '-money'">[{{item.groupon.groupon_status_str}}]</span>
                  <template v-if="item.groupon.groupon_status === 0 && item.groupon.surplus_seconds && item.at_countdown">
                    只差
                    <span :class="'corp-' + corpName + '-money'">{{item.groupon.surplus_number}}人</span>成团，剩
                    <span :class="'corp-' + corpName + '-money'">{{item.at_countdown.hour}}:{{item.at_countdown.minute}}:{{item.at_countdown.second}}</span>结束
                  </template>
                </p>
                <div class="goods-list">
                  <template v-if="item.goods.length === 1">
                    <div class="goods-img-list">
                      <img class="goods-img" mode="aspectFill" :src="item.goods[0].image_url" alt="">
                    </div>
                    <div class="goods-name">{{item.goods[0].goods_name}}</div>
                  </template>
                  <div v-else class="goods-img-list">
                    <img v-for="(img, imgIndex) in item.goods" :key="imgIndex" v-if="imgIndex < 4" class="goods-img" mode="aspectFill" :src="img.image_url" alt="">
                    <div class="img-item" v-if="item.goods.length > 4">
                      <div class="circle"></div>
                      <div class="circle"></div>
                      <div class="circle"></div>
                    </div>
                  </div>
                  <div class="arr-warp">
                    <div class="arrlow"><img v-if="imageUrl" :src="imageUrl+'/yx-image/cart/icon-pressed@2x.png'" alt="" class="arr"></div>
                  </div>
                </div>
              </div>
              <div class="bot">
                <div class="time">{{item.created_at}}</div>
                <div class="payment"><span class="goods-count">共{{item.goods.length}}件商品</span><span class="actual">总计：</span><span class="sum">{{item.total}}</span><span class="principal">元</span></div>
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
  </div>

</template>

<script type="text/ecmascript-6">
  import WePaint from '@components/we-paint/we-paint'
  import NavigationBar from '@components/navigation-bar/navigation-bar'
  import API from '@api'
  import {countDownHandle} from '@utils/common'

  const NAVLIST = [{id: 1, name: '全部订单', status: ''}, {id: 2, name: '待付款', status: 0}, {id: 3, name: '待提货', status: 1}, {id: 4, name: '已完成', status: 2}]
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
          url: `${this.$routes.main.ORDER_DETAIL}?id=${item.order_id}`
        })
      },
      jumpPostage(item) {
        wx.navigateTo({
          url: `${this.$routes.postage.ORDER_LIST}?id=&index=0`
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
        width: 25%
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
        width: 25%
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
      .center
        padding: 15px 3.2vw
        border-bottom-1px($color-line)
        .group-status
          margin-bottom : 8px
          height: 22px
          font-size: $font-size-14
          font-family: $font-family-regular
          layout(row)
          align-items :center

          .group-icon
            width: 15px
            height: @width
            margin-right :4px
        .goods-list
          layout(row)
          align-items: center
          justify-content: space-between

          .goods-img-list
            layout(row)
            align-items: center
            .goods-img
              width: 13.33vw
              height: 13.33vw
              border-radius: 2px
              margin-right: 2.67vw
            .img-item
              width: 13.33vw
              height: 13.33vw
              layout(row)
              justify-content: center
              align-items: center
              .circle
                width: 6px
                height: 6px
                background: #D8D8D8
                border-radius: 50%
                &:nth-child(2)
                  margin: 0 5px
        .goods-name
          flex: 1
          text-align: left
          font-family: $font-family-medium
          color: $color-text-main
          font-size: $font-size-14
          no-wrap-plus(2)
        .arr-warp
          layout(row)
          align-items: center
          .arrlow
            width: 7.5px
            height: 12.5px
            margin-left: 6px
            .arr
              display: block
              width: 100%
              height: 100%

      .bot
        height: 45px
        padding: 0 3.2vw
        layout(row)
        align-items: center
        justify-content: space-between
        .time
          font-family: $font-family-regular
          font-size: $font-size-13
          color: $color-text-sub
        .payment
          color: #000000
          .goods-count
            font-family: $font-family-regular
            font-size: $font-size-13
            margin-right: 5px
          .actual
            font-family: $font-family-medium
            font-size: $font-size-14
          .sum
            font-family: $font-family-medium
            font-size: $font-size-15
          .principal
            font-family: $font-family-medium
            font-size: $font-size-12

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

  .order-title
    layout(row)
    align-items: center
    justify-content: space-between
    height: 45px
    background: $color-white
    margin-top: 10px
    padding: 0 12px
    box-sizing: border-box
    .order-title-left
      layout(row)
      align-items: center
      .order-title-icon
        width: 15px
        height: 15px
        display: block
        margin-right: 5px
      .order-title-name
        font-size: $font-size-14
        font-family: $font-family-medium
        color: #111
    .order-title-right
      layout(row)
      align-items: center
      .right-icon
        width: 7.5px
        height: 12.5px
        display: block
      .right-name
        font-size: $font-size-14
        font-family: $font-family-regular
        color: #666
        margin-right: 5px
</style>
