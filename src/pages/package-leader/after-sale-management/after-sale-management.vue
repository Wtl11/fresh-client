<template>
  <div class="after-sale-management">
    <navigation-bar title="售后管理"></navigation-bar>
    <div class="after-header">
      <div class="after-search">
        <img :src="imageUrl + '/yx-image/group/icon-search@2x.png'" v-if="imageUrl" class="search-icon">
        <input type="text" class="search" placeholder="提供单号，手机号，微信昵称，搜索" :placeholder-style="'color: #B7B7B7,font-family:PingFangSC-Regular'" v-model="keyword" @input="_search"/>
      </div>
      <div class="rag-goods-tab">
        <span :class="[navIndex === index ? 'rag-goods-tab-item-active' : '',navIndex === index ? 'corp-' + corpName + '-bg' : '', 'corp-' + corpName + '-tab']" class="rag-goods-tab-item" v-for="(item, index) in nav" :key="index" @click="_setNav(index, item)">
          {{item.title}}
        </span>
      </div>
    </div>
    <div class="big-box">
      <div class="order-big-box" :style="{'transform': ' translateX('+ -(navIndex * width) +'px)','height': scrollHeight + 'px'}">
        <!--售后申请-->
        <scroll-view class="order-box" :style="{'height': scrollHeight + 'px'}" scroll-y @scrolltolower="_getMoreList">
          <div class="line"></div>
          <order-item :orderList="afterList" :isShowExamine="false" @dealOrder="applicationAfter"></order-item>
          <div class="end" v-if="showAfterEnd">— 没有订单了—</div>
          <div class="noting" v-if="afterNull">
            <div class="notingimg"><img class="img" :src="imageUrl + '/yx-image/group/pic-kong@2x.png'" alt=""></div>
            <div class="txt">空空如也</div>
          </div>
        </scroll-view>
        <!--申请记录-->
        <scroll-view class="order-box" :style="{'height': scrollHeight + 'px'}" scroll-y @scrolltolower="_getMoreList">
          <div class="line"></div>
          <order-item :orderList="applicationRecord" @dealOrder="_cancelApplication"></order-item>
          <div class="end" v-if="showRecode">— 没有订单了—</div>
          <div class="noting" v-if="recordNull">
            <div class="notingimg"><img class="img" :src="imageUrl + '/yx-image/group/pic-kong@2x.png'"></div>
            <div class="txt">空空如也</div>
          </div>
        </scroll-view>
      </div>
    </div>
    <dialog-model ref="dialog" @confirm="confirm"></dialog-model>
  </div>
</template>

<script type="text/ecmascript-6">
  import NavigationBar from '@components/navigation-bar/navigation-bar'
  import OrderItem from '@components/order-item/order-item'
  import DialogModel from '@components/dialog-model/dialog-model'
  import API from '@api'

  const Nav = [{title: '售后申请', status: 2}, {title: '申请记录', status: 3}]
  const PAGE_NAME = 'AFTER_SALE_MANAGEMENT'

  export default {
    name: PAGE_NAME,
    components: {
      NavigationBar,
      OrderItem,
      DialogModel
    },
    data() {
      return {
        nav: Nav,
        navIndex: 0,
        width: 0,
        afterList: [],
        page: 1,
        keyword: '',
        afterTotalPage: 1,
        applicationRecord: [],
        recordPage: 1,
        recordKeyword: '',
        recordTotalPage: 1,
        scrollHeight: 0,
        cancelItem: {},
        cancelIdx: 0,
        afterItem: {},
        afterIdx: 0,
        afterNull: false,
        recordNull: false
      }
    },
    async onLoad() {
      let data = this.$wx.getSystemInfoSync()
      this.$wx.getSystemInfo({
        success: (res) => {
          this.width = res.screenWidth
          this.scrollHeight = res.screenHeight - 151 - data.statusBarHeight
        }
      })
      await this._afterManagementList(true)
    },
    computed: {
      showAfterEnd() {
        let status = this.afterList.length && (this.afterList.length < 10 || this.page === this.afterTotalPage)
        return status
      },
      showRecode() {
        let status = this.applicationRecord.length && (this.applicationRecord.length < 10 || this.recordPage === this.recordTotalPage)
        return status
      }
    },
    methods: {
      async _search() {
        switch (this.navIndex) {
          case 0:
            this.page = 1
            await this._afterManagementList()
            break
          case 1:
            this.recordPage = 1
            await this._applicationRecordList()
            break
        }
      },
      // 申请售后
      async applicationAfter(index, item) {
        if (item.after_sale_status === 1) {
          return
        }
        this.afterItem = item
        this.afterIdx = index
        this.$refs.dialog.show({msg: '确定申请售后？'})
      },
      // 取消申请
      async _cancelApplication(index, item) {
        this.cancelItem = item
        this.cancelIdx = index
        this.$refs.dialog.show({msg: '确认取消该退款申请？'})
      },
      async confirm() {
        switch (this.navIndex) {
          case 0:
            let after = await API.Leader.applyAfterSale({id: this.afterItem.id})
            this.$wechat.showToast(after.message)
            if (after.error === this.$ERR_OK) {
              this.page = 1
              await this._afterManagementList()
            }
            break
          case 1:
            // 取消申请
            let res = await API.Leader.cancelApply({id: this.cancelItem.id})
            this.$wechat.showToast(res.message)
            if (res.error === this.$ERR_OK) {
              this.recordPage = 1
              await this._applicationRecordList()
            }
            break
        }
      },
      async _getMoreList() {
        switch (this.navIndex) {
          case 0:
            this.page++
            await this._afterManagementList()
            break
          case 1:
            this.recordPage++
            await this._applicationRecordList()
            break
        }
      },
      async _setNav(index, item) {
        this.navIndex = index
        this.keyword = ''
        switch (this.navIndex) {
          case 0:
            this.page = 1
            await this._afterManagementList()
            break
          case 1:
            this.recordPage = 1
            await this._applicationRecordList()
            break
        }
      },
      // 售后管理列表
      async _afterManagementList(loading = false) {
        if (this.afterTotalPage < this.page) {
          return
        }
        let res = await API.Leader.afterManagement({keyword: this.keyword, page: this.page}, loading)
        this.$wechat.hideLoading()
        if (res.error !== this.$ERR_OK) {
          this.afterNull = true
          return
        }
        this.afterTotalPage = res.meta.last_page
        let arr = this._infoList(res.data)
        if (this.page === 1) {
          this.afterList = arr
        } else {
          this.afterList = this.afterList.concat(arr)
        }
        this.afterNull = !this.afterList.length
      },
      // 申请记录列表
      async _applicationRecordList(loading = false) {
        if (this.recordTotalPage < this.recordPage) {
          return
        }
        let res = await API.Leader.applicationRecordList({keyword: this.keyword, page: this.recordPage}, loading)
        this.$wechat.hideLoading()
        if (res.error !== this.$ERR_OK) {
          this.recordNull = true
          return
        }
        this.recordTotalPage = res.meta.last_page
        let arr = this._infoRecord(res.data)
        if (this.recordPage === 1) {
          this.applicationRecord = arr
        } else {
          this.applicationRecord = this.applicationRecord.concat(arr)
        }
        this.recordNull = !this.applicationRecord.length
      },
      _infoList(arr) {
        arr = arr.map((item) => {
          item.btn_text = item.after_sale_status === 0 ? '申请售后' : '已申请'
          item.disable = item.after_sale_status
          item.isShowBtn = true
          return item
        })
        return arr
      },
      _infoRecord(arr) {
        arr = arr.map((item) => {
          item.btn_text = item.status_str === '审核中' ? '取消申请' : '已申请'
          item.isShowBtn = item.status_str === '审核中'
          item.text = '申请时间'
          return item
        })
        return arr
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
 @import "~@designCommon"

  .after-sale-management
    height: 100vh
    background: $color-background
    width: 100vw

  .after-header
    padding: 15px 0 12px
    box-sizing: border-box
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
      width: 176px
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
    overflow: hidden
    background: $color-background
    .line
      height: 10px
    .order-big-box
      width: 200vw
      display: flex
      transform: translateX(0)
      transition: all 0.3s
    .order-box
      width: 100vw

  .noting
    text-align: center
    padding-top: 106px
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


</style>
