<template>
  <div class="choose-pickup">
    <navigation-bar ref="navigationBar" title="选择提货点" :headStyle="headStyle" :titleColor="titleColor" :showArrow="false"></navigation-bar>
    <section class="top-background">
      <img class="img" mode="widthFix" v-if="imageUrl" :src="imageUrl + '/yx-image/2.3/bg-xzthd.png'">
    </section>
    <section class="header panel">
      <figure class="avatar">
        <img class="avatar-img" mode="aspectFill" v-if="imageUrl" :src="imageUrl + '/zd-image/test-img/1@1x.png'">
      </figure>
      <h1 class="name">团长 陈先生</h1>
      <p class="position">当前提货点：白云黄边北路国颐堂店</p>
    </section>
    <dl class="panel list-wrapper">
      <dt class="title">历史提货点</dt>
      <dd v-for="(item, index) in dataArray" :key="index" class="list-item-wrapper" @click="handleCheck(item)">
        <pick-up></pick-up>
      </dd>
    </dl>
    <confirm-msg ref="msg" useType="double" @confirm="deleteCartGood"></confirm-msg>
  </div>
</template>

<script type="text/ecmascript-6">
  import NavigationBar from '@components/navigation-bar/navigation-bar'
  import PickUp from './pickup-item/pickup-item'
  import ConfirmMsg from '@components/confirm-msg/confirm-msg'

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
        headStyle: `background:#76bb00`,
        titleColor: `#ffffff`,
        systemInfo: {},
        dataArray: new Array(2).fill(1)
      }
    },
    onLoad(options) {
      this._getSystemInfo()
      console.log(this.systemInfo)
      this.$refs.navigationBar && this.$refs.navigationBar.setNavigationBarBackground(`background:#76bb00;transition:none`)
      this.titleColor = `#ffffff`
    },
    onPageScroll(e) {
      this._changeNavigation(e)
    },
    methods: {
      // 获取设备系统参数
      _getSystemInfo() {
        this.systemInfo = wx.getSystemInfoSync()
      },
      _changeNavigation(e) {
        let flag = e.scrollTop < 20
        let styles = flag ? `background:#76bb00;transition:none` : `background:#fff;transition:none`
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
      handleCheck(item) {
        this.$refs.msg.show('你确定将TIT创意园树德生活馆设为新的提货点吗？')
        console.log(item)
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
      .avatar-img
        width :100%
        height :100%
        display :block
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
      border-bottom-1px()
</style>
