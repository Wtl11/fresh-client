<template>
  <div class="wrap">
    <navigation-bar title="我的自提点" :showArrow="false" :translucent="true"></navigation-bar>
    <div class="self-point-banner">
      <div class="curren">
        <div class="sub">当前自提点</div>
        <div class="point">
          <!--<img class="icon" v-if="imageUrl" :src="imageUrl+'/yx-image/cart/icon-address_sy@2x.png'" alt="" >-->
          <img v-if="imageUrl" :src="imageUrl+'/yx-image/cart/icon-aftersales@2x.png'" alt="" class="icon">
          <div class="txt">白云黄边北路国颐堂店</div>
        </div>
      </div>
      <div class="selt-point-history"><div class="name">历史自提点</div></div>
    </div>
    <div class="history-list">
      <div class="history-item" v-for="(item, index) in [1,2,3]" :key="index">
        <div class="left">
          <img class="avatar" mode="aspectFill" src="https://wx.qlogo.cn/mmopen/vi_32/DYAIOgq83er1Y2xVxQibcgQO7xblfYjo5yWt2Jo5GiaW1MsAoyHkV8fmffNkwDnBXP7If0cn9sdw3kfWFbByG0aw/132" alt="">
          <div class="info">
            <div class="colonel">团长：董秀英</div>
            <div class="group">社区：白云黄边社区</div>
            <div class="addr">提货地址：广东省广州市海珠区新港大道TIT创意园翡冷翠小镇A9赞播</div>
          </div>
        </div>
        <div class="right">
          <img class="arr" v-if="imageUrl" :src="imageUrl+'/yx-image/cart/icon-pressed@2x.png'" alt="">
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import WePaint from '@components/we-paint/we-paint'
  // import { mapGetters } from 'vuex'
  import NavigationBar from '@components/navigation-bar/navigation-bar'
  import API from '@api'
  import {oauthComputed} from '@state/helpers'
  import Vue from 'vue'

  export default {
    components: {
      WePaint,
      NavigationBar
    },
    beforeCreate() {
    },
    data() {
      return {
        testSrc: ''
        // title: '',
        // headStyle: 'background: rgba(255, 255, 255, 0)',
        // titleColor: 'white'
      }
    },
    onShow() {
      if (getApp().globalData.imgUrl) {
        this.testSrc = getApp().globalData.imgUrl
      }
      console.log(Vue.Component)
    },
    computed: {
      ...oauthComputed
      // ...mapGetters(['role'])
    },
    methods: {
      testApi() {
        API.Jwt.getToken()
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"
  .wrap
    width: 100vw
    min-height: 100vh
    background: $color-white
    position: relative
  .self-point-banner
    box-sizing: border-box
    width: 100vw
    padding: 64px 0 0
    position: relative
    height: 170px
    background-image: linear-gradient(0deg, #ABE300 0%, #73C200 89%)
    .curren
      padding: 3.2vw
      padding-top: 18px
      .sub
        font-family: $font-family-regular
        font-size: $font-size-14
        color: $color-white
      .point
        padding-top: 11px
        layout(row)
        align-items: flex-end
        .icon
          width: 11px
          margin-right: 5px
          height: 14px
        .txt
          font-family: $font-family-medium
          font-size: $font-size-16
          color: $color-white
          line-height: 16px
  .selt-point-history
    padding: 3.2vw
    width: 100vw
    background: $color-white
    height: 45px
    position: absolute
    bottom: -19px
    z-index: 9
    box-sizing: border-box
    border-radius: 16px 16px 0px 0px
    .name
      font-family: $font-family-regular
      font-size: $font-size-14
      color: $color-sub
  .history-list
    margin-top: 19px
    padding-left: 3.2vw
    .history-item
      height: 140px
      padding: 20px 3.2vw
      padding-left: 0
      box-sizing: border-box
      layout(row)
      justify-content: space-between
      border-bottom-1px(#E6E6E6)
      &:first-child
        border-top-1px(#E6E6E6)
      .left
        layout(row)
        .avatar
          display: block
          width: 13.34vw
          height: 13.34vw
          margin-right: 2.67vw
          border-radius: 50%
        .info
          width: 69.6vw
          .colonel,.group
            font-family: $font-family-medium
            font-size: $font-size-15
            padding-bottom: 8px
            color: $color-sub
          .addr
            padding-top: 5px
            font-family: $font-family-regular
            font-size: $font-size-14
            color: #999999
            line-height: 20px
      .right
        width: 5.5px
        height: 100px
        layout(row)
        align-items: center
        .arr
          display: block
          width: 5.5px
          height: 10.5px

  .txtsr
    min-height: 10px
</style>
