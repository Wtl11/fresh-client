<template>
  <div class="after-sale-management">
    <navigation-bar title="消费者订单"></navigation-bar>
    <div class="after-header">
      <div class="after-search">
        <img :src="imageUrl + '/yx-image/group/icon-search@2x.png'" v-if="imageUrl" class="search-icon">
        <input type="text" class="search" placeholder="提供单号，手机号，微信昵称，搜索" placeholder-class="search-pal" v-model="keyword" @input="_search"/>
      </div>
      <div class="rag-goods-tab">
        <span :class="[navIndex === index ? 'rag-goods-tab-item-active' : '',navIndex === index ? 'corp-' + corpName + '-bg' : '', 'corp-' + corpName + '-tab']" class="rag-goods-tab-item" v-for="(item, index) in nav" :key="index" @click="_setNav(index, item)">
          {{item.title}}
        </span>
      </div>
    </div>
    <div class="big-box">
      <div class="order-big-box" :style="{'transform': ' translateX('+ -(navIndex * width) +'px)', width: width * nav.length + 'px'}">
        <!--今日订单-->
        <!--<scroll-view class="order-box" :style="{'height': scrollHeight + 'px'}" scroll-y @scrolltolower="_getMoreList">-->
        <div class="order-box">
          <navigator :url="$routes.leader.GROUP_ORDER_DETAIL + '?id=' + order.order_id" :hover-stop-propagation="true" hover-class="none" class="order-item" v-for="(order, idx) in todayList" :key="idx">
            <div class="order-header">
              <div class="order-num">{{order.code}}</div>
              <div class="name">{{order.address.nickname}}</div>
              <div class="phone">{{order.address.mobile}}</div>
              <div class="order-status" :class="'corp-' + corpName + '-money'">{{order.status_text}}</div>
            </div>
            <div class="goods-more">
              <div class="goods-box">
                <img v-for="(img, imgIdx) in order.goods" :src="img.image_url" :key="imgIdx" v-if="imgIdx < 4" class="goods-img" mode="aspectFill">
              </div>
              <div class="num-box">
                <div class="num-text">共{{order.goods.length}}件</div>
                <img :src="imageUrl + '/yx-image/group/icon-pressed@2x.png'" v-if="imageUrl" class="way">
              </div>
            </div>
            <div class="order-footer">
              <div class="time">下单时间：{{order.created_at}}</div>
              <div class="money">实付:<span class="price">{{order.total}}</span><span class="small">元</span></div>
              <!--item.btn_text格式化功能按钮-->
            </div>
          </navigator>
          <!--<order-item :orderList="todayList"></order-item>-->
          <div class="end" v-if="todayNull">— 没有订单了—</div>
          <div class="noting" v-if="pageObj.todayNone">
            <div class="noting-img"><img class="img" :src="imageUrl + '/yx-image/group/pic-kong@2x.png'"></div>
            <div class="txt">空空如也</div>
          </div>
        </div>
        <!--</scroll-view>-->
        <!--<scroll-view class="order-box" :style="{'height': scrollHeight + 'px'}" scroll-y @scrolltolower="_getMoreList">-->
        <div class="order-box">
          <navigator :url="$routes.leader.GROUP_ORDER_DETAIL + '?id=' + order.order_id" :hover-stop-propagation="true" hover-class="none" class="order-item" v-for="(order, idx) in yesterdayList" :key="idx">
            <div class="order-header">
              <div class="order-num">{{order.code}}</div>
              <div class="name">{{order.address.nickname}}</div>
              <div class="phone">{{order.address.mobile}}</div>
              <div class="order-status" :class="'corp-' + corpName + '-money'">{{order.status_text}}</div>
            </div>
            <div class="goods-more">
              <div class="goods-box">
                <img v-for="(img, imgIdx) in order.goods" :src="img.image_url" :key="imgIdx" v-if="imgIdx <= 4" class="goods-img" mode="aspectFill">
                <img :src="imageUrl + '/yx-image/group/pic-order_more@2x.png'" v-if="imgIdx > 4" class="goods-img" mode="aspectFill">
              </div>
              <div class="num-box">
                <div class="num-text">共{{order.goods.length}}件</div>
                <img :src="imageUrl + '/yx-image/group/icon-pressed@2x.png'" v-if="imageUrl" class="way">
              </div>
            </div>
            <div class="order-footer">
              <div class="time">下单时间：{{order.created_at}}</div>
              <div class="money">实付:<span class="price">{{order.total}}</span><span class="small">元</span></div>
              <!--item.btn_text格式化功能按钮-->
            </div>
          </navigator>
          <!--<order-item :orderList="todayList"></order-item>-->
          <div class="end" v-if="yesterdayNull">— 没有订单了—</div>
          <div class="noting" v-if="pageObj.yesterdayNone">
            <div class="noting-img"><img class="img" :src="imageUrl + '/yx-image/group/pic-kong@2x.png'"></div>
            <div class="txt">空空如也</div>
          </div>
        </div>
        <!--</scroll-view>-->
        <!--<scroll-view class="order-box" :style="{'height': scrollHeight + 'px'}" scroll-y @scrolltolower="_getMoreList">-->
        <div class="order-box">
          <navigator :url="$routes.leader.GROUP_ORDER_DETAIL + '?id=' + order.order_id" :hover-stop-propagation="true" hover-class="none" class="order-item" v-for="(order, idx) in list" :key="idx">
            <div class="order-header">
              <div class="order-num">{{order.code}}</div>
              <div class="name">{{order.address.nickname}}</div>
              <div class="phone">{{order.address.mobile}}</div>
              <div class="order-status" :class="'corp-' + corpName + '-money'">{{order.status_text}}</div>
            </div>
            <div class="goods-more">
              <div class="goods-box">
                <img v-for="(img, imgIdx) in order.goods" :src="img.image_url" :key="imgIdx" v-if="imgIdx < 4" class="goods-img" mode="aspectFill">
              </div>
              <div class="num-box">
                <div class="num-text">共{{order.goods.length}}件</div>
                <img :src="imageUrl + '/yx-image/group/icon-pressed@2x.png'" v-if="imageUrl" class="way">
              </div>
            </div>
            <div class="order-footer">
              <div class="time">下单时间：{{order.created_at}}</div>
              <div class="money">实付:<span class="price">{{order.total}}</span><span class="small">元</span></div>
              <!--item.btn_text格式化功能按钮-->
            </div>
          </navigator>
          <!--<order-item :orderList="todayList"></order-item>-->
          <div class="end" v-if="allNull">— 没有订单了—</div>
          <div class="noting" v-if="pageObj.None">
            <div class="noting-img"><img class="img" :src="imageUrl + '/yx-image/group/pic-kong@2x.png'"></div>
            <div class="txt">空空如也</div>
          </div>
        </div>
        <!--</scroll-view>-->
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import NavigationBar from '@components/navigation-bar/navigation-bar'
  import API from '@api'

  const Nav = [{title: '今日订单', status: 'today'}, {title: '昨日订单', status: 'yesterday'}, {title: '全部订单', status: ''}]
  const PAGE_NAME = 'AFTER_SALE_MANAGEMENT'

  export default {
    name: PAGE_NAME,
    data() {
      return {
        nav: Nav,
        navIndex: 0,
        width: 0,
        consumerOrder: [[], [], []],
        keyword: '',
        pageObj: {todayPage: 1, yesterdayPage: 1, Page: 1, todayAllPage: 1, yesterdayAllPage: 1, AllPage: 1, todayNone: false, yesterdayNone: false, None: false},
        scrollHeight: 0,
        todayList: [],
        yesterdayList: [],
        list: []
      }
    },
    computed: {
      todayNull() {
        let status = this.todayList && this.todayList.length && (this.todayList.length < 10 || this.pageObj.todayPage === this.pageObj.todayAllPage)
        return status
      },
      yesterdayNull() {
        let status = this.yesterdayList && this.yesterdayList.length && (this.yesterdayList.length < 10 || this.pageObj.yesterdayPage === this.pageObj.yesterdayAllPage)
        return status
      },
      allNull() {
        let status = this.list && this.list.length && (this.list.length < 10 || this.pageObj.Page === this.pageObj.AllPage)
        return status
      }
    },
    async onPullDownRefresh() {
      this.pageObj[this.nav[this.navIndex].status + 'Page'] = 1
      await this._setList()
      wx.stopPullDownRefresh() // 停止下拉刷新
    },
    async onShow() {
      let data = this.$wx.getSystemInfoSync()
      this.$wx.getSystemInfo({
        success: (res) => {
          this.width = res.screenWidth
          this.scrollHeight = res.screenHeight - 151 - data.statusBarHeight
        }
      })
      await this._setList(1, 'today', true)
    },
    methods: {
      async _search() {
        this.pageObj[this.nav[this.navIndex].status + 'Page'] = 1
        await this._setList()
      },
      async _getMoreList() {
        this.pageObj[this.nav[this.navIndex].status + 'Page']++
        await this._setList()
      },
      async _setNav(index, item) {
        if (this.navIndex === index && this.keyword.length === 0) {
          return
        }
        console.log(222)
        this.navIndex = index
        this.keyword = ''
        this.pageObj[this.nav[this.navIndex].status + 'Page'] = 1
        await this._setList()
      },
      async _getConsumerOrder(page, time = 'today', loading = false) {
        let res = await API.Leader.consumerOrder({keyword: this.keyword, page, time}, loading)
        this.$wechat.hideLoading()
        if (res.error !== this.$ERR_OK) {
          return false
        }
        this.pageObj[time + 'AllPage'] = res.meta.last_page
        return res.data
      },
      async _setList() {
        let time = this.nav[this.navIndex].status
        let page = this.pageObj[this.nav[this.navIndex].status + 'Page']
        console.log(time, `${this.nav[this.navIndex].status}`, 'this.nav[this.navIndex].status')
        console.log(page, 'this.pageObj[this.nav[this.navIndex].statusPage')
        if (this.pageObj[this.nav[this.navIndex].status + 'AllPage'] < this.pageObj[this.nav[this.navIndex].status + 'Page']) {
          return
        }
        let arr = await this._getConsumerOrder(page, time)
        if (!arr) {
          return
        }
        if (page === 1) {
          this.consumerOrder[this.navIndex] = arr
        } else {
          this.consumerOrder[this.navIndex] = this.consumerOrder[this.navIndex].concat(arr)
        }
        console.log(arr, 'arr')
        this.pageObj[this.nav[this.navIndex].status + 'None'] = !this.consumerOrder[this.navIndex].length
        this.todayList = this.consumerOrder[0]
        this.yesterdayList = this.consumerOrder[1]
        this.list = this.consumerOrder[2]
      }
    },
    components: {
      NavigationBar
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
 @import "~@designCommon"

  .after-sale-management
    height: 100vh
    box-sizing: border-box
    /*overflow: hidden*/
    background: $color-white
    width: 100vw

  .after-header
    padding: 15px 0 12px
    box-sizing: border-box
    margin-bottom: 10px
    height: 107px
    background: $color-white
    .after-search
      background: #F4F4F4
      height: 35px
      display: flex
      align-items: center
      width: 92vw
      margin: 0 auto
      padding: 0 12px
      box-sizing: border-box
      .search-icon
        height: 16.5px
        width: 15px
      .search
        height: 100%
        margin-left: 10px
        font-size: $font-size-14
        font-family: $font-family-regular
        flex: 1
      .search-pal
        font-family: $font-family-regular
        color: $color-text-assist
    .rag-goods-tab
      width: 264px
      margin: 12px auto 0
      display: flex
      overflow: hidden
      margin-bottom: 11.5px
      .rag-goods-tab-item
        width: 88px
        font-size: $font-size-14
        font-family: $font-family-medium
        text-align: center
        line-height: 31px
        height: 33px
        transition: all 0.4s
        box-sizing: border-box
        &:first-child
          border-right: none
          border-radius: 50px 0 0 50px
        &:last-child
          border-left: none
          border-radius: 0 50px 50px 0
      .rag-goods-tab-item-active
        transform-origin: 50%
        color: $color-white

  .big-box
    width: 100vw
    /*overflow: hidden*/
    .order-big-box
      width: 300vw
      display: flex
      transform: translateX(0)
      transition: all 0.3s
    .order-box
      background: $color-background
      box-sizing: border-box
      width: 100vw

  .order-item
    margin-bottom: 12px
    background: $color-white
    width: 100%
    .order-header
      box-sizing: border-box
      padding: 0 12px
      display: flex
      align-items: center
      height: 45px
      border-bottom-1px($color-line)
      .order-num
        background: #9F9F9F
        font-size: $font-size-14
        color: $color-white
        font-family: $font-family-medium
        text-align: center
        line-height: 22px
        border-radius: 11px
        min-width: 22px
        height: 22px
      .name
        line-height: 1.2
        no-wrap()
        margin-left: 7px
        font-size: $font-size-14
        color: $color-text-main
        font-family: $font-family-medium
        max-width: 70px
      .phone
        margin-left: 6px
        font-size: $font-size-14
        color: $color-text-main
        font-family: $font-family-medium
      .order-status
        col-center()
        right: 12px
        font-size: $font-size-14
        font-family: $font-family-medium
    .order-footer
      border-top-1px($color-line)
      margin-top: 12px
      display: flex
      box-sizing: border-box
      padding: 0 12px
      font-size: $font-size-14
      font-family: $font-family-regular
      height: 55px
      align-items: center
      justify-content: space-between
      .time
        color: $color-text-sub
      .money
        line-height: 1
        font-size: $font-size-14
        color: $color-text-assist
        .price
          font-size: $font-size-17
          margin-left: 4.5px
          margin-right: 2px
        .small
          font-size: $font-size-12
    .goods-more
      display: flex
      justify-content: space-between
      padding: 0 12px
      box-sizing: border-box
      height: 79.5px
      align-items: center
      .goods-box
        display: flex
        .goods-img
          width: 13.3vw
          height: @width
          margin-right: 10px
          display: block
      .num-box
        display: flex
        line-height: 1
        font-size: $font-size-12
        color: $color-text-assist
        .way
          margin-left: 4.5px
          display: block
          width: 7.5px
          height: 12.5px

  .noting
    text-align: center
    padding-top: 106px
    .noting-img
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


</style>
