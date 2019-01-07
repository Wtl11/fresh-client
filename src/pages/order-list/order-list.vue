<template>
  <div class="wrap">
    <navigation-bar title="我的订单" :showArrow="true" :translucent="false"></navigation-bar>
    <div class="nav-box">
      <div class="order-nav">
        <div class="nav-item" :class="tabIdx * 1 === index ? 'nav-item-active' : ''" v-for="(item, index) in navList" :key="index" @click="selectIndex(item, index)">{{item.name}}</div>
      </div>
      <div class="line-box">
        <div class="line" :style="'transform: translate(' + tabIdx*100 + '%,0)'"><div class="lines"></div></div>
      </div>
    </div>
    <div class="big-box">
      <div class="order-big-box" :style="{'transform': ' translateX('+ -(tabIdx * 100) +'vw)'}">
        <div class="order-item-list">
          <div class="order-list" v-if="list0.length > 0">
            <div class="order-item" v-for="(item, index) in list0" :key="index" @click="jumpDetail(item)">
              <div class="top">
                <div class="group-name">{{item.social_name}}</div>
                <div class="status">{{item.status_text}}</div>
              </div>
              <div class="center">
                <div class="goods-list">
                  <div class="goods-img-list">
                    <img v-for="(items, indx) in item.goods" :key="indx" v-if="indx < 4" class="goods-img" mode="aspectFill" :src="items.image_url" alt="">
                    <div class="img-item" v-if="item.goods.length > 4">
                      <div class="circle"></div>
                      <div class="circle"></div>
                      <div class="circle"></div>
                    </div>
                  </div>
                  <div class="arr-warp">
                    <div class="all-number">共{{item.goods.length}}件</div>
                    <div class="arrlow"><img v-if="imageUrl" :src="imageUrl+'/yx-image/cart/icon-pressed@2x.png'" alt="" class="arr"></div>
                  </div>
                </div>
              </div>
              <div class="bot">
                <div class="time">{{item.created_at}}</div>
                <div class="payment"><span class="actual">实付：</span><span class="sum">{{item.total}}</span><span class="principal">元</span></div>
              </div>
            </div>
          </div>
          <div class="noting" v-if="list0.length === 0 && more0">
            <div class="notingimg"><img class="img" :src="imageUrl + '/yx-image/group/pic-kong@2x.png'" alt=""></div>
            <div class="txt">空空如也</div>
          </div>
        </div>
        <div class="order-item-list">
          <div class="order-list" v-if="list1.length > 0">
            <div class="order-item" v-for="(item, index) in list1" :key="index" @click="jumpDetail(item)">
              <div class="top">
                <div class="group-name">{{item.social_name}}</div>
                <div class="status">{{item.status_text}}</div>
              </div>
              <div class="center">
                <div class="goods-list">
                  <div class="goods-img-list">
                    <img v-for="(items, indx) in item.goods" :key="indx" v-if="indx < 4" class="goods-img" mode="aspectFill" :src="items.image_url" alt="">
                    <div class="img-item" v-if="item.goods.length > 4">
                      <div class="circle"></div>
                      <div class="circle"></div>
                      <div class="circle"></div>
                    </div>
                  </div>
                  <div class="arr-warp">
                    <div class="all-number">共{{item.goods.length}}件</div>
                    <div class="arrlow"><img v-if="imageUrl" :src="imageUrl+'/yx-image/cart/icon-pressed@2x.png'" alt="" class="arr"></div>
                  </div>
                </div>
              </div>
              <div class="bot">
                <div class="time">{{item.created_at}}</div>
                <div class="payment"><span class="actual">实付：</span><span class="sum">{{item.total}}</span><span class="principal">元</span></div>
              </div>
            </div>
          </div>
          <div class="noting" v-if="list1.length === 0 && more1">
            <div class="notingimg"><img class="img" :src="imageUrl + '/yx-image/group/pic-kong@2x.png'" alt=""></div>
            <div class="txt">空空如也</div>
          </div>
        </div>
        <div class="order-item-list">
          <div class="order-list" v-if="list2.length > 0">
            <div class="order-item" v-for="(item, index) in list2" :key="index" @click="jumpDetail(item)">
              <div class="top">
                <div class="group-name">{{item.social_name}}</div>
                <div class="status">{{item.status_text}}</div>
              </div>
              <div class="center">
                <div class="goods-list">
                  <div class="goods-img-list">
                    <img v-for="(items, indx) in item.goods" :key="indx" v-if="indx < 4" class="goods-img" mode="aspectFill" :src="items.image_url" alt="">
                    <div class="img-item" v-if="item.goods.length > 4">
                      <div class="circle"></div>
                      <div class="circle"></div>
                      <div class="circle"></div>
                    </div>
                  </div>
                  <div class="arr-warp">
                    <div class="all-number">共{{item.goods.length}}件</div>
                    <div class="arrlow"><img v-if="imageUrl" :src="imageUrl+'/yx-image/cart/icon-pressed@2x.png'" alt="" class="arr"></div>
                  </div>
                </div>
              </div>
              <div class="bot">
                <div class="time">{{item.created_at}}</div>
                <div class="payment"><span class="actual">实付：</span><span class="sum">{{item.total}}</span><span class="principal">元</span></div>
              </div>
            </div>
          </div>
          <div class="noting" v-if="list2.length === 0 && more2">
            <div class="notingimg"><img class="img" :src="imageUrl + '/yx-image/group/pic-kong@2x.png'" alt=""></div>
            <div class="txt">空空如也</div>
          </div>
        </div>
        <div class="order-item-list">
          <div class="order-list" v-if="list3.length > 0">
            <div class="order-item" v-for="(item, index) in list3" :key="index" @click="jumpDetail(item)">
              <div class="top">
                <div class="group-name">{{item.social_name}}</div>
                <div class="status">{{item.status_text}}</div>
              </div>
              <div class="center">
                <div class="goods-list">
                  <div class="goods-img-list">
                    <img v-for="(items, indx) in item.goods" :key="indx" v-if="indx < 4" class="goods-img" mode="aspectFill" :src="items.image_url" alt="">
                    <div class="img-item" v-if="item.goods.length > 4">
                      <div class="circle"></div>
                      <div class="circle"></div>
                      <div class="circle"></div>
                    </div>
                  </div>
                  <div class="arr-warp">
                    <div class="all-number">共{{item.goods.length}}件</div>
                    <div class="arrlow"><img v-if="imageUrl" :src="imageUrl+'/yx-image/cart/icon-pressed@2x.png'" alt="" class="arr"></div>
                  </div>
                </div>
              </div>
              <div class="bot">
                <div class="time">{{item.created_at}}</div>
                <div class="payment"><span class="actual">实付：</span><span class="sum">{{item.total}}</span><span class="principal">元</span></div>
              </div>
            </div>
          </div>
          <div class="noting" v-if="list3.length === 0 && more3">
            <div class="notingimg"><img class="img" :src="imageUrl + '/yx-image/group/pic-kong@2x.png'" alt=""></div>
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

  const NAVLIST = [{id: 1, name: '全部', status: ''}, {id: 2, name: '待付款', status: 0}, {id: 3, name: '待提货', status: 1}, {id: 4, name: '已完成', status: 2}]

  export default {
    components: {
      WePaint,
      NavigationBar
    },
    data() {
      return {
        navList: NAVLIST,
        orderList: [],
        tabIdx: 0,
        status: '',
        orderPage: 1,
        orderMore: false,
        page0: 1,
        list0: [],
        more0: false,
        page1: 1,
        list1: [],
        more1: false,
        page2: 1,
        list2: [],
        more2: false,
        page3: 1,
        list3: [],
        more3: false
      }
    },
    onLoad(e) {
      this.status = e.id
      this.tabIdx = e.index
      // this.getOrderList()
    },
    onShow() {
      this.getOrderList(this.tabIdx)
    },
    onReachBottom() {
      this.getMoreOrderList(this.tabIdx)
    },
    methods: {
      getOrderList(tabIdx) {
        this['page' + tabIdx] = 1
        this['more' + tabIdx] = false
        console.log(this.page0, this.more0)
        let status
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
        API.Order.getOrderListData(status, this['page' + tabIdx]).then((res) => {
          if (res.error === this.$ERR_OK) {
            this['list' + tabIdx] = res.data
            this._isMoreList(tabIdx, res)
          } else {
            this.$wechat.showToast(res.message)
          }
        })
      },
      getMoreOrderList(tabIdx) {
        if (this['more' + tabIdx]) {
          return
        }
        let status
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
        API.Order.getOrderListData(status, this['page' + tabIdx]).then((res) => {
          if (res.error === this.$ERR_OK) {
            this['list' + tabIdx] = this['list' + tabIdx].concat(res.data)
            this._isMoreList(tabIdx, res)
          } else {
            this.$wechat.showToast(res.message)
          }
        })
      },
      _isMoreList(tabIdx, res) {
        this['page' + tabIdx]++
        if (this['list' + tabIdx].length >= res.meta.total * 1) {
          this['more' + tabIdx] = true
        }
      },
      selectIndex(item, index) {
        this.status = item.status
        this.tabIdx = index
        this.getOrderList(this.tabIdx)
      },
      jumpDetail(item) {
        wx.navigateTo({
          url: `/pages/order-detail?id=${item.order_id}&&type=0`
        })
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"
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
          background: $color-main
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
          color: $color-money
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
        border-bottom-1px($color-line)
        .goods-list
          layout(row)
          align-items: center
          justify-content: space-between
          padding: 15px 3.2vw
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
        .arr-warp
          layout(row)
          align-items: center
          .all-number
            font-family: $font-family-regular
            font-size: $font-size-12
            color: $color-text-sub
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
          font-size: $font-size-14
          color: #000000
        .payment
          .actual
            font-family: $font-family-medium
            font-size: $font-size-14
            color: #000000
          .sum
            font-family: $font-family-medium
            font-size: $font-size-18
            color: #000000
          .principal
            font-family: $font-family-medium
            font-size: $font-size-12
            color: #000000

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
</style>
