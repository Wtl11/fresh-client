<template>
  <div class="mine-navigation">
    <div class="panel">
      <ul class="nav-wrapper">
        <li v-for="(item, index) in navList" :key="index" class="item-wrapper" :class="item.cname" @click="handleClick(item)">
          <img class="icon-img" mode="aspectFill" v-if="imageUrl && item.icon" :src="imageUrl + item.icon">
          <p v-if="item.titleIsArray" class="title">{{item.title[isLeader?1:0]}}</p>
          <p v-else class="title">{{item.title}}</p>
          <p v-if="item.hasExplain && couponNumber > 0" class="explain">{{couponNumber}}张可用</p>
          <img class="arrow-img" mode="aspectFill" v-if="imageUrl && !item.hideArrow" :src="imageUrl + '/yx-image/2.3/icon-pressed@2x.png'">
        </li>
      </ul>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  const COMPONENT_NAME = 'MINE_NAVIGATION'

  export default {
    name: COMPONENT_NAME,
    props: {
      detail: {
        type: Object,
        default: () => {}
      },
      couponNumber: {
        type: Number,
        default: 0
      },
      isLeader: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        navList: [
          {
            icon: '/yx-image/2.3/icon-coupon_me@2x.png',
            title: '优惠券',
            hasExplain: true,
            url: 'coupon-mine',
            fn: '_handleNav'
          },
          {
            icon: '/yx-image/2.3/icon-address_sy-mine@2x.png',
            title: '自提点',
            url: '',
            fn: '_navigateLocation'
          },
          {
            icon: '/yx-image/2.3/icon-myxq_me@2x.png',
            title: ['小区管理', '我的小区'],
            titleIsArray: true,
            url: '',
            fn: '_handleNav'
          },
          {
            icon: '/yx-image/2.3/icon-question_me@2x.png',
            title: '常见问题',
            url: 'faq',
            fn: '_handleNav'
          }
          // {
          //   styles: `height:17px;padding-bottom:0`,
          //   cname: 'line-box',
          //   hideArrow: true
          // },
          // {
          //   icon: '/yx-image/2.3/icon-colonel@2x.png',
          //   title: '团长招募',
          //   url: 'out-html?routeType=recruit-regimental',
          //   fn: '_handleNav'
          // },
          // {
          //   icon: '/yx-image/2.3/icon-supplier_me@2x.png',
          //   title: '供应商招募',
          //   url: 'out-html?routeType=recruit-supplier',
          //   fn: '_handleNav'
          // },
          // {
          //   icon: '/yx-image/2.3/icon-alliance_me@2x.png',
          //   title: '加盟商招募',
          //   url: 'out-html?routeType=recruit-alliance',
          //   fn: '_handleNav'
          // }
        ]
      }
    },
    methods: {
      handleClick(item) {
        typeof this[item.fn] === 'function' && this[item.fn](item)
      },
      _handleNav(item) {
        if (item.titleIsArray) {
          this._goMyHosing()
        } else {
          wx.navigateTo({url: `/pages/${item.url}`})
        }
      },
      // 跳转我的小区
      _goMyHosing() {
        let isLeader = wx.getStorageSync('isLeader') || false
        let page = isLeader ? '/pages/regimental-commander' : '/pages/mine-housing'
        wx.navigateTo({url: page})
      },
      _navigateLocation() {
        this.$wechat.openLocation({
          latitude: this.detail.latitude,
          longitude: this.detail.longitude,
          name: this.detail.socialName,
          address: this.detail.address
        })
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@designCommon"

  .mine-navigation
    padding :12px
    .panel
      background: #FFFFFF;
      box-shadow: 0 4px 30px 0 rgba(17,17,17,0.06);
      border-radius: 6px;
      .nav-wrapper
        padding :25px 0
        .item-wrapper
          layout(row,block,nowrap)
          padding-right :15px
          padding-left :15px
          padding-bottom :30px
          font-family: $font-family-regular
          font-size: 15px;
          color: $color-text-main
          align-items :center
          &.line-box
            height :17px
            padding-bottom :0
            position :relative
            &:after
              content: ''
              position :absolute
              top: -8px
              left :15px
              right :@left
              height :1px
              background:$color-line
          &:last-child
            padding-bottom :0
          .icon-img
            width:17px
            height: @width
          .title
            padding :0 10px
            flex: 1
          .explain
            color: $color-text-sub
            font-size :12px
            padding-right :5px
          .arrow-img
            display: block
            width: 7.5px
            height: 12.5px
</style>
