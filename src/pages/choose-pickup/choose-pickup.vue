<template>
  <div class="choose-pickup">
    <navigation-bar ref="navigationBar" title="选择提货点" :headStyle="headStyle" :titleColor="titleColor" :showArrow="false"></navigation-bar>
    <section class="top-background">
      <img class="img" :style="'border-top-width:' +  backgroundTop + 'px'" mode="widthFix" v-if="imageUrl" :src="imageUrl + '/yx-image/2.3/bg-xzthd.png'">
    </section>
    <section class="header panel">
      <figure class="avatar">
        <img class="avatar-img" mode="aspectFill" v-if="groupInfo.head_image_url" :src="groupInfo.head_image_url">
      </figure>
      <h1 class="name">团长 {{groupInfo.name}}</h1>
      <p class="position">当前提货点：{{groupInfo.social_name}}</p>
    </section>
    <dl v-if="dataArray.length" class="panel list-wrapper">
      <dt class="title">历史提货点</dt>
      <dd v-for="(item, index) in dataArray" :key="index" class="list-item-wrapper" :class="{'has-line': true}" @click="handleCheck(item)">
        <pick-up :dataInfo="item"></pick-up>
      </dd>
    </dl>
    <div v-if="isShowEmpty" class="panel empty-wrapper">
      <img class="empty-img" mode="aspectFill" v-if="imageUrl" :src="imageUrl + '/yx-image/2.3/pic-address@2x.png'">
      <p>没有其他提货点</p>
    </div>
    <confirm-msg ref="msg" useType="double" @confirm="handleConfirm"></confirm-msg>
  </div>
</template>

<script type="text/ecmascript-6">
  import NavigationBar from '@components/navigation-bar/navigation-bar'
  import PickUp from './pickup-item/pickup-item'
  import ConfirmMsg from '@components/confirm-msg/confirm-msg'
  import API from '@api'

  const PAGE_NAME = 'CHOOSE_PICKUP'

  export default {
    name: PAGE_NAME,
    components: {
      NavigationBar,
      PickUp,
      ConfirmMsg
    },
    data() {
      return {
        headStyle: `background:#73c200`,
        titleColor: `#ffffff`,
        systemInfo: {},
        backgroundTop: 0,
        groupInfo: {},
        page: 1,
        dataArray: [],
        isShowEmpty: false,
        hasMore: true,
        currentItem: {}
      }
    },
    onLoad(options) {
      this.groupInfo = getApp().globalData.$groupInfo
      this._getSystemInfo()
      this.backgroundTop = (this.systemInfo.statusBarHeight || 20) + 44
      this.$refs.navigationBar && this.$refs.navigationBar.setNavigationBarBackground(`background:#73c200;transition:none`)
      this.titleColor = `#ffffff`
      this._getList()
    },
    onPageScroll(e) {
      this._changeNavigation(e)
    },
    onReachBottom() {
      if (!this.hasMore) return
      this.page++
      this._getList()
    },
    methods: {
      // 获取设备系统参数
      _getSystemInfo() {
        this.systemInfo = wx.getSystemInfoSync()
      },
      _changeNavigation(e) {
        let flag = e.scrollTop < 20
        let styles = flag ? `background:#73c200;transition:none` : `background:#fff;transition:none`
        this.$refs.navigationBar && this.$refs.navigationBar.setNavigationBarBackground(styles)
        this.titleColor = flag ? `#ffffff` : `#000000`
        wx.setNavigationBarColor({
          frontColor: this.titleColor,
          backgroundColor: '#ffffff',
          animation: {
            duration: 0,
            timingFunc: 'easeIn'
          }
        })
      },
      _getList() {
        API.Pickup.getList({page: this.page}).then(res => {
          res.data.forEach(item => {
            this.dataArray.push(item)
          })
          this.isShowEmpty = this.dataArray.length === 0
          this.hasMore = res.data.length
        })
      },
      handleCheck(item) {
        this.currentItem = item
        this.$refs.msg.show(`你确定将${item.social_name}设为新的提货点吗？`)
      },
      handleConfirm() {
        wx.setStorageSync('shopId', this.currentItem.id)
        wx.navigateBack()
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@designCommon"

  .panel
    background: #FFFFFF;
    box-shadow: 0 4px 30px 0 rgba(17,17,17,0.05);
    border-radius: 6px;
    position :relative

  .choose-pickup
    width: 100%
    min-height :100vh
    layout(column,block,nowrap)
  .top-background
    position :absolute
    left :0
    right :0
    top:0
    .img
      width :100vw
      display :block
  .header
    margin :41px 12px 0
    padding :0 10px
    position :relative
    text-align :center
    .avatar
      row-center()
      top:-16px
      box-sizing :border-box
      width :60px
      height :@width
      border-radius :50%
      border: 2px solid #FFFFFF
      overflow :hidden
      background :#ccc
      .avatar-img
        width :100%
        height :100%
        display :block
        border-top-color :#73c200
    .name
      padding-top :58px
      font-family: $font-family-medium
      font-size: 17px;
      color: #1D2023;
      line-height: 1
    .position
      padding-top :23px
      padding-bottom :28px
      font-family: $font-family-regular
      font-size: 15px;
      color: #3F454B;
      line-height: 1.4
  .empty-wrapper
    flex: 1
    margin :12px
    padding :0 10px
    position :relative
    font-family: PingFangSC-Regular;
    font-size: 14px;
    color: $color-text-sub
    text-align: center;
    .empty-img
      margin :80px auto 15px
      width :116px
      height :109px
      display :block
  .list-wrapper
    flex: 1
    margin :12px
    padding :0 10px
    position :relative
    font-family: $font-family-regular
    font-size: 14px;
    color: $color-text-main
    line-height: 1
    .title
      padding :16px 0 15px
      border-bottom-1px()
    .list-item-wrapper
      height :90px
      &.has-line
        border-bottom-1px()
</style>
