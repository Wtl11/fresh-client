<template>
  <div class="after-sale-management">
    <navigation-bar title="消费者订单"></navigation-bar>
    <div class="after-header"></div>
    <div class="after-header" :style="{position:'fixed', top: statusBarHeight + 44 + 'px',zIndex: 50, left:0, right: 0}">
      <!--<div class="after-search">-->
        <!--<img :src="imageUrl + '/yx-image/group/icon-search@2x.png'" v-if="imageUrl" class="search-icon">-->
        <!--<input type="text" class="search" placeholder="提供单号，手机号，微信昵称，搜索" placeholder-class="search-pal" v-model="keyword" @input="_search"/>-->
      <!--</div>-->
      <section class="search-wrapper">
        <div class="input-wrapper">
          <img class="search-img" mode="aspectFit" v-if="imageUrl" :src="imageUrl+'/yx-image/2.3/icon-search@2x.png'">
          <input
            type="text"
            placeholder="提供单号，手机号，微信昵称"
            placeholder-class="input-p"
            :focus="false"
            confirm-type="search"
            @focus="handleFocus"
            @blur="handleBlur"
            @confirm="_search"
            v-model="keyword"
          >
          <figure v-if="showClearGoodsNameBtn" class="close" @click="handleClearGoodsName">
            <img class="close-img" mode="aspectFit" v-if="imageUrl" :src="imageUrl+'/yx-image/2.3/icon-delsr@2x.png'">
          </figure>
        </div>
        <div class="btn" @click.stop="_search()">搜索</div>
      </section>
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
        <div class="order-box" :style="{'min-height': scrollHeight + 'px'}" :class="navIndex === 0 ? '' : 'order-box-hideen'">
          <navigator :url="$routes.leader.GROUP_ORDER_DETAIL + '?id=' + order.order_id" :hover-stop-propagation="true" hover-class="none" class="order-item" v-for="(order, idx) in todayList" :key="idx">
            <div class="order-header">
              <div class="order-num">{{order.code}}</div>
              <div class="name">{{order.address.nickname}}</div>
              <div class="phone">{{order.address.mobile}}</div>
              <div v-if="order.is_new_customer" class="new-tips">新客</div>
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
          <div class="end" v-if="pageObj.todayNull">— 没有订单了—</div>
          <div class="noting" v-if="pageObj.todayNone">
            <div class="noting-img"><img class="img" :src="imageUrl + '/yx-image/group/pic-kong@2x.png'"></div>
            <div class="txt">空空如也</div>
          </div>
        </div>
        <!--</scroll-view>-->
        <!--<scroll-view class="order-box" :style="{'height': scrollHeight + 'px'}" scroll-y @scrolltolower="_getMoreList">-->
        <div class="order-box" :style="{'min-height': scrollHeight + 'px'}" :class="navIndex === 1 ? '' : 'order-box-hideen'">
          <navigator :url="$routes.leader.GROUP_ORDER_DETAIL + '?id=' + order.order_id" :hover-stop-propagation="true" hover-class="none" class="order-item" v-for="(order, idx) in yesterdayList" :key="idx">
            <div class="order-header">
              <div class="order-num">{{order.code}}</div>
              <div class="name">{{order.address.nickname}}</div>
              <div class="phone">{{order.address.mobile}}</div>
              <div v-if="order.is_new_customer" class="new-tips">新客</div>
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
          <div class="end" v-if="pageObj.yesterdayNull">— 没有订单了—</div>
          <div class="noting" v-if="pageObj.yesterdayNone">
            <div class="noting-img"><img class="img" :src="imageUrl + '/yx-image/group/pic-kong@2x.png'"></div>
            <div class="txt">空空如也</div>
          </div>
        </div>
        <!--</scroll-view>-->
        <!--<scroll-view class="order-box" :style="{'height': scrollHeight + 'px'}" scroll-y @scrolltolower="_getMoreList">-->
        <div class="order-box" :style="{'min-height': scrollHeight + 'px'}" :class="navIndex === 2 ? '' : 'order-box-hideen'">
          <navigator :url="$routes.leader.GROUP_ORDER_DETAIL + '?id=' + order.order_id" :hover-stop-propagation="true" hover-class="none" class="order-item" v-for="(order, idx) in list" :key="idx">
            <div class="order-header">
              <div class="order-num">{{order.code}}</div>
              <div class="name">{{order.address.nickname}}</div>
              <div class="phone">{{order.address.mobile}}</div>
              <div v-if="order.is_new_customer" class="new-tips">新客</div>
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
          <div class="end" v-if="pageObj.Null">— 没有订单了—</div>
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
        pageObj: {todayPage: 1, yesterdayPage: 1, Page: 1, todayAllPage: 1, yesterdayAllPage: 1, AllPage: 1, todayNone: false, yesterdayNone: false, None: false, todayNull: false, yesterdayNull: false, Null: false},
        scrollHeight: 0,
        todayList: [],
        yesterdayList: [],
        list: [],
        statusBarHeight: 0
      }
    },
    computed: {
      showClearGoodsNameBtn() {
        return this.keyword
      }
      // todayNull() {
      //   let status = this.todayList && this.todayList.length && (this.todayList.length < 10 || this.pageObj.todayPage === this.pageObj.todayAllPage)
      //   return status
      // },
      // yesterdayNull() {
      //   let status = this.yesterdayList && this.yesterdayList.length && (this.yesterdayList.length < 10 || this.pageObj.yesterdayPage === this.pageObj.yesterdayAllPage)
      //   return status
      // },
      // allNull() {
      //   let status = this.list && this.list.length && (this.list.length < 10 || this.pageObj.Page === this.pageObj.AllPage)
      //   return status
      // }
    },
    async onPullDownRefresh() {
      this.pageObj[this.nav[this.navIndex].status + 'Page'] = 1
      await this._setList()
      wx.stopPullDownRefresh() // 停止下拉刷新
    },
    async onReachBottom() {
      if (this.pageObj[this.nav[this.navIndex].status + 'Null']) return
      console.log(this.pageObj[this.nav[this.navIndex].status + 'Page'])
      this.pageObj[this.nav[this.navIndex].status + 'Page']++
      await this._setList()
    },
    onReady() {
      let res = this.$wx.getSystemInfoSync()
      this.statusBarHeight = res.statusBarHeight || 20
      this.width = res.screenWidth
      this.scrollHeight = res.screenHeight - 145 - res.statusBarHeight
    },
    async onShow() {
      // let data = this.$wx.getSystemInfoSync()
      // this.$wx.getSystemInfo({
      //   success: (res) => {
      //     this.width = res.screenWidth
      //     this.scrollHeight = res.screenHeight - 145 - data.statusBarHeight
      //   }
      // })
      await this._setList(1, 'today', true)
    },
    methods: {
      handleClearGoodsName() {
        this.keyword = ''
        // this.autoFocus = true
      },
      // 搜索
      async _search() {
        this.pageObj[this.nav[this.navIndex].status + 'Page'] = 1
        await this._setList()
      },
      async _getMoreList() {
        this.pageObj[this.nav[this.navIndex].status + 'Page']++
        await this._setList()
      },
      async _setNav(index, item) {
        if (this.navIndex === index && this.keyword.length === 0) return
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
        if (res.meta && res.meta.last_page) {
          this.pageObj[time + 'AllPage'] = res.meta.last_page
        }
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
        this.pageObj[this.nav[this.navIndex].status + 'None'] = !this.consumerOrder[this.navIndex].length
        this.pageObj[this.nav[this.navIndex].status + 'Null'] = this.pageObj[time + 'AllPage'] === this.pageObj[time + 'Page'] && !this.pageObj[this.nav[this.navIndex].status + 'None']
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
    background: $color-background
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
    overflow-x: hidden
    .order-big-box
      width: 300vw
      display: flex
      transform: translateX(0)
      transition: all 0.3s
    .order-box
      background: $color-background
      box-sizing: border-box
      width: 100vw
    .order-box-hideen
      overflow: hidden
      height: 70vh

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
        margin: 0 6px
        font-size: $font-size-14
        color: $color-text-main
        font-family: $font-family-medium
      .new-tips
        box-sizing: border-box
        height: 16px
        line-height: 1
        padding: 3px 5px
        background: rgba(115,194,0,0.10)
        border-1px($color-main,8px)
        border-radius: 8px
        font-size: $font-size-10
        color: $color-main
        font-family: $font-family-regular
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
  .search-wrapper
    font-family :$font-family-regular
    padding :0 12px
    layout(block, block, nowrap)
    align-items :center
    z-index :50
    .input-wrapper
      flex: 1
      height :32px
      display :flex
      align-items :center
      background :#F0F0F0
      padding : 0 13px 0 15px
      border-radius :@height
      position :relative
      .close
        position :absolute
        right :0
        height :32px
        width :@height
        display :flex
        align-items :center
        justify-content :flex-end
        .close-img
          width :13px
          height @width
          padding-right :13px
      .search-img
        width :14px
        height :13.5px
      input
        flex: 1
        height :20px
        padding : 0 15px 0 8px
        font-size :15px
        line-height :@height
    .btn
      font-size :15px
      padding-left :14px

</style>
